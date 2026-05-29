import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface DiffLine {
  readonly type: 'context' | 'add' | 'remove';
  readonly content: string;
  readonly oldLine?: number;
  readonly newLine?: number;
}

@Component({
  selector: 'mm-diff-viewer',
  imports: [],
  template: `
    <div
      class="rounded-mm-xl bg-surface-inverse text-white/90 overflow-hidden shadow-mm-sm border border-white/5"
    >
      <header
        class="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5"
      >
        <span class="font-mono text-xs text-white/70">
          @if (title()) {
            {{ title() }}
          } @else {
            diff
          }
        </span>
        <div class="flex items-center gap-3 text-[10px]">
          <span class="text-green-400 font-mono"> +{{ counts().added }} </span>
          <span class="text-red-400 font-mono"> −{{ counts().removed }} </span>
        </div>
      </header>
      <pre
        class="overflow-x-auto text-xs font-mono leading-relaxed mm-scroll-thin"
      ><code>@for (line of diffLines(); track $index) {<span
              class="block px-4"
              [class.bg-green-500/10]="line.type === 'add'"
              [class.bg-red-500/10]="line.type === 'remove'"
            ><span class="inline-block w-6 select-none"
              [class.text-green-400]="line.type === 'add'"
              [class.text-red-400]="line.type === 'remove'"
              [class.text-white/40]="line.type === 'context'"
            >{{ line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' ' }}</span><span
              class="inline-block w-8 text-right pr-2 select-none text-white/30 text-[10px]"
            >{{ line.newLine ?? line.oldLine ?? '' }}</span>{{ line.content }}</span>
}</code></pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DiffViewerComponent {
  readonly before = input.required<string>();
  readonly after = input.required<string>();
  readonly title = input<string>('');

  protected readonly diffLines = computed<readonly DiffLine[]>(() => {
    const a = this.before().split('\n');
    const b = this.after().split('\n');
    const result: DiffLine[] = [];

    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
      if (i >= a.length) {
        result.push({ type: 'add', content: b[j], newLine: j + 1 });
        j++;
      } else if (j >= b.length) {
        result.push({ type: 'remove', content: a[i], oldLine: i + 1 });
        i++;
      } else if (a[i] === b[j]) {
        result.push({
          type: 'context',
          content: a[i],
          oldLine: i + 1,
          newLine: j + 1,
        });
        i++;
        j++;
      } else {
        const nextMatchInB = b.indexOf(a[i], j);
        const nextMatchInA = a.indexOf(b[j], i);

        if (nextMatchInB > -1 && (nextMatchInA === -1 || nextMatchInB - j < nextMatchInA - i)) {
          while (j < nextMatchInB) {
            result.push({ type: 'add', content: b[j], newLine: j + 1 });
            j++;
          }
        } else if (nextMatchInA > -1) {
          while (i < nextMatchInA) {
            result.push({ type: 'remove', content: a[i], oldLine: i + 1 });
            i++;
          }
        } else {
          result.push({ type: 'remove', content: a[i], oldLine: i + 1 });
          result.push({ type: 'add', content: b[j], newLine: j + 1 });
          i++;
          j++;
        }
      }
    }
    return result;
  });

  protected readonly counts = computed(() => {
    let added = 0;
    let removed = 0;
    for (const line of this.diffLines()) {
      if (line.type === 'add') added++;
      else if (line.type === 'remove') removed++;
    }
    return { added, removed };
  });
}
