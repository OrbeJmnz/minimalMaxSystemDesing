import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { EmptyStateComponent } from '@minimax/ui-angular';
import { SkeletonComponent } from '@minimax/ui-angular';
import { RippleDirective } from '@minimax/ui-angular';

@Component({
  selector: 'mm-states',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    EmptyStateComponent,
    SkeletonComponent,
    RippleDirective,
  ],
  templateUrl: './states.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class StatesComponent {
  private readonly router = inject(Router);
  protected readonly isLoading = signal(false);

  protected async simulateLoading(): Promise<void> {
    this.isLoading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    this.isLoading.set(false);
  }

  protected goHome(): void {
    this.router.navigateByUrl('/overview');
  }

  protected readonly snippetsEmpty: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'states.html',
      code: `<mm-empty-state
  title="Aún no hay componentes guardados"
  description="Cuando guardes un componente desde la galería aparecerá aquí para acceder rápido."
  variant="brand"
>
  <div slot="actions" class="flex items-center gap-2">
    <button
      type="button"
      mmRipple
      class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-white shadow-mm-sm
             hover:shadow-mm-elevated mm-press hover:-translate-y-0.25 transition-all duration-200"
    >
      Explorar galería
    </button>
    <button
      type="button"
      class="rounded-mm-md border border-border bg-surface-base px-5 py-2.5 text-sm font-medium
             text-ink-dark hover:border-ink-dark mm-press hover:-translate-y-0.25 transition-all duration-200"
    >
      Ver tutorial
    </button>
  </div>
</mm-empty-state>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'states.ts',
      code: `import { EmptyStateComponent } from '@minimax/ui-angular';
import { RippleDirective } from '@minimax/ui-angular';

@Component({
  imports: [EmptyStateComponent, RippleDirective],
  templateUrl: './states.html',
})
export class StatesComponent {}

// Variantes disponibles: 'default' | 'brand' | 'success' | 'warning' | 'error'`,
    },
  ];

  protected readonly snippetsSkeleton: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'states.html',
      code: `<button type="button" mmRipple (click)="simulateLoading()"
  class="rounded-mm-md bg-brand-6 px-4 py-2 text-sm font-medium text-white shadow-mm-brand mm-press"
>
  Simular carga (1.8s)
</button>

<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
  @for (n of [1, 2, 3]; track n) {
    <div class="rounded-mm-2xl bg-surface-base border border-border-soft p-5 shadow-mm-sm">
      @if (isLoading()) {
        <mm-skeleton width="44px" height="44px" radius="var(--radius-mm-md)" />
        <div class="mt-4 space-y-2">
          <mm-skeleton width="60%" height="14px" />
          <mm-skeleton width="100%" height="12px" />
          <mm-skeleton width="80%" height="12px" />
        </div>
        <mm-skeleton width="110px" height="32px" radius="9999px" />
      } @else {
        <!-- contenido real -->
      }
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'states.ts',
      code: `import { signal } from '@angular/core';
import { SkeletonComponent } from '@minimax/ui-angular';

export class StatesComponent {
  protected readonly isLoading = signal(false);

  protected async simulateLoading(): Promise<void> {
    this.isLoading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    this.isLoading.set(false);
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (extracto)',
      code: `/* Shimmer del skeleton — gradient horizontal moviéndose */
.mm-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-secondary) 25%,
    var(--color-border-soft) 50%,
    var(--color-surface-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s linear infinite;
  border-radius: var(--radius-mm-md);
}

@keyframes skeleton-loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
    },
  ];

  protected readonly snippets404: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'states.html',
      code: `<div class="rounded-mm-2xl border border-border-soft bg-linear-to-br from-surface-base to-surface-secondary py-12">
  <mm-empty-state
    title="Esta página se fue al limbo"
    description="La ruta que buscas no existe o fue movida. Vuelve al inicio o usa la búsqueda."
    variant="error"
  >
    <span slot="icon">
      <span class="relative font-display text-6xl font-medium text-ink-dark">404</span>
    </span>
    <div slot="actions" class="flex items-center gap-2">
      <button type="button" mmRipple (click)="goHome()"
        class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-white shadow-mm-sm mm-press"
      >
        ← Volver al inicio
      </button>
      <button type="button"
        class="rounded-mm-md border border-border bg-surface-base px-5 py-2.5 text-sm font-medium text-ink-dark"
      >
        Reportar enlace roto
      </button>
    </div>
  </mm-empty-state>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'states.ts',
      code: `import { inject } from '@angular/core';
import { Router } from '@angular/router';

export class StatesComponent {
  private readonly router = inject(Router);

  protected goHome(): void {
    this.router.navigateByUrl('/overview');
  }
}`,
    },
  ];

  protected readonly snippetsMaintenance: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'states.html',
      code: `<div class="rounded-mm-2xl border border-border-soft bg-linear-to-br from-amber-50 to-surface-base py-12">
  <mm-empty-state
    title="Volvemos en unos minutos"
    description="Estamos desplegando mejoras de rendimiento. La galería volverá aproximadamente a las 14:30 hrs CDMX."
    variant="warning"
  >
    <span slot="icon">
      <svg class="relative size-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77..." />
      </svg>
    </span>
    <div slot="actions">
      <button type="button" mmRipple
        class="rounded-mm-md bg-warning px-5 py-2.5 text-sm font-medium text-white shadow-mm-sm mm-press"
      >
        Suscribirme a updates
      </button>
    </div>
  </mm-empty-state>
</div>`,
    },
  ];

  protected readonly snippetsVariants: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'states.html',
      code: `<div data-stagger class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="rounded-mm-2xl border border-border-soft bg-surface-base">
    <mm-empty-state
      title="Sin resultados"
      description="Tu búsqueda no encontró componentes."
      variant="default"
    />
  </div>
  <div class="rounded-mm-2xl border border-border-soft bg-surface-base">
    <mm-empty-state
      title="Todo al corriente"
      description="No hay notificaciones pendientes."
      variant="success"
    >
      <svg slot="icon" class="relative size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </mm-empty-state>
  </div>
  <div class="rounded-mm-2xl border border-border-soft bg-surface-base">
    <mm-empty-state
      title="Sin permisos"
      description="Pide acceso al administrador del equipo."
      variant="error"
    >
      <svg slot="icon" class="relative size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </mm-empty-state>
  </div>
</div>`,
    },
  ];
}
