import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { ToastService } from '@minimax/ui-angular';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block';

interface ToolbarAction {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly shortcut?: string;
}

const DEFAULT_MARKDOWN = `# MinimalMax Components

Bienvenido al **Markdown editor split** — escribe a la izquierda, mira la magia a la derecha.

## Lo que soporta

- Headings de **3 niveles** (\`#\`, \`##\`, \`###\`)
- *Énfasis* e **importancia**
- Listas como ésta
- \`código inline\` y bloques:

\`\`\`ts
function saludo(nombre: string): string {
  return \`Hola, \${nombre} 👋\`;
}
\`\`\`

- Links como [Angular 21](https://angular.dev)
- > Citas para frases memorables
- Imágenes: ![alt text](url)

---

Construido con **cero dependencias** — solo regex puro y \`bypassSecurityTrustHtml\`. Ligero, instantáneo, portable.
`;

@Component({
  selector: 'mm-markdown',
  imports: [CanvasFrameComponent, SectionHeaderComponent, CodeBlockComponent],
  templateUrl: './markdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class MarkdownFeatureComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toast = inject(ToastService);

  protected readonly editorRef = viewChild<ElementRef<HTMLTextAreaElement>>('editor');

  protected readonly source = signal(DEFAULT_MARKDOWN);
  protected readonly view = signal<'split' | 'editor' | 'preview'>('split');

  protected readonly viewTabs: ReadonlyArray<{
    readonly id: 'split' | 'editor' | 'preview';
    readonly label: string;
  }> = [
    { id: 'split', label: 'Split' },
    { id: 'editor', label: 'Editor' },
    { id: 'preview', label: 'Preview' },
  ];

  protected readonly toolbar: readonly ToolbarAction[] = [
    {
      id: 'bold',
      label: 'Negrita',
      icon: 'M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z',
      shortcut: '⌘B',
    },
    { id: 'italic', label: 'Cursiva', icon: 'M19 4h-9M14 20H5M15 4 9 20', shortcut: '⌘I' },
    { id: 'h1', label: 'Heading 1', icon: 'M4 12h16M4 4v16M20 4v16M14 4l3 0v16M17 12h6' },
    { id: 'h2', label: 'Heading 2', icon: 'M4 12h12M4 4v16M16 4v16M18 8l2-2v14h-2' },
    { id: 'ul', label: 'Lista', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
    {
      id: 'quote',
      label: 'Cita',
      icon: 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 .985 0 1 0 1 1v1c0 1-1 2-2 2-.985 0-1 .008-1 1.031V20c0 1 0 1 1 1z',
    },
    { id: 'code', label: 'Código', icon: 'm16 18 6-6-6-6M8 6l-6 6 6 6' },
    {
      id: 'link',
      label: 'Link',
      icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    },
    {
      id: 'image',
      label: 'Imagen',
      icon: 'M3 3h18v18H3zM8.5 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM21 15l-5-5L5 21',
    },
  ];

  protected readonly parserSource = `private toHtml(md: string): string {
  let src = md;

  // 1. Code blocks (\`\`\`lang\\ncode\\n\`\`\`) → placeholders para no escapar
  const blocks: string[] = [];
  src = src.replace(/\`\`\`(\\w*)\\n([\\s\\S]*?)\`\`\`/g, (_m, lang, code) => {
    const safe = this.escapeHtml(code.replace(/\\n$/, ''));
    blocks.push(\`<pre class="..."><code class="language-\${lang}">\${safe}</code></pre>\`);
    return \` BLOCK\${blocks.length - 1} \`;
  });

  // 2. Escape el resto del HTML
  src = this.escapeHtml(src);

  // 3. Headings
  src = src.replace(/^### (.+)$/gm, '<h3 class="...">$1</h3>');
  src = src.replace(/^## (.+)$/gm,  '<h2 class="...">$1</h2>');
  src = src.replace(/^# (.+)$/gm,   '<h1 class="...">$1</h1>');

  // 4. Horizontal rule
  src = src.replace(/^---+$/gm, '<hr class="..." />');

  // 5. Blockquote (cuidado: > ya fue escapado a &gt;)
  src = src.replace(/^&gt; (.+)$/gm,
    '<blockquote class="border-l-4 border-brand-6 ...">$1</blockquote>');

  // 6. Inline code (antes que bold/italic)
  src = src.replace(/\`([^\`\\n]+)\`/g, '<code class="...">$1</code>');

  // 7. Imágenes y links
  src = src.replace(/!\\[([^\\]]*)\\]\\(([^)\\s]+)\\)/g, '<img src="$2" alt="$1" />');
  src = src.replace(/\\[([^\\]]+)\\]\\(([^)\\s]+)\\)/g,
    '<a href="$2" target="_blank">$1</a>');

  // 8. Bold antes que italic (** antes que *)
  src = src.replace(/\\*\\*([^*\\n]+)\\*\\*/g, '<strong>$1</strong>');
  src = src.replace(/\\*([^*\\n]+)\\*/g,        '<em>$1</em>');

  // 9. Listas: agrupar líneas consecutivas que empiezan con "- "
  src = src.replace(/(?:^|\\n)((?:- .+(?:\\n|$))+)/g, (_m, group) => {
    const items = group.trim().split('\\n')
      .map(l => \`<li>\${l.replace(/^- /, '')}</li>\`).join('');
    return \`\\n<ul class="list-disc pl-6">\${items}</ul>\`;
  });

  // 10. Párrafos (separados por línea en blanco)
  src = src.split(/\\n{2,}/).map(para => {
    const t = para.trim();
    if (!t) return '';
    if (t.startsWith('<') || t.includes(' BLOCK')) return t;
    return \`<p>\${t.replace(/\\n/g, '<br />')}</p>\`;
  }).join('\\n');

  // 11. Restore code blocks
  src = src.replace(/ BLOCK(\\d+) /g, (_m, i) => blocks[+i]);
  return src;
}`;

  protected readonly stats = computed(() => {
    const text = this.source();
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    const readingTime = Math.max(1, Math.round(words / 200));
    return { words, chars, lines, readingTime };
  });

  protected readonly previewHtml = computed(() => this.toHtml(this.source()));

  protected readonly snippetsEditor: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'markdown.html (extracto)',
      code: `<!-- View switcher: split | editor | preview -->
<nav class="inline-flex items-center gap-1 rounded-mm-pill bg-surface-secondary p-1">
  @for (tab of views; track tab.id) {
    <button (click)="setView(tab.id)"
            [class.bg-surface-base]="view() === tab.id"
            [class.shadow-mm-sm]="view() === tab.id">
      {{ tab.label }}
    </button>
  }
</nav>

<!-- Toolbar -->
<div class="flex items-center gap-0.5 p-2 border-b">
  @for (action of toolbar; track action.id) {
    <button (click)="applyAction(action.id)"
            [title]="action.label + ' (' + action.shortcut + ')'"
            class="size-8 rounded-mm-sm hover:bg-surface-secondary">
      <svg viewBox="0 0 24 24" stroke="currentColor">
        <path [attr.d]="action.icon" />
      </svg>
    </button>
  }
</div>

<!-- Editor + Preview grid -->
<div [class.md:grid-cols-2]="view() === 'split'"
     [class.grid-cols-1]="view() !== 'split'">
  @if (view() !== 'preview') {
    <textarea #editor
              [value]="source()"
              (input)="onInput($event)"
              (keydown)="onKey($event)"
              class="mm-input-bare h-96 font-mono"></textarea>
  }
  @if (view() !== 'editor') {
    <div class="h-96 overflow-y-auto" [innerHTML]="previewHtml()"></div>
  }
</div>

<!-- Stats footer -->
<footer class="text-[11px] text-ink-muted font-mono tabular-nums">
  {{ stats().words }} palabras · {{ stats().chars }} caracteres ·
  {{ stats().readingTime }} min lectura
</footer>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'markdown.ts (toolbar actions + computed stats)',
      code: `interface ToolbarAction {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly shortcut?: string;
}

protected readonly source = signal(DEFAULT_MARKDOWN);
protected readonly view = signal<'split' | 'editor' | 'preview'>('split');

// Stats reactivas (palabras, caracteres, líneas, reading time)
protected readonly stats = computed(() => {
  const text = this.source();
  const words = text.trim().split(/\\s+/).filter(Boolean).length;
  const chars = text.length;
  const lines = text.split('\\n').length;
  const readingTime = Math.max(1, Math.round(words / 200)); // 200 wpm
  return { words, chars, lines, readingTime };
});

protected readonly previewHtml = computed(() => this.toHtml(this.source()));

// Toolbar: aplica markdown wrappers a la selección actual del textarea
protected applyAction(id: string): void {
  const el = this.editorRef()?.nativeElement;
  if (!el) return;
  const start = el.selectionStart, end = el.selectionEnd;
  const selected = this.source().slice(start, end);

  const wrap = (left: string, right: string, placeholder = 'texto') => {
    const inner = selected || placeholder;
    const next = this.source().slice(0, start) + left + inner + right +
                 this.source().slice(end);
    this.source.set(next);
    queueMicrotask(() => {
      el.focus();
      el.setSelectionRange(start + left.length,
                           start + left.length + inner.length);
    });
  };

  switch (id) {
    case 'bold':   return wrap('**', '**');
    case 'italic': return wrap('*', '*');
    case 'link':   return wrap('[', '](https://)', 'texto');
    // ... resto: h1, h2, ul, quote, code, image
  }
}

// Shortcuts ⌘B / ⌘I
protected onKey(event: KeyboardEvent): void {
  if (!(event.metaKey || event.ctrlKey)) return;
  if (event.key.toLowerCase() === 'b') {
    event.preventDefault();
    this.applyAction('bold');
  } else if (event.key.toLowerCase() === 'i') {
    event.preventDefault();
    this.applyAction('italic');
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (clases usadas)',
      code: `/* Textarea sin estilos nativos del browser */
.mm-input-bare,
.mm-input-bare:focus,
.mm-input-bare:focus-visible {
  appearance: none;
  background: transparent;
  border: 0;
  outline: 0;
  box-shadow: none;
}

/* Scroll del preview con scrollbar fino */
.mm-scroll-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.mm-scroll-thin::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 9999px;
}

/* Press feedback */
.mm-press:active { transform: scale(0.97); }

/* Tokens involucrados */
--color-brand-6: #1456f0;
--color-surface-secondary: #f0f0f0;
--color-border-soft: #f2f3f5;
--radius-mm-2xl: 20px;
--radius-mm-pill: 9999px;`,
    },
  ];

  protected readonly snippetsToolbar: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'toolbar.html',
      code: `<div class="inline-flex items-center gap-0.5 rounded-mm-md border bg-surface-base p-2 shadow-mm-sm">
  @for (action of toolbar; track action.id) {
    <button
      (click)="applyAction(action.id)"
      [title]="action.label"
      class="group size-9 rounded-mm-sm grid place-items-center text-ink-secondary
             hover:text-ink-dark hover:bg-surface-secondary transition-all mm-press"
    >
      <svg class="size-4 group-hover:scale-110 transition-transform"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path [attr.d]="action.icon"></path>
      </svg>
    </button>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'toolbar data',
      code: `protected readonly toolbar: readonly ToolbarAction[] = [
  { id: 'bold',   label: 'Negrita',   icon: 'M6 4h8a4 4 0 0 1 0 8H6...', shortcut: '⌘B' },
  { id: 'italic', label: 'Cursiva',   icon: 'M19 4h-9M14 20H5M15 4 9 20', shortcut: '⌘I' },
  { id: 'h1',     label: 'Heading 1', icon: 'M4 12h16M4 4v16...' },
  { id: 'h2',     label: 'Heading 2', icon: 'M4 12h12M4 4v16...' },
  { id: 'ul',     label: 'Lista',     icon: 'M8 6h13M8 12h13...' },
  { id: 'quote',  label: 'Cita',      icon: 'M3 21c3 0 7-1 7-8V5...' },
  { id: 'code',   label: 'Código',    icon: 'm16 18 6-6-6-6M8 6l-6 6 6 6' },
  { id: 'link',   label: 'Link',      icon: 'M10 13a5 5 0 0 0 7.54.54...' },
  { id: 'image',  label: 'Imagen',    icon: 'M3 3h18v18H3z...' },
];`,
    },
  ];

  protected readonly snippetsStats: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'stats-footer.html',
      code: `<div class="inline-flex items-center gap-4 rounded-mm-pill bg-surface-secondary
            px-5 py-2 text-xs font-mono tabular-nums text-ink-secondary">
  <span>{{ stats().words }} palabras</span>
  <span class="text-ink-muted">·</span>
  <span>{{ stats().chars }} caracteres</span>
  <span class="text-ink-muted">·</span>
  <span>{{ stats().lines }} líneas</span>
  <span class="text-ink-muted">·</span>
  <span class="inline-flex items-center gap-1">
    <svg class="size-3" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
    </svg>
    {{ stats().readingTime }} min
  </span>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'stats computed (reactivo al source)',
      code: `// computed() se re-evalúa automáticamente cuando source() cambia
protected readonly stats = computed(() => {
  const text = this.source();

  const words = text.trim().split(/\\s+/).filter(Boolean).length;
  const chars = text.length;
  const lines = text.split('\\n').length;
  const readingTime = Math.max(1, Math.round(words / 200)); // 200 wpm

  return { words, chars, lines, readingTime };
});`,
    },
  ];

  protected readonly snippetsParser: readonly CanvasFrameSnippet[] = [
    {
      label: 'TS',
      lang: 'ts',
      title: 'markdown.ts (parser regex)',
      code: this.parserSource,
    },
    {
      label: 'HTML',
      lang: 'html',
      title: 'render-preview.html',
      code: `<!-- innerHTML bindeado al computed previewHtml() -->
<div class="h-96 overflow-y-auto mm-scroll-thin"
     [innerHTML]="previewHtml()"></div>

<!-- previewHtml() es un computed que llama toHtml(source()).
     Como source() es signal, el preview se actualiza automáticamente
     en cada keystroke sin manual change detection. -->`,
    },
  ];

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.source.set(target.value);
  }

  protected setView(value: 'split' | 'editor' | 'preview'): void {
    this.view.set(value);
  }

  protected applyAction(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.editorRef()?.nativeElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = this.source().slice(start, end);
    const before = this.source().slice(0, start);
    const after = this.source().slice(end);

    const wrap = (left: string, right: string, placeholder = 'texto'): void => {
      const inner = selected || placeholder;
      const next = `${before}${left}${inner}${right}${after}`;
      this.source.set(next);
      queueMicrotask(() => {
        el.focus();
        const pos = start + left.length + inner.length;
        el.setSelectionRange(start + left.length, pos);
      });
    };

    const linePrefix = (prefix: string): void => {
      const lineStart = before.lastIndexOf('\n') + 1;
      const next = `${this.source().slice(0, lineStart)}${prefix}${this.source().slice(lineStart)}`;
      this.source.set(next);
      queueMicrotask(() => {
        el.focus();
        el.setSelectionRange(end + prefix.length, end + prefix.length);
      });
    };

    switch (id) {
      case 'bold':
        return wrap('**', '**');
      case 'italic':
        return wrap('*', '*');
      case 'h1':
        return linePrefix('# ');
      case 'h2':
        return linePrefix('## ');
      case 'ul':
        return linePrefix('- ');
      case 'quote':
        return linePrefix('> ');
      case 'code':
        if (selected.includes('\n')) {
          return wrap('\n```\n', '\n```\n', 'código');
        }
        return wrap('`', '`', 'código');
      case 'link':
        return wrap('[', '](https://)', 'texto del link');
      case 'image':
        return wrap('![', '](https://)', 'descripción');
    }
  }

  protected onKey(event: KeyboardEvent): void {
    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();
    if (key === 'b') {
      event.preventDefault();
      this.applyAction('bold');
    } else if (key === 'i') {
      event.preventDefault();
      this.applyAction('italic');
    }
  }

  protected copySource(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard.writeText(this.source()).then(
      () => this.toast.success('Markdown copiado al portapapeles'),
      () => this.toast.error('No se pudo copiar'),
    );
  }

  protected resetMarkdown(): void {
    this.source.set(DEFAULT_MARKDOWN);
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private toHtml(md: string): string {
    let src = md;

    // Code blocks (```lang\ncode\n```)
    const blocks: string[] = [];
    src = src.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      const safe = this.escapeHtml(code.replace(/\n$/, ''));
      const cls = lang ? `language-${lang}` : '';
      blocks.push(
        `<pre class="my-3 overflow-x-auto rounded-mm-md bg-ink-charcoal text-white/90 p-3 text-xs font-mono leading-relaxed mm-scroll-thin"><code class="${cls}">${safe}</code></pre>`,
      );
      return ` BLOCK${blocks.length - 1} `;
    });

    // Escape rest
    src = this.escapeHtml(src);

    // Headings
    src = src.replace(
      /^### (.+)$/gm,
      '<h3 class="font-display text-base font-medium text-ink-dark mt-5 mb-2">$1</h3>',
    );
    src = src.replace(
      /^## (.+)$/gm,
      '<h2 class="font-display text-lg font-medium text-ink-dark mt-6 mb-2">$1</h2>',
    );
    src = src.replace(
      /^# (.+)$/gm,
      '<h1 class="font-display text-2xl font-medium text-ink-dark mt-2 mb-3 leading-tight">$1</h1>',
    );

    // Horizontal rule
    src = src.replace(/^---+$/gm, '<hr class="my-5 border-t border-border-soft" />');

    // Blockquote
    src = src.replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="my-3 border-l-4 border-brand-6 bg-surface-secondary/40 pl-4 py-2 text-ink-secondary italic">$1</blockquote>',
    );

    // Inline code
    src = src.replace(
      /`([^`\n]+)`/g,
      '<code class="rounded-mm-sm bg-surface-secondary px-1.5 py-0.5 text-[0.85em] font-mono text-brand-6">$1</code>',
    );

    // Images ![alt](url)
    src = src.replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      '<img src="$2" alt="$1" class="my-3 rounded-mm-md max-w-full" />',
    );

    // Links [label](url)
    src = src.replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" class="text-brand-6 underline underline-offset-2 hover:text-primary-700" target="_blank" rel="noopener">$1</a>',
    );

    // Bold then italic (order matters)
    src = src.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    src = src.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

    // Lists — agrupar líneas consecutivas que empiezan con "- "
    src = src.replace(/(?:^|\n)((?:- .+(?:\n|$))+)/g, (_m, group: string) => {
      const items = group
        .trim()
        .split('\n')
        .map((l) => `<li class="ml-1">${l.replace(/^- /, '')}</li>`)
        .join('');
      return `\n<ul class="my-3 list-disc pl-6 space-y-1 marker:text-brand-6">${items}</ul>`;
    });

    // Parágrafos: líneas con contenido que no son tag
    src = src
      .split(/\n{2,}/)
      .map((para) => {
        const trimmed = para.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<') || trimmed.includes(' BLOCK')) return trimmed;
        return `<p class="my-2 leading-relaxed">${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');

    // Restore code blocks
    src = src.replace(/ BLOCK(\d+) /g, (_m, i: string) => blocks[+i]);

    return src;
  }
}
