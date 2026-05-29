import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'mm-chart-ring',
  imports: [],
  template: `
    <figure
      class="relative inline-block"
      [style.width.px]="size()"
      [style.height.px]="size()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <svg [attr.viewBox]="'0 0 ' + size() + ' ' + size()" class="w-full h-full -rotate-90">
        <defs>
          <linearGradient [attr.id]="gradientId()" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" [attr.stop-color]="startColor()"></stop>
            <stop offset="100%" [attr.stop-color]="endColor()"></stop>
          </linearGradient>
        </defs>
        <circle
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
          [attr.r]="radius()"
          fill="none"
          stroke="var(--color-surface-secondary)"
          [attr.stroke-width]="thickness()"
        />
        <circle
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
          [attr.r]="radius()"
          fill="none"
          [attr.stroke]="'url(#' + gradientId() + ')'"
          [attr.stroke-width]="thickness()"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference()"
          [attr.stroke-dashoffset]="dashOffset()"
          style="animation: mm-ring-draw 1000ms var(--ease-out) both; transition: stroke-dashoffset 600ms var(--ease-out);"
        />
      </svg>
      <div class="absolute inset-0 grid place-items-center text-center pointer-events-none">
        <div>
          <p class="font-display text-2xl md:text-3xl font-medium text-ink-dark tabular-nums">
            {{ value() }}<span class="text-base text-ink-muted">{{ suffix() }}</span>
          </p>
          @if (label()) {
            <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold mt-0.5">
              {{ label() }}
            </p>
          }
        </div>
      </div>
    </figure>
    <style>
      @keyframes mm-ring-draw {
        from {
          stroke-dashoffset: var(--mm-circ, 999);
        }
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
})
export class ChartRingComponent {
  private static counter = 0;
  private readonly id = `mm-ring-${++ChartRingComponent.counter}`;

  readonly value = input.required<number>();
  readonly max = input(100);
  readonly size = input(140);
  readonly thickness = input(14);
  readonly suffix = input<string>('%');
  readonly label = input<string>('');
  readonly variant = input<'brand' | 'success' | 'warning' | 'pink'>('brand');
  readonly ariaLabel = input<string>('Progreso');

  protected readonly gradientId = computed(() => `${this.id}-gradient`);
  protected readonly radius = computed(() => this.size() / 2 - this.thickness() / 2 - 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());

  protected readonly dashOffset = computed(() => {
    const pct = Math.max(0, Math.min(1, this.value() / this.max()));
    return this.circumference() * (1 - pct);
  });

  protected readonly startColor = computed(() => {
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

  protected readonly endColor = computed(() => {
    switch (this.variant()) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return '#fb923c';
      case 'pink':
        return 'var(--color-brand-sky)';
      default:
        return 'var(--color-brand-pink)';
    }
  });
}
