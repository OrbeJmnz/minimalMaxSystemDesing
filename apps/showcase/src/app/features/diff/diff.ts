import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { DiffViewerComponent } from '@minimax/ui-angular';

interface SideBySideLine {
  readonly left?: { num: number; content: string };
  readonly right?: { num: number; content: string };
  readonly type: 'context' | 'modify' | 'add' | 'remove';
}

interface FileStat {
  readonly path: string;
  readonly added: number;
  readonly removed: number;
  readonly status: 'modified' | 'added' | 'deleted' | 'renamed';
}

@Component({
  selector: 'mm-diff',
  imports: [CanvasFrameComponent, SectionHeaderComponent, DiffViewerComponent],
  templateUrl: './diff.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DiffComponent {
  protected readonly beforeRefactor = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

function applyDiscount(total, discount) {
  return total - (total * discount);
}`;

  protected readonly afterRefactor = `function calculateTotal(items: readonly Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function applyDiscount(total: number, discount: number): number {
  return total * (1 - discount);
}`;

  protected readonly beforeSimple = `const colors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  danger: '#ef4444',
};`;

  protected readonly afterSimple = `const colors = {
  primary: '#1456f0',
  secondary: '#64748b',
  danger: '#ef4444',
  success: '#10b981',
};`;

  protected readonly viewMode = signal<'unified' | 'split'>('split');
  protected readonly hunksOpen = signal<ReadonlySet<number>>(new Set([0, 1]));

  protected readonly fileStats: readonly FileStat[] = [
    { path: 'src/app/features/cards/cards.html', added: 42, removed: 8, status: 'modified' },
    { path: 'src/app/features/cards/cards.ts', added: 36, removed: 0, status: 'modified' },
    { path: 'src/styles.css', added: 18, removed: 4, status: 'modified' },
    { path: 'src/app/features/dashboard/dashboard.ts', added: 124, removed: 0, status: 'added' },
    { path: 'src/app/features/dashboard/dashboard.html', added: 218, removed: 0, status: 'added' },
    { path: 'src/app/features/old-cards/old-cards.ts', added: 0, removed: 62, status: 'deleted' },
    { path: 'docs/old.md', added: 0, removed: 0, status: 'renamed' },
  ];

  protected readonly statsTotal = computed(() => {
    const list = this.fileStats;
    return {
      files: list.length,
      added: list.reduce((s, f) => s + f.added, 0),
      removed: list.reduce((s, f) => s + f.removed, 0),
    };
  });

  protected readonly sideBySideRefactor = computed<readonly SideBySideLine[]>(() =>
    this.computeSideBySide(this.beforeRefactor, this.afterRefactor),
  );

  protected readonly hunks: readonly {
    id: number;
    header: string;
    lines: readonly SideBySideLine[];
  }[] = [
    {
      id: 0,
      header: '@@ -1,8 +1,5 @@  src/utils/calculate.ts',
      lines: this.computeSideBySide(this.beforeRefactor, this.afterRefactor),
    },
    {
      id: 1,
      header: '@@ -1,5 +1,6 @@  src/tokens/colors.ts',
      lines: this.computeSideBySide(this.beforeSimple, this.afterSimple),
    },
  ];

  protected toggleHunk(id: number): void {
    this.hunksOpen.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected isHunkOpen(id: number): boolean {
    return this.hunksOpen().has(id);
  }

  protected setViewMode(mode: 'unified' | 'split'): void {
    this.viewMode.set(mode);
  }

  protected statusClass(status: FileStat['status']): string {
    switch (status) {
      case 'added':
        return 'bg-success-bg text-success';
      case 'deleted':
        return 'bg-error-bg text-error';
      case 'renamed':
        return 'bg-warning-bg text-warning';
      default:
        return 'bg-primary-200 text-primary-700';
    }
  }

  protected statusLabel(status: FileStat['status']): string {
    switch (status) {
      case 'added':
        return 'A';
      case 'deleted':
        return 'D';
      case 'renamed':
        return 'R';
      default:
        return 'M';
    }
  }

  private computeSideBySide(before: string, after: string): SideBySideLine[] {
    const a = before.split('\n');
    const b = after.split('\n');
    const result: SideBySideLine[] = [];

    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
      if (i >= a.length) {
        result.push({ right: { num: j + 1, content: b[j] }, type: 'add' });
        j++;
      } else if (j >= b.length) {
        result.push({ left: { num: i + 1, content: a[i] }, type: 'remove' });
        i++;
      } else if (a[i] === b[j]) {
        result.push({
          left: { num: i + 1, content: a[i] },
          right: { num: j + 1, content: b[j] },
          type: 'context',
        });
        i++;
        j++;
      } else {
        const nextMatchInB = b.indexOf(a[i], j);
        const nextMatchInA = a.indexOf(b[j], i);

        if (nextMatchInB > -1 && (nextMatchInA === -1 || nextMatchInB - j < nextMatchInA - i)) {
          while (j < nextMatchInB) {
            result.push({ right: { num: j + 1, content: b[j] }, type: 'add' });
            j++;
          }
        } else if (nextMatchInA > -1) {
          while (i < nextMatchInA) {
            result.push({ left: { num: i + 1, content: a[i] }, type: 'remove' });
            i++;
          }
        } else {
          result.push({
            left: { num: i + 1, content: a[i] },
            right: { num: j + 1, content: b[j] },
            type: 'modify',
          });
          i++;
          j++;
        }
      }
    }
    return result;
  }

  protected readonly snippetsUnified: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'diff-unified.html',
      code: `<!-- mm-diff-viewer ya hace el trabajo pesado.
     Le pasas before/after y ya viene con LCS-style line matching,
     header con stats y monospace styling. -->
<mm-diff-viewer
  [before]="beforeText"
  [after]="afterText"
  title="src/utils/calculate.ts"
/>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'diff.ts (before/after strings)',
      code: `protected readonly beforeRefactor = \`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}\`;

protected readonly afterRefactor = \`function calculateTotal(items: readonly Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}\`;`,
    },
  ];

  protected readonly snippetsSplit: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'diff-split.html (extracto)',
      code: `<!-- Vista side-by-side: 2 columnas (left=before / right=after) -->
<div class="rounded-mm-xl bg-surface-inverse text-white/90 overflow-hidden">
  <header><!-- title + stats +N -N --></header>

  <div class="grid grid-cols-2 divide-x divide-white/10">
    <!-- Columna izquierda (BEFORE) -->
    <div>
      @for (line of sideBySide; track $index) {
        <div class="flex" [class.bg-red-500/10]="line.type === 'remove' || line.type === 'modify'">
          <span class="w-10 text-right pr-2 text-white/30 font-mono">
            {{ line.left?.num ?? '' }}
          </span>
          <pre class="px-2 font-mono">{{ line.left?.content ?? '' }}</pre>
        </div>
      }
    </div>

    <!-- Columna derecha (AFTER) -->
    <div>
      @for (line of sideBySide; track $index) {
        <div class="flex" [class.bg-green-500/10]="line.type === 'add' || line.type === 'modify'">
          <span class="w-10 text-right pr-2 text-white/30 font-mono">
            {{ line.right?.num ?? '' }}
          </span>
          <pre class="px-2 font-mono">{{ line.right?.content ?? '' }}</pre>
        </div>
      }
    </div>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'diff.ts (computeSideBySide algorithm)',
      code: `interface SideBySideLine {
  readonly left?: { num: number; content: string };
  readonly right?: { num: number; content: string };
  readonly type: 'context' | 'modify' | 'add' | 'remove';
}

