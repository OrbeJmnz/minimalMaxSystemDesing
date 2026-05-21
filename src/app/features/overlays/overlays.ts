import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ModalShellComponent } from '../../shared/components/modal-shell/modal-shell';
import { DrawerShellComponent } from '../../shared/components/drawer-shell/drawer-shell';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'mm-overlays',
  imports: [
    JsonPipe,
    CanvasFrameComponent,
    SectionHeaderComponent,
    ModalShellComponent,
    DrawerShellComponent,
    TooltipDirective,
    RippleDirective,
    ClickOutsideDirective,
  ],
  templateUrl: './overlays.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class OverlaysComponent {
  protected readonly modalOpen = signal(false);
  protected readonly confirmOpen = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly popoverOpen = signal(false);
  protected readonly cookieOpen = signal(true);
  protected readonly cookieMode = signal<'banner' | 'customize'>('banner');
  protected readonly cookiePrefs = signal({
    essential: true,
    analytics: true,
    marketing: false,
  });

  protected acceptAllCookies(): void {
    this.cookiePrefs.set({ essential: true, analytics: true, marketing: true });
    this.cookieOpen.set(false);
  }

  protected rejectAllCookies(): void {
    this.cookiePrefs.set({ essential: true, analytics: false, marketing: false });
    this.cookieOpen.set(false);
  }

  protected saveCookiePrefs(): void {
    this.cookieOpen.set(false);
  }

  protected reopenCookies(): void {
    this.cookieMode.set('banner');
    this.cookieOpen.set(true);
  }

  protected readonly snippetsModal: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overlays.html',
      code: `<button
  type="button"
  mmRipple
  (click)="modalOpen.set(true)"
  class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-white
         shadow-mm-sm hover:shadow-mm-elevated transition mm-press"
>
  Abrir modal
</button>

<mm-modal-shell
  [open]="modalOpen()"
  title="Invitar a tu equipo"
  eyebrow="Colaboración"
  (close)="modalOpen.set(false)"
>
  <p class="text-sm text-ink-secondary leading-relaxed">
    Agrega miembros a tu workspace por email…
  </p>
  <div class="mt-4 flex flex-col gap-1.5">
    <label class="text-xs font-medium text-ink-dark" for="modal-email">Email</label>
    <input
      id="modal-email"
      type="email"
      placeholder="tu@correo.com"
      class="rounded-mm-md border-2 border-border bg-surface-base px-4 py-2.5
             text-sm focus:border-primary-500 focus:outline-none
             focus:ring-3 focus:ring-primary-500/10 transition"
    />
  </div>

  <div slot="actions" class="flex items-center gap-3">
    <button type="button" (click)="modalOpen.set(false)"
            class="rounded-mm-md border border-border bg-surface-base px-4 py-2
                   text-sm font-medium text-ink-dark hover:border-ink-dark">
      Cancelar
    </button>
    <button type="button" mmRipple (click)="modalOpen.set(false)"
            class="rounded-mm-md bg-brand-6 px-4 py-2 text-sm font-medium
                   text-white shadow-mm-brand hover:shadow-mm-elevated">
      Enviar invitación
    </button>
  </div>
</mm-modal-shell>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overlays.ts',
      code: `// Estado: signal abierto/cerrado.
// mm-modal-shell se encarga del backdrop blur, escape, body lock y focus trap.
protected readonly modalOpen = signal(false);`,
    },
  ];

  protected readonly snippetsConfirmDialog: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overlays.html',
      code: `<button
  type="button"
  mmRipple
  (click)="confirmOpen.set(true)"
  class="rounded-mm-md bg-error px-5 py-2.5 text-sm font-medium text-white
         shadow-mm-sm hover:shadow-mm-elevated transition mm-press"
>
  Eliminar proyecto…
</button>

<mm-modal-shell
  [open]="confirmOpen()"
  title="¿Eliminar este proyecto?"
  eyebrow="Acción destructiva"
  (close)="confirmOpen.set(false)"
