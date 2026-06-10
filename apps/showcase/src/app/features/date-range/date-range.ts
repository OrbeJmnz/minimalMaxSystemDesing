import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import {
  BottomSheetComponent,
  DateWheelComponent,
  SectionHeaderComponent,
  ViewportService,
} from '@minimax/ui-angular';

interface DayCell {
  readonly date: Date;
  readonly day: number;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly isStart: boolean;
  readonly isEnd: boolean;
  readonly inRange: boolean;
  readonly isWeekend: boolean;
}

interface Preset {
  readonly id: string;
  readonly label: string;
  readonly compute: (today: Date) => { start: Date; end: Date };
}

const MONTH_NAMES = [
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

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function addMonths(d: Date, n: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + n);
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d: Date | null): string {
  if (!d) return '—';
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

@Component({
  selector: 'mm-date-range',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    BottomSheetComponent,
    DateWheelComponent,
  ],
  templateUrl: './date-range.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DateRangeComponent {
  private readonly viewport = inject(ViewportService);
  protected readonly isMobile = this.viewport.isMobile;

  protected readonly today = startOfDay(new Date(2026, 4, 20));

  protected readonly viewMonth = signal(new Date(2026, 4, 1));
  protected readonly start = signal<Date | null>(addDays(this.today, -6));
  protected readonly end = signal<Date | null>(this.today);
  protected readonly hover = signal<Date | null>(null);
  protected readonly open = signal(false);
  protected readonly activePreset = signal<string | null>('7d');

  // ---- Mobile sheet (wheel picker) ----------------------------------------
  protected readonly sheetOpen = signal(false);
  protected readonly activeEndpoint = signal<'start' | 'end'>('start');
  protected readonly startDraft = signal<Date>(this.start() ?? this.today);
  protected readonly endDraft = signal<Date>(this.end() ?? this.today);

  protected readonly activeDraft = computed(() =>
    this.activeEndpoint() === 'start' ? this.startDraft() : this.endDraft(),
  );
  protected readonly startDraftLabel = computed(() => formatDate(this.startDraft()));
  protected readonly endDraftLabel = computed(() => formatDate(this.endDraft()));
  protected readonly draftDays = computed(() => {
    const a = startOfDay(this.startDraft()).getTime();
    const b = startOfDay(this.endDraft()).getTime();
    return Math.abs(Math.round((b - a) / 86_400_000)) + 1;
  });

  protected readonly presets: readonly Preset[] = [
    {
      id: 'today',
      label: 'Hoy',
      compute: (t) => ({ start: t, end: t }),
    },
    {
      id: 'yesterday',
      label: 'Ayer',
      compute: (t) => ({ start: addDays(t, -1), end: addDays(t, -1) }),
    },
    {
      id: '7d',
      label: 'Últimos 7 días',
      compute: (t) => ({ start: addDays(t, -6), end: t }),
    },
    {
      id: '14d',
      label: 'Últimos 14 días',
      compute: (t) => ({ start: addDays(t, -13), end: t }),
    },
    {
      id: '30d',
      label: 'Últimos 30 días',
      compute: (t) => ({ start: addDays(t, -29), end: t }),
    },
    {
      id: '90d',
      label: 'Últimos 90 días',
      compute: (t) => ({ start: addDays(t, -89), end: t }),
    },
    {
      id: 'thisMonth',
      label: 'Este mes',
      compute: (t) => ({
        start: new Date(t.getFullYear(), t.getMonth(), 1),
        end: t,
      }),
    },
    {
      id: 'lastMonth',
      label: 'Mes pasado',
      compute: (t) => {
        const prev = new Date(t.getFullYear(), t.getMonth() - 1, 1);
        return {
          start: prev,
          end: new Date(t.getFullYear(), t.getMonth(), 0),
        };
      },
    },
  ];

  protected readonly leftCalendar = computed(() => this.buildMonth(this.viewMonth()));
  protected readonly rightCalendar = computed(() =>
    this.buildMonth(addMonths(this.viewMonth(), 1)),
  );

  protected readonly summary = computed(() => {
    const s = this.start();
    const e = this.end();
    if (!s && !e) return 'Selecciona un rango';
    if (s && !e) return `Desde ${formatDate(s)}`;
    if (s && e) {
      if (sameDay(s, e)) return formatDate(s);
      return `${formatDate(s)} → ${formatDate(e)}`;
    }
    return '—';
  });

  protected readonly diffDays = computed(() => {
    const s = this.start();
    const e = this.end();
    if (!s || !e) return 0;
    const ms = startOfDay(e).getTime() - startOfDay(s).getTime();
    return Math.round(ms / 86_400_000) + 1;
  });

  protected toggleOpen(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected nextMonth(): void {
    this.viewMonth.update((d) => addMonths(d, 1));
  }

  protected prevMonth(): void {
    this.viewMonth.update((d) => addMonths(d, -1));
  }

  protected applyPreset(preset: Preset): void {
    const range = preset.compute(this.today);
    this.start.set(range.start);
    this.end.set(range.end);
    this.activePreset.set(preset.id);
    this.viewMonth.set(new Date(range.start.getFullYear(), range.start.getMonth(), 1));
  }

  protected selectDay(date: Date): void {
    const s = this.start();
    const e = this.end();

    if (!s || (s && e)) {
      this.start.set(date);
      this.end.set(null);
      this.activePreset.set(null);
      return;
    }

    if (s && !e) {
      if (date < s) {
        this.end.set(s);
        this.start.set(date);
      } else {
        this.end.set(date);
      }
      this.activePreset.set(null);
    }
  }

  protected onHover(date: Date | null): void {
    this.hover.set(date);
  }

  protected clear(): void {
    this.start.set(null);
    this.end.set(null);
    this.activePreset.set(null);
  }

  // ---- Mobile sheet handlers ----------------------------------------------

  /** El trigger compacto: en móvil abre el sheet de ruedas; en desktop el popover. */
  protected onTrigger(): void {
    if (this.isMobile()) this.openSheet();
    else this.toggleOpen();
  }

  protected openSheet(): void {
    this.startDraft.set(this.start() ?? this.today);
    this.endDraft.set(this.end() ?? this.today);
    this.activeEndpoint.set('start');
    this.open.set(false);
    this.sheetOpen.set(true);
  }

  protected closeSheet(): void {
    this.sheetOpen.set(false);
  }

  protected onWheelChange(date: Date): void {
    if (this.activeEndpoint() === 'start') this.startDraft.set(date);
    else this.endDraft.set(date);
  }

  protected applyPresetDraft(preset: Preset): void {
    const range = preset.compute(this.today);
    this.startDraft.set(range.start);
    this.endDraft.set(range.end);
    this.activePreset.set(preset.id);
  }

  /** Aplica el rango ordenando si quedó invertido (start > end). */
  protected applySheet(): void {
    let s = startOfDay(this.startDraft());
    let e = startOfDay(this.endDraft());
    if (s.getTime() > e.getTime()) [s, e] = [e, s];
    this.start.set(s);
    this.end.set(e);
    this.activePreset.set(null);
    this.viewMonth.set(new Date(s.getFullYear(), s.getMonth(), 1));
    this.sheetOpen.set(false);
  }

  protected clearDraft(): void {
    this.startDraft.set(this.today);
    this.endDraft.set(this.today);
    this.activeEndpoint.set('start');
  }

  private buildMonth(reference: Date): {
    readonly month: number;
    readonly year: number;
    readonly title: string;
    readonly days: readonly DayCell[];
  } {
    const year = reference.getFullYear();
    const month = reference.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startWeekday = (first.getDay() + 6) % 7;
    const totalDays = last.getDate();

    const cells: DayCell[] = [];
    for (let i = startWeekday; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      cells.push(this.buildCell(date, false));
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push(this.buildCell(new Date(year, month, d), true));
    }
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const last = cells[cells.length - 1].date;
      cells.push(this.buildCell(addDays(last, 1), false));
    }

    return {
      month,
      year,
      title: `${MONTH_NAMES[month]} ${year}`,
      days: cells,
    };
  }

  private buildCell(date: Date, isCurrentMonth: boolean): DayCell {
    const s = this.start();
    const e = this.end();
    const h = this.hover();
    const isStart = !!(s && sameDay(date, s));
    const isEnd = !!(e && sameDay(date, e));
    let inRange = false;
    if (s && e) {
      inRange = date >= s && date <= e;
    } else if (s && h && !e) {
      const a = s < h ? s : h;
      const b = s < h ? h : s;
      inRange = date >= a && date <= b;
    }
    const dow = date.getDay();
    return {
      date,
      day: date.getDate(),
      isCurrentMonth,
      isToday: sameDay(date, this.today),
      isStart,
      isEnd,
      inRange,
      isWeekend: dow === 0 || dow === 6,
    };
  }

  protected readonly weekdayLabels = WEEKDAY_LABELS;

  protected readonly snippetsPicker: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'date-range.html (extracto)',
      code: `<!-- Compact input que abre el popover -->
<div class="relative">
  <button (click)="toggleOpen()"
          class="inline-flex items-center gap-3 rounded-mm-md border bg-surface-base px-4 py-2.5">
    <svg><!-- calendar icon --></svg>
    <span class="flex-1 text-left">
      <span class="block text-[10px] uppercase">Periodo</span>
      <span class="font-mono">{{ summary() }}</span>
    </span>
    @if (diffDays() > 0) {
      <span class="rounded-mm-pill bg-primary-200 px-2">{{ diffDays() }} días</span>
    }
  </button>

  @if (open()) {
    <div class="absolute z-20 mt-2 rounded-mm-xl border bg-surface-base shadow-mm-elevated"
         style="animation: fadeInDown 220ms;">
      <!-- Presets sidebar + Doble calendario -->
      <div class="grid md:grid-cols-[160px_1fr]">

        <!-- Presets -->
        <aside class="border-r p-2">
          @for (p of presets; track p.id) {
            <button (click)="applyPreset(p)"
                    [class.bg-cta]="activePreset() === p.id"
                    [class.text-cta-fg]="activePreset() === p.id">
              {{ p.label }}
            </button>
          }
        </aside>

        <!-- Doble calendario -->
        <div class="p-3 grid md:grid-cols-2 gap-4">
          <!-- left + right calendars -->
        </div>
      </div>
    </div>
  }
</div>

<!-- Cada day cell con highlighting de range -->
@for (cell of left.days; track cell.date.toISOString()) {
  <button (click)="selectDay(cell.date)"
          (mouseenter)="onHover(cell.date)"
          [class.bg-cta]="cell.isStart || cell.isEnd"
          [class.text-cta-fg]="cell.isStart || cell.isEnd"
          [class.bg-primary-200]="cell.inRange && !cell.isStart && !cell.isEnd"
          [class.font-semibold]="cell.isToday"
          [class.ring-2]="cell.isToday"
          [class.ring-brand-6]="cell.isToday">
    {{ cell.day }}
  </button>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'date-range.ts (presets + range logic)',
      code: `interface DayCell {
  readonly date: Date;
  readonly day: number;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly isStart: boolean;
  readonly isEnd: boolean;
  readonly inRange: boolean;
  readonly isWeekend: boolean;
}

interface Preset {
  readonly id: string;
  readonly label: string;
  readonly compute: (today: Date) => { start: Date; end: Date };
}

protected readonly start = signal<Date | null>(null);
protected readonly end = signal<Date | null>(null);
protected readonly hover = signal<Date | null>(null);  // para previsualizar range
protected readonly viewMonth = signal(new Date());
protected readonly activePreset = signal<string | null>(null);

// Presets: hoy, ayer, últimos 7/14/30/90 días, este mes, mes pasado
protected readonly presets: readonly Preset[] = [
  { id: '7d',  label: 'Últimos 7 días',
    compute: (t) => ({ start: addDays(t, -6), end: t }) },
  { id: '30d', label: 'Últimos 30 días',
    compute: (t) => ({ start: addDays(t, -29), end: t }) },
  { id: 'thisMonth', label: 'Este mes',
    compute: (t) => ({
      start: new Date(t.getFullYear(), t.getMonth(), 1),
      end: t,
    }) },
  // ... resto
];

protected applyPreset(preset: Preset): void {
  const range = preset.compute(this.today);
  this.start.set(range.start);
  this.end.set(range.end);
  this.activePreset.set(preset.id);
  this.viewMonth.set(new Date(range.start.getFullYear(), range.start.getMonth(), 1));
}

// Click en day cell: primer click = start, segundo = end (auto-swap si end < start)
protected selectDay(date: Date): void {
  const s = this.start();
  const e = this.end();

  if (!s || (s && e)) {
    // Empezar nuevo rango
    this.start.set(date);
    this.end.set(null);
    this.activePreset.set(null);
    return;
  }

  if (s && !e) {
    if (date < s) {
      // Auto-swap si el usuario eligió fecha anterior
      this.end.set(s);
      this.start.set(date);
    } else {
      this.end.set(date);
    }
    this.activePreset.set(null);
  }
}

// Construye las celdas de un mes (incluye días del mes anterior/siguiente
// para llenar la grid 7x6)
private buildMonth(reference: Date) {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Lunes = 0

  const cells: DayCell[] = [];
  // Padding inicio (días del mes anterior)
  for (let i = startWeekday; i > 0; i--) {
    cells.push(this.buildCell(new Date(year, month, 1 - i), false));
  }
  // Días del mes
  const last = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= last; d++) {
    cells.push(this.buildCell(new Date(year, month, d), true));
  }
  // Padding fin para completar grid 7x6
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const lastDay = cells[cells.length - 1].date;
    cells.push(this.buildCell(addDays(lastDay, 1), false));
  }
  return { month, year, days: cells };
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (animation popover)',
      code: `/* Popover entrada con slide-down */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Hover de día con scale (en el HTML usar transition-transform) */
.calendar-day:hover {
  transform: scale(1.08);
  z-index: 1;
}

/* Tokens del rango */
--color-brand-6: #1456f0;          /* start/end */
--color-primary-200: #bfdbfe;      /* in-range */
--color-cta: #181e25;              /* preset activo */
--shadow-mm-elevated: 0 12px 16px -4px rgba(36, 36, 36, 0.08);`,
    },
  ];

  protected readonly snippetsPresets: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'presets-sidebar.html',
      code: `<aside class="flex flex-col gap-0.5 w-44">
  @for (preset of presets; track preset.id) {
    <button
      type="button"
      (click)="applyPreset(preset)"
      class="text-left px-3 py-1.5 rounded-mm-sm text-xs font-medium transition mm-press"
      [class.bg-cta]="activePreset() === preset.id"
      [class.text-cta-fg]="activePreset() === preset.id"
      [class.shadow-mm-sm]="activePreset() === preset.id"
      [class.text-ink-secondary]="activePreset() !== preset.id"
      [class.hover:bg-surface-secondary]="activePreset() !== preset.id"
      [class.hover:text-ink-dark]="activePreset() !== preset.id"
    >
      {{ preset.label }}
    </button>
  }
</aside>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'presets data',
      code: `const today = new Date();

