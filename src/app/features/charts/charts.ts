import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import {
  ChartLineComponent,
  LinePoint,
} from '../../shared/components/charts/chart-line';
import {
  BarItem,
  ChartBarComponent,
} from '../../shared/components/charts/chart-bar';
import {
  ChartDonutComponent,
  DonutSlice,
} from '../../shared/components/charts/chart-donut';
import { ChartSparklineComponent } from '../../shared/components/charts/chart-sparkline';
import {
  ChartHeatmapComponent,
  HeatCell,
} from '../../shared/components/charts/chart-heatmap';
import { ChartRingComponent } from '../../shared/components/charts/chart-ring';

@Component({
  selector: 'mm-charts',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    ChartLineComponent,
    ChartBarComponent,
    ChartDonutComponent,
    ChartSparklineComponent,
    ChartHeatmapComponent,
    ChartRingComponent,
  ],
  templateUrl: './charts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ChartsComponent {
  protected readonly revenueData: readonly LinePoint[] = [
    { label: 'Ene', value: 12 },
    { label: 'Feb', value: 18 },
    { label: 'Mar', value: 14 },
    { label: 'Abr', value: 22 },
    { label: 'May', value: 28 },
    { label: 'Jun', value: 24 },
    { label: 'Jul', value: 32 },
    { label: 'Ago', value: 38 },
    { label: 'Sep', value: 35 },
    { label: 'Oct', value: 42 },
    { label: 'Nov', value: 48 },
    { label: 'Dic', value: 52 },
  ];

  protected readonly signupsData: readonly LinePoint[] = [
    { label: 'L', value: 32 },
    { label: 'M', value: 48 },
    { label: 'X', value: 41 },
    { label: 'J', value: 56 },
    { label: 'V', value: 68 },
    { label: 'S', value: 52 },
    { label: 'D', value: 39 },
  ];

  protected readonly trafficBars: readonly BarItem[] = [
    { label: 'Lun', value: 420 },
    { label: 'Mar', value: 580 },
    { label: 'Mié', value: 510 },
    { label: 'Jue', value: 720 },
    { label: 'Vie', value: 860 },
    { label: 'Sáb', value: 340 },
    { label: 'Dom', value: 280 },
  ];

  protected readonly categoryBars: readonly BarItem[] = [
    { label: 'Diseño', value: 28, color: 'bg-brand-6' },
    { label: 'Code', value: 42, color: 'bg-brand-pink' },
    { label: 'Docs', value: 15, color: 'bg-emerald-500' },
    { label: 'QA', value: 22, color: 'bg-amber-500' },
    { label: 'Ops', value: 18, color: 'bg-violet-500' },
  ];

  protected readonly traffic: readonly DonutSlice[] = [
    { label: 'Orgánico', value: 4820, color: 'var(--color-brand-6)' },
    { label: 'Social', value: 2310, color: 'var(--color-brand-pink)' },
    { label: 'Directo', value: 1840, color: 'var(--color-brand-sky)' },
    { label: 'Email', value: 950, color: '#10b981' },
    { label: 'Otros', value: 380, color: 'var(--color-ink-muted)' },
  ];

  protected readonly stack: readonly DonutSlice[] = [
    { label: 'Frontend', value: 45, color: 'var(--color-brand-6)' },
    { label: 'Backend', value: 30, color: 'var(--color-brand-pink)' },
    { label: 'DevOps', value: 15, color: '#10b981' },
    { label: 'Design', value: 10, color: '#f59e0b' },
  ];

  protected readonly statCards = [
    {
      label: 'MRR',
      value: '$24.8K',
      delta: '+12.4%',
      trend: 'up',
      spark: [12, 18, 14, 22, 28, 24, 32, 38, 35, 42, 48, 52],
      variant: 'brand' as const,
    },
    {
      label: 'Sign-ups',
      value: '1,284',
      delta: '+8.2%',
      trend: 'up',
      spark: [32, 48, 41, 56, 68, 52, 39],
      variant: 'success' as const,
    },
    {
      label: 'Churn',
      value: '2.1%',
      delta: '-0.4%',
      trend: 'down',
      spark: [3.2, 2.9, 3.0, 2.7, 2.4, 2.5, 2.1],
      variant: 'pink' as const,
    },
    {
      label: 'Latencia p99',
      value: '184ms',
      delta: '+12ms',
      trend: 'up',
      spark: [142, 158, 152, 168, 175, 172, 184],
      variant: 'warning' as const,
    },
  ];

  protected readonly activityHeatmap: readonly HeatCell[] = this.generateHeatmap();

  protected readonly progressRings = [
    { value: 78, label: 'Cobertura', variant: 'brand' as const },
    { value: 92, label: 'Performance', variant: 'success' as const },
    { value: 64, label: 'Onboarding', variant: 'pink' as const },
    { value: 38, label: 'Reviews', variant: 'warning' as const },
  ];

  protected readonly snippetsStats: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'charts.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-4 gap-3">
  @for (stat of statCards; track stat.label) {
    <div class="group rounded-mm-2xl bg-surface-base border border-border-soft
                p-5 shadow-mm-sm mm-hover-lift">
      <div class="flex items-start justify-between mb-2">
        <p class="text-xs text-ink-muted font-medium">{{ stat.label }}</p>
        <span class="rounded-mm-pill px-1.5 py-0.5 text-[10px] font-semibold"
              [class.bg-success-bg]="stat.trend === 'up'"
              [class.text-success]="stat.trend === 'up'"
              [class.bg-error-bg]="stat.trend === 'down'"
              [class.text-error]="stat.trend === 'down'">
          {{ stat.delta }}
        </span>
      </div>
      <p class="font-display text-2xl font-medium text-ink-dark tabular-nums">
        {{ stat.value }}
      </p>
      <div class="h-9 mt-2">
        <mm-chart-sparkline [data]="stat.spark" [variant]="stat.variant" />
      </div>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'charts.ts (data)',
      code: `protected readonly statCards = [
  {
    label: 'MRR',
    value: '$24.8K',
    delta: '+12.4%',
    trend: 'up',
    spark: [12, 18, 14, 22, 28, 24, 32, 38, 35, 42, 48, 52],
    variant: 'brand' as const,
  },
  {
    label: 'Sign-ups',
    value: '1,284',
    delta: '+8.2%',
    trend: 'up',
    spark: [32, 48, 41, 56, 68, 52, 39],
    variant: 'success' as const,
  },
  {
    label: 'Churn',
    value: '2.1%',
    delta: '-0.4%',
    trend: 'down',
    spark: [3.2, 2.9, 3.0, 2.7, 2.4, 2.5, 2.1],
    variant: 'pink' as const,
  },
  {
    label: 'Latencia p99',
    value: '184ms',
    delta: '+12ms',
    trend: 'up',
    spark: [142, 158, 152, 168, 175, 172, 184],
    variant: 'warning' as const,
  },
];`,
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

  protected readonly snippetsLine: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'charts.html',
      code: `<div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
  <div class="flex items-baseline justify-between mb-4">
    <div>
      <p class="text-xs text-ink-muted">Ingresos totales 2026</p>
      <p class="font-display text-3xl font-medium text-ink-dark tabular-nums">$364.2K</p>
    </div>
    <span class="rounded-mm-pill bg-success-bg text-success px-2.5 py-1 text-xs font-semibold">
      ↑ 28.4% YoY
    </span>
  </div>
  <mm-chart-line
    [data]="revenueData"
    [width]="720"
    [height]="200"
    variant="brand"
    ariaLabel="Ingresos por mes durante 2026"
  />
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'charts.ts (data)',
      code: `import { LinePoint } from '../../shared/components/charts/chart-line';

protected readonly revenueData: readonly LinePoint[] = [
  { label: 'Ene', value: 12 },
  { label: 'Feb', value: 18 },
  { label: 'Mar', value: 14 },
  { label: 'Abr', value: 22 },
  { label: 'May', value: 28 },
  { label: 'Jun', value: 24 },
  { label: 'Jul', value: 32 },
  { label: 'Ago', value: 38 },
  { label: 'Sep', value: 35 },
  { label: 'Oct', value: 42 },
  { label: 'Nov', value: 48 },
  { label: 'Dic', value: 52 },
];`,
    },
  ];

  protected readonly snippetsLineSmall: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'charts.html',
      code: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
    <p class="text-xs text-ink-muted mb-1">Sign-ups esta semana</p>
    <p class="font-display text-xl font-medium text-ink-dark mb-3 tabular-nums">336</p>
    <mm-chart-line
      [data]="signupsData"
      [width]="360"
      [height]="120"
      variant="success"
      [showDots]="false"
    />
  </div>
  <div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
    <p class="text-xs text-ink-muted mb-1">Tendencia variant pink</p>
    <p class="font-display text-xl font-medium text-ink-dark mb-3 tabular-nums">52</p>
    <mm-chart-line
      [data]="signupsData"
      [width]="360"
      [height]="120"
      variant="pink"
      [showGrid]="false"
    />
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'charts.ts (data)',
      code: `protected readonly signupsData: readonly LinePoint[] = [
  { label: 'L', value: 32 },
  { label: 'M', value: 48 },
  { label: 'X', value: 41 },
  { label: 'J', value: 56 },
  { label: 'V', value: 68 },
  { label: 'S', value: 52 },
  { label: 'D', value: 39 },
];`,
    },
  ];

  protected readonly snippetsBar: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'charts.html',
      code: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
    <p class="text-xs text-ink-muted mb-1">Tráfico semanal</p>
    <p class="font-display text-xl font-medium text-ink-dark mb-4 tabular-nums">3,710 visitas</p>
    <mm-chart-bar [data]="trafficBars" [height]="180" variant="gradient" />
  </div>
  <div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
    <p class="text-xs text-ink-muted mb-1">Distribución por categoría</p>
    <p class="font-display text-xl font-medium text-ink-dark mb-4 tabular-nums">125 PRs</p>
    <mm-chart-bar [data]="categoryBars" [height]="180" />
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'charts.ts (data)',
      code: `import { BarItem } from '../../shared/components/charts/chart-bar';

protected readonly trafficBars: readonly BarItem[] = [
  { label: 'Lun', value: 420 },
  { label: 'Mar', value: 580 },
  { label: 'Mié', value: 510 },
  { label: 'Jue', value: 720 },
  { label: 'Vie', value: 860 },
  { label: 'Sáb', value: 340 },
  { label: 'Dom', value: 280 },
];

protected readonly categoryBars: readonly BarItem[] = [
  { label: 'Diseño', value: 28, color: 'bg-brand-6' },
  { label: 'Code', value: 42, color: 'bg-brand-pink' },
  { label: 'Docs', value: 15, color: 'bg-emerald-500' },
  { label: 'QA', value: 22, color: 'bg-amber-500' },
  { label: 'Ops', value: 18, color: 'bg-violet-500' },
];`,
    },
  ];

  protected readonly snippetsDonut: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'charts.html',
      code: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
    <p class="text-xs text-ink-muted mb-4">Fuentes de tráfico</p>
    <mm-chart-donut [data]="traffic" totalLabel="visitas" />
  </div>
  <div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
    <p class="text-xs text-ink-muted mb-4">Stack del equipo</p>
    <mm-chart-donut [data]="stack" totalLabel="seats" [size]="180" />
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'charts.ts (data)',
      code: `import { DonutSlice } from '../../shared/components/charts/chart-donut';

protected readonly traffic: readonly DonutSlice[] = [
  { label: 'Orgánico', value: 4820, color: 'var(--color-brand-6)' },
  { label: 'Social', value: 2310, color: 'var(--color-brand-pink)' },
  { label: 'Directo', value: 1840, color: 'var(--color-brand-sky)' },
  { label: 'Email', value: 950, color: '#10b981' },
  { label: 'Otros', value: 380, color: 'var(--color-ink-muted)' },
];

protected readonly stack: readonly DonutSlice[] = [
  { label: 'Frontend', value: 45, color: 'var(--color-brand-6)' },
  { label: 'Backend', value: 30, color: 'var(--color-brand-pink)' },
  { label: 'DevOps', value: 15, color: '#10b981' },
  { label: 'Design', value: 10, color: '#f59e0b' },
];`,
    },
  ];

  protected readonly snippetsRings: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'charts.html',
      code: `<div data-stagger class="flex flex-wrap items-center justify-around gap-4">
  @for (ring of progressRings; track ring.label) {
    <mm-chart-ring
      [value]="ring.value"
      [label]="ring.label"
      [variant]="ring.variant"
      [size]="140"
      [thickness]="12"
    />
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'charts.ts (data)',
      code: `protected readonly progressRings = [
  { value: 78, label: 'Cobertura', variant: 'brand' as const },
  { value: 92, label: 'Performance', variant: 'success' as const },
  { value: 64, label: 'Onboarding', variant: 'pink' as const },
  { value: 38, label: 'Reviews', variant: 'warning' as const },
];`,
    },
  ];

  protected readonly snippetsHeatmap: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'charts.html',
      code: `<div class="rounded-mm-xl border border-border-soft bg-surface-base p-5 shadow-mm-sm">
  <div class="flex items-baseline justify-between mb-4">
    <div>
      <p class="text-xs text-ink-muted">Actividad últimos 140 días</p>
      <p class="font-display text-xl font-medium text-ink-dark tabular-nums">
        386 contribuciones
      </p>
    </div>
    <span class="text-xs text-ink-muted font-mono">Hasta 2026-05-16</span>
  </div>
  <mm-chart-heatmap [data]="activityHeatmap" [cellSize]="14" />
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'charts.ts (data generator)',
      code: `import { HeatCell } from '../../shared/components/charts/chart-heatmap';

protected readonly activityHeatmap: readonly HeatCell[] = this.generateHeatmap();

private generateHeatmap(): readonly HeatCell[] {
  const days = 140;
  const today = new Date('2026-05-16');
  const cells: HeatCell[] = [];
  let seed = 1;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    seed = (seed * 9301 + 49297) % 233280;
    const random = seed / 233280;
    const dayOfWeek = d.getDay();
    const weekday = dayOfWeek > 0 && dayOfWeek < 6;
    const base = weekday ? 4 : 1.5;
    const value = Math.max(0, Math.round(random * random * 12 * base));
    cells.push({ date: d.toISOString().slice(0, 10), value });
  }
  return cells;
}`,
    },
  ];

  protected readonly snippetsApi: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'API charts',
      code: `<mm-chart-line
  [data]="data"              <!-- readonly { label, value }[] -->
  [width]="720" [height]="200"
  variant="brand"             <!-- brand | success | warning | pink -->
  [showArea]="true"           <!-- gradient fill -->
  [showDots]="true"           <!-- puntos en cada valor -->
  [showGrid]="true"           <!-- grid lines -->
/>

<mm-chart-bar [data]="bars" variant="gradient" />

<mm-chart-donut [data]="slices" totalLabel="total" />

<mm-chart-sparkline [data]="[12,18,14,22,28]" variant="success" />

<mm-chart-ring [value]="78" label="Cobertura" variant="brand" />

<mm-chart-heatmap [data]="cells" [cellSize]="14" />`,
    },
  ];

  private generateHeatmap(): readonly HeatCell[] {
    const days = 140;
    const today = new Date('2026-05-16');
    const cells: HeatCell[] = [];
    let seed = 1;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      seed = (seed * 9301 + 49297) % 233280;
      const random = seed / 233280;
      const dayOfWeek = d.getDay();
      const weekday = dayOfWeek > 0 && dayOfWeek < 6;
      const base = weekday ? 4 : 1.5;
      const value = Math.max(0, Math.round(random * random * 12 * base));
      cells.push({
        date: d.toISOString().slice(0, 10),
        value,
      });
    }
    return cells;
  }
}
