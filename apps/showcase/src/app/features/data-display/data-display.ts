import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

interface Project {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly status: 'live' | 'building' | 'paused';
  readonly progress: number;
  readonly updated: string;
}

interface AccordionItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

interface TimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly time: string;
  readonly type: 'feature' | 'fix' | 'release' | 'note';
}

type SortField = 'name' | 'owner' | 'progress' | 'updated';

@Component({
  selector: 'mm-data-display',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './data-display.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DataDisplayComponent {
  protected readonly projects = signal<readonly Project[]>([
    {
      id: 'p1',
      name: 'MinimalMax Showcase',
      owner: 'Orbe Jimenez',
      status: 'live',
      progress: 92,
      updated: 'Hace 2 min',
    },
    {
      id: 'p2',
      name: 'Spacer Onboarding',
      owner: 'Sofia Reyes',
      status: 'building',
      progress: 64,
      updated: 'Hace 1 hora',
    },
    {
      id: 'p3',
      name: 'Tortugas Marinas API',
      owner: 'Diego Luna',
      status: 'live',
      progress: 100,
      updated: 'Ayer',
    },
    {
      id: 'p4',
      name: 'TasGuard Dashboard',
      owner: 'Ana Vega',
      status: 'paused',
      progress: 38,
      updated: 'Hace 3 días',
    },
    {
      id: 'p5',
      name: 'InventarioLibero',
      owner: 'Luis Mora',
      status: 'building',
      progress: 71,
      updated: 'Hace 5 horas',
    },
  ]);

  protected readonly sortField = signal<SortField>('updated');
  protected readonly sortDirection = signal<'asc' | 'desc'>('desc');
  protected readonly selected = signal<ReadonlySet<string>>(new Set());

  protected readonly expandedRows = signal<ReadonlySet<string>>(new Set());

  protected readonly compactRows: readonly {
    file: string;
    type: string;
    size: string;
    modified: string;
    icon: string;
    tone: string;
  }[] = [
    {
      file: 'tokens.css',
      type: 'CSS',
      size: '12.4 KB',
      modified: '2026-05-15 14:30',
      icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
      tone: 'bg-primary-200 text-primary-700',
    },
    {
      file: 'sidebar.ts',
      type: 'TypeScript',
      size: '4.8 KB',
      modified: '2026-05-15 13:12',
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
      tone: 'bg-blue-100 text-blue-700 mm-dark:bg-blue-900/40 mm-dark:text-blue-300',
    },
    {
      file: 'overview.html',
      type: 'HTML',
      size: '8.2 KB',
      modified: '2026-05-14 19:42',
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
      tone: 'bg-amber-100 text-amber-700 mm-dark:bg-amber-900/40 mm-dark:text-amber-300',
    },
    {
      file: 'README.md',
      type: 'Markdown',
      size: '2.1 KB',
      modified: '2026-05-14 16:00',
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
      tone: 'bg-emerald-100 text-emerald-700 mm-dark:bg-emerald-900/40 mm-dark:text-emerald-300',
    },
    {
      file: 'package.json',
      type: 'JSON',
      size: '1.6 KB',
      modified: '2026-05-13 10:20',
      icon: 'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3',
      tone: 'bg-violet-100 text-violet-700 mm-dark:bg-violet-900/40 mm-dark:text-violet-300',
    },
    {
      file: 'angular.json',
      type: 'JSON',
      size: '2.4 KB',
      modified: '2026-05-13 10:15',
      icon: 'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3',
      tone: 'bg-fuchsia-100 text-fuchsia-700 mm-dark:bg-fuchsia-900/40 mm-dark:text-fuchsia-300',
    },
  ];

  protected readonly invoices: readonly {
    id: string;
    invoice: string;
    client: string;
    amount: number;
    issued: string;
    status: 'paid' | 'pending' | 'overdue';
    items: string[];
  }[] = [
    {
      id: 'inv1',
      invoice: 'INV-2026-0142',
      client: 'Acme Industries',
      amount: 12450,
      issued: '2026-05-10',
      status: 'paid',
      items: ['Pro plan anual', 'Soporte premium', 'Onboarding 1:1'],
    },
    {
      id: 'inv2',
      invoice: 'INV-2026-0143',
      client: 'Globex Corp',
      amount: 4800,
      issued: '2026-05-12',
      status: 'pending',
      items: ['Team plan trimestral', 'SSO add-on'],
    },
    {
      id: 'inv3',
      invoice: 'INV-2026-0144',
      client: 'Initech',
      amount: 9200,
      issued: '2026-04-28',
      status: 'overdue',
      items: ['Pro plan anual', 'Workshop privado', 'Audit accesibilidad'],
    },
    {
      id: 'inv4',
      invoice: 'INV-2026-0145',
      client: 'Soylent Inc',
      amount: 2100,
      issued: '2026-05-14',
      status: 'paid',
      items: ['Free plan upgrade', 'Componentes premium'],
    },
  ];

  protected toggleExpanded(id: string): void {
    this.expandedRows.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected isExpanded(id: string): boolean {
    return this.expandedRows().has(id);
  }

  protected invoiceStatus(status: 'paid' | 'pending' | 'overdue'): string {
    switch (status) {
      case 'paid':
        return 'bg-success-bg text-success';
      case 'pending':
        return 'bg-warning-bg text-warning';
      default:
        return 'bg-error-bg text-error';
    }
  }

  protected invoiceLabel(status: 'paid' | 'pending' | 'overdue'): string {
    return { paid: 'Pagado', pending: 'Pendiente', overdue: 'Vencido' }[status];
  }

  protected readonly sortedProjects = computed(() => {
    const items = [...this.projects()];
    const field = this.sortField();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;
    return items.sort((a, b) => {
      const va = a[field] as string | number;
      const vb = b[field] as string | number;
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  });

  protected readonly accordionItems: readonly AccordionItem[] = [
    {
      id: 'a1',
      question: '¿Qué incluye el plan Pro?',
      answer:
        'Proyectos ilimitados, soporte prioritario por chat, integraciones con Slack/GitHub/Notion, y acceso a beta features.',
    },
    {
      id: 'a2',
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer:
        'Sí. Upgrade es instantáneo. Downgrade aplica al siguiente ciclo de cobro y conservas las features hasta entonces.',
    },
    {
      id: 'a3',
      question: '¿Hay garantía de devolución?',
      answer: '30 días de garantía total. Si no te convence, regresamos el 100% sin preguntas.',
    },
    {
      id: 'a4',
      question: '¿Cómo funciona la facturación por equipo?',
      answer:
        'Por miembro activo al mes. Los seats inactivos no se cobran. Audit log incluido en Team plan.',
    },
  ];
  protected readonly openAccordion = signal<string | null>('a1');

  protected readonly timeline: readonly TimelineEvent[] = [
    {
      id: 't1',
      title: 'v0.2 release',
      description: 'Fase 4 completa: Forms básicos + avanzados con drag & drop.',
      time: 'Hace 5 min',
      type: 'release',
    },
    {
      id: 't2',
      title: 'Toast system + Dark mode',
      description: 'Sistema de notificaciones y tema oscuro listos.',
      time: 'Hace 1 hora',
      type: 'feature',
    },
    {
      id: 't3',
      title: 'Fix: number input alignment',
      description: 'Prefijo/sufijo del input desalineados con el texto del usuario.',
      time: 'Hace 2 horas',
      type: 'fix',
    },
    {
      id: 't4',
      title: 'Floating labels',
      description: 'Patrón de label flotante alineado pixel-perfect con la línea de texto.',
      time: 'Hoy 14:30',
      type: 'feature',
    },
    {
      id: 't5',
      title: 'Bootstrap inicial',
      description: 'Angular 21 + Tailwind 4 + SSR + zoneless funcionando.',
      time: 'Ayer',
      type: 'note',
    },
  ];

  protected toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  protected isSelected(id: string): boolean {
    return this.selected().has(id);
  }

  protected toggleRow(id: string): void {
    this.selected.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected toggleAll(): void {
    this.selected.update((set) => {
      if (set.size === this.projects().length) return new Set();
      return new Set(this.projects().map((p) => p.id));
    });
  }

  protected toggleAccordion(id: string): void {
    this.openAccordion.update((current) => (current === id ? null : id));
  }

  protected statusBadge(status: Project['status']): string {
    switch (status) {
      case 'live':
        return 'bg-success-bg text-success';
      case 'building':
        return 'bg-primary-200 text-primary-700';
      default:
        return 'bg-surface-secondary text-ink-muted';
    }
  }

  protected statusLabel(status: Project['status']): string {
    return { live: 'Live', building: 'Building', paused: 'En pausa' }[status];
  }

  protected timelineColor(type: TimelineEvent['type']): string {
    switch (type) {
      case 'release':
        return 'bg-brand-6 text-white';
      case 'feature':
        return 'bg-primary-200 text-primary-700';
      case 'fix':
        return 'bg-warning-bg text-warning';
      default:
        return 'bg-surface-secondary text-ink-muted';
    }
  }

  protected timelineIcon(type: TimelineEvent['type']): string {
    switch (type) {
      case 'release':
        return 'M13 2 3 14h9l-1 8 10-12h-9l1-8z';
      case 'feature':
        return 'M12 5v14M5 12h14';
      case 'fix':
        return 'M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375z';
      default:
        return 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm1-4h-2V7h2z';
    }
  }

  protected readonly snippetsTableSort: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'table-sort.html (extracto)',
      code: `<table class="w-full text-sm">
  <thead class="bg-surface-secondary/50 border-b border-border-soft">
    <tr>
      <th class="w-12 px-4 py-3">
        <input type="checkbox" class="peer sr-only"
               [checked]="selected().size === projects().length"
               [indeterminate]="selected().size > 0 && selected().size < projects().length"
               (change)="toggleAll()" />
        <!-- ... custom checkbox UI ... -->
      </th>
      <th class="text-left px-4 py-3"
          [attr.aria-sort]="sortField() === 'name'
            ? (sortDirection() === 'asc' ? 'ascending' : 'descending')
            : 'none'">
        <button type="button" (click)="toggleSort('name')"
                class="inline-flex items-center gap-1 text-xs font-semibold uppercase">
          Proyecto
          @if (sortField() === 'name') {
            <svg class="size-3 text-brand-6"
                 [class.rotate-180]="sortDirection() === 'desc'"
                 style="animation: mm-badge-pop 280ms var(--ease-bounce) both">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          }
        </button>
      </th>
      <!-- ... resto en data-display.html -->
    </tr>
  </thead>
  <tbody data-stagger-rows class="divide-y divide-border-soft">
    @for (project of sortedProjects(); track project.id) {
      <tr class="group/row hover:bg-surface-secondary/40 transition-all"
          [class.bg-primary-200/20]="isSelected(project.id)">
        <td class="px-4 py-3 font-medium">{{ project.name }}</td>
        <td class="px-4 py-3">
          <span class="inline-flex items-center gap-1.5 rounded-mm-pill px-2.5 py-0.5
                       text-xs font-semibold" [class]="statusBadge(project.status)">
            <span class="size-1.5 rounded-full bg-current animate-pulse"></span>
            {{ statusLabel(project.status) }}
          </span>
        </td>
        <!-- progress bar + updated ... -->
      </tr>
    }
  </tbody>
</table>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'data-display.ts (sort + selection)',
      code: `type SortField = 'name' | 'owner' | 'progress' | 'updated';

protected readonly sortField = signal<SortField>('updated');
protected readonly sortDirection = signal<'asc' | 'desc'>('desc');
protected readonly selected = signal<ReadonlySet<string>>(new Set());

protected readonly sortedProjects = computed(() => {
  const items = [...this.projects()];
  const field = this.sortField();
  const dir = this.sortDirection() === 'asc' ? 1 : -1;
  return items.sort((a, b) => {
    const va = a[field] as string | number;
    const vb = b[field] as string | number;
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
});

protected toggleSort(field: SortField): void {
  if (this.sortField() === field) {
    this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
  } else {
    this.sortField.set(field);
    this.sortDirection.set('asc');
  }
}

protected toggleRow(id: string): void {
  this.selected.update((set) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

protected toggleAll(): void {
  this.selected.update((set) => {
    if (set.size === this.projects().length) return new Set();
    return new Set(this.projects().map((p) => p.id));
  });
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (data-stagger-rows + mm-badge-pop)',
      code: `[data-stagger-rows] > * {
  opacity: 0;
  animation: mm-row-in 320ms var(--ease-out) both;
}
[data-stagger-rows] > *:nth-child(1) { animation-delay: 30ms; }
[data-stagger-rows] > *:nth-child(2) { animation-delay: 70ms; }
[data-stagger-rows] > *:nth-child(3) { animation-delay: 110ms; }
/* ... hasta nth-child(8) */

@keyframes mm-row-in {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0);    }
}

@keyframes mm-badge-pop {
  0%   { transform: scale(0.6);  opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}`,
    },
  ];

  protected readonly snippetsTableCompact: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'table-compact.html',
      code: `<table class="w-full text-sm">
  <thead class="bg-surface-secondary/50 border-b border-border-soft">
    <tr>
      <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase
                 tracking-wider text-ink-secondary">Archivo</th>
      <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase">Tipo</th>
      <th class="text-right px-3 py-2 text-[10px] font-semibold uppercase">Tamaño</th>
      <th class="text-right px-3 py-2 text-[10px] font-semibold uppercase">Modificado</th>
    </tr>
  </thead>
  <tbody data-stagger-rows>
    @for (row of compactRows; track row.file; let even = $even) {
      <tr
        class="group/row border-b border-border-soft last:border-0
               transition-all duration-200 hover:bg-surface-secondary"
        [class.bg-surface-secondary/30]="even"
      >
        <td class="px-3 py-2">
          <div class="flex items-center gap-2
                      transition-transform group-hover/row:translate-x-1">
            <span
              class="size-6 rounded-mm-sm grid place-items-center shrink-0
                     transition-transform group-hover/row:rotate-6 group-hover/row:scale-110"
              [class]="row.tone"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <path [attr.d]="row.icon"></path>
              </svg>
            </span>
            <span class="font-mono text-xs text-ink-dark">{{ row.file }}</span>
          </div>
        </td>
        <td class="px-3 py-2 text-xs text-ink-muted">{{ row.type }}</td>
        <td class="px-3 py-2 text-right font-mono text-xs tabular-nums">{{ row.size }}</td>
        <td class="px-3 py-2 text-right font-mono text-[11px] text-ink-muted">
          {{ row.modified }}
        </td>
      </tr>
    }
  </tbody>
</table>`,
    },
  ];

  protected readonly snippetsTableExpandible: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'table-expandible.html (extracto)',
      code: `<tbody data-stagger-rows class="divide-y divide-border-soft">
  @for (invoice of invoices; track invoice.id) {
    <tr
      class="group/row transition-all duration-200 hover:bg-surface-secondary"
      [class.bg-surface-secondary/30]="isExpanded(invoice.id)"
    >
      <td class="px-4 py-3">
        <button
          type="button"
          (click)="toggleExpanded(invoice.id)"
          [attr.aria-expanded]="isExpanded(invoice.id)"
          class="size-7 rounded-mm-sm grid place-items-center"
          [class.bg-brand-6]="isExpanded(invoice.id)"
          [class.text-white]="isExpanded(invoice.id)"
        >
          <svg
            class="size-3.5 transition-transform duration-300 ease-bounce"
            [class.rotate-90]="isExpanded(invoice.id)"
          >
            <path d="m9 6 6 6-6 6"></path>
          </svg>
        </button>
      </td>
      <td class="px-4 py-3 font-mono text-xs">{{ invoice.invoice }}</td>
      <!-- ... cliente, estado, total -->
    </tr>

    @if (isExpanded(invoice.id)) {
      <tr class="bg-surface-secondary/40">
        <td colspan="6" class="px-6 py-4">
          <div class="flex flex-col md:flex-row gap-6"
               style="animation: fadeInDown 220ms var(--ease-out) both;">
            <ul>
              @for (item of invoice.items; track item) {
                <li class="flex items-center gap-2 text-sm">
                  <svg class="size-3.5 text-success" stroke-width="2.5">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  {{ item }}
                </li>
              }
            </ul>
          </div>
        </td>
      </tr>
    }
  }
</tbody>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'data-display.ts (expanded rows)',
      code: `protected readonly expandedRows = signal<ReadonlySet<string>>(new Set());

protected toggleExpanded(id: string): void {
  this.expandedRows.update((set) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

protected isExpanded(id: string): boolean {
  return this.expandedRows().has(id);
}

protected invoiceStatus(status: 'paid' | 'pending' | 'overdue'): string {
  switch (status) {
    case 'paid':    return 'bg-success-bg text-success';
    case 'pending': return 'bg-warning-bg text-warning';
    default:        return 'bg-error-bg text-error';
  }
}`,
    },
  ];

  protected readonly snippetsTableResponsive: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'table-responsive.html',
      code: `<!-- Desktop: tabla normal -->
<div class="hidden md:block overflow-hidden rounded-mm-xl border border-border-soft">
  <table class="w-full text-sm">
    <thead class="bg-surface-secondary/50 border-b border-border-soft">
      <tr>
        <th class="text-left px-4 py-3">Proyecto</th>
        <th class="text-left px-4 py-3">Owner</th>
        <th class="text-left px-4 py-3">Estado</th>
        <th class="text-right px-4 py-3">Progreso</th>
      </tr>
    </thead>
    <tbody data-stagger-rows class="divide-y divide-border-soft">
      @for (project of projects(); track project.id) {
        <tr class="group/row hover:bg-surface-secondary">
          <td class="px-4 py-3 font-medium">{{ project.name }}</td>
          <td class="px-4 py-3 text-ink-secondary">{{ project.owner }}</td>
          <td class="px-4 py-3"><!-- status badge --></td>
          <td class="px-4 py-3 text-right font-mono">{{ project.progress }}%</td>
        </tr>
      }
    </tbody>
  </table>
</div>

<!-- Mobile: cards apiladas -->
<ul data-stagger class="md:hidden flex flex-col gap-3">
  @for (project of projects(); track project.id) {
    <li class="rounded-mm-xl border border-border-soft bg-surface-base
               shadow-mm-sm p-4">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="min-w-0">
          <p class="font-medium truncate">{{ project.name }}</p>
          <p class="text-xs text-ink-muted">{{ project.owner }}</p>
        </div>
        <span class="rounded-mm-pill px-2.5 py-0.5 text-xs font-semibold shrink-0"
              [class]="statusBadge(project.status)">
          {{ statusLabel(project.status) }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex-1 h-1.5 rounded-mm-pill bg-border overflow-hidden">
          <div class="h-full bg-linear-to-r from-brand-6 to-primary-500"
               [style.width.%]="project.progress"></div>
        </div>
        <span class="text-xs font-mono tabular-nums shrink-0">
          {{ project.progress }}%
        </span>
      </div>
    </li>
  }
</ul>`,
    },
  ];

  protected readonly snippetsListAvatar: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'list-avatar.html',
      code: `<ul data-stagger class="flex flex-col gap-2">
  @for (project of projects(); track project.id) {
    <li
      class="flex items-center gap-4 p-4 rounded-mm-xl border border-border-soft
             bg-surface-base shadow-mm-sm hover:shadow-mm-elevated
             transition-all cursor-pointer mm-press"
    >
      <span
        class="size-11 rounded-mm-md bg-linear-to-br from-brand-6 to-primary-500
               grid place-items-center text-white font-display font-semibold
               text-sm shrink-0"
      >
        {{ project.name.charAt(0) }}
      </span>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-ink-dark truncate">{{ project.name }}</p>
        <p class="text-xs text-ink-muted">
          {{ project.owner }} · {{ project.updated }}
        </p>
      </div>
      <span class="rounded-mm-pill px-2.5 py-0.5 text-xs font-semibold"
            [class]="statusBadge(project.status)">
        {{ statusLabel(project.status) }}
      </span>
    </li>
  }
</ul>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — fadeInDown',
      code: `/* fadeInDown — entrada desde arriba */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
    },
  ];

  protected readonly snippetsAccordion: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'accordion.html',
      code: `<div class="flex flex-col gap-2 max-w-2xl">
  @for (item of accordionItems; track item.id) {
    <div
      class="rounded-mm-xl border border-border-soft bg-surface-base
             overflow-hidden transition-shadow"
      [class.shadow-mm-sm]="openAccordion() === item.id"
    >
      <button
        type="button"
        (click)="toggleAccordion(item.id)"
        [attr.aria-expanded]="openAccordion() === item.id"
        class="w-full flex items-center justify-between gap-3 px-5 py-4 text-left
               text-sm font-medium hover:bg-surface-secondary/30 cursor-pointer"
      >
        <span>{{ item.question }}</span>
        <span class="size-7 shrink-0 rounded-mm-pill grid place-items-center
                     transition-all duration-300"
              [class.bg-brand-6]="openAccordion() === item.id"
              [class.text-white]="openAccordion() === item.id"
              [class.bg-surface-secondary]="openAccordion() !== item.id">
          <svg class="size-3.5 transition-transform duration-300"
               [class.rotate-180]="openAccordion() === item.id">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </span>
      </button>

      <!-- Truco: animar grid-template-rows en lugar de height -->
      <div
        class="grid transition-[grid-template-rows] duration-300 ease-out"
        [class.grid-rows-[1fr]]="openAccordion() === item.id"
        [class.grid-rows-[0fr]]="openAccordion() !== item.id"
      >
        <div class="overflow-hidden">
          <p class="px-5 pb-4 text-sm text-ink-secondary leading-relaxed">
            {{ item.answer }}
          </p>
        </div>
      </div>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'data-display.ts (accordion)',
      code: `protected readonly accordionItems: readonly AccordionItem[] = [
  {
    id: 'a1',
    question: '¿Qué incluye el plan Pro?',
    answer: 'Proyectos ilimitados, soporte prioritario por chat, integraciones...',
  },
  // ...
];

protected readonly openAccordion = signal<string | null>('a1');

protected toggleAccordion(id: string): void {
  this.openAccordion.update((current) => (current === id ? null : id));
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — collapse',
      code: `/* Colapso animado sin medir altura en JS: anima grid-template-rows 0fr -> 1fr */
.collapsible {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-normal) var(--ease-out);
}
.collapsible.is-open { grid-template-rows: 1fr; }
.collapsible > div { overflow: hidden; }`,
    },
  ];

  protected readonly snippetsTimeline: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'timeline.html',
      code: `<ol class="relative pl-8">
  <!-- Línea vertical conectora -->
  <span class="absolute left-3.5 top-2 bottom-2 w-px bg-border-soft"></span>

  @for (event of timeline; track event.id) {
    <li class="relative pb-6 last:pb-0">
      <!-- Bullet con icono y color por tipo -->
      <span
        class="absolute -left-8 size-7 rounded-mm-pill grid place-items-center
               shadow-mm-sm ring-4 ring-surface-base"
        [class]="timelineColor(event.type)"
      >
        <svg class="size-3.5" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5">
          <path [attr.d]="timelineIcon(event.type)"></path>
        </svg>
      </span>

      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between gap-3">
          <h4 class="font-display text-sm font-semibold">{{ event.title }}</h4>
          <span class="text-xs text-ink-muted font-mono shrink-0">
            {{ event.time }}
          </span>
        </div>
        <p class="text-sm text-ink-secondary leading-relaxed">
          {{ event.description }}
        </p>
      </div>
    </li>
  }
</ol>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'data-display.ts (timeline helpers)',
      code: `interface TimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly time: string;
  readonly type: 'feature' | 'fix' | 'release' | 'note';
}

protected timelineColor(type: TimelineEvent['type']): string {
  switch (type) {
    case 'release': return 'bg-brand-6 text-white';
    case 'feature': return 'bg-primary-200 text-primary-700';
    case 'fix':     return 'bg-warning-bg text-warning';
    default:        return 'bg-surface-secondary text-ink-muted';
  }
}

protected timelineIcon(type: TimelineEvent['type']): string {
  switch (type) {
    case 'release': return 'M13 2 3 14h9l-1 8 10-12h-9l1-8z';
    case 'feature': return 'M12 5v14M5 12h14';
    case 'fix':     return 'M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5...';
    default:        return 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z...';
  }
}`,
    },
  ];
}
