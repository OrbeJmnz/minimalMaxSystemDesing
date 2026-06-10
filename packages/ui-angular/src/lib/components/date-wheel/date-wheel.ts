import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { WheelItem, WheelPickerComponent } from '../wheel-picker/wheel-picker';

const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * `mm-date-wheel` — selector de fecha con ruedas día · mes · año (orden es-MX).
 *
 * Compone tres `mm-wheel-picker` y mantiene la coherencia del calendario: al
 * girar mes o año reajusta el día si el mes destino tiene menos días (31→30,
 * febrero, bisiestos). El rango de años es acotado por `minYear`/`maxYear`.
 */
@Component({
  selector: 'mm-date-wheel',
  imports: [WheelPickerComponent],
  template: `
    <div class="relative">
      <div class="grid grid-cols-[1fr_1.5fr_1.1fr] mb-1 px-1">
        <span class="text-center text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Día</span>
        <span class="text-center text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Mes</span>
        <span class="text-center text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Año</span>
      </div>
      <div class="grid grid-cols-[1fr_1.5fr_1.1fr]">
        <mm-wheel-picker
          [items]="dayItems()"
          [value]="day()"
          (valueChange)="setDay($any($event))"
          [itemHeight]="itemHeight()"
          [visible]="visible()"
          ariaLabel="Día"
        />
        <mm-wheel-picker
          [items]="monthItems()"
          [value]="month()"
          (valueChange)="setMonth($any($event))"
          [itemHeight]="itemHeight()"
          [visible]="visible()"
          ariaLabel="Mes"
        />
        <mm-wheel-picker
          [items]="yearItems()"
          [value]="year()"
          (valueChange)="setYear($any($event))"
          [itemHeight]="itemHeight()"
          [visible]="visible()"
          ariaLabel="Año"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DateWheelComponent {
  readonly value = model.required<Date>();
  readonly minYear = input<number | null>(null);
  readonly maxYear = input<number | null>(null);
  readonly monthNames = input<readonly string[]>(MONTHS_ES);
  readonly itemHeight = input(40);
  readonly visible = input(5);

  protected readonly year = computed(() => this.value().getFullYear());
  protected readonly month = computed(() => this.value().getMonth());
  protected readonly day = computed(() => this.value().getDate());

  protected readonly yearItems = computed<readonly WheelItem[]>(() => {
    const base = this.value().getFullYear();
    const lo = this.minYear() ?? base - 10;
    const hi = Math.max(this.maxYear() ?? base + 5, lo);
    const out: WheelItem[] = [];
    for (let y = lo; y <= hi; y++) out.push({ value: y, label: `${y}` });
    return out;
  });

  protected readonly monthItems = computed<readonly WheelItem[]>(() =>
    this.monthNames().map((label, m) => ({ value: m, label })),
  );

  protected readonly dayItems = computed<readonly WheelItem[]>(() => {
    const total = daysInMonth(this.year(), this.month());
    const out: WheelItem[] = [];
    for (let d = 1; d <= total; d++) out.push({ value: d, label: `${d}` });
    return out;
  });

  protected setYear(y: number): void {
    const d = this.value();
    const day = Math.min(d.getDate(), daysInMonth(y, d.getMonth()));
    this.value.set(new Date(y, d.getMonth(), day));
  }

  protected setMonth(m: number): void {
    const d = this.value();
    const day = Math.min(d.getDate(), daysInMonth(d.getFullYear(), m));
    this.value.set(new Date(d.getFullYear(), m, day));
  }

  protected setDay(d: number): void {
    const cur = this.value();
    this.value.set(new Date(cur.getFullYear(), cur.getMonth(), d));
  }
}
