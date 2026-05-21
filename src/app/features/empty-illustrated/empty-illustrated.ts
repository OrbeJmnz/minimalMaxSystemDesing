import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

type EmptyVariantId =
  | 'no-results'
  | 'no-data'
  | 'no-permissions'
  | 'network-error'
  | 'coming-soon'
  | 'maintenance'
  | 'paywall'
  | 'success';

interface EmptyVariant {
  readonly id: EmptyVariantId;
  readonly title: string;
  readonly description: string;
  readonly cta: string;
  readonly secondaryCta?: string;
}

@Component({
  selector: 'mm-empty-illustrated',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './empty-illustrated.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class EmptyIllustratedComponent {
  protected readonly activeVariant = signal<EmptyVariantId>('no-results');

  protected readonly variants: readonly EmptyVariant[] = [
    {
      id: 'no-results',
      title: 'Sin resultados',
      description:
        'No encontramos nada para esa búsqueda. Prueba con términos más generales o limpia los filtros activos.',
      cta: 'Limpiar filtros',
      secondaryCta: 'Ver todo',
    },
    {
      id: 'no-data',
      title: 'Aún sin datos',
      description:
        'Cuando empieces a recibir tráfico, las métricas aparecerán aquí. Es cuestión de tiempo.',
      cta: 'Configurar tracking',
    },
    {
      id: 'no-permissions',
      title: 'Sin acceso a esta sección',
      description:
        'Tu rol actual no incluye permisos para ver Billing. Habla con el admin de tu workspace.',
      cta: 'Solicitar acceso',
      secondaryCta: 'Volver al inicio',
    },
    {
      id: 'network-error',
      title: 'Sin conexión',
      description:
        'Estamos teniendo problemas para alcanzar el servidor. Verifica tu conexión y reintenta.',
      cta: 'Reintentar',
    },
    {
      id: 'coming-soon',
      title: 'Próximamente',
      description:
        'Esta función está en desarrollo. Avísanos si quieres acceso early — lanzamos en julio.',
      cta: 'Pedir acceso early',
      secondaryCta: 'Ver roadmap',
    },
    {
      id: 'maintenance',
      title: 'En mantenimiento',
      description:
        'Estamos actualizando la base de datos. Volvemos en aproximadamente 8 minutos.',
      cta: 'Ver status page',
    },
    {
      id: 'paywall',
      title: 'Esta función es del plan Growth',
      description:
        'Charts avanzados, exports ilimitados y soporte prioritario están en el plan Growth.',
      cta: 'Upgrade a Growth',
      secondaryCta: 'Ver comparación',
    },
    {
      id: 'success',
      title: '¡Todo listo!',
      description:
        'Tu workspace está configurado. Es hora de invitar a tu equipo y crear tu primer proyecto.',
      cta: 'Crear proyecto',
      secondaryCta: 'Invitar equipo',
    },
  ];

  protected setVariant(id: EmptyVariantId): void {
    this.activeVariant.set(id);
  }

  protected currentVariant(): EmptyVariant {
    return this.variants.find((v) => v.id === this.activeVariant()) ?? this.variants[0];
  }

  protected variantTone(id: EmptyVariantId): {
    readonly accent: string;
    readonly muted: string;
    readonly fill: string;
  } {
    switch (id) {
      case 'no-results':
        return { accent: '#f59e0b', muted: '#fde68a', fill: '#fef3c7' };
      case 'no-data':
        return { accent: '#1456f0', muted: '#bfdbfe', fill: '#dbeafe' };
      case 'no-permissions':
        return { accent: '#ef4444', muted: '#fecaca', fill: '#fee2e2' };
      case 'network-error':
        return { accent: '#ea5ec1', muted: '#fbcfe8', fill: '#fce7f3' };
      case 'coming-soon':
        return { accent: '#8b5cf6', muted: '#ddd6fe', fill: '#ede9fe' };
      case 'maintenance':
        return { accent: '#f59e0b', muted: '#fed7aa', fill: '#ffedd5' };
      case 'paywall':
        return { accent: '#1456f0', muted: '#bfdbfe', fill: '#dbeafe' };
      case 'success':
        return { accent: '#10b981', muted: '#bbf7d0', fill: '#d1fae5' };
    }
  }

  protected readonly snippetsGallery: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'empty-state-illustrated.html',
      code: `<!-- Empty state con illustration SVG inline custom -->
<section class="text-center max-w-md mx-auto py-12">
  <!-- SVG illustration con colores por variante -->
  <svg viewBox="0 0 320 240" class="w-full max-w-xs mx-auto mb-6"
       [attr.aria-label]="variant.title">
    <!-- Background shapes geométricas con opacity -->
    <circle cx="160" cy="120" r="80" [attr.fill]="tone.fill"/>

    <!-- Floating elements con animation nativa -->
    <rect x="80" y="100" width="40" height="40" rx="8" [attr.fill]="tone.muted">
      <animate attributeName="y" values="100;90;100" dur="3s" repeatCount="indefinite"/>
    </rect>
    <circle cx="220" cy="140" r="14" [attr.fill]="tone.accent" opacity="0.7">
      <animate attributeName="r" values="14;18;14" dur="2.5s" repeatCount="indefinite"/>
    </circle>

    <!-- Main object central (lupa / dashboard / lock / wifi / etc según variante) -->
    <g transform="translate(140, 80)">
      <!-- SVG icon central de 40x40 -->
    </g>
  </svg>

  <h3 class="font-display text-xl md:text-2xl font-medium text-ink-dark mb-2">
    {{ variant.title }}
  </h3>
  <p class="text-sm text-ink-secondary leading-relaxed mb-6">
    {{ variant.description }}
  </p>

  <div class="flex flex-wrap items-center justify-center gap-2">
    <button class="rounded-mm-md bg-cta text-cta-fg px-5 py-2.5 text-sm font-medium">
      {{ variant.cta }}
    </button>
    @if (variant.secondaryCta) {
      <button class="rounded-mm-md border border-border bg-surface-base px-5 py-2.5 text-sm">
        {{ variant.secondaryCta }}
      </button>
    }
  </div>
</section>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'empty-variants.ts',
      code: `type EmptyVariantId =
  | 'no-results' | 'no-data' | 'no-permissions'
  | 'network-error' | 'coming-soon' | 'maintenance'
  | 'paywall' | 'success';

interface EmptyVariant {
  readonly id: EmptyVariantId;
  readonly title: string;
  readonly description: string;
  readonly cta: string;
  readonly secondaryCta?: string;
}

protected readonly variants: readonly EmptyVariant[] = [
  {
    id: 'no-results',
    title: 'Sin resultados',
    description: 'No encontramos nada para esa búsqueda...',
    cta: 'Limpiar filtros',
    secondaryCta: 'Ver todo',
  },
  // ... 7 más
];

// Cada variante tiene su paleta (accent + muted + fill) para colorear el SVG inline
protected variantTone(id: EmptyVariantId): { accent: string; muted: string; fill: string } {
  switch (id) {
    case 'no-results':     return { accent: '#f59e0b', muted: '#fde68a', fill: '#fef3c7' };
    case 'no-data':        return { accent: '#1456f0', muted: '#bfdbfe', fill: '#dbeafe' };
    case 'no-permissions': return { accent: '#ef4444', muted: '#fecaca', fill: '#fee2e2' };
    case 'success':        return { accent: '#10b981', muted: '#bbf7d0', fill: '#d1fae5' };
    // ...
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (animations involucradas)',
      code: `/* Las animaciones del SVG son nativas (<animate> tags),
   no requieren CSS adicional.

   Para el container, usamos fadeInUp del @theme inline: */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Variant switcher con pop al activar */
@keyframes mm-check-pop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}`,
    },
  ];

  protected readonly snippetsSwitcher: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'variant-switcher.html',
      code: `<!-- Grid de pills clickeables para previsualizar cada variante -->
<nav data-stagger class="flex flex-wrap items-center gap-2">
  @for (v of variants; track v.id) {
    <button
      (click)="setVariant(v.id)"
      [class.bg-cta]="activeVariant() === v.id"
      [class.text-cta-fg]="activeVariant() === v.id"
      [class.shadow-mm-sm]="activeVariant() === v.id"
      [class.scale-105]="activeVariant() === v.id"
      class="rounded-mm-pill border bg-surface-base px-3 py-1.5 text-xs font-medium
             transition-all duration-200 mm-press hover:-translate-y-px"
    >
      {{ v.title }}
    </button>
  }
</nav>`,
    },
  ];

  protected readonly snippetsSizes: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'empty-state-sizes.html',
      code: `<!-- 3 tamaños del mismo patrón -->

<!-- 1. FULL PAGE (h-screen, illustration grande) -->
<div class="min-h-[60vh] grid place-items-center">
  <section class="text-center max-w-md mx-auto p-6">
    <svg class="w-full max-w-xs mx-auto mb-6"><!-- 320x240 --></svg>
    <h3 class="font-display text-2xl">{{ variant.title }}</h3>
    <p class="text-sm text-ink-secondary mt-2">{{ variant.description }}</p>
    <button class="mt-6 bg-cta text-cta-fg px-5 py-2.5">{{ variant.cta }}</button>
  </section>
</div>

<!-- 2. IN-CARD (compacto, illustration mediana) -->
<article class="rounded-mm-2xl border bg-surface-base p-8 text-center">
  <svg class="size-32 mx-auto mb-4"><!-- 128x128 --></svg>
  <h4 class="font-display text-lg">{{ variant.title }}</h4>
  <p class="text-xs text-ink-secondary mt-1">{{ variant.description }}</p>
  <button class="mt-4 bg-cta text-cta-fg px-4 py-2 text-xs">{{ variant.cta }}</button>
</article>

<!-- 3. IN-ROW (horizontal, illustration pequeña al lado) -->
<div class="rounded-mm-xl border bg-surface-base p-4 flex items-center gap-4">
  <svg class="size-16 shrink-0"><!-- 64x64 --></svg>
  <div class="flex-1">
    <p class="font-medium text-sm">{{ variant.title }}</p>
    <p class="text-xs text-ink-muted">{{ variant.description }}</p>
  </div>
  <button class="bg-cta text-cta-fg px-3 py-1.5 text-xs">{{ variant.cta }}</button>
</div>`,
    },
  ];
}
