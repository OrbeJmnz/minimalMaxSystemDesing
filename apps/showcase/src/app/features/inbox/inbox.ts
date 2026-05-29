import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { EmptyStateComponent } from '@minimax/ui-angular';
import { ToastService } from '@minimax/ui-angular';
import { inject } from '@angular/core';

interface MailMessage {
  readonly id: string;
  readonly senderName: string;
  readonly senderInitials: string;
  readonly senderTone: string;
  readonly subject: string;
  readonly preview: string;
  readonly time: string;
  readonly threadCount?: number;
  readonly label?: {
    readonly text: string;
    readonly tone: 'work' | 'personal' | 'updates' | 'social';
  };
  readonly attachments?: number;
  unread: boolean;
  starred: boolean;
  important: boolean;
  archived: boolean;
}

type InboxFilter = 'all' | 'unread' | 'starred' | 'important' | 'archived';

@Component({
  selector: 'mm-inbox',
  imports: [CanvasFrameComponent, SectionHeaderComponent, EmptyStateComponent],
  templateUrl: './inbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class InboxComponent {
  private readonly toast = inject(ToastService);

  protected readonly messages = signal<MailMessage[]>([
    {
      id: 'm-1',
      senderName: 'Sofia Reyes',
      senderInitials: 'SR',
      senderTone: 'from-brand-pink to-fuchsia-500',
      subject: 'Review del onboarding flow — necesito tu input',
      preview:
        'Hola! Pasé el wireframe del flow de onboarding por una segunda iteración. Me gustaría que revisaras los pasos 3 y 4 antes del meeting del jueves...',
      time: '10:42',
      threadCount: 4,
      label: { text: 'Design', tone: 'work' },
      attachments: 2,
      unread: true,
      starred: true,
      important: true,
      archived: false,
    },
    {
      id: 'm-2',
      senderName: 'GitHub',
      senderInitials: 'GH',
      senderTone: 'from-ink-charcoal to-ink-dark',
      subject: 'PR #248: Refactor canvas-frame con snippets system',
      preview:
        'Diego Luna ha solicitado tu review en el PR #248. Cambios: 8 archivos · +312 −47 líneas. CI status: ✓ passing.',
      time: '09:15',
      label: { text: 'Updates', tone: 'updates' },
      unread: true,
      starred: false,
      important: false,
      archived: false,
    },
    {
      id: 'm-3',
      senderName: 'Diego Luna',
      senderInitials: 'DL',
      senderTone: 'from-emerald-500 to-teal-500',
      subject: 'Re: Migración Postgres 16 — checklist',
      preview:
        'Crack, te paso el checklist actualizado con los puntos que validamos ayer. Faltaría confirmar la ventana de mantenimiento con Karina.',
      time: 'Ayer',
      threadCount: 7,
      label: { text: 'Engineering', tone: 'work' },
      unread: false,
      starred: true,
      important: true,
      archived: false,
    },
    {
      id: 'm-4',
      senderName: 'Ana Vega',
      senderInitials: 'AV',
      senderTone: 'from-amber-500 to-orange-500',
      subject: 'Roadmap Q3 — preview',
      preview:
        'Comparto el draft del roadmap. La idea es bajar a 3 iniciativas grandes en lugar de las 7 que veníamos manejando.',
      time: 'Ayer',
      label: { text: 'Product', tone: 'work' },
      attachments: 1,
      unread: false,
      starred: false,
      important: false,
      archived: false,
    },
    {
      id: 'm-5',
      senderName: 'Stripe',
      senderInitials: 'S$',
      senderTone: 'from-[#635BFF] to-purple-600',
      subject: 'Tu factura de mayo está lista',
      preview:
        'Factura #IN-2026-05 · $284.00 USD · Plan Growth. Auto-cobrada en la tarjeta terminada en •4242. Próxima fecha: 15 jun.',
      time: 'Lun',
      label: { text: 'Billing', tone: 'updates' },
      unread: false,
      starred: false,
      important: false,
      archived: false,
    },
    {
      id: 'm-6',
      senderName: 'Karina Mendez',
      senderInitials: 'KM',
      senderTone: 'from-brand-6 to-primary-500',
      subject: 'Cena del equipo · viernes 23',
      preview:
        '¿Confirmas? Reservé en El Califa de León a las 8pm. Somos 12. Si tienes alguna restricción alimentaria avísame con tiempo.',
      time: 'Lun',
      label: { text: 'Personal', tone: 'personal' },
      unread: false,
      starred: false,
      important: false,
      archived: false,
    },
    {
      id: 'm-7',
      senderName: 'LinkedIn',
      senderInitials: 'in',
      senderTone: 'from-sky-600 to-blue-700',
      subject: '3 perfiles que coinciden con tu búsqueda',
      preview:
        'Encontramos perfiles senior en Frontend que coinciden con tu requerimiento. Top match: Marina (94%).',
      time: 'Dom',
      label: { text: 'Social', tone: 'social' },
      unread: false,
      starred: false,
      important: false,
      archived: true,
    },
    {
      id: 'm-8',
      senderName: 'Notion',
      senderInitials: 'N',
      senderTone: 'from-ink-charcoal to-ink-dark',
      subject: 'Tu workspace tiene actividad reciente',
      preview:
        '7 páginas actualizadas esta semana en MinimalMax HQ. Lo más editado: Design tokens (4 ediciones).',
      time: '15 abr',
      label: { text: 'Updates', tone: 'updates' },
      unread: false,
      starred: false,
      important: false,
      archived: true,
    },
  ]);

  protected readonly filter = signal<InboxFilter>('all');
  protected readonly selected = signal<ReadonlySet<string>>(new Set());
  protected readonly activeMessageId = signal<string | null>(null);
  protected readonly query = signal('');

  protected readonly filters: readonly { id: InboxFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'unread', label: 'No leídos' },
    { id: 'starred', label: 'Con estrella' },
    { id: 'important', label: 'Importantes' },
    { id: 'archived', label: 'Archivados' },
  ];

  protected readonly filteredMessages = computed(() => {
    const f = this.filter();
    const q = this.query().trim().toLowerCase();
    return this.messages().filter((m) => {
      if (f === 'unread' && !m.unread) return false;
      if (f === 'starred' && !m.starred) return false;
      if (f === 'important' && !m.important) return false;
      if (f === 'archived' && !m.archived) return false;
      if (f !== 'archived' && m.archived) return false;
      if (q) {
        const haystack = `${m.senderName} ${m.subject} ${m.preview}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  });

  protected readonly unreadCount = computed(
    () => this.messages().filter((m) => m.unread && !m.archived).length,
  );

  protected readonly filterCount = computed(() => {
    const all = this.messages();
    return {
      all: all.filter((m) => !m.archived).length,
      unread: all.filter((m) => m.unread && !m.archived).length,
      starred: all.filter((m) => m.starred && !m.archived).length,
      important: all.filter((m) => m.important && !m.archived).length,
      archived: all.filter((m) => m.archived).length,
    };
  });

  protected readonly allSelected = computed(() => {
    const visible = this.filteredMessages();
    if (visible.length === 0) return false;
    const sel = this.selected();
    return visible.every((m) => sel.has(m.id));
  });

  protected readonly someSelected = computed(() => {
    const sel = this.selected();
    if (sel.size === 0) return false;
    return !this.allSelected();
  });

  protected readonly activeMessage = computed(
    () => this.messages().find((m) => m.id === this.activeMessageId()) ?? null,
  );

  protected isSelected(id: string): boolean {
    return this.selected().has(id);
  }

  protected toggleRow(id: string, event?: Event): void {
    event?.stopPropagation();
    this.selected.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected toggleAll(): void {
    this.selected.update((set) => {
      const visible = this.filteredMessages();
      if (visible.every((m) => set.has(m.id))) return new Set();
      return new Set(visible.map((m) => m.id));
    });
  }

  protected clearSelection(): void {
    this.selected.set(new Set());
  }

  protected toggleStar(id: string, event?: Event): void {
    event?.stopPropagation();
    this.messages.update((list) =>
      list.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    );
  }

  protected toggleUnread(id: string, event?: Event): void {
    event?.stopPropagation();
    this.messages.update((list) =>
      list.map((m) => (m.id === id ? { ...m, unread: !m.unread } : m)),
    );
  }

  protected archive(id: string, event?: Event): void {
    event?.stopPropagation();
    this.messages.update((list) =>
      list.map((m) => (m.id === id ? { ...m, archived: true, starred: false } : m)),
    );
    this.selected.update((set) => {
      const next = new Set(set);
      next.delete(id);
      return next;
    });
    this.toast.info('Mensaje archivado');
  }

  protected archiveSelected(): void {
    const ids = this.selected();
    this.messages.update((list) => list.map((m) => (ids.has(m.id) ? { ...m, archived: true } : m)));
    this.toast.success(
      `${ids.size} mensaje${ids.size === 1 ? '' : 's'} archivado${ids.size === 1 ? '' : 's'}`,
    );
    this.clearSelection();
  }

  protected markSelectedRead(): void {
    const ids = this.selected();
    this.messages.update((list) => list.map((m) => (ids.has(m.id) ? { ...m, unread: false } : m)));
    this.toast.info(`Marcado${ids.size === 1 ? '' : 's'} como leído${ids.size === 1 ? '' : 's'}`);
    this.clearSelection();
  }

  protected deleteSelected(): void {
    const ids = this.selected();
    this.messages.update((list) => list.filter((m) => !ids.has(m.id)));
    this.toast.error(
      `${ids.size} mensaje${ids.size === 1 ? '' : 's'} eliminado${ids.size === 1 ? '' : 's'}`,
    );
    this.clearSelection();
  }

  protected openMessage(id: string): void {
    this.activeMessageId.set(id);
    this.messages.update((list) => list.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  }

  protected closeMessage(): void {
    this.activeMessageId.set(null);
  }

  protected setFilter(filter: InboxFilter): void {
    this.filter.set(filter);
    this.clearSelection();
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected labelClass(tone: 'work' | 'personal' | 'updates' | 'social'): string {
    switch (tone) {
      case 'work':
        return 'bg-primary-200 text-primary-700';
      case 'personal':
        return 'bg-success-bg text-success';
      case 'updates':
        return 'bg-warning-bg text-warning';
      case 'social':
        return 'bg-brand-pink/15 text-brand-pink';
    }
  }

  protected readonly snippetsInbox: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inbox.html (extracto)',
      code: `<!-- Filter tabs (All · Unread · Starred · Important · Archived) -->
<nav class="inline-flex rounded-mm-pill bg-surface-secondary p-1">
  @for (f of filters; track f.id) {
    <button (click)="setFilter(f.id)"
            [class.bg-surface-base]="filter() === f.id"
            [class.shadow-mm-sm]="filter() === f.id">
      {{ f.label }}
      @if (filterCount()[f.id] > 0) {
        <span class="ml-1.5 rounded-mm-pill bg-surface-secondary px-1.5 text-[10px]">
          {{ filterCount()[f.id] }}
        </span>
      }
    </button>
  }
</nav>

<!-- Mail list -->
<ul data-stagger-rows class="divide-y divide-border-soft">
  @for (msg of filteredMessages(); track msg.id) {
    <li class="group/row flex items-center gap-3 p-3 cursor-pointer
                hover:bg-surface-secondary/40 transition-all"
        [class.bg-primary-200/15]="isSelected(msg.id)"
        (click)="openMessage(msg.id)">

      <!-- Checkbox (selection) -->
      <input type="checkbox" class="peer sr-only"
             [checked]="isSelected(msg.id)"
             (change)="toggleRow(msg.id, $event)" />

      <!-- Star toggle -->
      <button (click)="toggleStar(msg.id, $event)">
        <svg [class.fill-amber-400]="msg.starred"><!-- star icon --></svg>
      </button>

      <!-- Avatar -->
      <span [class]="'size-9 rounded-mm-pill bg-linear-to-br ' + msg.senderTone">
        {{ msg.senderInitials }}
      </span>

      <!-- Sender + subject + preview -->
      <div class="flex-1 min-w-0">
        <p [class.font-semibold]="msg.unread">{{ msg.senderName }}</p>
        <p class="truncate"><strong>{{ msg.subject }}</strong> — {{ msg.preview }}</p>
      </div>

      <!-- Quick actions on hover (archive, mark unread, delete) -->
      <div class="opacity-0 group-hover/row:opacity-100">
        <button (click)="archive(msg.id, $event)">📥</button>
      </div>

      <span class="font-mono text-[11px]">{{ msg.time }}</span>
    </li>
  }
</ul>

<!-- Bulk actions bar (cuando hay selección) -->
@if (selected().size > 0) {
  <div class="sticky bottom-0 bg-cta text-cta-fg px-4 py-3 flex justify-between">
    <span>{{ selected().size }} seleccionado(s)</span>
    <button (click)="archiveSelected()">Archivar</button>
    <button (click)="markSelectedRead()">Marcar leídos</button>
    <button (click)="deleteSelected()">Eliminar</button>
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inbox.ts (signals + bulk + filtros)',
      code: `interface MailMessage {
  readonly id: string;
  readonly senderName: string;
  readonly senderInitials: string;
  readonly senderTone: string;
  readonly subject: string;
  readonly preview: string;
  readonly time: string;
  readonly threadCount?: number;
  readonly label?: { text: string; tone: 'work' | 'personal' | 'updates' | 'social' };
  unread: boolean;
  starred: boolean;
  important: boolean;
  archived: boolean;
}

type InboxFilter = 'all' | 'unread' | 'starred' | 'important' | 'archived';

protected readonly messages = signal<MailMessage[]>([...]);
protected readonly filter = signal<InboxFilter>('all');
protected readonly selected = signal<ReadonlySet<string>>(new Set());
protected readonly query = signal('');

// Computed: lista filtrada por tab + búsqueda
protected readonly filteredMessages = computed(() => {
  const f = this.filter();
  const q = this.query().trim().toLowerCase();
  return this.messages().filter((m) => {
    if (f === 'unread' && !m.unread) return false;
    if (f === 'starred' && !m.starred) return false;
    if (f === 'important' && !m.important) return false;
    if (f === 'archived' && !m.archived) return false;
    if (f !== 'archived' && m.archived) return false;
    if (q) {
      const haystack = (m.senderName + m.subject + m.preview).toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
});

// Bulk: toggle individual + toggle todos visibles
protected toggleRow(id: string, event?: Event): void {
  event?.stopPropagation();
  this.selected.update((set) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
}

protected toggleAll(): void {
  this.selected.update((set) => {
    const visible = this.filteredMessages();
    if (visible.every((m) => set.has(m.id))) return new Set();
    return new Set(visible.map((m) => m.id));
  });
}

// Archive / Delete bulk
protected archiveSelected(): void {
  const ids = this.selected();
  this.messages.update((list) =>
    list.map((m) => (ids.has(m.id) ? { ...m, archived: true } : m)),
  );
  this.clearSelection();
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (data-stagger-rows + hover)',
      code: `/* Entry animation: cada row entra desde la izquierda */
@keyframes mm-row-in {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

[data-stagger-rows] > * {
  opacity: 0;
  animation: mm-row-in 320ms var(--ease-out) both;
}
[data-stagger-rows] > *:nth-child(1) { animation-delay: 30ms; }
[data-stagger-rows] > *:nth-child(2) { animation-delay: 70ms; }
[data-stagger-rows] > *:nth-child(3) { animation-delay: 110ms; }
/* ... hasta n+9 */

/* Bulk actions bar entry */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Tokens */
--color-cta: #181e25;
--color-error: #ef4444;
--color-warning: #f59e0b;
--shadow-mm-elevated: 0 12px 16px -4px rgba(36, 36, 36, 0.08);`,
    },
  ];

  protected readonly snippetsFilters: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inbox-filters.html',
      code: `<nav class="inline-flex items-center gap-1 rounded-mm-pill bg-surface-secondary p-1"
     role="tablist">
  @for (f of filters; track f.id) {
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="filter() === f.id"
      (click)="setFilter(f.id)"
      class="relative inline-flex items-center gap-1.5 rounded-mm-pill
             px-3 py-1.5 text-xs font-medium transition-all duration-200 mm-press"
      [class.bg-surface-base]="filter() === f.id"
      [class.shadow-mm-sm]="filter() === f.id"
      [class.text-ink-dark]="filter() === f.id"
      [class.text-ink-secondary]="filter() !== f.id">
      {{ f.label }}
      @if (filterCount()[f.id] > 0) {
        <span class="rounded-mm-pill bg-surface-secondary text-ink-secondary
                     px-1.5 py-0.5 text-[10px] font-semibold">
          {{ filterCount()[f.id] }}
        </span>
      }
    </button>
  }
</nav>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'filter-count computed',
      code: `// Contadores reactivos por filtro
protected readonly filterCount = computed(() => {
  const all = this.messages();
  return {
    all:       all.filter((m) => !m.archived).length,
    unread:    all.filter((m) => m.unread && !m.archived).length,
    starred:   all.filter((m) => m.starred && !m.archived).length,
    important: all.filter((m) => m.important && !m.archived).length,
    archived:  all.filter((m) => m.archived).length,
  };
});

protected setFilter(filter: InboxFilter): void {
  this.filter.set(filter);
  this.clearSelection(); // limpiar selección al cambiar filtro
}`,
    },
  ];

  protected readonly snippetsBulkBar: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'bulk-actions-bar.html',
      code: `@if (selected().size > 0) {
  <div
    class="flex items-center justify-between gap-3 px-4 py-3 bg-cta text-cta-fg
           rounded-mm-xl shadow-mm-elevated"
    style="animation: fadeInDown 200ms var(--ease-out) both;"
  >
    <div class="flex items-center gap-3">
      <button (click)="clearSelection()"
              class="size-7 rounded-mm-sm grid place-items-center
                     hover:bg-white/10 transition">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <span class="text-sm">
        <span class="font-mono font-semibold">{{ selected().size }}</span>
        seleccionado{{ selected().size === 1 ? '' : 's' }}
      </span>
    </div>

    <div class="flex items-center gap-1">
      <button (click)="markSelectedRead()" class="...">Marcar leídos</button>
      <button (click)="archiveSelected()"  class="...">Archivar</button>
      <button (click)="deleteSelected()"   class="bg-error">Eliminar</button>
    </div>
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'bulk action handlers',
      code: `protected archiveSelected(): void {
  const ids = this.selected();
  this.messages.update((list) =>
    list.map((m) => (ids.has(m.id) ? { ...m, archived: true } : m)),
  );
  this.toast.success(\`\${ids.size} mensaje(s) archivado(s)\`);
  this.clearSelection();
}

protected markSelectedRead(): void {
  const ids = this.selected();
  this.messages.update((list) =>
    list.map((m) => (ids.has(m.id) ? { ...m, unread: false } : m)),
  );
  this.clearSelection();
}

protected deleteSelected(): void {
  const ids = this.selected();
  this.messages.update((list) => list.filter((m) => !ids.has(m.id)));
  this.toast.error(\`\${ids.size} mensaje(s) eliminado(s)\`);
  this.clearSelection();
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — fadeInDown',
      code: `/* fadeInDown — entrada desde arriba (banners/popups) */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
    },
  ];

  protected readonly snippetsEmpty: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'empty-state-inbox.html',
      code: `@if (filteredMessages().length === 0) {
  <mm-empty-state
    icon="M3 8l9 6 9-6M3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M3 8l9-5 9 5"
    title="Inbox vacío"
    [description]="
      filter() === 'unread'   ? 'No tienes mensajes sin leer. ¡Buen trabajo!' :
      filter() === 'starred'  ? 'Aún no marcaste mensajes con estrella.'      :
      filter() === 'archived' ? 'Tu archivo está vacío.'                       :
      'No hay mensajes que coincidan con tu búsqueda.'
    "
  />
}`,
    },
  ];
}
