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

  protected readonly snippetsIcon: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'buttons-icon.html',
      code: `<!-- CTA con icono que rota 90° en hover -->
<button
  type="button"
  mmRipple
  class="group inline-flex items-center gap-2 rounded-mm-md bg-cta px-5 py-2.5
         text-sm font-medium text-cta-fg transition-all duration-200
         hover:-translate-y-px hover:bg-cta-hover mm-press"
>
  <svg
    class="size-4 transition-transform duration-300 group-hover:rotate-90"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"
  >
    <path d="M12 5v14M5 12h14"></path>
  </svg>
  Nuevo proyecto
</button>

<!-- Pill con badge contador -->
<button
  type="button"
  mmRipple
  [color]="'rgba(20, 86, 240, 0.2)'"
  class="group inline-flex items-center gap-2 rounded-mm-pill bg-black/5
         px-5 py-2.5 text-sm font-medium text-ink-dark transition-colors
         hover:bg-surface-secondary mm-press"
>
  <svg class="size-4 transition-transform duration-300 group-hover:scale-110"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
  Comentar
  <span class="rounded-mm-pill bg-primary-200 text-primary-700
               text-[10px] font-semibold px-2 py-0.5">
    3
  </span>
</button>

<!-- Icon-only ghost button -->
<button
  type="button"
  mmRipple
  [color]="'rgba(0, 0, 0, 0.08)'"
  class="inline-flex items-center justify-center size-10 rounded-mm-pill
         bg-surface-base border border-border text-ink-dark
         hover:border-ink-dark hover:shadow-mm-sm transition mm-press"
  aria-label="Más opciones"
>
  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
</button>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'tip — icono reactivo al hover del padre',
      code: `/* El truco está en el modifier 'group' de Tailwind:
   - El botón tiene class="group"
   - El icono usa group-hover:rotate-90 / group-hover:scale-110
   - Así reaccionan al hover del botón, no del icono solo. */

/* Tokens de animación */
--duration-fast: 160ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);`,
    },
  ];

  protected readonly snippetsStates: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'buttons-states.html',
      code: `<!-- Hover (lift + shadow) -->
<button
  type="button"
  mmRipple
  class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-cta-fg
         transition-all hover:-translate-y-px hover:shadow-mm-elevated mm-press"
>
  Hover me
</button>

<!-- Focus visible con outline accesible -->
<button
  type="button"
  class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-cta-fg
         focus-visible:outline-2 focus-visible:outline-offset-2
         focus-visible:outline-primary-500"
>
  Focus me (Tab)
</button>

<!-- Disabled -->
<button
  type="button"
  disabled
  class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-cta-fg
         opacity-50 cursor-not-allowed"
>
  Disabled
</button>

<!-- Loading con skeleton overlay + spinner -->
<button
  type="button"
  mmRipple
  (click)="triggerLoading()"
  [disabled]="loading()"
  class="relative inline-flex items-center gap-2 rounded-mm-md bg-brand-6
         px-5 py-2.5 text-sm font-medium text-white shadow-mm-brand
         disabled:cursor-wait mm-press overflow-hidden"
>
  @if (loading()) {
    <span class="absolute inset-0 mm-skeleton opacity-30"></span>
    <svg class="relative size-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor"
              stroke-width="3" stroke-opacity="0.25"></circle>
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor"
            stroke-width="3" stroke-linecap="round"></path>
    </svg>
    <span class="relative">Procesando…</span>
  } @else {
    Probar loading
  }
</button>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'buttons.ts (extracto)',
      code: `protected readonly loading = signal(false);

protected async triggerLoading(): Promise<void> {
  this.loading.set(true);
  await new Promise((resolve) => setTimeout(resolve, 1400));
  this.loading.set(false);
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — skeleton shimmer',
      code: `.mm-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-secondary) 0%,
    var(--color-border-soft) 50%,
    var(--color-surface-secondary) 100%
  );
  background-size: 200% 100%;
  animation: mm-shimmer 1.4s ease-in-out infinite;
}

@keyframes mm-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
    },
  ];

  protected readonly snippetsToast: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'buttons.html — triggers',
      code: `<!-- 4 botones que disparan el toast service -->
<button
  type="button"
  mmRipple
  (click)="demoToast('success')"
  class="inline-flex items-center gap-2 rounded-mm-md bg-success px-4 py-2
         text-sm font-medium text-white shadow-mm-sm
         hover:shadow-mm-elevated transition mm-press"
>
  <span class="size-2 rounded-full bg-white"></span>
  Success
</button>

<button (click)="demoToast('error')"   class="... bg-error ...">Error</button>
<button (click)="demoToast('warning')" class="... bg-warning ...">Warning</button>
<button (click)="demoToast('info')"    class="... bg-brand-6 ...">Info</button>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'buttons.ts (extracto)',
      code: `import { inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

export class ButtonsComponent {
  private readonly toast = inject(ToastService);

  protected demoToast(variant: 'success' | 'error' | 'info' | 'warning'): void {
    const messages = {
      success: 'Componente guardado en tu biblioteca.',
      error:   'No pudimos completar la acción. Intenta de nuevo.',
      info:    'Hay una nueva versión disponible (v0.2).',
      warning: 'Tu sesión expira en 5 minutos.',
    };
    this.toast[variant](messages[variant], {
      title: variant.charAt(0).toUpperCase() + variant.slice(1),
    });
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — slide-in derecha',
      code: `@keyframes mm-toast-in {
  from {
    opacity: 0;
    transform: translateX(120%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* El ToastService inyecta nodos en un host fijo en bottom-right
   y los anima con esta keyframe. Auto-dismiss a los 4s por default. */`,
    },
  ];

  protected readonly snippetsPillTabs: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'buttons.html',
      code: `<mm-pill-tabs [tabs]="filterTabs" [(active)]="activeFilterTab" />

<!-- El componente internamente renderiza:
     - un track con bg-surface-secondary + rounded-mm-pill
     - un indicador absoluto bg-cta que se desliza con
       transition-[left,width] duration-300 ease-out
     - botones con z-10 que cambian color según active -->`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'buttons.ts (extracto)',
      code: `import { PillTab, PillTabsComponent } from '../../shared/components/pill-tabs/pill-tabs';

@Component({
  selector: 'mm-buttons',
  imports: [PillTabsComponent],
})
export class ButtonsComponent {
  protected readonly filterTabs: readonly PillTab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'members',  label: 'Members' },
    { id: 'settings', label: 'Settings' },
  ];
  protected readonly activeFilterTab = signal('overview');
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'pill-tabs.ts (template inline)',
      code: `/* El indicador deslizante se posiciona con left.px / width.px
   leídos del offsetLeft / offsetWidth del botón activo. */
.indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  border-radius: 9999px;
  background: var(--color-cta);
  box-shadow: var(--shadow-mm-sm);
  transition: left 300ms cubic-bezier(0.16, 1, 0.3, 1),
              width 300ms cubic-bezier(0.16, 1, 0.3, 1);
}`,
    },
  ];
}