protected readonly presets: readonly Preset[] = [
  { id: 'today',     label: 'Hoy',
    compute: (t) => ({ start: t, end: t }) },
  { id: 'yesterday', label: 'Ayer',
    compute: (t) => ({ start: addDays(t, -1), end: addDays(t, -1) }) },
  { id: '7d',  label: 'Últimos 7 días',
    compute: (t) => ({ start: addDays(t, -6), end: t }) },
  { id: '14d', label: 'Últimos 14 días',
    compute: (t) => ({ start: addDays(t, -13), end: t }) },
  { id: '30d', label: 'Últimos 30 días',
    compute: (t) => ({ start: addDays(t, -29), end: t }) },
  { id: '90d', label: 'Últimos 90 días',
    compute: (t) => ({ start: addDays(t, -89), end: t }) },
  { id: 'thisMonth', label: 'Este mes',
    compute: (t) => ({
      start: new Date(t.getFullYear(), t.getMonth(), 1),
      end: t,
    }) },
  { id: 'lastMonth', label: 'Mes pasado',
    compute: (t) => {
      const prev = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      return {
        start: prev,
        end: new Date(t.getFullYear(), t.getMonth(), 0),
      };
    } },
];`,
    },
  ];

  protected readonly snippetsCompact: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'compact-input.html',
      code: `<button
  type="button"
  (click)="toggleOpen()"
  class="group inline-flex items-center gap-3 rounded-mm-md border border-border
         bg-surface-base px-4 py-2.5 text-sm shadow-mm-sm transition-all duration-200
         hover:border-ink-dark hover:shadow-mm-elevated mm-press"
