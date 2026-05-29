import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface ToolbarButton {
  readonly id: string;
  readonly label: string;
  readonly command: string;
  readonly icon: string;
  readonly value?: string;
}

@Component({
  selector: 'mm-rich-text-editor',
  imports: [],
  template: `
    <div
      class="rounded-mm-xl border-2 border-border bg-surface-base focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/10 transition-[border-color,box-shadow] duration-200 overflow-hidden"
    >
      <div
        class="flex items-center flex-wrap gap-1 px-2 py-1.5 border-b border-border-soft bg-surface-secondary/40"
        role="toolbar"
        aria-label="Formato del editor"
      >
        @for (btn of buttons; track btn.id) {
          <button
            type="button"
            (click)="exec(btn)"
            (mousedown)="$event.preventDefault()"
            [attr.aria-label]="btn.label"
            [attr.aria-pressed]="active().has(btn.id)"
            class="size-8 rounded-mm-sm grid place-items-center text-ink-secondary hover:text-ink-dark hover:bg-surface-base transition mm-press"
            [class.!bg-cta]="active().has(btn.id)"
            [class.!text-cta-fg]="active().has(btn.id)"
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
              <path [attr.d]="btn.icon"></path>
            </svg>
          </button>
          @if (btn.id === 'underline' || btn.id === 'strike' || btn.id === 'ol') {
            <span class="w-px h-5 bg-border mx-1" aria-hidden="true"></span>
          }
        }
        <button
          type="button"
          (click)="clearFormat()"
          (mousedown)="$event.preventDefault()"
          aria-label="Limpiar formato"
          class="ml-auto size-8 rounded-mm-sm grid place-items-center text-ink-muted hover:text-error hover:bg-error-bg transition mm-press"
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
            <path d="M3 7h6m-3 0v10m11-5l-5 5m0-5l5 5M14 3h5l-2 4"></path>
          </svg>
        </button>
      </div>

      <div
        #editor
        contenteditable="true"
        role="textbox"
        aria-multiline="true"
        [attr.data-placeholder]="placeholder()"
        (input)="onInput($event)"
        (keyup)="updateActive()"
        (mouseup)="updateActive()"
        (focus)="focused.set(true)"
        (blur)="focused.set(false); updateActive()"
        class="mm-rte-content min-h-[140px] px-4 py-3 text-sm text-ink-dark focus:outline-none leading-relaxed"
      ></div>
    </div>

    <style>
      .mm-rte-content:empty::before {
        content: attr(data-placeholder);
        color: var(--color-ink-muted);
        pointer-events: none;
      }
      .mm-rte-content :where(b, strong) {
        font-weight: 700;
      }
      .mm-rte-content :where(i, em) {
        font-style: italic;
      }
      .mm-rte-content u {
        text-decoration: underline;
      }
      .mm-rte-content s {
        text-decoration: line-through;
      }
      .mm-rte-content ul {
        padding-left: 1.5rem;
        list-style: disc;
        margin: 0.5rem 0;
      }
      .mm-rte-content ol {
        padding-left: 1.5rem;
        list-style: decimal;
        margin: 0.5rem 0;
      }
      .mm-rte-content a {
        color: var(--color-brand-6);
        text-decoration: underline;
        text-underline-offset: 2px;
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class RichTextEditorComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly value = model<string>('');
  readonly placeholder = input<string>('Escribe algo...');

  @ViewChild('editor') protected editorRef?: ElementRef<HTMLDivElement>;

  protected readonly active = signal<ReadonlySet<string>>(new Set());
  protected readonly focused = signal(false);

  protected readonly buttons: readonly ToolbarButton[] = [
    {
      id: 'bold',
      label: 'Negrita',
      command: 'bold',
      icon: 'M14 12a4 4 0 0 0 0-8H6v8M14 12H6m8 0a4 4 0 0 1 0 8H6v-8',
    },
    {
      id: 'italic',
      label: 'Itálica',
      command: 'italic',
      icon: 'M19 4h-9M14 20H5M15 4 9 20',
    },
    {
      id: 'underline',
      label: 'Subrayado',
      command: 'underline',
      icon: 'M6 3v7a6 6 0 0 0 12 0V3M4 21h16',
    },
    {
      id: 'strike',
      label: 'Tachado',
      command: 'strikeThrough',
      icon: 'M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16',
    },
    {
      id: 'ul',
      label: 'Lista',
      command: 'insertUnorderedList',
      icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    },
    {
      id: 'ol',
      label: 'Lista numerada',
      command: 'insertOrderedList',
      icon: 'M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
    },
    {
      id: 'link',
      label: 'Enlace',
      command: 'createLink',
      icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.editorRef && this.value()) {
      this.editorRef.nativeElement.innerHTML = this.value();
    }
  }

  protected exec(btn: ToolbarButton): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.editorRef?.nativeElement.focus();
    let value = btn.value;
    if (btn.command === 'createLink') {
      const url = prompt('URL del enlace:', 'https://');
      if (!url) return;
      value = url;
    }
    document.execCommand(btn.command, false, value);
    this.syncValue();
    this.updateActive();
  }

  protected clearFormat(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.editorRef?.nativeElement.focus();
    document.execCommand('removeFormat');
    document.execCommand('unlink');
    this.syncValue();
    this.updateActive();
  }

  protected onInput(event: Event): void {
    const html = (event.target as HTMLDivElement).innerHTML;
    this.value.set(html);
  }

  protected updateActive(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const next = new Set<string>();
    for (const btn of this.buttons) {
      try {
        if (document.queryCommandState(btn.command)) {
          next.add(btn.id);
        }
      } catch {
        /* ignore */
      }
    }
    this.active.set(next);
  }

  private syncValue(): void {
    if (this.editorRef) {
      this.value.set(this.editorRef.nativeElement.innerHTML);
    }
  }
}
