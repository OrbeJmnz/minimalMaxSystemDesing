import { ChangeDetectionStrategy, Component, HostListener, computed, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { PillTab, PillTabsComponent } from '../../shared/components/pill-tabs/pill-tabs';
import { RippleDirective } from '../../shared/directives/ripple.directive';

interface Step {
  readonly id: number;
  readonly label: string;
  readonly description: string;
}

@Component({
  selector: 'mm-navigation',
  imports: [CanvasFrameComponent, SectionHeaderComponent, PillTabsComponent, RippleDirective],
  templateUrl: './navigation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class NavigationComponent {
  protected readonly breadcrumb = [
    { label: 'MinimalMax', path: '/' },
    { label: 'Componentes', path: '/components' },
    { label: 'Navegación' },
  ];

  protected readonly pillTabs: readonly PillTab[] = [
    { id: 'general', label: 'General' },
    { id: 'billing', label: 'Billing' },
    { id: 'team', label: 'Team' },
    { id: 'security', label: 'Security' },
  ];
  protected readonly activeTab = signal('billing');

  protected readonly totalPages = 12;
  protected readonly currentPage = signal(4);

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages;
    const current = this.currentPage();
    const result: (number | 'gap')[] = [];
    const add = (n: number | 'gap') => result.push(n);

    add(1);
    if (current > 3) add('gap');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      add(i);
    }
    if (current < total - 2) add('gap');
    if (total > 1) add(total);
    return result;
  });

  protected readonly steps: readonly Step[] = [
    { id: 1, label: 'Cuenta', description: 'Datos de tu empresa' },
    { id: 2, label: 'Plan', description: 'Elige tu suscripción' },
    { id: 3, label: 'Pago', description: 'Información de cobro' },
    { id: 4, label: 'Confirma', description: 'Revisa y aprueba' },
  ];
  protected readonly currentStep = signal(2);

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage.set(page);
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (target?.isContentEditable) return;
    if (event.key === 'Home') {
      event.preventDefault();
      this.goToPage(1);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.goToPage(this.totalPages);
    }
  }

  protected nextStep(): void {
    this.currentStep.update((v) => Math.min(this.steps.length, v + 1));
  }

  protected prevStep(): void {
    this.currentStep.update((v) => Math.max(1, v - 1));
  }

  protected goToStep(id: number): void {
    if (id > this.currentStep() + 1) return;
    this.currentStep.set(id);
  }

  protected readonly snippetsBreadcrumbs: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'breadcrumbs.html',
      code: `<nav
  data-stagger
  class="flex items-center gap-2 text-sm flex-wrap"
  aria-label="Breadcrumb"
>
  @for (crumb of breadcrumb; track crumb.label;
        let last = $last; let first = $first) {
    @if (!first) {
      <svg class="size-3.5 text-ink-muted shrink-0" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6"></path>
      </svg>
    }
    @if (crumb.path && !last) {
      <a
        [href]="crumb.path"
        class="relative text-ink-muted hover:text-ink-dark transition-all
               font-medium hover:-translate-y-0.5 inline-block
               after:absolute after:left-0 after:-bottom-0.5 after:h-px
               after:w-0 after:bg-current after:transition-all
               hover:after:w-full"
      >
        {{ crumb.label }}
      </a>
    } @else {
      <span class="font-display font-medium text-ink-dark"
            style="animation: mm-badge-pop 360ms var(--ease-bounce) both">
        {{ crumb.label }}
      </span>
    }
  }
</nav>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'navigation.ts (breadcrumb)',
      code: `protected readonly breadcrumb = [
  { label: 'MinimalMax', path: '/' },
  { label: 'Componentes', path: '/components' },
  { label: 'Navegación' }, // sin path = current page
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-badge-pop',
      code: `/* mm-badge-pop — pop del badge/separador */
@keyframes mm-badge-pop {
  0%   { transform: scale(0.6);  opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}`,
    },
  ];

  protected readonly snippetsTabsPill: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'tabs-pill.html',
      code: `<mm-pill-tabs [tabs]="pillTabs" [(active)]="activeTab" />

<div class="p-5 rounded-mm-xl bg-surface-secondary/50 border border-border-soft">
  <p class="text-sm text-ink-secondary">
    Contenido de la pestaña
    <span class="font-mono text-ink-dark">{{ activeTab() }}</span>.
  </p>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'navigation.ts (pill tabs)',
      code: `import { PillTab, PillTabsComponent } from
  '../../shared/components/pill-tabs/pill-tabs';

