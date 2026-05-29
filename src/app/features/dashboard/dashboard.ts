import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ChartLineComponent, LinePoint } from '../../shared/components/charts/chart-line';
import { ChartDonutComponent, DonutSlice } from '../../shared/components/charts/chart-donut';
import { ChartBarComponent, BarItem } from '../../shared/components/charts/chart-bar';
import { ChartSparklineComponent } from '../../shared/components/charts/chart-sparkline';
import { RippleDirective } from '../../shared/directives/ripple.directive';

interface StatCard {
  readonly label: string;
  readonly value: string;
  readonly delta: number;
  readonly trendUp: boolean;
  readonly icon: string;
  readonly tone: string;
  readonly spark: readonly number[];
}

interface TopPage {
  readonly path: string;
  readonly views: number;
  readonly bounceRate: number;
  readonly avgTime: string;
}

interface ActivityEvent {
  readonly id: string;
  readonly user: string;
  readonly initials: string;
  readonly tone: string;
  readonly action: string;
  readonly target: string;
  readonly time: string;
}

interface GeoEntry {
  readonly country: string;
  readonly flag: string;
  readonly users: number;
  readonly percent: number;
}

type DashRange = '7d' | '30d' | '90d';

@Component({
  selector: 'mm-dashboard',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    ChartLineComponent,
    ChartDonutComponent,
    ChartBarComponent,
    ChartSparklineComponent,
    RippleDirective,
  ],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DashboardComponent {
  protected readonly range = signal<DashRange>('30d');

  protected readonly ranges: readonly { id: DashRange; label: string }[] = [
    { id: '7d', label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: '90d', label: '90 días' },
  ];

  protected readonly stats: readonly StatCard[] = [
    {
      label: 'Ingresos',
      value: '$184,250',
      delta: 14.4,
      trendUp: true,
      icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
      tone: 'bg-primary-200 text-primary-700',
      spark: [42, 38, 52, 48, 58, 55, 64, 72, 68, 78, 84, 92, 88, 96],
    },
    {
      label: 'Usuarios activos',
      value: '12,486',
      delta: 8.2,
      trendUp: true,
      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      tone: 'bg-brand-pink/15 text-brand-pink',
      spark: [820, 845, 890, 920, 980, 1020, 1080, 1110, 1180, 1240, 1280, 1320, 1380, 1448],
    },
    {
      label: 'Sesiones',
      value: '38,902',
      delta: -2.1,
      trendUp: false,
      icon: 'M3 3h18v18H3zM3 9h18M9 21V9',
      tone: 'bg-success-bg text-success',
      spark: [3200, 3450, 3380, 3520, 3480, 3650, 3580, 3420, 3380, 3250, 3180, 3050, 2980, 3120],
    },
    {
      label: 'Duración promedio',
      value: '4m 28s',
      delta: 5.6,
      trendUp: true,
      icon: 'M12 6v6l4 2M22 12a10 10 0 1 1-10-10',
      tone: 'bg-warning-bg text-warning',
      spark: [220, 235, 248, 252, 260, 258, 265, 272, 268, 278, 285, 290, 280, 295],
    },
  ];

  protected readonly revenueData: readonly LinePoint[] = [
    { label: '1 May', value: 4200 },
    { label: '3', value: 4850 },
    { label: '5', value: 5240 },
    { label: '7', value: 5180 },
    { label: '9', value: 6020 },
    { label: '11', value: 6380 },
    { label: '13', value: 6240 },
    { label: '15', value: 7180 },
    { label: '17', value: 7840 },
    { label: '19', value: 7620 },
    { label: '21', value: 8420 },
    { label: '23', value: 9180 },
    { label: '25', value: 8940 },
    { label: '27', value: 9620 },
    { label: '29', value: 10240 },
    { label: '30 May', value: 10890 },
  ];

  protected readonly trafficSources: readonly DonutSlice[] = [
    { label: 'Búsqueda orgánica', value: 4820, color: 'var(--color-brand-6)' },
    { label: 'Directo', value: 3140, color: 'var(--color-brand-pink)' },
    { label: 'Social', value: 2280, color: 'var(--color-success)' },
    { label: 'Referral', value: 1480, color: 'var(--color-warning)' },
    { label: 'Email', value: 760, color: 'var(--color-brand-sky)' },
  ];

  protected readonly deviceSessions: readonly BarItem[] = [
    { label: 'Mobile', value: 18420 },
    { label: 'Desktop', value: 15280 },
    { label: 'Tablet', value: 4280 },
    { label: 'Smart TV', value: 920 },
  ];

  protected readonly topPages: readonly TopPage[] = [
    { path: '/products', views: 24850, bounceRate: 32, avgTime: '3m 12s' },
    { path: '/pricing', views: 18420, bounceRate: 28, avgTime: '4m 48s' },
    { path: '/docs', views: 14280, bounceRate: 22, avgTime: '5m 22s' },
    { path: '/blog/design-systems', views: 9840, bounceRate: 18, avgTime: '6m 15s' },
    { path: '/about', views: 7620, bounceRate: 42, avgTime: '2m 08s' },
  ];

  protected readonly activity: readonly ActivityEvent[] = [
    {
      id: 'a-1',
      user: 'Sofia Reyes',
      initials: 'SR',
      tone: 'from-brand-pink to-fuchsia-500',
      action: 'mergeó el PR',
      target: '#248 · Refactor canvas-frame',
      time: 'Hace 2 min',
    },
    {
      id: 'a-2',
      user: 'Diego Luna',
      initials: 'DL',
      tone: 'from-emerald-500 to-teal-500',
      action: 'creó un release',
      target: 'v2.4.1 · Bugfixes',
      time: 'Hace 14 min',
    },
    {
      id: 'a-3',
      user: 'Ana Vega',
      initials: 'AV',
      tone: 'from-amber-500 to-orange-500',
      action: 'comentó en',
      target: 'Onboarding flow review',
      time: 'Hace 1 hora',
    },
    {
      id: 'a-4',
      user: 'Karina Mendez',
      initials: 'KM',
      tone: 'from-brand-6 to-primary-500',
      action: 'invitó a',
      target: 'luis@orbe.dev al workspace',
      time: 'Hace 2 horas',
    },
    {
      id: 'a-5',
      user: 'Luis Mora',
      initials: 'LM',
      tone: 'from-violet-500 to-purple-600',
      action: 'publicó',
      target: '3 componentes en producción',
      time: 'Ayer',
    },
  ];

  protected readonly geography: readonly GeoEntry[] = [
    { country: 'México', flag: '🇲🇽', users: 3240, percent: 26 },
    { country: 'Estados Unidos', flag: '🇺🇸', users: 2890, percent: 23 },
    { country: 'Colombia', flag: '🇨🇴', users: 1480, percent: 12 },
    { country: 'Argentina', flag: '🇦🇷', users: 1280, percent: 10 },
    { country: 'España', flag: '🇪🇸', users: 980, percent: 8 },
    { country: 'Chile', flag: '🇨🇱', users: 720, percent: 6 },
  ];

  protected readonly maxBounce = computed(() =>
    Math.max(...this.topPages.map((p) => p.bounceRate)),
  );

  protected setRange(id: DashRange): void {
    this.range.set(id);
  }

  protected readonly snippetsDashboard: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'dashboard.html (composición)',
      code: `<!-- Dashboard layout: header + 4 stats + chart hero + 2 charts + table + activity + geo -->
<div class="space-y-5">

  <!-- Topbar local: title + date range + export -->
  <header class="flex items-center justify-between">
    <h2 class="font-display text-2xl font-medium">Analytics overview</h2>
    <div class="flex items-center gap-2">
      <nav class="rounded-mm-pill bg-surface-secondary p-1">
        @for (r of ranges; track r.id) {
          <button (click)="setRange(r.id)"
                  [class.bg-surface-base]="range() === r.id">
            {{ r.label }}
          </button>
        }
      </nav>
      <button class="rounded-mm-md bg-cta text-cta-fg px-4 py-2">Exportar</button>
    </div>
  </header>

  <!-- Stat cards row (4 cols) -->
  <div data-stagger class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    @for (stat of stats; track stat.label) {
      <article class="rounded-mm-2xl bg-surface-base border p-5 shadow-mm-sm mm-hover-lift">
        <header class="flex items-center justify-between mb-4">
          <span [class]="'size-10 rounded-mm-md grid place-items-center ' + stat.tone">
            <svg><!-- icon --></svg>
          </span>
          <span [class.text-success]="stat.trendUp"
                [class.text-error]="!stat.trendUp">
            {{ stat.trendUp ? '↑' : '↓' }} {{ stat.delta }}%
          </span>
        </header>
        <p class="text-xs text-ink-muted">{{ stat.label }}</p>
        <p class="font-display text-3xl">{{ stat.value }}</p>
        <mm-chart-sparkline [data]="stat.spark"
                            [variant]="stat.trendUp ? 'success' : 'error'" />
      </article>
    }
  </div>

  <!-- Chart hero (revenue) -->
  <article class="rounded-mm-2xl bg-surface-base border p-6">
    <header><h3>Ingresos</h3></header>
    <mm-chart-line [data]="revenueData" variant="brand"
                   [width]="800" [height]="220" />
  </article>

  <!-- 2 charts grid: donut + bar -->
  <div class="grid md:grid-cols-2 gap-5">
    <article class="rounded-mm-2xl bg-surface-base border p-6">
      <h3>Fuentes de tráfico</h3>
      <mm-chart-donut [data]="trafficSources" />
    </article>
    <article class="rounded-mm-2xl bg-surface-base border p-6">
      <h3>Sesiones por dispositivo</h3>
      <mm-chart-bar [data]="deviceSessions" variant="gradient" />
    </article>
  </div>

  <!-- Top pages table -->
  <article class="rounded-mm-2xl bg-surface-base border">
    <header class="p-5 border-b"><h3>Top páginas</h3></header>
    <table>...</table>
  </article>

  <!-- Activity feed + Geography (2 cols) -->
  <div class="grid md:grid-cols-2 gap-5">
    <article><!-- Activity --></article>
    <article><!-- Geography --></article>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'dashboard.ts (data structures + range signal)',
      code: `interface StatCard {
  readonly label: string;
  readonly value: string;
  readonly delta: number;
  readonly trendUp: boolean;
  readonly icon: string;
  readonly tone: string;        // tailwind class for icon wrapper
  readonly spark: readonly number[];
}

type DashRange = '7d' | '30d' | '90d';

protected readonly range = signal<DashRange>('30d');

protected readonly stats: readonly StatCard[] = [
  {
    label: 'Ingresos',
    value: '$184,250',
    delta: 14.4,
    trendUp: true,
    icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    tone: 'bg-primary-200 text-primary-700',
    spark: [42, 38, 52, 48, 58, 55, 64, 72, 68, 78, 84, 92, 88, 96],
  },
  // ... 3 más
];

// Data tipada para cada chart
protected readonly revenueData: readonly LinePoint[] = [
  { label: '1 May', value: 4200 },
  // ... 30 puntos
];

protected readonly trafficSources: readonly DonutSlice[] = [
  { label: 'Búsqueda orgánica', value: 4820, tone: 'brand-6' },
  { label: 'Directo',            value: 3140, tone: 'brand-pink' },
  { label: 'Social',             value: 2280, tone: 'success' },
  { label: 'Referral',           value: 1480, tone: 'warning' },
  { label: 'Email',              value:  760, tone: 'brand-sky' },
];

protected readonly deviceSessions: readonly BarItem[] = [
  { label: 'Mobile',   value: 18420 },
  { label: 'Desktop',  value: 15280 },
  { label: 'Tablet',   value: 4280 },
  { label: 'Smart TV', value: 920 },
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (clases usadas)',
      code: `/* Hover lift de cards */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* Stagger entry para grid de stats */
[data-stagger] > * {
  opacity: 0;
  animation: fadeInUp 600ms var(--ease-out) both;
}
[data-stagger] > *:nth-child(1) { animation-delay: 40ms; }
[data-stagger] > *:nth-child(2) { animation-delay: 100ms; }
[data-stagger] > *:nth-child(3) { animation-delay: 160ms; }
[data-stagger] > *:nth-child(4) { animation-delay: 220ms; }

/* Tokens */
--color-brand-6: #1456f0;
--color-brand-pink: #ea5ec1;
--color-success: #10b981;
--color-error: #ef4444;
--shadow-mm-sm: 0 4px 6px rgba(0, 0, 0, 0.08);
--shadow-mm-elevated: 0 12px 16px -4px rgba(36, 36, 36, 0.08);
--radius-mm-2xl: 20px;`,
    },
  ];

  protected readonly snippetsStats: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'stat-cards-row.html',
      code: `<div data-stagger class="grid grid-cols-2 lg:grid-cols-4 gap-4">
  @for (stat of stats; track stat.label) {
    <article class="group rounded-mm-2xl bg-surface-base border border-border-soft
                    p-5 shadow-mm-sm mm-hover-lift">
      <header class="flex items-center justify-between mb-3">
        <span [class]="'size-10 rounded-mm-md grid place-items-center
                        transition-transform duration-300 group-hover:rotate-6 ' +
                        stat.tone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path [attr.d]="stat.icon" />
          </svg>
        </span>
        <span class="inline-flex items-center gap-1 text-xs font-semibold rounded-mm-pill px-2 py-0.5"
              [class.bg-success-bg]="stat.trendUp"
              [class.text-success]="stat.trendUp"
              [class.bg-error-bg]="!stat.trendUp"
              [class.text-error]="!stat.trendUp">
          {{ stat.trendUp ? '↑' : '↓' }} {{ stat.delta }}%
        </span>
      </header>
      <p class="text-xs text-ink-muted mb-1">{{ stat.label }}</p>
      <p class="font-display text-3xl font-medium leading-none tabular-nums mb-3">
        {{ stat.value }}
      </p>
      <mm-chart-sparkline [data]="stat.spark"
                          [variant]="stat.trendUp ? 'success' : 'error'"
                          [width]="140" [height]="32" />
    </article>
  }
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsActivity: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'activity-feed.html',
      code: `<ol class="flex flex-col gap-0.5">
  @for (event of activity; track event.id) {
    <li class="flex items-start gap-3 p-3 rounded-mm-md
                hover:bg-surface-secondary/50 transition-colors">
      <span [class]="
        'size-9 shrink-0 rounded-mm-pill bg-linear-to-br grid place-items-center
         font-display font-semibold text-white text-xs shadow-mm-sm ' + event.tone
      ">
        {{ event.initials }}
      </span>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-ink-dark">
          <span class="font-medium">{{ event.user }}</span>
          <span class="text-ink-secondary"> {{ event.action }} </span>
          <span class="font-medium">{{ event.target }}</span>
        </p>
        <p class="text-xs text-ink-muted font-mono mt-0.5">{{ event.time }}</p>
      </div>
    </li>
  }
</ol>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'activity data',
      code: `interface ActivityEvent {
  readonly id: string;
  readonly user: string;
  readonly initials: string;
  readonly tone: string;       // gradient classes
  readonly action: string;     // verbo: "mergeó", "comentó en"
  readonly target: string;     // el objeto: "#248 · Refactor"
  readonly time: string;       // ISO + format con DatePipe O literal "Hace 2 min"
}

protected readonly activity: readonly ActivityEvent[] = [
  {
    id: 'a-1',
    user: 'Sofia Reyes',
    initials: 'SR',
    tone: 'from-brand-pink to-fuchsia-500',
    action: 'mergeó el PR',
    target: '#248 · Refactor canvas-frame',
    time: 'Hace 2 min',
  },
  // ... resto
];`,
    },
  ];

  protected readonly snippetsGeo: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'geo-distribution.html',
      code: `<ul class="flex flex-col gap-3">
  @for (entry of geography; track entry.country) {
    <li class="flex items-center gap-3">
      <span class="text-xl shrink-0">{{ entry.flag }}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-ink-dark">{{ entry.country }}</span>
          <span class="text-xs font-mono tabular-nums text-ink-muted">
            {{ entry.users.toLocaleString() }} · {{ entry.percent }}%
          </span>
        </div>
        <div class="h-1.5 rounded-mm-pill bg-border overflow-hidden">
          <div class="h-full bg-linear-to-r from-brand-6 to-primary-500
                      transition-[width] duration-700 ease-out"
               [style.width.%]="entry.percent"></div>
        </div>
      </div>
    </li>
  }
</ul>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'geo data',
      code: `interface GeoEntry {
  readonly country: string;
  readonly flag: string;       // emoji flag (cero deps, soporte nativo)
  readonly users: number;
  readonly percent: number;    // 0-100
}

protected readonly geography: readonly GeoEntry[] = [
  { country: 'México',          flag: '🇲🇽', users: 3240, percent: 26 },
  { country: 'Estados Unidos',  flag: '🇺🇸', users: 2890, percent: 23 },
  { country: 'Colombia',        flag: '🇨🇴', users: 1480, percent: 12 },
  // ...
];`,
    },
  ];
}
