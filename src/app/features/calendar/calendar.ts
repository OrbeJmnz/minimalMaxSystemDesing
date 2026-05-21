import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import {
  CalendarComponent,
  CalendarEvent,
  DateRange,
} from '../../shared/components/calendar/calendar';

@Component({
  selector: 'mm-calendar-feature',
  imports: [CanvasFrameComponent, SectionHeaderComponent, CalendarComponent],
  templateUrl: './calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class CalendarFeatureComponent {
  protected readonly singleDate = signal<string | null>('2026-05-16');
  protected readonly range = signal<DateRange>({ start: '2026-05-10', end: '2026-05-22' });

  protected readonly events: readonly CalendarEvent[] = [
    { date: '2026-05-16', title: 'Release v0.3', color: 'var(--color-brand-6)' },
    { date: '2026-05-16', title: 'Demo cliente Acme', color: 'var(--color-brand-pink)' },
    { date: '2026-05-18', title: 'Sprint planning', color: 'var(--color-success)' },
    { date: '2026-05-20', title: 'Code review', color: 'var(--color-warning)' },
    { date: '2026-05-22', title: 'Workshop a11y', color: 'var(--color-brand-pink)' },
    { date: '2026-05-25', title: 'Retrospectiva', color: 'var(--color-success)' },
    { date: '2026-05-28', title: 'Launch Pro plan', color: 'var(--color-brand-6)' },
    { date: '2026-06-01', title: 'Team offsite', color: 'var(--color-brand-pink)' },
  ];

  protected readonly snippetsSingle: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'calendar.html',
      code: `<div class="flex flex-col md:flex-row items-start gap-6">
  <mm-calendar [(selected)]="singleDate" />

  <div class="rounded-mm-xl bg-surface-base border border-border-soft p-4 shadow-mm-sm">
    <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
      Seleccionado
    </p>
    <p class="font-mono text-lg text-ink-dark mt-1">
      {{ singleDate() ?? '—' }}
    </p>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'calendar.ts',
      code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'mm-calendar-feature',
  templateUrl: './calendar.html',
})
export class CalendarFeatureComponent {
  protected readonly singleDate = signal<string | null>('2026-05-16');
}

// Navegación de mes (interna del componente mm-calendar):
//
// protected readonly viewDate = signal(new Date('2026-05-16'));
//
// protected navigate(delta: number): void {
//   this.viewDate.update((d) => {
//     const next = new Date(d);
//     next.setMonth(d.getMonth() + delta);  // -1 = mes anterior, +1 = siguiente
//     return next;
//   });
// }
//
// protected goToday(): void {
//   this.viewDate.set(new Date());
// }`,
    },
  ];

  protected readonly snippetsRange: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'calendar.html',
      code: `<div class="flex flex-col md:flex-row items-start gap-6">
  <mm-calendar mode="range" [(range)]="range" />

  <div class="rounded-mm-xl bg-surface-base border border-border-soft p-4 shadow-mm-sm">
    <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
      Rango
    </p>
    <p class="font-mono text-sm text-ink-dark mt-1">
      {{ range().start ?? '—' }} → {{ range().end ?? '—' }}
    </p>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'calendar.ts',
      code: `import { Component, signal } from '@angular/core';
import { DateRange } from '../../shared/components/calendar/calendar';

@Component({ selector: 'mm-calendar-feature', templateUrl: './calendar.html' })
export class CalendarFeatureComponent {
  protected readonly range = signal<DateRange>({
    start: '2026-05-10',
    end: '2026-05-22',
  });
}

// Lógica interna del rango (mm-calendar):
//
// protected onSelect(iso: string): void {
//   const r = this.range();
//   if (!r.start || (r.start && r.end)) {
//     // primer click → set start, reset end
//     this.range.set({ start: iso, end: null });
//   } else {
//     // segundo click → set end (asegurando orden)
//     const start = iso < r.start ? iso : r.start;
//     const end   = iso < r.start ? r.start : iso;
//     this.range.set({ start, end });
//   }
// }`,
    },
  ];

  protected readonly snippetsEvents: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'calendar.html',
      code: `<mm-calendar [events]="events" [(selected)]="singleDate" />`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'calendar.ts (events data)',
      code: `import { Component, signal } from '@angular/core';
import { CalendarEvent } from '../../shared/components/calendar/calendar';

@Component({ selector: 'mm-calendar-feature', templateUrl: './calendar.html' })
export class CalendarFeatureComponent {
  protected readonly singleDate = signal<string | null>('2026-05-16');

  protected readonly events: readonly CalendarEvent[] = [
    { date: '2026-05-16', title: 'Release v0.3',      color: 'var(--color-brand-6)' },
    { date: '2026-05-16', title: 'Demo cliente Acme', color: 'var(--color-brand-pink)' },
    { date: '2026-05-18', title: 'Sprint planning',   color: 'var(--color-success)' },
    { date: '2026-05-20', title: 'Code review',       color: 'var(--color-warning)' },
    { date: '2026-05-22', title: 'Workshop a11y',     color: 'var(--color-brand-pink)' },
    { date: '2026-05-25', title: 'Retrospectiva',     color: 'var(--color-success)' },
    { date: '2026-05-28', title: 'Launch Pro plan',   color: 'var(--color-brand-6)' },
    { date: '2026-06-01', title: 'Team offsite',      color: 'var(--color-brand-pink)' },
  ];
}

// El componente mm-calendar agrupa eventos por día (Map<iso, CalendarEvent[]>),
// pinta dots en las celdas y muestra la sección "Próximos eventos" debajo.`,
    },
  ];

  protected readonly snippetsMini: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'calendar.html',
      code: `<div class="flex flex-wrap gap-4">
  <!-- Mini sin eventos (sidebars, popovers) -->
  <mm-calendar size="sm" [(selected)]="singleDate" />

  <!-- Mini con dots de eventos -->
  <mm-calendar size="sm" [events]="events" [(selected)]="singleDate" />
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'API mm-calendar',
      code: `// Inputs disponibles en mm-calendar:
//
// mode      : 'single' | 'range'     (default: 'single')
// size      : 'md' | 'sm'            (default: 'md')
// selected  : signal<string | null>  (two-way con [(selected)])
// range     : signal<DateRange>      (two-way con [(range)], requiere mode="range")
// events    : readonly CalendarEvent[]
//
// Tipos:
export interface CalendarEvent {
  readonly date: string;   // ISO YYYY-MM-DD
  readonly title: string;
  readonly color?: string; // CSS color para el dot
}
export interface DateRange {
  readonly start: string | null;
  readonly end:   string | null;
}`,
    },
  ];
}
