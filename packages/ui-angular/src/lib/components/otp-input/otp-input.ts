import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mm-otp-input',
  imports: [],
  template: `
    <div class="inline-flex items-center gap-2" role="group" [attr.aria-label]="ariaLabel()">
      @for (slot of slots(); track $index; let i = $index) {
        <input
          #slotInput
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="1"
          [value]="slot"
          [disabled]="disabled()"
          [attr.aria-label]="'Dígito ' + (i + 1)"
          (input)="onInput(i, $event)"
          (keydown)="onKey(i, $event)"
          (paste)="onPaste($event)"
          (focus)="onFocus($event)"
          (blur)="onTouched()"
          class="size-12 text-center font-mono text-lg font-medium rounded-mm-md border-2 border-border bg-surface-base text-ink-dark focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/10 transition-[border-color,box-shadow] duration-200 tabular-nums disabled:opacity-50 disabled:cursor-not-allowed"
          [class.!border-primary-500]="slot"
          [class.!bg-primary-200/20]="slot"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OtpInputComponent), multi: true },
  ],
})
export class OtpInputComponent implements ControlValueAccessor {
  readonly length = input(6);
  readonly value = model<string>('');
  readonly ariaLabel = input<string>('Código de verificación');
  protected readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // ControlValueAccessor — habilita formControlName / ngModel.
  writeValue(value: string): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  /** Escritura por interacción del usuario: actualiza el modelo y notifica al form. */
  private commit(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  @ViewChildren('slotInput') protected inputs!: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly slots = computed(() => {
    const v = this.value();
    return Array.from({ length: this.length() }, (_, i) => v[i] ?? '');
  });

  protected onInput(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const digit = target.value.replace(/\D/g, '').slice(-1);
    target.value = digit;
    this.setSlot(index, digit);
    if (digit && index < this.length() - 1) {
      this.focusInput(index + 1);
    }
  }

  protected onKey(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const current = this.slots()[index];
      if (!current && index > 0) {
        event.preventDefault();
        this.setSlot(index - 1, '');
        this.focusInput(index - 1);
      } else if (current) {
        this.setSlot(index, '');
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      event.preventDefault();
      this.focusInput(index + 1);
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, this.length());
    if (!digits) return;
    this.commit(digits.padEnd(this.length(), '').slice(0, this.length()).trimEnd());
    const focusIdx = Math.min(digits.length, this.length() - 1);
    queueMicrotask(() => this.focusInput(focusIdx));
  }

  protected onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  private setSlot(index: number, digit: string): void {
    const current = this.value().padEnd(this.length(), ' ').split('');
    current[index] = digit || ' ';
    this.commit(current.join('').trimEnd());
  }

  private focusInput(index: number): void {
    const refs = this.inputs?.toArray() ?? [];
    refs[index]?.nativeElement.focus();
  }
}
