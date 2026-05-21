import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface DonutSlice {
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

@Component({
  selector: 'mm-chart-donut',
  imports: [],
  template: `
    <figure
      class="flex flex-col md:flex-row items-center gap-6"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="relative shrink-0" [style.width.px]="size()" [style.height.px]="size()">
        <svg [attr.viewBox]="'0 0 ' + size() + ' ' + size()" class="w-full h-full -rotate-90">
          <circle
            [attr.cx]="size() / 2"
            [attr.cy]="size() / 2"
            [attr.r]="radius()"
            fill="none"
            stroke="var(--color-surface-secondary)"
            [attr.stroke-width]="thickness()"
          />
          @for (segment of segments(); track segment.label; let i = $index) {
            <circle
              [attr.cx]="size() / 2"
              [attr.cy]="size() / 2"
              [attr.r]="radius()"
              fill="none"
              [attr.stroke]="segment.color"
              [attr.stroke-width]="thickness()"
              stroke-linecap="round"
              [attr.stroke-dasharray]="segment.dash"
              [attr.stroke-dashoffset]="segment.offset"
              [style.animation-delay.ms]="i * 120"
              style="animation: mm-donut-draw 800ms var(--ease-out) both"
            />
          }
        </svg>
        <div
          class="absolute inset-0 grid place-items-center text-center"
        >
          <div>
            <p class="font-display text-3xl font-medium text-ink-dark tabular-nums">
              {{ total() }}
            </p>
            <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
              {{ totalLabel() }}
            </p>
          </div>
        </div>
      </div>

      @if (showLegend()) {
        <figcaption class="flex flex-col gap-2 flex-1 min-w-0">
          @for (segment of data(); track segment.label) {
            <div class="flex items-center gap-3 text-sm min-w-0">
              <span
                class="size-3 rounded-mm-sm shrink-0"
                [style.background]="segment.color"
              ></span>
              <span class="flex-1 text-ink-dark truncate">{{ segment.label }}</span>
              <span class="font-mono text-ink-muted tabular-nums shrink-0">
                {{ segment.value }}
              </span>
            </div>
          }
        </figcaption>
      }
    </figure>
    <style>
      @keyframes mm-donut-draw {
        from {
          stroke-dasharray: 0 9999;
        }
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ChartDonutComponent {
  readonly data = input.required<readonly DonutSlice[]>();
  readonly size = input(180);
  readonly thickness = input(18);
  readonly totalLabel = input<string>('Total');
  readonly showLegend = input(true);
  readonly ariaLabel = input<string>('Gráfico donut');

  protected readonly radius = computed(() => this.size() / 2 - this.thickness() / 2 - 4);

  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());

  protected readonly total = computed(() =>
    this.data().reduce((sum, segment) => sum + segment.value, 0),
  );

  protected readonly segments = computed(() => {
    const circ = this.circumference();
    const totalValue = this.total() || 1;
    let acc = 0;
    return this.data().map((segment) => {
      const portion = (segment.value / totalValue) * circ;
      const dash = `${Math.max(0, portion - 2)} ${circ}`;
      const offset = -acc;
      acc += portion;
      return { ...segment, dash, offset };
    });
  });
}
