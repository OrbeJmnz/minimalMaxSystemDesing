import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { ToastService } from '../../core/services/toast.service';

interface Goal {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}

interface Invite {
  readonly email: string;
  readonly role: 'admin' | 'editor' | 'viewer';
}

@Component({
  selector: 'mm-onboarding',
  imports: [CanvasFrameComponent, SectionHeaderComponent, RippleDirective],
  templateUrl: './onboarding.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class OnboardingComponent {
  private readonly toast = inject(ToastService);

  protected readonly step = signal(1);
  protected readonly totalSteps = 5;

  protected readonly userName = signal('');
  protected readonly companyName = signal('');
  protected readonly role = signal('');

  protected readonly selectedGoals = signal<ReadonlySet<string>>(new Set());

  protected readonly invites = signal<readonly Invite[]>([
    { email: '', role: 'editor' },
    { email: '', role: 'editor' },
  ]);

  protected readonly theme = signal<'light' | 'dark' | 'auto'>('auto');
  protected readonly density = signal<'comfortable' | 'compact'>('comfortable');

  protected readonly themeOptions: readonly {
    readonly id: 'light' | 'dark' | 'auto';
    readonly label: string;
    readonly icon: string;
    readonly preview: string;
  }[] = [
    {
      id: 'light',
      label: 'Claro',
      icon: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
      preview: 'bg-white border-border-soft',
    },
    {
      id: 'dark',
      label: 'Oscuro',
      icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
      preview: 'bg-[#161b22] border-[#0d1117]',
    },
    {
      id: 'auto',
      label: 'Auto',
      icon: 'M12 2a10 10 0 1 0 0 20zM12 2v20',
      preview: 'bg-linear-to-r from-white to-[#0d1117] border-border',
    },
  ];

  protected readonly densityOptions: readonly {
    readonly id: 'comfortable' | 'compact';
    readonly label: string;
    readonly desc: string;
  }[] = [
    {
      id: 'comfortable',
      label: 'Cómoda',
      desc: 'Más espacio, ideal para lectura',
    },
    {
      id: 'compact',
      label: 'Compacta',
      desc: 'Más info, ideal para power users',
    },
  ];

  protected readonly goals: readonly Goal[] = [
    {
      id: 'collab',
      label: 'Colaboración en equipo',
      description: 'Trabajar con mi equipo en proyectos compartidos',
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    },
    {
      id: 'design',
      label: 'Diseño de productos',
      description: 'Crear interfaces y mantener un design system',
      icon: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z',
    },
    {
      id: 'dev',
      label: 'Desarrollo',
      description: 'Escribir, revisar y desplegar código',
      icon: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Medir métricas y entender usuarios',
      icon: 'M3 3v18h18M7 14l4-4 4 4 5-5',
    },
    {
      id: 'content',
      label: 'Content & marketing',
      description: 'Crear contenido, campañas y blog posts',
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    },
    {
      id: 'ai',
      label: 'AI / experimentación',
      description: 'Prompt engineering y generación con LLMs',
      icon: 'm12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8',
    },
  ];

  protected readonly progress = computed(
    () => (this.step() / this.totalSteps) * 100,
  );

  protected readonly stepLabel = computed(() => {
    switch (this.step()) {
      case 1:
        return 'Bienvenida';
      case 2:
        return 'Cuéntanos sobre ti';
      case 3:
        return '¿Qué buscas hacer?';
      case 4:
        return 'Invita a tu equipo';
      case 5:
        return 'Personaliza tu workspace';
      default:
        return '';
    }
  });

  protected readonly canAdvance = computed(() => {
    switch (this.step()) {
      case 1:
        return true;
      case 2:
        return this.userName().trim().length >= 2 && this.companyName().trim().length >= 2;
      case 3:
        return this.selectedGoals().size >= 1;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  });

  protected readonly canBack = computed(() => this.step() > 1);

  protected next(): void {
    if (!this.canAdvance()) return;
    if (this.step() === this.totalSteps) {
      this.finish();
      return;
    }
    this.step.update((s) => s + 1);
  }

  protected back(): void {
    if (!this.canBack()) return;
    this.step.update((s) => s - 1);
  }

  protected jump(target: number): void {
    if (target < 1 || target > this.totalSteps) return;
    if (target > this.step() && !this.canAdvance()) return;
    this.step.set(target);
  }

  protected restart(): void {
    this.step.set(1);
  }

  protected finish(): void {
    this.toast.success('¡Workspace listo! Bienvenido a MinimalMax');
    this.step.set(1);
  }

  protected skip(): void {
    this.toast.info('Setup pospuesto · puedes completarlo después en Settings');
    this.step.set(1);
  }

  protected onName(event: Event): void {
    this.userName.set((event.target as HTMLInputElement).value);
  }

  protected onCompany(event: Event): void {
    this.companyName.set((event.target as HTMLInputElement).value);
  }

  protected onRole(event: Event): void {
    this.role.set((event.target as HTMLInputElement).value);
  }

  protected toggleGoal(id: string): void {
    this.selectedGoals.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected isGoalSelected(id: string): boolean {
    return this.selectedGoals().has(id);
  }

  protected updateInvite(index: number, field: 'email' | 'role', value: string): void {
    this.invites.update((list) =>
      list.map((inv, i) =>
        i === index ? { ...inv, [field]: value } : inv,
      ),
    );
  }

  protected onInviteEmail(index: number, event: Event): void {
    this.updateInvite(index, 'email', (event.target as HTMLInputElement).value);
  }

  protected onInviteRole(index: number, event: Event): void {
    this.updateInvite(index, 'role', (event.target as HTMLSelectElement).value);
  }

  protected setTheme(id: 'light' | 'dark' | 'auto'): void {
    this.theme.set(id);
  }

  protected setDensity(id: 'comfortable' | 'compact'): void {
    this.density.set(id);
  }

  protected addInvite(): void {
    this.invites.update((list) => [...list, { email: '', role: 'editor' }]);
  }

  protected removeInvite(index: number): void {
    this.invites.update((list) => list.filter((_, i) => i !== index));
  }

  protected readonly snippetsOnboarding: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'onboarding.html (extracto)',
      code: `<!-- Container full-screen con header (progress) + content (steps) + footer (nav) -->
<div class="rounded-mm-3xl bg-surface-base border shadow-mm-elevated overflow-hidden
            grid grid-rows-[auto_1fr_auto] min-h-[560px]">

  <!-- HEADER: progress bar + step indicator + skip -->
  <header class="px-6 py-4 border-b">
    <div class="flex items-center justify-between mb-3">
      <span class="font-mono">Paso {{ step() }} de {{ totalSteps }}</span>
      <button (click)="skip()">Saltar setup</button>
    </div>
    <div class="h-1.5 rounded-mm-pill bg-border overflow-hidden">
      <div class="h-full bg-linear-to-r from-brand-6 to-brand-pink
                  transition-[width] duration-500"
           [style.width.%]="progress()"></div>
    </div>
  </header>

  <!-- CONTENT: switch entre 5 pasos -->
  <main class="p-6 grid place-items-center">
    @switch (step()) {
      @case (1) { <!-- Welcome con illustration SVG --> }
      @case (2) { <!-- Form name + company + role --> }
      @case (3) { <!-- Goals grid (multi-select cards) --> }
      @case (4) { <!-- Invite team (lista de emails + role) --> }
      @case (5) { <!-- Theme + density picker --> }
    }
  </main>

  <!-- FOOTER: back + step dots + next -->
  <footer class="px-6 py-4 border-t flex justify-between">
    <button (click)="back()" [disabled]="!canBack()">← Atrás</button>
    <div class="flex gap-1.5">
      @for (i of [1,2,3,4,5]; track i) {
        <button (click)="jump(i)"
                [class.bg-brand-6]="step() === i"
                [class.bg-border]="step() !== i"
                class="size-2 rounded-full"></button>
      }
    </div>
    <button (click)="next()" [disabled]="!canAdvance()">
      {{ step() === totalSteps ? 'Finalizar' : 'Siguiente →' }}
    </button>
  </footer>
</div>

<!-- Cada paso entra con animation slide -->
<style>
  .step-content { animation: fadeInUp 320ms var(--ease-out) both; }
</style>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'onboarding.ts (step state + guards)',
      code: `protected readonly step = signal(1);
protected readonly totalSteps = 5;

// Inputs por step (signals para reactivity sin Forms)
protected readonly userName = signal('');
protected readonly companyName = signal('');
protected readonly selectedGoals = signal<ReadonlySet<string>>(new Set());
protected readonly invites = signal<Invite[]>([
  { email: '', role: 'editor' },
  { email: '', role: 'editor' },
]);

// Computed: progress % para la barra
protected readonly progress = computed(
  () => (this.step() / this.totalSteps) * 100,
);

// Guard: permite avanzar solo si los campos requeridos están listos
protected readonly canAdvance = computed(() => {
  switch (this.step()) {
    case 1: return true;
    case 2: return this.userName().length >= 2 && this.companyName().length >= 2;
    case 3: return this.selectedGoals().size >= 1;     // al menos 1 goal
    case 4: return true;                                // invites opcional
    case 5: return true;
    default: return false;
  }
});

protected next(): void {
  if (!this.canAdvance()) return;
  if (this.step() === this.totalSteps) return this.finish();
  this.step.update((s) => s + 1);
}

protected back(): void {
  if (this.step() <= 1) return;
  this.step.update((s) => s - 1);
}

// Jump permite ir hacia atrás libremente; hacia adelante solo si canAdvance
protected jump(target: number): void {
  if (target < 1 || target > this.totalSteps) return;
  if (target > this.step() && !this.canAdvance()) return;
  this.step.set(target);
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (animations)',
      code: `/* Cada paso entra con slide-up sutil */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Stagger para los cards de goals */
[data-stagger] > * {
  opacity: 0;
  animation: fadeInUp 600ms var(--ease-out) both;
}
[data-stagger] > *:nth-child(1) { animation-delay: 40ms; }
[data-stagger] > *:nth-child(2) { animation-delay: 100ms; }
/* ... */

/* Progress bar smooth */
.progress-fill {
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Check pop al seleccionar goal */
@keyframes mm-check-pop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}`,
    },
  ];

  protected readonly snippetsProgress: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'progress-header.html',
      code: `<header class="px-6 py-4 border-b border-border-soft bg-surface-base">
  <div class="flex items-center justify-between mb-3">
    <span class="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
      Paso {{ step() }} de {{ totalSteps }} · {{ stepLabel() }}
    </span>
    <button (click)="skip()"
            class="text-xs text-ink-muted hover:text-ink-dark transition">
      Saltar setup
    </button>
  </div>
  <div class="h-1.5 rounded-mm-pill bg-border overflow-hidden">
    <div class="h-full bg-linear-to-r from-brand-6 via-primary-500 to-brand-pink
                transition-[width] duration-500 ease-out"
         [style.width.%]="progress()"></div>
  </div>
</header>

<!-- Step dots como navigation -->
<div class="flex items-center gap-1.5">
  @for (i of [1,2,3,4,5]; track i) {
    <button (click)="jump(i)"
            [attr.aria-label]="'Paso ' + i"
            class="rounded-full transition-all"
            [class.size-2]="step() !== i"
            [class.size-2.5]="step() === i"
            [class.bg-brand-6]="step() === i"
            [class.bg-success]="step() > i"
            [class.bg-border]="step() < i">
    </button>
  }
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — progress',
      code: `/* Barra de progreso — solo anima el ancho */
.progress-fill {
  transition: width 400ms var(--ease-out);
}`,
    },
  ];

  protected readonly snippetsIllustration: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'welcome-illustration.html',
      code: `<!-- Illustration SVG inline geometric (cero deps externas) -->
<svg viewBox="0 0 320 240" class="w-full max-w-md mx-auto"
     aria-label="Bienvenida ilustración">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#1456f0"/>
      <stop offset="100%" stop-color="#ea5ec1"/>
    </linearGradient>
  </defs>

  <!-- Floating geometric shapes (animación CSS infinite) -->
  <circle cx="60"  cy="60"  r="20" fill="url(#g1)" opacity="0.15">
    <animateTransform attributeName="transform" type="translate"
                      values="0,0; 0,-8; 0,0" dur="3s" repeatCount="indefinite"/>
  </circle>
  <rect x="240" y="40" width="40" height="40" rx="8" fill="#ea5ec1" opacity="0.18">
    <animateTransform attributeName="transform" type="rotate"
                      values="0 260 60; 12 260 60; 0 260 60" dur="4s" repeatCount="indefinite"/>
  </rect>

  <!-- Card central -->
  <rect x="80" y="80" width="160" height="100" rx="16"
        fill="white" stroke="#e5e7eb" stroke-width="2"/>
  <circle cx="120" cy="110" r="12" fill="url(#g1)"/>
  <rect x="140" y="105" width="80" height="6" rx="3" fill="#e5e7eb"/>
  <rect x="140" y="118" width="50" height="4" rx="2" fill="#f0f0f0"/>
  <rect x="100" y="140" width="120" height="4" rx="2" fill="#f0f0f0"/>
  <rect x="100" y="152" width="90"  height="4" rx="2" fill="#f0f0f0"/>
</svg>`,
    },
  ];
}
