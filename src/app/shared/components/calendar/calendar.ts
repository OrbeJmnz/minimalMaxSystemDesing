import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';

export interface CalendarEvent {
  readonly date: string;
  readonly title: string;
  readonly color: string;
}

export interface DateRange {
  readonly start: string | null;
  readonly end: string | null;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

@Component({
  selector: 'mm-calendar',
  imports: [],
  template: `
    <div
      class="rounded-mm-2xl bg-surface-base border border-border-soft shadow-mm-sm overflow-hidden"
      [class.p-3]="size() === 'sm'"
      [class.p-5]="size() === 'md'"
    >
      <header class="flex items-center justify-between mb-4">
        <h3
          class="font-display font-semibold text-ink-dark"
          [class.text-sm]="size() === 'sm'"
          [class.text-base]="size() === 'md'"
        >
          {{ monthLabel() }}
        </h3>
        <div class="flex items-center gap-1">
          <button
            type="button"
            (click)="navigate(-1)"
            aria-label="Mes anterior"
            class="size-7 rounded-mm-sm grid place-items-center text-ink-muted hover:text-ink-dark hover:bg-surface-secondary transition mm-press"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          <button
            type="button"
            (click)="goToday()"
            class="rounded-mm-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted hover:text-ink-dark hover:bg-surface-secondary transition mm-press"
          >
            Hoy
          </button>
          <button
            type="button"
            (click)="navigate(1)"
            aria-label="Mes siguiente"
            class="size-7 rounded-mm-sm grid place-items-center text-ink-muted hover:text-ink-dark hover:bg-surface-secondary transition mm-press"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </header>

      <div class="grid grid-cols-7 gap-1 mb-1">
        @for (w of weekdays; track w) {
          <span
            class="text-center text-[10px] uppercase tracking-wider text-ink-muted font-semibold py-1"
          >
            {{ w }}
          </span>
        }
      </div>

      <div class="grid grid-cols-7 gap-1">
        @for (cell of grid(); track cell.iso) {
          <button
            type="button"
            (click)="onPick(cell.iso)"
            (mouseenter)="onHover(cell.iso)"
            [disabled]="!cell.inMonth && !allowOutOfMonth()"
            [class]="cellClass(cell)"
            [attr.aria-label]="cell.iso"
            [attr.aria-current]="cell.iso === todayIso() ? 'date' : null"
            [attr.aria-pressed]="isSelected(cell.iso)"
          >
            <span class="relative z-10">{{ cell.day }}</span>
            @if (cell.events.length > 0 && size() === 'md') {
              <span
                class="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
                aria-hidden="true"
              >
                @for (ev of cell.events.slice(0, 3); track $index) {
                  <span class="size-1 rounded-full" [style.background]="ev.color"></span>
                }
              </span>
            }
          </button>
        }
      </div>

      @if (size() === 'md' && upcomingEvents().length > 0) {
        <div class="mt-4 pt-4 border-t border-border-soft">
          <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
            Próximos eventos
          </p>
          <ul class="flex flex-col gap-1.5">
            @for (ev of upcomingEvents(); track ev.date + ev.title) {
              <li class="flex items-center gap-2 text-xs">
                <span class="size-2 rounded-full shrink-0" [style.background]="ev.color"></span>
                <span class="font-mono text-ink-muted shrink-0">{{ ev.date }}</span>
                <span class="text-ink-dark truncate">{{ ev.title }}</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
})
export class CalendarComponent {
  readonly size = input<'sm' | 'md'>('md');
  readonly mode = input<'single' | 'range'>('single');
  readonly selected = model<string | null>(null);
  readonly range = model<DateRange>({ start: null, end: null });
  readonly events = input<readonly CalendarEvent[]>([]);
  readonly allowOutOfMonth = input(false);

  protected readonly weekdays = WEEKDAYS;
  protected readonly todayIso = signal(toISO(new Date('2026-05-16')));
  protected readonly viewDate = signal(new Date('2026-05-16'));
  protected readonly hovering = signal<string | null>(null);

  protected readonly monthLabel = computed(() => {
    const d = this.viewDate();
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  });

  protected readonly grid = computed(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const totalCells = 42;
    const startDate = new Date(year, month, 1 - firstWeekday);
    const cells = [];
    const eventsByDate = new Map<string, CalendarEvent[]>();
    for (const ev of this.events()) {
      const arr = eventsByDate.get(ev.date) ?? [];
      arr.push(ev);
      eventsByDate.set(ev.date, arr);
    }

    for (let i = 0; i < totalCells; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const iso = toISO(d);
      cells.push({
        iso,
        day: d.getDate(),
        inMonth: d.getMonth() === month,
        isToday: iso === this.todayIso(),
        events: eventsByDate.get(iso) ?? [],
      });
    }
    return cells;
  });

  protected readonly upcomingEvents = computed(() => {
    const today = this.todayIso();
    return this.events()
      .filter((ev) => ev.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);
  });

  protected onPick(iso: string): void {
    if (this.mode() === 'single') {
      this.selected.set(iso);
    } else {
      const current = this.range();
      if (!current.start || (current.start && current.end)) {
        this.range.set({ start: iso, end: null });
      } else if (iso < current.start) {
        this.range.set({ start: iso, end: current.start });
      } else {
        this.range.set({ start: current.start, end: iso });
      }
    }
  }

  protected onHover(iso: string): void {
    if (this.mode() !== 'range') return;
    this.hovering.set(iso);
  }

  protected navigate(delta: number): void {
    this.viewDate.update((d) => {
      const next = new Date(d);
      next.setMonth(d.getMonth() + delta);
      return next;
    });
  }

  protected goToday(): void {
    this.viewDate.set(fromISO(this.todayIso()));
  }

  protected isSelected(iso: string): boolean {
    if (this.mode() === 'single') return this.selected() === iso;
    const r = this.range();
    return r.start === iso || r.end === iso;
  }

  protected isInRange(iso: string): boolean {
    if (this.mode() !== 'range') return false;
    const r = this.range();
    if (!r.start) return false;
    const end = r.end ?? this.hovering();
    if (!end) return false;
    const [from, to] = r.start <= end ? [r.start, end] : [end, r.start];
    return iso > from && iso < to;
  }

  protected cellClass(cell: {
    iso: string;
    inMonth: boolean;
    isToday: boolean;
    events: readonly CalendarEvent[];
  }): string {
    const base =
      'relative aspect-square rounded-mm-md grid place-items-center transition-colors duration-150 ';
    const sizeBase = this.size() === 'sm' ? 'text-xs ' : 'text-sm ';
    const classes: string[] = [base, sizeBase];

    if (!cell.inMonth) classes.push('text-ink-muted/40 ');
    else classes.push('text-ink-dark ');

    if (cell.isToday) classes.push('ring-2 ring-brand-6 font-semibold ');

    if (this.isSelected(cell.iso)) {
      classes.push('!bg-cta !text-cta-fg font-semibold shadow-mm-sm ');
    } else if (this.isInRange(cell.iso)) {
      classes.push('bg-primary-200 text-primary-700 ');
    } else if (cell.inMonth) {
      classes.push('hover:bg-surface-secondary ');
    }

    return classes.join('');
  }
}
