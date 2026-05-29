import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CodeBlockComponent, CodeLang } from '../code-block/code-block';

export interface CanvasFrameSnippet {
  readonly label: string;
  readonly lang: CodeLang;
  readonly code: string;
  readonly title?: string;
}

@Component({
  selector: 'mm-canvas-frame',
  imports: [CodeBlockComponent],
  templateUrl: './canvas-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block scroll-mt-28',
    '[id]': 'tocId()',
    '[attr.data-mm-toc-id]': 'tocId()',
    '[attr.data-mm-toc-label]': 'heading()',
  },
})
export class CanvasFrameComponent {
  readonly heading = input.required<string>();
  readonly description = input<string>('');
  readonly background = input<'plain' | 'dotted' | 'grid'>('plain');
  readonly snippets = input<readonly CanvasFrameSnippet[]>([]);

  protected readonly showCode = signal(false);
  protected readonly activeTab = signal(0);

  readonly tocId = computed(
    () =>
      this.heading()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'section',
  );

  readonly hasCode = computed(() => this.snippets().length > 0);
  readonly activeSnippet = computed(() => {
    const list = this.snippets();
    return list[this.activeTab()] ?? list[0];
  });

  protected toggleCode(): void {
    this.showCode.update((v) => !v);
  }

  protected selectTab(index: number): void {
    this.activeTab.set(index);
  }
}