>
  <svg class="size-4 text-brand-6 group-hover:rotate-12 transition-transform"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
  <span class="flex-1 text-left">
    <span class="block text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
      Periodo
    </span>
    <span class="block font-mono text-ink-dark">{{ summary() }}</span>
  </span>
  @if (diffDays() > 0) {
    <span class="rounded-mm-pill bg-primary-200 text-primary-700
                 px-2 py-0.5 text-[10px] font-semibold tabular-nums">
      {{ diffDays() }} días
    </span>
  }
</button>`,
    },
  ];

  protected readonly snippetsMobile: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'date-range.html (sheet móvil)',
      code: `<!-- En móvil el trigger abre un bottom-sheet con ruedas en vez del popover -->
<mm-bottom-sheet [open]="sheetOpen()" (close)="closeSheet()"
                 title="Selecciona el rango" eyebrow="Periodo">

  <!-- Segmento Desde | Hasta: tocas cuál editas -->
  <div class="grid grid-cols-2 gap-1 rounded-mm-xl bg-surface-secondary p-1">
    <button (click)="activeEndpoint.set('start')"
            [class.bg-surface-base]="activeEndpoint() === 'start'">
      <span class="block text-[10px] uppercase">Desde</span>
      <span class="font-mono">{{ startDraftLabel() }}</span>
    </button>
    <button (click)="activeEndpoint.set('end')"
            [class.bg-surface-base]="activeEndpoint() === 'end'">
      <span class="block text-[10px] uppercase">Hasta</span>
      <span class="font-mono">{{ endDraftLabel() }}</span>
    </button>
  </div>

  <!-- Presets en chips con scroll horizontal -->
  <div class="flex gap-2 overflow-x-auto mm-scroll-hidden">
    @for (preset of presets; track preset.id) {
      <button (click)="applyPresetDraft(preset)" class="shrink-0 rounded-mm-pill ...">
        {{ preset.label }}
      </button>
    }
  </div>

  <!-- Ruedas día/mes/año (la activa edita el endpoint seleccionado) -->
  <mm-date-wheel [value]="activeDraft()" (valueChange)="onWheelChange($event)"
                 [minYear]="2020" [maxYear]="2030" />

  <!-- Aplicar ordena si quedó invertido (start > end) -->
  <div slot="footer">
    <button (click)="clearDraft()">Limpiar</button>
    <button (click)="applySheet()">Aplicar</button>
  </div>