// LCS-style: avanza por ambos arrays buscando matches.
// Si no hay match, intenta proyectar hacia adelante para detectar grupos add/remove.
private computeSideBySide(before: string, after: string): SideBySideLine[] {
  const a = before.split('\\n');
  const b = after.split('\\n');
  const result: SideBySideLine[] = [];

  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i >= a.length) {
      result.push({ right: { num: j + 1, content: b[j] }, type: 'add' });
      j++;
    } else if (j >= b.length) {
      result.push({ left: { num: i + 1, content: a[i] }, type: 'remove' });
      i++;
    } else if (a[i] === b[j]) {
      result.push({
        left: { num: i + 1, content: a[i] },
        right: { num: j + 1, content: b[j] },
        type: 'context',
      });
      i++; j++;
    } else {
      const nextMatchInB = b.indexOf(a[i], j);
      const nextMatchInA = a.indexOf(b[j], i);

      if (nextMatchInB > -1 && (nextMatchInA === -1 || nextMatchInB - j < nextMatchInA - i)) {
        while (j < nextMatchInB) {
          result.push({ right: { num: j + 1, content: b[j] }, type: 'add' });
          j++;
        }
      } else if (nextMatchInA > -1) {
        while (i < nextMatchInA) {
          result.push({ left: { num: i + 1, content: a[i] }, type: 'remove' });
          i++;
        }
      } else {
        // Líneas distintas en ambos lados → marca como 'modify' (rojo izq + verde der)
        result.push({
          left:  { num: i + 1, content: a[i] },
          right: { num: j + 1, content: b[j] },
          type: 'modify',
        });
        i++; j++;
      }
    }
  }
  return result;
}`,
    },
  ];

  protected readonly snippetsFileStats: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'file-stats-list.html',
      code: `<!-- File stats (lista de cambios en un PR) -->
