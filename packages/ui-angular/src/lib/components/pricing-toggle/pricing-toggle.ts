import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type PricingPeriod = 'monthly' | 'yearly';

@Component({
  selector: 'mm-pricing-toggle',
  imports: [],
  template: `
    <div class="inline-flex items-center gap-3">
      <button
        type="button"
        [disabled]="disabled()"
        (click)="select('monthly')"
        class="text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        [class.text-ink-dark]="period() === 'monthly'"
        [class.text-ink-muted]="period() !== 'monthly'"
      >
        {{ monthlyLabel() }}
      </button>

      <button
        type="button"
        [disabled]="disabled()"
        (click)="toggle()"
        [attr.aria-label]="period() === 'yearly' ? 'Cambiar a mensual' : 'Cambiar a anual'"
        role="switch"
        [attr.aria-checked]="period() === 'yearly'"
        class="relative inline-flex h-7 w-12 shrink-0 rounded-mm-pill bg-border transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
          [disabled]="disabled()"
          (click)="select('yearly')"
          class="text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PricingToggleComponent),
      multi: true,
    },
  ],
})
export class PricingToggleComponent implements ControlValueAccessor {
  readonly period = model<PricingPeriod>('monthly');
  readonly monthlyLabel = input<string>('Mensual');
  readonly yearlyLabel = input<string>('Anual');
  readonly discount = input<number>(20);
  protected readonly disabled = signal(false);

  private onChange: (value: PricingPeriod) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor — habilita formControlName / ngModel.
  writeValue(value: PricingPeriod): void {
    this.period.set(value ?? 'monthly');
  }
  registerOnChange(fn: (value: PricingPeriod) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected select(value: PricingPeriod): void {
    if (this.disabled()) return;
    this.period.set(value);
    this.onChange(value);
    this.onTouched();
  }

  protected toggle(): void {
    this.select(this.period() === 'monthly' ? 'yearly' : 'monthly');
  }
}
