import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';

interface KTask {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly priority: 'low' | 'medium' | 'high';
  readonly tags?: readonly string[];
  readonly assignees: readonly { name: string; initials: string; tone: string }[];
  readonly due?: string;
}

interface KColumn {
  readonly id: string;
  readonly label: string;
  readonly tone: string;
  tasks: KTask[];
}

@Component({
  selector: 'mm-kanban',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './kanban.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class KanbanComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly columns = signal<KColumn[]>([
    {
      id: 'backlog',
      label: 'Backlog',
      tone: 'bg-ink-muted',
      tasks: [
        {
          id: 'k1',
          title: 'Migrar landing a tokens MinimalMax',
          description: 'Reemplazar colores hardcoded por tokens semánticos.',
          priority: 'medium',
          tags: ['design', 'refactor'],
          assignees: [{ name: 'Sofia', initials: 'SR', tone: 'from-brand-pink to-fuchsia-500' }],
          due: '2026-05-25',
        },
        {
          id: 'k2',
          title: 'Audit a11y de modales',
          priority: 'low',
          tags: ['a11y'],
          assignees: [{ name: 'Luis', initials: 'LM', tone: 'from-violet-500 to-indigo-500' }],
        },
      ],
    },
    {
      id: 'progress',
      label: 'En progreso',
      tone: 'bg-warning',
      tasks: [
        {
          id: 'k3',
          title: 'Kanban board con drag & drop entre columnas',
          description: 'Pointer events + drop indicator visible.',
          priority: 'high',
          tags: ['feature', 'multimedia'],
          assignees: [
            { name: 'Orbe', initials: 'OJ', tone: 'from-brand-6 to-primary-500' },
            { name: 'Diego', initials: 'DL', tone: 'from-emerald-500 to-teal-500' },
          ],
          due: '2026-05-17',
        },
        {
          id: 'k4',
          title: 'Calendar con range selection',
          priority: 'medium',
          tags: ['feature'],
          assignees: [{ name: 'Orbe', initials: 'OJ', tone: 'from-brand-6 to-primary-500' }],
        },
      ],
    },
    {
      id: 'review',
      label: 'En review',
      tone: 'bg-brand-6',
      tasks: [
        {
          id: 'k5',
          title: 'Charts SVG custom',
          description: 'Line, bar, donut, sparkline, heatmap, ring.',
          priority: 'high',
          tags: ['feature', 'charts'],
          assignees: [
            { name: 'Orbe', initials: 'OJ', tone: 'from-brand-6 to-primary-500' },
            { name: 'Ana', initials: 'AV', tone: 'from-amber-500 to-orange-500' },
          ],
          due: '2026-05-18',
        },
      ],
    },
    {
      id: 'done',
      label: 'Done',
      tone: 'bg-success',
      tasks: [
        {
          id: 'k6',
          title: 'Setup base — Angular 21 + Tailwind 4',
          priority: 'high',
          tags: ['infra'],
          assignees: [{ name: 'Orbe', initials: 'OJ', tone: 'from-brand-6 to-primary-500' }],
        },
        {
          id: 'k7',
          title: 'Dark mode SSR-safe con script inline',
          priority: 'medium',
          tags: ['feature', 'a11y'],
          assignees: [{ name: 'Orbe', initials: 'OJ', tone: 'from-brand-6 to-primary-500' }],
        },
        {
          id: 'k8',
          title: 'Forms validation con shake',
          priority: 'low',
          tags: ['feature'],
          assignees: [{ name: 'Sofia', initials: 'SR', tone: 'from-brand-pink to-fuchsia-500' }],
        },
      ],
    },
  ]);

  protected readonly draggingId = signal<string | null>(null);
  protected readonly overTaskId = signal<string | null>(null);
  protected readonly overColumnId = signal<string | null>(null);
  protected readonly dragOffset = signal({ x: 0, y: 0 });
  private startPos: { x: number; y: number } | null = null;

  protected priorityClass(p: KTask['priority']): string {
    switch (p) {
      case 'high':
        return 'bg-error-bg text-error';
      case 'medium':
        return 'bg-warning-bg text-warning';
      default:
        return 'bg-surface-secondary text-ink-muted';
    }
  }

  protected onPointerDown(taskId: string, event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    this.draggingId.set(taskId);
    this.startPos = { x: event.clientX, y: event.clientY };
    this.dragOffset.set({ x: 0, y: 0 });
  }

  @HostListener('document:pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    if (!this.draggingId() || !this.startPos) return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.dragOffset.set({
      x: event.clientX - this.startPos.x,
      y: event.clientY - this.startPos.y,
    });

    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const taskEl = target?.closest<HTMLElement>('[data-k-task]');
    const colEl = target?.closest<HTMLElement>('[data-k-col]');
    const taskId = taskEl?.dataset['kTask'] ?? null;
    const colId = colEl?.dataset['kCol'] ?? null;
    if (taskId !== this.overTaskId()) this.overTaskId.set(taskId);
    if (colId !== this.overColumnId()) this.overColumnId.set(colId);
  }

  @HostListener('document:pointerup')
  @HostListener('document:pointercancel')
  protected onPointerUp(): void {
    const sourceId = this.draggingId();
    const targetTaskId = this.overTaskId();
    const targetColId = this.overColumnId();

    if (sourceId && targetColId) {
      this.columns.update((cols) => {
        const next = cols.map((c) => ({ ...c, tasks: [...c.tasks] }));
        let source: KTask | undefined;
        for (const col of next) {
          const idx = col.tasks.findIndex((t) => t.id === sourceId);
          if (idx >= 0) {
            source = col.tasks.splice(idx, 1)[0];
            break;
          }
        }
        if (!source) return cols;
        const targetCol = next.find((c) => c.id === targetColId);
        if (!targetCol) return cols;
        if (targetTaskId && targetTaskId !== sourceId) {
          const targetIdx = targetCol.tasks.findIndex((t) => t.id === targetTaskId);
          targetCol.tasks.splice(targetIdx < 0 ? targetCol.tasks.length : targetIdx, 0, source);
        } else {
          targetCol.tasks.push(source);
        }
        return next;
      });
    }

    this.draggingId.set(null);
    this.overTaskId.set(null);
    this.overColumnId.set(null);
    this.dragOffset.set({ x: 0, y: 0 });
    this.startPos = null;
  }

  protected readonly snippetsBoard: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'kanban.html',
      code: `<div
  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 select-none"
  [class.touch-none]="draggingId()"
>
  @for (col of columns(); track col.id) {
    <div
      [attr.data-k-col]="col.id"
      class="rounded-mm-xl bg-surface-secondary/40 border border-border-soft min-h-72 flex flex-col"
      [class.!border-brand-6]="overColumnId() === col.id && draggingId()"
    >
      <header class="flex items-center justify-between px-3 py-2.5 border-b border-border-soft">
        <span [class]="'size-2 rounded-full ' + col.tone"></span>
        <span class="text-xs font-semibold uppercase">{{ col.label }}</span>
      </header>

      <div class="flex-1 p-2 flex flex-col gap-2">
        @for (task of col.tasks; track task.id) {
          <!-- drop indicator -->
          @if (overTaskId() === task.id && draggingId() && draggingId() !== task.id) {
            <div
              class="h-1 rounded-mm-pill bg-linear-to-r from-brand-6 to-brand-pink shadow-mm-brand"
              style="animation: mm-drop-indicator 1.2s var(--ease-out) infinite"
            ></div>
          }
          <article
            [attr.data-k-task]="task.id"
            [style.transform]="
              draggingId() === task.id
                ? 'translate3d(' + dragOffset().x + 'px, ' + dragOffset().y + 'px, 0) rotate(2deg) scale(1.04)'
                : ''
            "
            class="rounded-mm-md bg-surface-base border border-border-soft p-3 shadow-mm-sm cursor-grab"
            (pointerdown)="onPointerDown(task.id, $event)"
          >
            <!-- ... priority pill, title, tags, assignees ... -->
          </article>
        }
      </div>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'kanban.ts',
      code: `import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface KTask { id: string; title: string; priority: 'low' | 'medium' | 'high'; /* ... */ }