<header class="flex items-center justify-between mb-3">
  <h3>{{ statsTotal().files }} archivos cambiados</h3>
  <div class="flex gap-3 font-mono text-xs">
    <span class="text-success">+{{ statsTotal().added }}</span>
    <span class="text-error">−{{ statsTotal().removed }}</span>
  </div>
</header>

<ul class="rounded-mm-xl border divide-y">
  @for (f of fileStats; track f.path) {
    <li class="flex items-center gap-3 px-3 py-2 hover:bg-surface-secondary/50">

      <!-- Status badge: M / A / D / R -->
      <span class="size-6 rounded-mm-sm grid place-items-center font-mono text-[10px] font-bold"
            [class]="statusClass(f.status)">
        {{ statusLabel(f.status) }}
      </span>

      <code class="flex-1 font-mono text-xs truncate">{{ f.path }}</code>

      <!-- Mini-bar +/- proporcional -->
      <div class="flex items-center gap-2 text-xs font-mono">
        <span class="text-success">+{{ f.added }}</span>
        <span class="text-error">−{{ f.removed }}</span>
      </div>
    </li>
  }
</ul>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'file stat data',
      code: `interface FileStat {
  readonly path: string;
  readonly added: number;
  readonly removed: number;
  readonly status: 'modified' | 'added' | 'deleted' | 'renamed';
}

protected readonly fileStats: readonly FileStat[] = [
  { path: 'src/app/features/cards/cards.html', added: 42, removed: 8, status: 'modified' },
  { path: 'src/app/features/cards/cards.ts', added: 36, removed: 0, status: 'modified' },
  { path: 'src/app/features/dashboard/dashboard.ts', added: 124, removed: 0, status: 'added' },
  // ...
];

// Totales reactivos
protected readonly statsTotal = computed(() => {
  return {
    files:   this.fileStats.length,
    added:   this.fileStats.reduce((s, f) => s + f.added, 0),
    removed: this.fileStats.reduce((s, f) => s + f.removed, 0),
  };
});`,
    },
  ];

  protected readonly snippetsHunks: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'collapsible-hunks.html',
      code: `<!-- Hunks colapsables (cada hunk es un grupo de líneas alrededor de un cambio) -->
@for (hunk of hunks; track hunk.id) {
  <article class="rounded-mm-xl bg-surface-inverse overflow-hidden">

    <!-- Hunk header con chevron -->
    <button (click)="toggleHunk(hunk.id)"
            class="w-full flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10
                   border-b border-white/10">
      <svg class="size-3 text-white/60 transition-transform"
           [class.rotate-90]="isHunkOpen(hunk.id)"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path d="m9 6 6 6-6 6"/>
      </svg>
      <span class="font-mono text-[11px] text-white/60">{{ hunk.header }}</span>
    </button>

    <!-- Animated expand/collapse con grid-template-rows -->
    <div class="grid transition-[grid-template-rows] duration-400 ease-out"
         [class.grid-rows-[1fr]]="isHunkOpen(hunk.id)"
         [class.grid-rows-[0fr]]="!isHunkOpen(hunk.id)">
      <div class="overflow-hidden">
        <!-- Líneas del hunk (unified o split) -->
      </div>
    </div>
  </article>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'hunks state',
      code: `protected readonly hunksOpen = signal<ReadonlySet<number>>(new Set([0, 1]));

protected readonly hunks: readonly {
  id: number;
  header: string;     // ej "@@ -1,8 +1,5 @@  src/utils/calculate.ts"
  lines: readonly SideBySideLine[];
}[] = [
  {
    id: 0,
    header: '@@ -1,8 +1,5 @@  src/utils/calculate.ts',
    lines: this.computeSideBySide(this.beforeRefactor, this.afterRefactor),
  },
  // ...
];

protected toggleHunk(id: number): void {
  this.hunksOpen.update((set) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
}

protected isHunkOpen(id: number): boolean {
  return this.hunksOpen().has(id);
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
}
