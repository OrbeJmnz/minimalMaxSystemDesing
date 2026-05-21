import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { PillTab, PillTabsComponent } from '../../shared/components/pill-tabs/pill-tabs';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'mm-buttons',
  imports: [CanvasFrameComponent, SectionHeaderComponent, PillTabsComponent, RippleDirective],
  templateUrl: './buttons.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ButtonsComponent {
  protected readonly loading = signal(false);
  private readonly toast = inject(ToastService);

  protected readonly filterTabs: readonly PillTab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'members', label: 'Members' },
    { id: 'settings', label: 'Settings' },
  ];
  protected readonly activeFilterTab = signal('overview');

  protected async triggerLoading(): Promise<void> {
    this.loading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    this.loading.set(false);
    this.toast.success('Acción completada', {
      title: 'Listo',
      action: { label: 'Deshacer', run: () => this.toast.info('Acción revertida') },
    });
  }

  protected demoToast(variant: 'success' | 'error' | 'info' | 'warning'): void {
    const messages = {
      success: 'Componente guardado en tu biblioteca.',
      error: 'No pudimos completar la acción. Intenta de nuevo.',
      info: 'Hay una nueva versión disponible (v0.2).',
      warning: 'Tu sesión expira en 5 minutos.',
    };
    this.toast[variant](messages[variant], {
      title: variant.charAt(0).toUpperCase() + variant.slice(1),
    });
  }

  protected readonly snippetsVariants: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'buttons.html',
      code: `<button
  type="button"
  mmRipple
  class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-cta-fg
         hover:-translate-y-px hover:bg-cta-hover transition-all duration-200 mm-press"
>
  Primary Dark
</button>

<button
  type="button"
  mmRipple
  class="rounded-mm-md bg-brand-6 px-5 py-2.5 text-sm font-medium text-white
         shadow-mm-brand hover:bg-primary-600 hover:-translate-y-px transition mm-press"
>
  Primary Brand
</button>

<button
  type="button"
  mmRipple
  class="rounded-mm-pill bg-cta px-5 py-2.5 text-sm font-medium text-cta-fg
         hover:bg-cta-hover hover:-translate-y-px transition mm-press"
>
  Pill Active
</button>

<button
  type="button"
  mmRipple
  class="rounded-mm-md bg-surface-secondary px-5 py-2.5 text-sm font-medium text-ink-dark
         hover:bg-border-soft hover:-translate-y-px transition mm-press"
>
  Secondary
</button>

<button
  type="button"
  mmRipple
  class="rounded-mm-md border border-border bg-surface-base px-5 py-2.5 text-sm font-medium
         text-ink-dark hover:border-ink-dark hover:shadow-mm-sm transition mm-press"
>
  Ghost
</button>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'buttons.ts',
      code: `import { Component } from '@angular/core';
import { RippleDirective } from '../../shared/directives/ripple.directive';

@Component({
  selector: 'mm-buttons',
  imports: [RippleDirective],
  templateUrl: './buttons.html',
})
export class ButtonsComponent {}

// La directiva mmRipple genera el efecto de onda al click.
// Es opcional via [color]="'rgba(20, 86, 240, 0.2)'" para tintar el ripple.`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (extracto)',
      code: `/* mm-press: efecto de pulsado en click */
.mm-press {
  transition: transform var(--duration-fast) var(--ease-out);
}
.mm-press:active {
  transform: scale(0.97);
}

/* Tokens involucrados */
--color-cta: #181e25;
--color-cta-fg: #ffffff;
--color-cta-hover: #000000;
--color-brand-6: #1456f0;
--shadow-mm-brand: 0 0 15px rgba(44, 30, 116, 0.16);
--radius-mm-md: 8px;
--radius-mm-pill: 9999px;`,
    },
  ];

  protected readonly snippetsSizes: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'buttons-sizes.html',
      code: `<button class="rounded-mm-md bg-cta px-3 py-1.5 text-xs font-semibold text-cta-fg mm-press">
  Small
</button>

<button class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-cta-fg mm-press">
  Medium
</button>

<button class="rounded-mm-md bg-cta px-7 py-3.5 text-base font-medium text-cta-fg mm-press">
  Large
</button>`,
    },
  ];
}
