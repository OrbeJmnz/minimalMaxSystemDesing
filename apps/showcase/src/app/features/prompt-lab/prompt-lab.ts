import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { ToastService } from '../../core/services/toast.service';

interface PromptModel {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly tone: string;
  readonly tag: 'Text' | 'Image' | 'Audio' | 'Video';
}

interface SuggestedPrompt {
  readonly icon: string;
  readonly label: string;
  readonly text: string;
}

interface HistoryEntry {
  readonly id: string;
  readonly prompt: string;
  readonly model: string;
  readonly preview: string;
  readonly time: string;
}

const TOKEN_LIMIT = 4000;
const STREAM_INTERVAL_MS = 18;

@Component({
  selector: 'mm-prompt-lab',
  imports: [CanvasFrameComponent, SectionHeaderComponent, RippleDirective],
  templateUrl: './prompt-lab.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class PromptLabComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);

  protected readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('promptArea');

  protected readonly models: readonly PromptModel[] = [
    {
      id: 'talk-01',
      name: 'Talk-01',
      description: 'Conversación multilingüe · <200ms',
      tone: 'from-brand-6 to-primary-500',
      tag: 'Text',
    },
    {
      id: 'hailuo-image',
      name: 'Hailuo Image',
      description: 'Generación de imágenes 4K',
      tone: 'from-brand-pink to-fuchsia-500',
      tag: 'Image',
    },
    {
      id: 'voice-02',
      name: 'Voice-02',
      description: 'Clonación de voz · 5s referencia',
      tone: 'from-amber-500 to-orange-500',
      tag: 'Audio',
    },
    {
      id: 'hailuo-video',
      name: 'Hailuo Video',
      description: 'Text-to-video · hasta 6s',
      tone: 'from-emerald-500 to-teal-500',
      tag: 'Video',
    },
  ];

  protected readonly selectedModel = signal<string>('talk-01');
  protected readonly modelOpen = signal(false);

  protected readonly suggestedPrompts: readonly SuggestedPrompt[] = [
    {
      icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
      label: 'Reescribe profesional',
      text: 'Reescribe el siguiente texto en un tono profesional, manteniendo el sentido pero mejorando claridad y concisión:\n\n',
    },
    {
      icon: 'm21 11.5-9-9-9 9 4 4 5-5 5 5 4-4z',
      label: 'Explica como a un niño',
      text: 'Explica el siguiente concepto como si se lo explicaras a un niño de 10 años, usando analogías simples:\n\n',
    },
    {
      icon: 'M9 12l2 2 4-4M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z',
      label: 'Resumen ejecutivo',
      text: 'Genera un resumen ejecutivo de 3 viñetas del siguiente texto:\n\n',
    },
    {
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
      label: 'Brainstorm ideas',
      text: 'Genera 10 ideas creativas y diversas sobre:\n\n',
    },
    {
      icon: 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3',
      label: 'Genera código',
      text: 'Escribe código TypeScript moderno que:\n\n',
    },
  ];

  protected readonly promptText = signal('');
  protected readonly generating = signal(false);
  protected readonly streamedText = signal('');
  protected readonly lastResponse = signal('');

  protected readonly tokenCount = computed(() => Math.ceil(this.promptText().length / 4));
  protected readonly tokenPercent = computed(() =>
    Math.min(100, (this.tokenCount() / TOKEN_LIMIT) * 100),
  );
  protected readonly tokenOver = computed(() => this.tokenCount() > TOKEN_LIMIT);
  protected readonly tokenLimit = TOKEN_LIMIT;

  protected readonly activeModel = computed(
    () => this.models.find((m) => m.id === this.selectedModel()) ?? this.models[0],
  );

  protected readonly canGenerate = computed(
    () => this.promptText().trim().length > 0 && !this.generating(),
  );

  protected readonly history = signal<readonly HistoryEntry[]>([
    {
      id: 'h-3',
      prompt: 'Explica RAG vs fine-tuning para un PM',
      model: 'Talk-01',
      preview:
        'RAG (Retrieval-Augmented Generation) es como darle a un modelo acceso a una biblioteca consultable...',
      time: 'Hace 2 min',
    },
    {
      id: 'h-2',
      prompt: 'Genera 5 nombres para una app de notas con AI',
      model: 'Talk-01',
      preview: '1. Mente (lo simple gana)\n2. Cortex Notes\n3. Lumiére\n4. Brainwave\n5. Tinta',
      time: 'Hace 14 min',
    },
    {
      id: 'h-1',
      prompt: 'Logo minimalista de pájaro origami azul',
      model: 'Hailuo Image',
      preview: '✦ imagen-1024x1024.png · estilo flat geométrico',
      time: 'Hace 1 hora',
    },
  ]);

  private streamTimer: number | undefined;
  private streamFullText = '';
  private streamIndex = 0;

  protected readonly snippetsPromptInput: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'prompt-lab.html (extracto)',
      code: `<!-- Suggested prompts chips -->
<div class="flex flex-wrap gap-2">
  @for (s of suggestedPrompts; track s.label) {
    <button mmRipple (click)="applySuggestion(s)" class="rounded-mm-pill ...">
      {{ s.label }}
    </button>
  }
</div>

<!-- Prompt textarea (autosize) + footer con selector + tokens + acciones -->
<div class="rounded-mm-2xl border focus-within:border-brand-6 focus-within:shadow-mm-brand">
  <textarea
    #promptArea
    [value]="promptText()"
    (input)="onPromptInput($event)"
    class="mm-input-bare w-full resize-none px-5 pt-5 pb-2 text-sm"
    rows="3"
  ></textarea>

  <div class="flex items-center justify-between px-3 pb-3 border-t border-border-soft">
    <!-- Model selector pill + token meter -->
    <button (click)="toggleModel()" class="rounded-mm-pill bg-surface-secondary ...">
      {{ activeModel().name }}
    </button>

    <!-- Generate / Stop -->
    @if (generating()) {
      <button (click)="stop()" class="bg-error text-white">Detener</button>
    } @else {
      <button (click)="generate()" [disabled]="!canGenerate()" class="bg-cta">
        Generar
      </button>
    }
  </div>
</div>

<!-- Response card con streaming + caret pulsante -->
@if (streamedText() || generating()) {
  <article class="rounded-mm-2xl border p-6" style="animation: fadeInUp 320ms;">
    <div class="whitespace-pre-wrap">{{ streamedText() }}@if (generating()) {
      <span class="inline-block w-1.5 h-4 bg-brand-6 animate-pulse"></span>
    }</div>
  </article>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'prompt-lab.ts (streaming + token meter)',
      code: `const TOKEN_LIMIT = 4000;
const STREAM_INTERVAL_MS = 18;

export class PromptLabComponent {
  protected readonly promptText = signal('');
  protected readonly generating = signal(false);
  protected readonly streamedText = signal('');
  protected readonly selectedModel = signal('talk-01');

  protected readonly tokenCount = computed(() =>
    Math.ceil(this.promptText().length / 4),
  );
  protected readonly tokenPercent = computed(() =>
    Math.min(100, (this.tokenCount() / TOKEN_LIMIT) * 100),
  );
  protected readonly tokenOver = computed(() => this.tokenCount() > TOKEN_LIMIT);

  protected readonly canGenerate = computed(
    () => this.promptText().trim().length > 0 && !this.generating(),
  );

  private streamTimer?: number;
  private streamFullText = '';
  private streamIndex = 0;

  protected generate(): void {
    if (!this.canGenerate()) return;
    this.streamFullText = this.buildResponse(this.promptText());
    this.streamIndex = 0;
    this.streamedText.set('');
    this.generating.set(true);

    // Stream letra por letra — velocidad variable (1, 2 o 3 chars)
    this.streamTimer = window.setInterval(() => {
      if (this.streamIndex >= this.streamFullText.length) {
        this.finishStream();
        return;
      }
      const step = Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1;
      this.streamIndex = Math.min(this.streamIndex + step, this.streamFullText.length);
      this.streamedText.set(this.streamFullText.slice(0, this.streamIndex));
    }, STREAM_INTERVAL_MS);
  }

  protected stop(): void { this.finishStream(); }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (clases involucradas)',
      code: `/* Reset del textarea para que la "card" sea el border-focus */
.mm-input-bare,
.mm-input-bare:focus,
.mm-input-bare:focus-visible {
  appearance: none;
  background: transparent;
  border: 0;
  outline: 0;
  box-shadow: none;
}

/* Press feedback en todos los botones */
.mm-press {
  transition: transform var(--duration-fast) var(--ease-out);
}
.mm-press:active { transform: scale(0.97); }

/* Entrada de la respuesta card */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Tokens usados */
--color-brand-6: #1456f0;
--color-cta: #181e25;
--color-error: #ef4444;
--shadow-mm-brand: 0 0 15px rgba(44, 30, 116, 0.16);
--radius-mm-2xl: 20px;
--radius-mm-pill: 9999px;`,
    },
  ];

  protected readonly snippetsModelSelector: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'model-selector.html',
      code: `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
  @for (model of models; track model.id) {
    <button
      (click)="selectModel(model.id)"
      [attr.aria-pressed]="selectedModel() === model.id"
      class="group flex items-center gap-3 rounded-mm-xl border p-4 transition-all hover:-translate-y-0.5"
      [class.border-brand-6]="selectedModel() === model.id"
      [class.shadow-mm-brand]="selectedModel() === model.id"
    >
      <span [class]="
        'size-12 rounded-mm-md bg-linear-to-br shadow-mm-brand grid place-items-center
         text-white font-semibold group-hover:rotate-6 group-hover:scale-105 transition-transform ' +
        model.tone
      ">
        {{ model.tag.charAt(0) }}
      </span>
      <div class="flex-1">
        <p class="font-medium text-sm">{{ model.name }}</p>
        <p class="text-xs text-ink-muted">{{ model.description }}</p>
      </div>
      @if (selectedModel() === model.id) {
        <span class="size-6 rounded-mm-pill bg-brand-6 text-white grid place-items-center"
              style="animation: mm-check-pop 320ms var(--ease-bounce);">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </span>
      }
    </button>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'models data',
      code: `interface PromptModel {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly tone: string;      // tailwind gradient classes
  readonly tag: 'Text' | 'Image' | 'Audio' | 'Video';
}

protected readonly models: readonly PromptModel[] = [
  {
    id: 'talk-01',
    name: 'Talk-01',
    description: 'Conversación multilingüe · <200ms',
    tone: 'from-brand-6 to-primary-500',
    tag: 'Text',
  },
  {
    id: 'hailuo-image',
    name: 'Hailuo Image',
    description: 'Generación de imágenes 4K',
    tone: 'from-brand-pink to-fuchsia-500',
    tag: 'Image',
  },
  // ... voice-02, hailuo-video
];

protected readonly selectedModel = signal('talk-01');

protected selectModel(id: string): void {
  this.selectedModel.set(id);
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-check-pop',
      code: `/* mm-check-pop — pop del check al seleccionar opción */
@keyframes mm-check-pop {
  0%   { transform: scale(0);   opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}`,
    },
  ];

  protected readonly snippetsTokenMeter: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'token-meter.html',
      code: `<div class="flex flex-col gap-3">
  <div class="flex items-center justify-between text-xs">
    <span class="text-ink-secondary font-medium">Uso de tokens</span>
    <span class="font-mono tabular-nums"
          [class.text-error]="tokenOver()"
          [class.font-semibold]="tokenOver()">
      {{ tokenCount() }} / {{ tokenLimit }}
    </span>
  </div>

  <div class="relative h-2 rounded-mm-pill bg-border overflow-hidden">
    <div class="absolute inset-y-0 left-0 rounded-mm-pill transition-all duration-300"
         [class.bg-linear-to-r]="!tokenOver()"
         [class.from-brand-6]="!tokenOver()"
         [class.to-primary-500]="!tokenOver()"
         [class.bg-error]="tokenOver()"
         [style.width.%]="tokenPercent()"></div>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'token computed',
      code: `const TOKEN_LIMIT = 4000;