>
  <div class="flex items-start gap-4">
    <span class="size-12 rounded-mm-pill bg-error-bg text-error
                 grid place-items-center shrink-0">
      <svg class="size-6"><!-- alert-triangle --></svg>
    </span>
    <p class="text-sm text-ink-secondary leading-relaxed">
      Esta acción no se puede deshacer. Se eliminarán todos los archivos,
      configuraciones e integraciones asociadas con el proyecto.
    </p>
  </div>

  <div slot="actions" class="flex items-center gap-3">
    <button type="button" (click)="confirmOpen.set(false)"
            class="rounded-mm-md border border-border bg-surface-base
                   px-4 py-2 text-sm font-medium">
      Cancelar
    </button>
    <button type="button" mmRipple (click)="confirmOpen.set(false)"
            class="rounded-mm-md bg-error px-4 py-2 text-sm font-medium text-white">
      Sí, eliminar
    </button>
  </div>
</mm-modal-shell>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overlays.ts',
      code: `// Mismo patrón que el modal, pero con CTA destructivo (bg-error).
// Útil para confirmaciones de borrado, logout, cancelar suscripción, etc.
protected readonly confirmOpen = signal(false);`,
    },
  ];

  protected readonly snippetsDrawer: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overlays.html',
      code: `<button
  type="button"
  mmRipple
  (click)="drawerOpen.set(true)"
  class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-white
         shadow-mm-sm hover:shadow-mm-elevated transition mm-press"
>
  Abrir drawer →
</button>

<mm-drawer-shell
  [open]="drawerOpen()"
  title="Filtros avanzados"
  eyebrow="Búsqueda"
  side="right"
  (close)="drawerOpen.set(false)"
>
  <div class="flex flex-col gap-6">
    <label class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-ink-dark">Estado</span>
      <select class="rounded-mm-md border-2 border-border bg-surface-base
                     px-3 py-2 text-sm focus:border-primary-500 focus:outline-none">
        <option>Todos</option>
        <option>Activos</option>
        <option>Archivados</option>
      </select>
    </label>
    <label class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-ink-dark">Fecha de creación</span>
      <input type="date" class="rounded-mm-md border-2 border-border bg-surface-base px-3 py-2 text-sm" />
    </label>

    <!-- Footer sticky con CTA -->
    <div class="flex items-center gap-3 mt-2 sticky bottom-0 bg-surface-base py-3
                -mx-6 px-6 border-t border-border-soft">
      <button (click)="drawerOpen.set(false)"
              class="flex-1 rounded-mm-md border border-border px-4 py-2 text-sm">
        Limpiar
      </button>
      <button mmRipple (click)="drawerOpen.set(false)"
              class="flex-1 rounded-mm-md bg-cta px-4 py-2 text-sm text-white">
        Aplicar
      </button>
    </div>
  </div>
</mm-drawer-shell>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overlays.ts',
      code: `// side: 'right' | 'left'. mm-drawer-shell hace slide-in + backdrop + escape.
protected readonly drawerOpen = signal(false);`,
    },
  ];

  protected readonly snippetsTooltips: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overlays.html',
      code: `<!-- Tooltip con directive — hover/focus muestra el bocadillo. -->
<!-- tooltipSide acepta: 'top' | 'bottom' | 'right' | 'left'. -->

<button
  type="button"
  mmTooltip="Crea un nuevo proyecto"
  tooltipSide="top"
  class="rounded-mm-md bg-surface-secondary px-4 py-2 text-sm font-medium
         text-ink-dark hover:bg-border transition mm-press"
>
  Tooltip arriba
</button>

<button
  type="button"
  mmTooltip="Configuración avanzada"
  tooltipSide="bottom"
  class="rounded-mm-md bg-surface-secondary px-4 py-2 text-sm font-medium"
>
  Tooltip abajo
</button>

<button
  type="button"
  mmTooltip="Documentación completa, atajos de teclado y guías"
  tooltipSide="top"
  aria-label="Ayuda"
  class="size-10 rounded-mm-pill bg-surface-secondary text-ink-dark
         hover:bg-border grid place-items-center transition mm-press"
>
  <svg class="size-4"><!-- help-circle --></svg>
