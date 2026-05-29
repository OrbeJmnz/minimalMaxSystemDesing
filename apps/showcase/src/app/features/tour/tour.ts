import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { TourService, TourStep } from '../../core/services/tour.service';

@Component({
  selector: 'mm-tour',
  imports: [CanvasFrameComponent, SectionHeaderComponent, RippleDirective],
  templateUrl: './tour.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TourComponent {
  protected readonly tour = inject(TourService);

  protected readonly steps: readonly TourStep[] = [
    {
      targetId: 'tour-target-1',
      title: 'Bienvenido al tour',
      description:
        'Te voy a mostrar los puntos clave del producto en 4 pasos. Puedes saltarlo en cualquier momento.',
      placement: 'bottom',
    },
    {
      targetId: 'tour-target-2',
      title: 'Crea proyectos rápido',
      description:
        'Click aquí para iniciar un proyecto nuevo. Se duplica con todos los tokens MinimalMax cableados.',
      placement: 'bottom',
    },
    {
      targetId: 'tour-target-3',
      title: 'Configura tu workspace',
      description:
        'Aquí ajustas tu tema, idioma y notificaciones. Los cambios se guardan automáticamente.',
      placement: 'top',
    },
    {
      targetId: 'tour-target-4',
      title: '¡Listo para construir!',
      description:
        'Ya conoces lo esencial. Cualquier duda, abre el chat de soporte en la esquina inferior derecha.',
      placement: 'top',
    },
  ];

  protected startTour(): void {
    this.tour.start(this.steps);
  }

  protected readonly snippetsDemo: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'tour.html',
      code: `<button type="button" mmRipple (click)="startTour()"
  class="rounded-mm-md bg-cta px-5 py-3 text-sm font-medium text-cta-fg shadow-mm-sm mm-press"
>
  🎯 Empezar tour
</button>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-mm-2xl border border-border-soft p-6">
  <!-- Cada target debe tener un id único — el TourService apunta a estos -->
  <div id="tour-target-1" class="rounded-mm-xl bg-surface-base border border-border-soft p-5 shadow-mm-sm">
    <h4 class="font-display text-base">Inicio</h4>
    <p class="text-xs text-ink-secondary mt-1">Vista general de tu workspace.</p>
  </div>

  <div id="tour-target-2" class="rounded-mm-xl bg-surface-base border border-border-soft p-5 shadow-mm-sm">
    <h4 class="font-display text-base">Nuevo proyecto</h4>
    <p class="text-xs text-ink-secondary mt-1">Crea un proyecto en segundos.</p>
  </div>

  <div id="tour-target-3" class="rounded-mm-xl bg-surface-base border border-border-soft p-5 shadow-mm-sm">
    <h4 class="font-display text-base">Configuración</h4>
    <p class="text-xs text-ink-secondary mt-1">Ajustes del workspace.</p>
  </div>

  <div id="tour-target-4" class="rounded-mm-xl bg-linear-to-br from-amber-500 to-orange-500 text-white p-5 shadow-mm-brand">
    <h4 class="font-display text-base">¡Listo!</h4>
    <p class="text-xs text-white/80 mt-1">A construir.</p>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'tour.ts',
      code: `import { Component, inject } from '@angular/core';
import { TourService, TourStep } from '../../core/services/tour.service';

@Component({ /* ... */ })
export class TourComponent {
  protected readonly tour = inject(TourService);

  protected readonly steps: readonly TourStep[] = [
    {
      targetId: 'tour-target-1',
      title: 'Bienvenido al tour',
      description: 'Te voy a mostrar los puntos clave del producto en 4 pasos. Puedes saltarlo en cualquier momento.',
      placement: 'bottom',
    },
    {
      targetId: 'tour-target-2',
      title: 'Crea proyectos rápido',
      description: 'Click aquí para iniciar un proyecto nuevo. Se duplica con todos los tokens MinimalMax cableados.',
      placement: 'bottom',
    },
    {
      targetId: 'tour-target-3',
      title: 'Configura tu workspace',
      description: 'Aquí ajustas tu tema, idioma y notificaciones. Los cambios se guardan automáticamente.',
      placement: 'top',
    },
    {
      targetId: 'tour-target-4',
      title: '¡Listo para construir!',
      description: 'Ya conoces lo esencial. Cualquier duda, abre el chat de soporte.',
      placement: 'top',
    },
  ];

  protected startTour(): void {
    this.tour.start(this.steps);
  }
}`,
    },
  ];

  protected readonly snippetsApi: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'tour.html',
      code: `<!-- Solo un <pre> con código embebido, no hay markup interactivo -->
<pre class="font-mono text-xs bg-surface-inverse text-white/90 p-5 rounded-mm-xl overflow-x-auto">
  // Ver TS para el contenido del snippet
</pre>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'TourService API',
      code: `// component.ts
private readonly tour = inject(TourService);

protected startOnboarding() {
  this.tour.start([
    {
      targetId: 'sidebar-create',
      title: 'Crea tu primer proyecto',
      description: 'Click aquí para empezar.',
      placement: 'right',
    },
    {
      targetId: 'topbar-theme',
      title: 'Cambia el tema',
      description: 'Light o dark, lo que prefieras.',
    },
  ]);
}

// Métodos del service:
// tour.next()     -> siguiente paso
// tour.prev()     -> paso anterior
// tour.skip()     -> cerrar tour
// tour.complete() -> finalizar

// Signals expuestos:
// tour.active        -> boolean (tour en curso)
// tour.currentStep   -> TourStep | null
// tour.currentIndex  -> number (0-based)
// tour.total         -> number (cantidad total de steps)
// tour.isFirst       -> boolean
// tour.isLast        -> boolean`,
    },
  ];
}