interface KColumn { id: string; label: string; tone: string; tasks: KTask[]; }

@Component({ /* ... */ })
export class KanbanComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly columns = signal<KColumn[]>([/* ... 4 columnas seed ... */]);
  protected readonly draggingId = signal<string | null>(null);
  protected readonly overTaskId = signal<string | null>(null);
  protected readonly overColumnId = signal<string | null>(null);
  protected readonly dragOffset = signal({ x: 0, y: 0 });
  private startPos: { x: number; y: number } | null = null;

  protected onPointerDown(taskId: string, event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    this.draggingId.set(taskId);
    this.startPos = { x: event.clientX, y: event.clientY };
    this.dragOffset.set({ x: 0, y: 0 });
  }

  @HostListener('document:pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    if (!this.draggingId() || !this.startPos) return;
    this.dragOffset.set({
      x: event.clientX - this.startPos.x,
      y: event.clientY - this.startPos.y,
    });
    // hit-test con elementFromPoint para detectar columna/task bajo el cursor
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const taskEl = target?.closest<HTMLElement>('[data-k-task]');
    const colEl = target?.closest<HTMLElement>('[data-k-col]');
    this.overTaskId.set(taskEl?.dataset['kTask'] ?? null);
    this.overColumnId.set(colEl?.dataset['kCol'] ?? null);
  }

  @HostListener('document:pointerup')
  @HostListener('document:pointercancel')
  protected onPointerUp(): void {
    const sourceId = this.draggingId();
    const targetTaskId = this.overTaskId();
    const targetColId = this.overColumnId();

    if (sourceId && targetColId) {
      this.columns.update((cols) => {
        const next = cols.map((c) => ({ ...c, tasks: [...c.tasks] }));
        let source: KTask | undefined;
        for (const col of next) {
          const idx = col.tasks.findIndex((t) => t.id === sourceId);
          if (idx >= 0) { source = col.tasks.splice(idx, 1)[0]; break; }
        }
        if (!source) return cols;
        const targetCol = next.find((c) => c.id === targetColId)!;
        if (targetTaskId && targetTaskId !== sourceId) {
          const targetIdx = targetCol.tasks.findIndex((t) => t.id === targetTaskId);
          targetCol.tasks.splice(targetIdx < 0 ? targetCol.tasks.length : targetIdx, 0, source);
        } else {
          targetCol.tasks.push(source);
        }
        return next;
      });
    }
    this.draggingId.set(null);
    this.overTaskId.set(null);
    this.overColumnId.set(null);
    this.dragOffset.set({ x: 0, y: 0 });
    this.startPos = null;
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (extracto)',
      code: `/* Pulse del drop indicator (la barra que aparece entre cards) */
@keyframes mm-drop-indicator {
  0%, 100% {
    opacity: 1;
    transform: scaleX(1);
  }
  50% {
    opacity: 0.7;
    transform: scaleX(0.96);
  }
}

/* Tokens involucrados */
--shadow-mm-brand: 0 0 15px rgba(44, 30, 116, 0.16);
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--radius-mm-pill: 9999px;`,
    },
  ];
}