</button>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'tooltip.directive.ts',
      code: `// La directive TooltipDirective ya está en shared/directives.
// Sólo importa y úsala — maneja hover, focus, posicionamiento y escape.

import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  imports: [TooltipDirective],
  // ...
})`,
    },
  ];

  protected readonly snippetsPopover: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overlays.html',
      code: `<div
  class="relative inline-block"
  (mmClickOutside)="popoverOpen.set(false)"
  [mmClickOutsideEnabled]="popoverOpen()"
>
  <button
    type="button"
    mmRipple
    (click)="popoverOpen.set(!popoverOpen())"
    class="inline-flex items-center gap-2 rounded-mm-md bg-surface-secondary
           px-4 py-2 text-sm font-medium text-ink-dark hover:bg-border transition mm-press"
    [class.!bg-cta]="popoverOpen()"
    [class.!text-white]="popoverOpen()"
  >
    <svg class="size-4"><!-- info --></svg>
    Más info
  </button>

  @if (popoverOpen()) {
    <div
      class="absolute top-full mt-2 left-0 z-40 w-72 rounded-mm-xl
             border border-border-soft bg-surface-base shadow-mm-elevated p-4"
      style="animation: scaleIn 200ms var(--ease-out) both;
             transform-origin: top left;"
      role="dialog"
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <h4 class="font-display text-sm font-semibold">Datos sensibles</h4>
        <button (click)="popoverOpen.set(false)" aria-label="Cerrar"
                class="size-6 rounded-mm-sm grid place-items-center">
          <svg class="size-3.5"><!-- x --></svg>
        </button>
      </div>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Información cifrada con AES-256 en reposo…
      </p>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overlays.ts',
      code: `// A diferencia del tooltip, el popover se abre con click y persiste
// hasta que el usuario cierra (✕ o click fuera).
protected readonly popoverOpen = signal(false);`,
    },
  ];

  protected readonly snippetsCookieConsent: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overlays.html',
      code: `@if (cookieOpen()) {
  <div
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md
           z-40 rounded-mm-2xl border border-border-soft bg-surface-base
           shadow-mm-elevated p-5 mm-no-print"
    style="animation: slideInRight 380ms var(--ease-out) both"
    role="dialog"
    aria-label="Consentimiento de cookies"
  >
    @if (cookieMode() === 'banner') {
      <div class="flex items-start gap-3 mb-4">
        <span class="size-10 rounded-mm-pill bg-primary-200 text-primary-700
                     grid place-items-center">🍪</span>
        <div class="flex-1 min-w-0">
          <h4 class="font-display text-sm font-semibold">Cookies en MinimalMax</h4>
          <p class="text-xs text-ink-secondary leading-relaxed mt-1">
            Usamos cookies esenciales para que el sitio funcione, y analytics
            para mejorar la experiencia. Tú decides.
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <button mmRipple (click)="acceptAllCookies()"
                class="w-full rounded-mm-md bg-cta px-4 py-2 text-sm text-cta-fg">
          Aceptar todas
        </button>
        <div class="flex gap-2">
          <button (click)="rejectAllCookies()"
                  class="flex-1 rounded-mm-md border border-border px-4 py-2 text-sm">
            Rechazar
          </button>
          <button (click)="cookieMode.set('customize')"
                  class="flex-1 rounded-mm-md border border-border px-4 py-2 text-sm">
            Personalizar
          </button>
        </div>
      </div>
    } @else {
      <!-- Modo 'customize': toggles por categoría (essential/analytics/marketing)
           con peer-checked. Botón "Guardar preferencias" al final. -->
    }
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overlays.ts',
      code: `protected readonly cookieOpen = signal(true);
protected readonly cookieMode = signal<'banner' | 'customize'>('banner');
protected readonly cookiePrefs = signal({
  essential: true,
  analytics: true,
  marketing: false,
});

protected acceptAllCookies(): void {
  this.cookiePrefs.set({ essential: true, analytics: true, marketing: true });
  this.cookieOpen.set(false);
}

protected rejectAllCookies(): void {
  this.cookiePrefs.set({ essential: true, analytics: false, marketing: false });
  this.cookieOpen.set(false);
}

protected saveCookiePrefs(): void {
  this.cookieOpen.set(false);
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css',
      code: `/* slideInRight — el banner entra desde la derecha (mobile y desktop) */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* mm-no-print — oculta el banner al usar window.print() */
@media print {
  .mm-no-print { display: none !important; }
}`,
    },
  ];
}
