import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'mm-color-picker',
  imports: [],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            type="color"
            [value]="value()"
            (input)="setFromInput($event)"
            class="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Selector de color"
          />
          <div
            class="size-12 rounded-mm-md border-2 border-border-soft shadow-mm-sm pointer-events-none"
            [style.background]="value()"
          ></div>
        </div>
        <div class="flex-1">
          <label class="flex flex-col gap-1">
            <span class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
              Hex
            </span>
            <input
              type="text"
              [value]="value()"
              (input)="setFromText($event)"
              maxlength="7"
              class="font-mono text-sm w-full rounded-mm-md border-2 border-border bg-surface-base px-3 py-1.5 text-ink-dark focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/10 transition uppercase"
            />
          </label>
        </div>
      </div>

      <div>
        <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
          Swatches MinimalMax
        </p>
        <div class="flex flex-wrap gap-1.5">
          @for (swatch of swatches(); track swatch) {
            <button
              type="button"
              (click)="value.set(swatch)"
              [attr.aria-label]="'Color ' + swatch"
              [attr.aria-pressed]="value().toLowerCase() === swatch.toLowerCase()"
              class="size-7 rounded-mm-md border-2 transition-all hover:scale-110 mm-press"
              [class.border-transparent]="value().toLowerCase() !== swatch.toLowerCase()"
              [class.border-ink-dark]="value().toLowerCase() === swatch.toLowerCase()"
              [class.ring-2]="value().toLowerCase() === swatch.toLowerCase()"
              [class.ring-offset-2]="value().toLowerCase() === swatch.toLowerCase()"
              [class.ring-primary-500]="value().toLowerCase() === swatch.toLowerCase()"
              [style.background]="swatch"
            ></button>
          }
        </div>
      </div>

      @if (showContrast()) {
        <div class="flex items-center gap-3 mt-1 p-3 rounded-mm-md bg-surface-secondary">
          <div
            class="size-10 rounded-mm-md grid place-items-center font-semibold text-sm shrink-0"
            [style.background]="value()"
            [style.color]="contrastFg()"
          >
            Aa
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-ink-dark">Contraste con texto</p>
            <p class="text-[11px] text-ink-muted font-mono">
              {{ contrastRatio() }} —
              <span
                [class.text-success]="contrastRatio() >= 4.5"
                [class.text-warning]="contrastRatio() < 4.5"
              >
                {{ contrastRatio() >= 7 ? 'AAA' : contrastRatio() >= 4.5 ? 'AA' : 'Insuficiente' }}
              </span>
            </p>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ColorPickerComponent {
  readonly value = model<string>('#1456f0');
  readonly swatches = input<readonly string[]>([
    '#1456f0',
    '#ea5ec1',
    '#3daeff',
    '#17437d',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#0ea5e9',
    '#ec4899',
    '#181e25',
    '#ffffff',
  ]);
  readonly showContrast = input(true);

  protected setFromInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected setFromText(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      this.value.set(raw.toLowerCase());
    } else if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
      const r = raw[1];
      const g = raw[2];
      const b = raw[3];
      this.value.set(`#${r}${r}${g}${g}${b}${b}`.toLowerCase());
    }
  }

  protected readonly contrastFg = computed(() => {
    const lum = this.luminance(this.value());
    return lum > 0.5 ? '#18181b' : '#ffffff';
  });

  protected readonly contrastRatio = computed(() => {
    const lumFg = this.luminance(this.contrastFg());
    const lumBg = this.luminance(this.value());
    const lighter = Math.max(lumFg, lumBg);
    const darker = Math.min(lumFg, lumBg);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    return Math.round(ratio * 10) / 10;
  });

  private luminance(hex: string): number {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    const linear = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  }
}
