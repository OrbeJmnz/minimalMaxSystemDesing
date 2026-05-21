import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface BarItem {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

@Component({
  selector: 'mm-chart-bar',
  imports: [],
  template: `
    <figure class="block w-full" role="img" [attr.aria-label]="ariaLabel()">
      <div
        class="flex items-end justify-between gap-2 w-full"
        [style.height.px]="height()"
        role="presentation"
      >
        @for (item of data(); track item.label; let i = $index) {
          <div class="flex-1 flex flex-col items-center gap-2 min-w-0 group">
            <span
              class="text-[10px] font-mono text-ink-muted tabular-nums opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {{ item.value }}
            </span>
            <div
              [class]="
                'w-full rounded-mm-sm transition-all duration-700 ease-out hover:opacity-80 ' +
                (item.color ?? defaultBarClass())
              "
              [style.height.%]="heightPercent(item.value)"
              [style.animation-delay.ms]="i * 60"
              style="animation: mm-bar-grow 700ms var(--ease-out) both; transform-origin: bottom;"
            ></div>
          </div>
        }
      </div>
      @if (showLabels()) {
        <figcaption class="flex items-center justify-between mt-2 gap-2">
          @for (item of data(); track item.label) {
            <span class="flex-1 text-center text-[10px] text-ink-muted truncate">
              {{ item.label }}
            </span>
          }
        </figcaption>
      }
    </figure>
    <style>
      @keyframes mm-bar-grow {
        from {
          transform: scaleY(0);
        }
        to {
          transform: scaleY(1);
        }
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ChartBarComponent {
  readonly data = input.required<readonly BarItem[]>();
  readonly height = input(180);
  readonly variant = input<'brand' | 'gradient' | 'success'>('gradient');
  readonly showLabels = input(true);
  readonly ariaLabel = input<string>('Gráfico de barras');

  protected readonly max = computed(() => Math.max(...this.data().map((d) => d.value), 1));

  protected heightPercent(value: number): number {
    return Math.max(2, (value / this.max()) * 100);
  }

  protected readonly defaultBarClass = computed(() => {
    switch (this.variant()) {
      case 'brand':
        return 'bg-brand-6';
      case 'success':
        return 'bg-success';
      default:
        return 'bg-linear-to-t from-brand-6 to-primary-500';
    }
  });
}
