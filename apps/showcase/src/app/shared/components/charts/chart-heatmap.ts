import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface HeatCell {
  readonly date: string;
  readonly value: number;
}

@Component({
  selector: 'mm-chart-heatmap',
  imports: [],
  template: `
    <figure class="block w-full" role="img" [attr.aria-label]="ariaLabel()">
      <div class="flex gap-1 overflow-x-auto" [style.--cell-size.px]="cellSize()">
        @for (week of weeks(); track $index) {
          <div class="flex flex-col gap-1 shrink-0">
            @for (cell of week; track $index) {
              <span
                class="rounded-mm-sm transition-transform hover:scale-125 cursor-default"
                [style.width.px]="cellSize()"
                [style.height.px]="cellSize()"
                [style.background]="cellBackground(cell.value)"
                [attr.title]="cell.date + ': ' + cell.value"
                [attr.aria-label]="cell.date + ', ' + cell.value + ' actividad'"
              ></span>
            }
          </div>
        }
      </div>
      @if (showLegend()) {
        <figcaption class="flex items-center justify-end gap-2 mt-3 text-[10px] text-ink-muted">
          <span>Menos</span>
          @for (level of legendLevels(); track $index) {
            <span
              class="rounded-mm-sm"
              [style.width.px]="cellSize()"
              [style.height.px]="cellSize()"
              [style.background]="cellBackground(level)"
            ></span>
          }
          <span>Más</span>
        </figcaption>
      }
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ChartHeatmapComponent {
  readonly data = input.required<readonly HeatCell[]>();
  readonly weeksCount = input(20);
  readonly cellSize = input(14);
  readonly showLegend = input(true);
  readonly ariaLabel = input<string>('Mapa de calor de actividad');

  protected readonly max = computed(() => Math.max(...this.data().map((c) => c.value), 1));

  protected readonly weeks = computed(() => {
    const cells = this.data();
    const grouped: HeatCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      grouped.push(cells.slice(i, i + 7));
    }
    return grouped;
  });

  protected readonly legendLevels = computed(() => {
    const max = this.max();
    return [0, max * 0.25, max * 0.5, max * 0.75, max];
  });

  protected cellBackground(value: number): string {
    if (value === 0) return 'var(--color-surface-secondary)';
    const intensity = Math.min(1, value / this.max());
    const opacity = 0.15 + intensity * 0.85;
    return `color-mix(in srgb, var(--color-brand-6) ${Math.round(opacity * 100)}%, transparent)`;
  }
}
