import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { RippleDirective } from '../../shared/directives/ripple.directive';

interface ChatMessage {
  readonly id: string;
  readonly authorId: string;
  readonly content: string;
  readonly timestamp: string;
  readonly attachment?: {
    readonly type: 'image' | 'file' | 'audio';
    readonly name: string;
    readonly meta?: string;
    readonly src?: string;
  };
  readonly reactions?: readonly { emoji: string; count: number }[];
}

interface ChatAuthor {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly tone: string;
  readonly online?: boolean;
}

@Component({
  selector: 'mm-chat',
  imports: [
    ReactiveFormsModule,
    CanvasFrameComponent,
    SectionHeaderComponent,
    RippleDirective,
  ],
  templateUrl: './chat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ChatComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly me = 'u-me';

  protected readonly authors: readonly ChatAuthor[] = [
    { id: 'u-me', name: 'Tú', initials: 'OJ', tone: 'from-brand-6 to-primary-500', online: true },
    {
      id: 'u-sofia',
      name: 'Sofia Reyes',
      initials: 'SR',
      tone: 'from-brand-pink to-fuchsia-500',
      online: true,
    },
    {
      id: 'u-diego',
      name: 'Diego Luna',
      initials: 'DL',
      tone: 'from-emerald-500 to-teal-500',
    },
  ];

  protected readonly messages = signal<readonly ChatMessage[]>([
    {
      id: 'm1',
      authorId: 'u-sofia',
      content: '¡Buenas! ¿Cómo va el showcase?',
      timestamp: '10:14',
    },
    {
      id: 'm2',
      authorId: 'u-me',
      content: 'Listo carnal, ya cerré charts y kanban. Vamos por chat.',
      timestamp: '10:15',
    },
    {
      id: 'm3',
      authorId: 'u-me',
      content: '¿Te parece si lo subimos a Vercel mañana?',
      timestamp: '10:15',
    },
    {
      id: 'm4',
      authorId: 'u-sofia',
      content: 'Va, te dejo el moodboard para el hero.',
      timestamp: '10:16',
      attachment: {
        type: 'image',
        name: 'moodboard-v3.png',
        meta: '1.2 MB',
        src: 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f?w=500&q=70&auto=format&fit=crop',
      },
    },
    {
      id: 'm5',
      authorId: 'u-diego',
      content: 'El backend ya tiene SSE para typing indicator real ✅',
      timestamp: '10:18',
      reactions: [
        { emoji: '🔥', count: 2 },
        { emoji: '🎉', count: 1 },
      ],
    },
    {
      id: 'm6',
      authorId: 'u-me',
      content: 'Ya me pasaron el spec del flujo de pagos.',
      timestamp: '10:21',
      attachment: { type: 'file', name: 'pagos-spec-v2.pdf', meta: '342 KB' },
    },
    {
      id: 'm7',
      authorId: 'u-sofia',
      content: 'Te llamo en un rato 📞',
      timestamp: '10:22',
      attachment: { type: 'audio', name: 'audio-15s.m4a', meta: '0:15' },
    },
  ]);

  protected readonly draft = new FormControl<string>('', { nonNullable: true });
  protected readonly typingFrom = signal<string | null>(null);
  protected readonly scrolledUp = signal(false);

  protected readonly grouped = computed(() => {
    const msgs = this.messages();
    return msgs.map((msg, i) => {
      const prev = msgs[i - 1];
      const showAvatar = !prev || prev.authorId !== msg.authorId;
      return { ...msg, showAvatar };
    });
  });

  protected authorOf(id: string): ChatAuthor {
    return this.authors.find((a) => a.id === id) ?? this.authors[0];
  }

  protected async send(): Promise<void> {
    const text = this.draft.value.trim();
    if (!text) return;

    const id = `m${Date.now()}`;
    this.messages.update((arr) => [
      ...arr,
      {
        id,
        authorId: this.me,
        content: text,
        timestamp: new Date().toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    this.draft.setValue('');

    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.typingFrom.set('u-sofia'), 600);
    setTimeout(() => {
      this.typingFrom.set(null);
      this.messages.update((arr) => [
        ...arr,
        {
          id: `m${Date.now()}r`,
          authorId: 'u-sofia',
          content: this.autoReply(text),
          timestamp: new Date().toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }, 2400);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected onTextareaInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }

  protected onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    this.scrolledUp.set(!nearBottom);
  }

  protected scrollToBottom(container: HTMLElement): void {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }

  private autoReply(text: string): string {
    if (text.length < 6) return '👍';
    if (text.toLowerCase().includes('vercel')) return 'Va, le doy go mañana en la mañana.';
    return 'Anotado, lo reviso y te aviso ✌️';
  }

  protected readonly snippetsConversacion: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'chat.html (estructura)',
      code: `<div class="rounded-mm-2xl border border-border-soft bg-surface-base
            overflow-hidden shadow-mm-sm">
  <!-- Header con avatares apilados -->
  <header class="flex items-center gap-3 px-4 py-3 border-b border-border-soft
                 bg-surface-secondary/40">
    <div class="flex -space-x-2">
      @for (a of authors.slice(1); track a.id) {
        <span [class]="
          'size-8 rounded-mm-pill grid place-items-center text-white text-xs
           ring-2 ring-surface-base bg-linear-to-br ' + a.tone">
          {{ a.initials }}
        </span>
      }
    </div>
    <p class="flex-1 font-medium text-ink-dark">Sofia, Diego</p>
  </header>

  <!-- Scroller de mensajes -->
  <div #scroller class="flex flex-col gap-1.5 px-4 py-4 max-h-[480px]
                        overflow-y-auto mm-scroll-thin"
       (scroll)="onScroll($event)">
    @for (msg of grouped(); track msg.id) {
      @let mine = msg.authorId === me;
      <div class="flex gap-2 max-w-[80%]"
           [class.self-end]="mine"
           [class.flex-row-reverse]="mine"
           style="animation: fadeInUp 280ms var(--ease-out) both">

        <!-- Avatar solo en primer mensaje del grupo -->
        @if (msg.showAvatar) {
          <span class="size-8 rounded-mm-pill bg-linear-to-br ...">
            {{ author.initials }}
          </span>
        }

        <!-- Burbuja -->
        <div class="rounded-mm-xl px-3 py-2 text-sm shadow-mm-sm"
             [class.bg-cta]="mine" [class.text-cta-fg]="mine"
             [class.bg-surface-secondary]="!mine">
          <p>{{ msg.content }}</p>

          <!-- Attachment: image | file | audio (con @switch) -->
        </div>
      </div>
    }

    <!-- Typing dots -->
    @if (typingFrom()) {
      <div class="flex gap-2 self-start">
        <span class="size-1.5 rounded-full bg-ink-muted"
              style="animation: mm-typing 1.2s ease-in-out infinite"></span>
        <!-- ... 2 dots más con delay 200ms, 400ms ... -->
      </div>
    }
  </div>

  <!-- Composer -->
  <footer class="flex items-end gap-2 px-3 py-2.5 border-t border-border-soft">
    <textarea [formControl]="draft"
              (keydown)="onKey($event)"
              (input)="onTextareaInput($event)"
              rows="1"
              class="flex-1 resize-none rounded-mm-pill border border-border
                     bg-surface-secondary/40 px-4 py-2 text-sm mm-scroll-thin"></textarea>
    <button mmRipple (click)="send()" [disabled]="!draft.value.trim()"
            class="size-9 rounded-mm-pill bg-cta text-cta-fg mm-press">
      <!-- icono enviar -->
    </button>
  </footer>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'chat.ts',
      code: `interface ChatMessage {
  readonly id: string;
  readonly authorId: string;
  readonly content: string;
  readonly timestamp: string;
  readonly attachment?: {
    readonly type: 'image' | 'file' | 'audio';
    readonly name: string;
    readonly meta?: string;
    readonly src?: string;
  };
  readonly reactions?: readonly { emoji: string; count: number }[];
}

export class ChatComponent {
  protected readonly me = 'u-me';

  protected readonly messages = signal<readonly ChatMessage[]>([
    { id: 'm1', authorId: 'u-sofia',
      content: '¡Buenas! ¿Cómo va el showcase?', timestamp: '10:14' },
    { id: 'm2', authorId: 'u-me',
      content: 'Listo carnal, ya cerré charts y kanban.', timestamp: '10:15' },
    // ... más mensajes con attachments tipo image/file/audio
  ]);

  protected readonly draft = new FormControl('', { nonNullable: true });
  protected readonly typingFrom = signal<string | null>(null);

  // Agrupa por autor para mostrar avatar solo en el primer mensaje
  protected readonly grouped = computed(() => {
    const msgs = this.messages();
    return msgs.map((msg, i) => ({
      ...msg,
      showAvatar: !msgs[i - 1] || msgs[i - 1].authorId !== msg.authorId,
    }));
  });

  protected async send(): Promise<void> {
    const text = this.draft.value.trim();
    if (!text) return;

    this.messages.update((arr) => [...arr, {
      id: \`m\${Date.now()}\`,
      authorId: this.me,
      content: text,
      timestamp: new Date().toLocaleTimeString('es-MX',
        { hour: '2-digit', minute: '2-digit' }),
    }]);
    this.draft.setValue('');

    // Simula typing indicator + auto-reply
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.typingFrom.set('u-sofia'), 600);
    setTimeout(() => {
      this.typingFrom.set(null);
      this.messages.update((arr) => [...arr, /* respuesta */]);
    }, 2400);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  // Autosize textarea (cap a 140px)
  protected onTextareaInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'typing dots — keyframe',
      code: `/* 3 dots con delay escalonado: 0ms, 200ms, 400ms */
@keyframes mm-typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* fadeInUp para nuevos mensajes (tokens globales) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* mm-scroll-thin: scrollbar sutil para WebKit + Firefox */
.mm-scroll-thin::-webkit-scrollbar { width: 6px; }
.mm-scroll-thin::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 9999px;
}`,
    },
  ];
}