</mm-bottom-sheet>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'date-range.ts (sheet + orden)',
      code: `private readonly viewport = inject(ViewportService);
protected readonly isMobile = this.viewport.isMobile;   // signal SSR-safe

protected readonly sheetOpen = signal(false);
protected readonly activeEndpoint = signal<'start' | 'end'>('start');
protected readonly startDraft = signal<Date>(this.today);
protected readonly endDraft = signal<Date>(this.today);

// La rueda escribe sobre el endpoint activo
protected readonly activeDraft = computed(() =>
  this.activeEndpoint() === 'start' ? this.startDraft() : this.endDraft());

protected onWheelChange(date: Date): void {
  if (this.activeEndpoint() === 'start') this.startDraft.set(date);
  else this.endDraft.set(date);
}

// El trigger: móvil → sheet de ruedas, desktop → popover doble calendario
protected onTrigger(): void {
  if (this.isMobile()) this.openSheet();
  else this.toggleOpen();
}

// Aplicar ordena si el usuario dejó el rango invertido
protected applySheet(): void {
  let s = startOfDay(this.startDraft());
  let e = startOfDay(this.endDraft());
  if (s.getTime() > e.getTime()) [s, e] = [e, s];
  this.start.set(s);
  this.end.set(e);
  this.sheetOpen.set(false);
}`,
    },
  ];
}
