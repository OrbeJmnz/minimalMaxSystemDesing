import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'mm-chart-sparkline',
  imports: [],
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      preserveAspectRatio="none"
      class="block w-full h-full"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <defs>
        <linearGradient [attr.id]="gradientId()" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" [attr.stop-color]="strokeColor()" stop-opacity="0.3"></stop>
          <stop offset="100%" [attr.stop-color]="strokeColor()" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      <path [attr.d]="areaPath()" [attr.fill]="'url(#' + gradientId() + ')'" />
      <path
        [attr.d]="linePath()"
        fill="none"
        [attr.stroke]="strokeColor()"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ChartSparklineComponent {
  private static counter = 0;
  private readonly id = `mm-sparkline-${++ChartSparklineComponent.counter}`;

  readonly data = input.required<readonly number[]>();
  readonly width = input(120);
  readonly height = input(36);
  readonly variant = input<'brand' | 'success' | 'warning' | 'error' | 'pink'>('brand');
  readonly ariaLabel = input<string>('Sparkline');

  protected readonly gradientId = computed(() => `${this.id}-gradient`);

  protected readonly strokeColor = computed(() => {
    switch (this.variant()) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      case 'pink':
        return 'var(--color-brand-pink)';
      default:
        return 'var(--color-brand-6)';
    }
  });

  protected readonly points = computed(() => {
    const values = this.data();
    if (values.length === 0) return [];
    const w = this.width();
    const h = this.height();
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const xStep = w / Math.max(1, values.length - 1);
    return values.map((v, i) => ({
      x: i * xStep,
      y: h - 2 - (h - 4) * ((v - min) / range),
    }));
  });

  protected readonly linePath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return '';
    return pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  });

  protected readonly areaPath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return '';
    const h = this.height();
    const first = pts[0];
    const last = pts[pts.length - 1];
    return [
      `M ${first.x.toFixed(1)} ${h}`,
      ...pts.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
      `L ${last.x.toFixed(1)} ${h}`,
      'Z',
    ].join(' ');
  });
}