// 1 token ≈ 4 caracteres (regla de aproximación de OpenAI/Anthropic)
protected readonly tokenCount = computed(() =>
  Math.ceil(this.promptText().length / 4),
);

protected readonly tokenPercent = computed(() =>
  Math.min(100, (this.tokenCount() / TOKEN_LIMIT) * 100),
);

protected readonly tokenOver = computed(() =>
  this.tokenCount() > TOKEN_LIMIT,
);`,
    },
  ];

  protected readonly snippetsHistory: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'history-list.html',
      code: `<ol class="flex flex-col gap-2">
  @for (entry of history(); track entry.id) {
    <li>
      <button (click)="restoreFromHistory(entry)"
              class="group w-full flex items-start gap-3 rounded-mm-xl border p-4
                     hover:shadow-mm-elevated hover:border-brand-6 transition-all">
        <span class="size-9 rounded-mm-md bg-primary-200 text-primary-700 grid place-items-center
                     group-hover:rotate-6 transition-transform">
          <svg><!-- clock icon --></svg>
        </span>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm truncate">{{ entry.prompt }}</p>
          <p class="text-xs text-ink-muted line-clamp-2 whitespace-pre-line">
            {{ entry.preview }}
          </p>
          <p class="text-[11px] text-ink-muted mt-2 font-mono">{{ entry.time }}</p>
        </div>
      </button>
    </li>
  }
