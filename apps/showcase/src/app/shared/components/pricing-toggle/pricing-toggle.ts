import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export type PricingPeriod = 'monthly' | 'yearly';

@Component({
  selector: 'mm-pricing-toggle',
  imports: [],
  template: `
    <div class="inline-flex items-center gap-3">
      <button
        type="button"
        (click)="period.set('monthly')"
        class="text-sm font-medium transition-colors"
        [class.text-ink-dark]="period() === 'monthly'"
        [class.text-ink-muted]="period() !== 'monthly'"
      >
        {{ monthlyLabel() }}
      </button>

      <button
        type="button"
        (click)="toggle()"
        [attr.aria-label]="period() === 'yearly' ? 'Cambiar a mensual' : 'Cambiar a anual'"
        role="switch"
        [attr.aria-checked]="period() === 'yearly'"
        class="relative inline-flex h-7 w-12 shrink-0 rounded-mm-pill bg-border transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-primary-500/30"
        [class.!bg-brand-6]="period() === 'yearly'"
      >
        <span
          class="absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-mm-sm transition-transform duration-300"
          style="transition-timing-function: var(--ease-bounce)"
          [class.translate-x-5]="period() === 'yearly'"
        ></span>
      </button>

      <span class="flex items-center gap-2">
        <button
          type="button"
          (click)="period.set('yearly')"
          class="text-sm font-medium transition-colors"
          [class.text-ink-dark]="period() === 'yearly'"
          [class.text-ink-muted]="period() !== 'yearly'"
        >
          {{ yearlyLabel() }}
        </button>
        @if (period() === 'yearly') {
          <span
            class="rounded-mm-pill bg-success-bg text-success px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style="animation: pop 280ms var(--ease-bounce) both"
          >
            Ahorra {{ discount() }}%
          </span>
        }
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
})
export class PricingToggleComponent {
  readonly period = model<PricingPeriod>('monthly');
  readonly monthlyLabel = input<string>('Mensual');
  readonly yearlyLabel = input<string>('Anual');
  readonly discount = input<number>(20);

  protected toggle(): void {
    this.period.update((p) => (p === 'monthly' ? 'yearly' : 'monthly'));
  }
}