protected readonly pillTabs: readonly PillTab[] = [
  { id: 'general',  label: 'General' },
  { id: 'billing',  label: 'Billing' },
  { id: 'team',     label: 'Team' },
  { id: 'security', label: 'Security' },
];

protected readonly activeTab = signal('billing');

// El componente mm-pill-tabs calcula la posición/ancho del pill activo
// con ViewChildren + computed signals — el indicador se desliza solo.`,
    },
  ];

  protected readonly snippetsTabsUnderline: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'tabs-underline.html',
      code: `<nav class="relative flex items-center gap-6 border-b border-border-soft"
     role="tablist">
  @for (tab of pillTabs; track tab.id) {
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="activeTab() === tab.id"
      (click)="activeTab.set(tab.id)"
      class="relative pb-3 text-sm font-medium transition-all
             hover:-translate-y-px"
      [class.text-ink-dark]="activeTab() === tab.id"
      [class.text-ink-muted]="activeTab() !== tab.id"
    >
      {{ tab.label }}
      @if (activeTab() === tab.id) {
        <span
          class="absolute -bottom-px left-0 right-0 h-0.5 rounded-mm-pill
                 bg-linear-to-r from-brand-6 via-primary-500 to-brand-pink"
          style="animation: mm-tab-underline 320ms var(--ease-out) both;"
        ></span>
      }
    </button>
  }
</nav>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (mm-tab-underline)',
      code: `@keyframes mm-tab-underline {
  from {
    transform: scaleX(0.2);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}`,
    },
  ];

  protected readonly snippetsPagination: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'pagination.html',
      code: `<nav data-stagger class="inline-flex items-center gap-1" aria-label="Paginación">
  <button
    type="button"
    mmRipple
    (click)="goToPage(currentPage() - 1)"
    [disabled]="currentPage() === 1"
    aria-label="Página anterior"
    class="group size-10 rounded-mm-md grid place-items-center
           hover:bg-surface-secondary disabled:opacity-40
           disabled:cursor-not-allowed mm-press"
  >
    <svg class="size-4"><path d="m15 18-6-6 6-6"></path></svg>
  </button>

  @for (page of pageNumbers(); track $index) {
    @if (page === 'gap') {
      <span class="size-10 grid place-items-center text-ink-muted">…</span>
    } @else {
      <button
        type="button"
        mmRipple
        (click)="goToPage(page)"
        [attr.aria-current]="currentPage() === page ? 'page' : null"
        class="size-10 rounded-mm-md text-sm font-medium mm-press"
        [class.bg-cta]="currentPage() === page"
        [class.text-white]="currentPage() === page"
        [class.shadow-mm-sm]="currentPage() === page"
        [class.text-ink-dark]="currentPage() !== page"
        [class.hover:bg-surface-secondary]="currentPage() !== page"
      >
        {{ page }}
      </button>
    }
  }

  <button (click)="goToPage(currentPage() + 1)"
          [disabled]="currentPage() === totalPages" mmRipple>
    <svg><path d="m9 18 6-6-6-6"></path></svg>
  </button>
</nav>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'navigation.ts (pagination)',
      code: `protected readonly totalPages = 12;
protected readonly currentPage = signal(4);

// Devuelve [1, 'gap', 3, 4, 5, 'gap', 12] según la posición actual
protected readonly pageNumbers = computed(() => {
  const total = this.totalPages;
  const current = this.currentPage();
  const result: (number | 'gap')[] = [];
  const add = (n: number | 'gap') => result.push(n);

  add(1);
  if (current > 3) add('gap');
  for (let i = Math.max(2, current - 1);
       i <= Math.min(total - 1, current + 1); i++) {
    add(i);
  }
  if (current < total - 2) add('gap');
  if (total > 1) add(total);
  return result;
});

protected goToPage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage.set(page);
}

// Atajos: Home → primera página, End → última página
@HostListener('document:keydown', ['$event'])
protected onKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement;
  if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
  if (target?.isContentEditable) return;
  if (event.key === 'Home') {
    event.preventDefault();
    this.goToPage(1);
  } else if (event.key === 'End') {
    event.preventDefault();
    this.goToPage(this.totalPages);
  }
}`,
    },
  ];

  protected readonly snippetsStepper: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'stepper.html (extracto)',
      code: `<ol class="flex items-start gap-2 md:gap-4" aria-label="Progreso del flujo">
  @for (step of steps; track step.id; let last = $last) {
    <li class="flex-1 flex items-center gap-2 md:gap-4"
        [attr.aria-current]="step.id === currentStep() ? 'step' : null">
      <button
        type="button"
        (click)="goToStep(step.id)"
        [disabled]="step.id > currentStep() + 1"
        class="group flex flex-col items-center gap-2 disabled:opacity-50"
      >
        <span
          class="size-10 rounded-mm-pill grid place-items-center font-display
                 text-sm font-semibold transition-all duration-500 ease-bounce"
          [class.bg-brand-6]="step.id < currentStep()"
          [class.text-white]="step.id < currentStep()"
          [class.shadow-mm-brand]="step.id <= currentStep()"
          [class.bg-cta]="step.id === currentStep()"
          [class.bg-surface-secondary]="step.id > currentStep()"
          [style.animation]="step.id === currentStep()
            ? 'mm-step-active 2.4s var(--ease-out) infinite' : null"
        >
          @if (step.id < currentStep()) {
            <svg style="animation: mm-check-pop 420ms var(--ease-bounce) both">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          } @else {
            {{ step.id }}
          }
        </span>
        <span class="flex flex-col items-center text-center">
          <span class="text-xs font-medium">{{ step.label }}</span>
          <span class="text-[11px] text-ink-muted hidden md:block">
            {{ step.description }}
          </span>
        </span>
      </button>

      @if (!last) {
        <span class="relative flex-1 h-0.5 rounded-mm-pill bg-border overflow-hidden">
          <span
            class="absolute inset-0 origin-left rounded-mm-pill
                   bg-linear-to-r from-brand-6 to-primary-500
                   transition-transform duration-500 ease-out"
            [style.transform]="step.id < currentStep() ? 'scaleX(1)' : 'scaleX(0)'"
          ></span>
        </span>
      }
    </li>
  }
</ol>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'navigation.ts (stepper)',
      code: `interface Step {
  readonly id: number;
  readonly label: string;
  readonly description: string;
}

protected readonly steps: readonly Step[] = [
  { id: 1, label: 'Cuenta',   description: 'Datos de tu empresa' },
  { id: 2, label: 'Plan',     description: 'Elige tu suscripción' },
  { id: 3, label: 'Pago',     description: 'Información de cobro' },
  { id: 4, label: 'Confirma', description: 'Revisa y aprueba' },
];

protected readonly currentStep = signal(2);

protected nextStep(): void {
  this.currentStep.update((v) => Math.min(this.steps.length, v + 1));
}

protected prevStep(): void {
  this.currentStep.update((v) => Math.max(1, v - 1));
}

// Solo se puede saltar al paso actual o al siguiente
protected goToStep(id: number): void {
  if (id > this.currentStep() + 1) return;
  this.currentStep.set(id);
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (animaciones del stepper)',
      code: `@keyframes mm-step-active {
  0%, 100% {
    box-shadow:
      var(--shadow-mm-brand),
      0 0 0 0 rgba(20, 86, 240, 0.45);
  }
  50% {
    box-shadow:
      var(--shadow-mm-brand),
      0 0 0 8px rgba(20, 86, 240, 0);
  }
}

@keyframes mm-check-pop {
  0%   { transform: scale(0);   opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}`,
    },
  ];
}
