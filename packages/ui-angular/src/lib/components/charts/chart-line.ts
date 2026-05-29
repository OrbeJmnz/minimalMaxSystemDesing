import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface LinePoint {
  readonly label: string;
  readonly value: number;
}

@Component({
  selector: 'mm-chart-line',
  imports: [],
  template: `
    <figure class="block w-full" role="img" [attr.aria-label]="ariaLabel()">
      <svg
        [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
        preserveAspectRatio="none"
        class="w-full h-auto block"
      >
        <defs>
          <linearGradient [attr.id]="gradientId()" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" [attr.stop-color]="strokeColor()" stop-opacity="0.35"></stop>
            <stop offset="100%" [attr.stop-color]="strokeColor()" stop-opacity="0"></stop>
          </linearGradient>
        </defs>

        @if (showGrid()) {
          @for (line of gridLines(); track $index) {
            <line
              [attr.x1]="padding()"
              [attr.x2]="width() - padding()"
              [attr.y1]="line"
              [attr.y2]="line"
              stroke="var(--color-border-soft)"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
          }
        }

        @if (showArea()) {
          <path
            [attr.d]="areaPath()"
            [attr.fill]="'url(#' + gradientId() + ')'"
            style="animation: fadeIn 600ms var(--ease-out) both"
          />
        }

        <path
          [attr.d]="linePath()"
          fill="none"
          [attr.stroke]="strokeColor()"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          [style.stroke-dasharray]="pathLength()"
          [style.stroke-dashoffset]="pathLength()"
          style="animation: mm-chart-draw 1200ms var(--ease-out) forwards"
        />

        @if (showDots()) {
          @for (point of computedPoints(); track $index) {
            <circle
              [attr.cx]="point.x"
              [attr.cy]="point.y"
              r="4"
              [attr.fill]="strokeColor()"
              stroke="var(--color-surface-base)"
              stroke-width="2"
              style="animation: scaleIn 400ms var(--ease-bounce) both"
              [style.animation-delay.ms]="80 * $index + 600"
            />
          }
        }
      </svg>

      @if (showLabels()) {
        <figcaption class="flex items-center justify-between mt-2 text-[10px] text-ink-muted">
          @for (point of data(); track $index) {
            <span>{{ point.label }}</span>
          }
        </figcaption>
      }
    </figure>
    <style>
      @keyframes mm-chart-draw {
        to {
          stroke-dashoffset: 0;
        }
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ChartLineComponent {
  private static counter = 0;
  private readonly id = `mm-chart-line-${++ChartLineComponent.counter}`;

  readonly data = input.required<readonly LinePoint[]>();
  readonly width = input(400);
  readonly height = input(160);
  readonly padding = input(16);
  readonly variant = input<'brand' | 'success' | 'warning' | 'pink'>('brand');
  readonly showArea = input(true);
  readonly showDots = input(true);
  readonly showGrid = input(true);
  readonly showLabels = input(true);
  readonly ariaLabel = input<string>('Gráfico de línea');

  protected readonly strokeColor = computed(() => {
    switch (this.variant()) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'pink':
        return 'var(--color-brand-pink)';
      default:
        return 'var(--color-brand-6)';
    }
  });

  protected readonly gradientId = computed(() => `${this.id}-gradient`);

  protected readonly computedPoints = computed(() => {
    const points = this.data();
    if (points.length === 0) return [];
    const w = this.width();
    const h = this.height();
    const p = this.padding();
    const max = Math.max(...points.map((pt) => pt.value));
    const min = Math.min(...points.map((pt) => pt.value));
    const range = max - min || 1;
    const xStep = (w - p * 2) / Math.max(1, points.length - 1);
    return points.map((pt, i) => ({
      x: p + xStep * i,
      y: p + (h - p * 2) * (1 - (pt.value - min) / range),
    }));
  });

  protected readonly linePath = computed(() => {
    const pts = this.computedPoints();
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  });

  protected readonly areaPath = computed(() => {
    const pts = this.computedPoints();
    if (pts.length === 0) return '';
    const h = this.height();
    const p = this.padding();
    const first = pts[0];
    const last = pts[pts.length - 1];
    return [
      `M ${first.x} ${h - p}`,
      ...pts.map((pt) => `L ${pt.x} ${pt.y}`),
      `L ${last.x} ${h - p}`,
      'Z',
    ].join(' ');
  });

  protected readonly pathLength = computed(() => {
    const pts = this.computedPoints();
    if (pts.length < 2) return 0;
    let length = 0;
    for (let i = 1; i < pts.length; i++) {
      length += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return Math.round(length);
  });

  protected readonly gridLines = computed(() => {
    const h = this.height();
    const p = this.padding();
    const steps = 4;
    const inner = h - p * 2;
    return Array.from({ length: steps + 1 }, (_, i) => p + (inner * i) / steps);
  });
}
