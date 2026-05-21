import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type CodeLang = 'ts' | 'js' | 'html' | 'css' | 'json' | 'bash' | 'plain';

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

const TS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'class', 'interface', 'type', 'enum',
  'extends', 'implements', 'public', 'private', 'protected', 'readonly',
  'static', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'this', 'super', 'import',
  'export', 'default', 'from', 'as', 'in', 'of', 'try', 'catch', 'finally',
  'throw', 'true', 'false', 'null', 'undefined', 'void', 'never', 'any',
  'string', 'number', 'boolean', 'object', 'symbol',
]);

const CSS_KEYWORDS = new Set(['important', 'inherit', 'initial', 'unset', 'auto']);

@Component({
  selector: 'mm-code-block',
  imports: [],
  template: `
    <figure
      class="relative rounded-mm-xl bg-surface-inverse text-white/90 overflow-hidden shadow-mm-sm border border-white/5"
    >
      <header
        class="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5"
      >
        <span class="flex items-center gap-2">
          <span class="flex gap-1.5" aria-hidden="true">
            <span class="size-2.5 rounded-full bg-red-500/70"></span>
            <span class="size-2.5 rounded-full bg-amber-500/70"></span>
            <span class="size-2.5 rounded-full bg-green-500/70"></span>
          </span>
          @if (title()) {
            <span class="font-mono text-xs text-white/70 ml-2">{{ title() }}</span>
          }
        </span>
        <div class="flex items-center gap-2">
          <span
            class="rounded-mm-pill bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          >
            {{ lang() }}
          </span>
          <button
            type="button"
            (click)="copy()"
            [attr.aria-label]="copied() ? 'Copiado' : 'Copiar código'"
            class="inline-flex items-center gap-1.5 rounded-mm-sm bg-white/10 hover:bg-white/20 px-2 py-1 text-[10px] font-medium text-white transition"
          >
            @if (copied()) {
              <svg
                class="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              Copiado
            } @else {
              <svg
                class="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copiar
            }
          </button>
        </div>
      </header>

      <pre
        class="overflow-x-auto p-4 text-xs font-mono leading-relaxed mm-scroll-thin"
      ><code [innerHTML]="highlighted()"></code></pre>
    </figure>

    <style>
      .mm-tk-keyword { color: #c084fc; }
      .mm-tk-string { color: #86efac; }
      .mm-tk-number { color: #fda4af; }
      .mm-tk-comment { color: #64748b; font-style: italic; }
      .mm-tk-fn { color: #93c5fd; }
      .mm-tk-property { color: #fcd34d; }
      .mm-tk-tag { color: #f9a8d4; }
      .mm-tk-attr { color: #fcd34d; }
      .mm-tk-punct { color: #94a3b8; }
      .mm-tk-line { display: inline-block; min-width: 2.5ch; padding-right: 1rem; color: #475569; user-select: none; text-align: right; }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class CodeBlockComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly code = input.required<string>();
  readonly lang = input<CodeLang>('ts');
  readonly title = input<string>('');
  readonly showLineNumbers = input<boolean>(false);

  protected readonly copied = signal(false);

  protected readonly highlighted = computed(() => {
    const raw = this.code();
    const tokens = this.tokenize(raw, this.lang());
    if (!this.showLineNumbers()) return tokens;
    return tokens
      .split('\n')
      .map((line, i) => `<span class="mm-tk-line">${i + 1}</span>${line}`)
      .join('\n');
  });

  protected async copy(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      /* ignore */
    }
  }

  private tokenize(code: string, lang: CodeLang): string {
    if (lang === 'plain' || lang === 'bash') return escapeHtml(code);

    if (lang === 'html') return this.highlightHtml(code);
    if (lang === 'css') return this.highlightCss(code);
    if (lang === 'json') return this.highlightJson(code);
    return this.highlightTs(code);
  }

  private highlightTs(code: string): string {
    let escaped = escapeHtml(code);
    escaped = escaped.replace(
      /(\/\*[\s\S]*?\*\/|\/\/.*$)/gm,
      '<span class="mm-tk-comment">$1</span>',
    );
    escaped = escaped.replace(
      /(&#39;[^&]*?&#39;|&quot;[^&]*?&quot;|`[^`]*?`)/g,
      '<span class="mm-tk-string">$1</span>',
    );
    escaped = escaped.replace(
      /\b(\d+\.?\d*)\b/g,
      '<span class="mm-tk-number">$1</span>',
    );
    escaped = escaped.replace(/\b([a-zA-Z_$][\w$]*)\b/g, (match) => {
      if (TS_KEYWORDS.has(match)) {
        return `<span class="mm-tk-keyword">${match}</span>`;
      }
      return match;
    });
    escaped = escaped.replace(
      /\b([a-zA-Z_$][\w$]*)(?=\s*\()/g,
      '<span class="mm-tk-fn">$1</span>',
    );
    return escaped;
  }

  private highlightHtml(code: string): string {
    let escaped = escapeHtml(code);
    escaped = escaped.replace(
      /(&lt;!--[\s\S]*?--&gt;)/g,
      '<span class="mm-tk-comment">$1</span>',
    );
    escaped = escaped.replace(
      /(&lt;\/?)([\w-]+)/g,
      '$1<span class="mm-tk-tag">$2</span>',
    );
    escaped = escaped.replace(
      /\s([\w-]+)=/g,
      ' <span class="mm-tk-attr">$1</span>=',
    );
    escaped = escaped.replace(
      /=(&quot;[^&]*?&quot;)/g,
      '=<span class="mm-tk-string">$1</span>',
    );
    return escaped;
  }

  private highlightCss(code: string): string {
    let escaped = escapeHtml(code);
    escaped = escaped.replace(
      /(\/\*[\s\S]*?\*\/)/g,
      '<span class="mm-tk-comment">$1</span>',
    );
    escaped = escaped.replace(
      /([\w-]+)(?=\s*:)/g,
      '<span class="mm-tk-property">$1</span>',
    );
    escaped = escaped.replace(
      /(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g,
      '<span class="mm-tk-string">$1</span>',
    );
    escaped = escaped.replace(
      /(#[0-9a-fA-F]{3,8}|\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|deg)?\b)/g,
      '<span class="mm-tk-number">$1</span>',
    );
    escaped = escaped.replace(/\b(!important)\b/g, '<span class="mm-tk-keyword">$1</span>');
    return escaped;
  }

  private highlightJson(code: string): string {
    let escaped = escapeHtml(code);
    escaped = escaped.replace(
      /(&quot;[^&]*?&quot;)(\s*:)/g,
      '<span class="mm-tk-property">$1</span>$2',
    );
    escaped = escaped.replace(
      /:\s*(&quot;[^&]*?&quot;)/g,
      ': <span class="mm-tk-string">$1</span>',
    );
    escaped = escaped.replace(
      /\b(\d+\.?\d*)\b/g,
      '<span class="mm-tk-number">$1</span>',
    );
    escaped = escaped.replace(
      /\b(true|false|null)\b/g,
      '<span class="mm-tk-keyword">$1</span>',
    );
    return escaped;
  }
}