</ol>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'history signal',
      code: `interface HistoryEntry {
  readonly id: string;
  readonly prompt: string;
  readonly model: string;
  readonly preview: string;
  readonly time: string;
}

protected readonly history = signal<readonly HistoryEntry[]>([
  {
    id: 'h-3',
    prompt: 'Explica RAG vs fine-tuning para un PM',
    model: 'Talk-01',
    preview: 'RAG es como darle al modelo acceso a una biblioteca...',
    time: 'Hace 2 min',
  },
  // ...
]);

protected restoreFromHistory(entry: HistoryEntry): void {
  this.promptText.set(entry.prompt);
  queueMicrotask(() => this.textareaRef()?.nativeElement.focus());
}`,
    },
  ];

  constructor() {
    effect(() => {
      this.promptText();
      untracked(() => this.autosize());
    });

    this.destroyRef.onDestroy(() => this.clearStream());
  }

  protected selectModel(id: string): void {
    this.selectedModel.set(id);
    this.modelOpen.set(false);
  }

  protected toggleModel(): void {
    this.modelOpen.update((v) => !v);
  }

  protected onPromptInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.promptText.set(target.value);
  }

  protected applySuggestion(suggestion: SuggestedPrompt): void {
    this.promptText.set(suggestion.text);
    queueMicrotask(() => {
      const el = this.textareaRef()?.nativeElement;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
    });
  }

  protected clearPrompt(): void {
    this.promptText.set('');
    this.streamedText.set('');
    this.lastResponse.set('');
    queueMicrotask(() => this.textareaRef()?.nativeElement.focus());
  }

  protected generate(): void {
    if (!this.canGenerate()) return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.clearStream();
    this.streamFullText = this.buildResponse(this.promptText(), this.activeModel().name);
    this.streamIndex = 0;
    this.streamedText.set('');
    this.lastResponse.set('');
    this.generating.set(true);

    this.streamTimer = window.setInterval(() => {
      if (this.streamIndex >= this.streamFullText.length) {
        this.finishStream();
        return;
      }
      const step = Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1;
      this.streamIndex = Math.min(this.streamIndex + step, this.streamFullText.length);
      this.streamedText.set(this.streamFullText.slice(0, this.streamIndex));
    }, STREAM_INTERVAL_MS);
  }

  protected stop(): void {
    this.finishStream();
  }

  protected regenerate(): void {
    if (this.generating()) return;
    this.generate();
  }

  protected copyResponse(): void {
    const text = this.lastResponse() || this.streamedText();
    if (!text || !isPlatformBrowser(this.platformId)) return;
    navigator.clipboard.writeText(text).then(
      () => this.toast.success('Respuesta copiada al portapapeles'),
      () => this.toast.error('No se pudo copiar'),
    );
  }

  protected restoreFromHistory(entry: HistoryEntry): void {
    this.promptText.set(entry.prompt);
    queueMicrotask(() => this.textareaRef()?.nativeElement.focus());
  }

  private finishStream(): void {
    this.clearStream();
    this.lastResponse.set(this.streamFullText);
    this.streamedText.set(this.streamFullText);
    this.generating.set(false);
  }

  private clearStream(): void {
    if (this.streamTimer !== undefined) {
      clearInterval(this.streamTimer);
      this.streamTimer = undefined;
    }
  }

  private autosize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.textareaRef()?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }

  private buildResponse(prompt: string, model: string): string {
    const trimmed = prompt.trim();
    if (model === 'Hailuo Image') {
      return `✦ Generando imagen...\n\nPrompt analizado: "${trimmed.slice(0, 80)}${trimmed.length > 80 ? '...' : ''}"\n\nDimensiones: 1024 × 1024 px\nEstilo detectado: flat geométrico\nIteraciones: 4 pasos de difusión\n\n[ Aquí se renderizaría la imagen generada ]`;
    }
    if (model === 'Voice-02') {
      return `🎙️ Síntesis de voz lista\n\nTexto: "${trimmed.slice(0, 100)}${trimmed.length > 100 ? '...' : ''}"\n\nVoz: Sofia (clonada · 5s de muestra)\nDuración estimada: ${Math.ceil(trimmed.length / 18)}s\nFormato: MP3 · 192 kbps\n\n[ ▶ Reproducir audio ]`;
    }
    if (model === 'Hailuo Video') {
      return `🎬 Video generado\n\nPrompt: "${trimmed.slice(0, 80)}${trimmed.length > 80 ? '...' : ''}"\n\nDuración: 6s · 24 fps · 1080p\nMotion intensity: media\nIluminación: cinemática\n\n[ Aquí se incrustaría el video resultante ]`;
    }
    return `Excelente pregunta. Vamos a desglosarlo en partes para que quede claro:\n\n**Punto 1 — Contexto**\n${trimmed.length > 40 ? trimmed.slice(0, 120) + '...' : trimmed} es un tema que toca varias capas. La primera es la conceptual: qué problema resuelve y por qué importa.\n\n**Punto 2 — Implementación**\nEn la práctica, esto se traduce en decisiones concretas:\n• Diseñar primero la interfaz pública\n• Validar con casos de uso reales\n• Iterar con feedback temprano\n\n**Punto 3 — Trade-offs**\nNada viene gratis. Lo que ganas en flexibilidad lo pagas en complejidad. La clave está en elegir la abstracción correcta para el nivel de problema que tienes hoy, no el que crees que tendrás mañana.\n\n¿Quieres que profundice en alguna parte específica?`;
  }
}
