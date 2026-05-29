import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { EmptyStateComponent } from '@minimax/ui-angular';

interface SearchResult {
  readonly id: string;
  readonly type: 'doc' | 'person' | 'image' | 'code';
  readonly title: string;
  readonly snippet: string;
  readonly author?: string;
  readonly tag?: string;
  readonly date: string;
  readonly dateOrder: number;
  readonly popularity: number;
}

type SortMode = 'relevance' | 'date' | 'popularity';

interface FacetCount {
  readonly id: string;
  readonly label: string;
  readonly count: number;
}

@Component({
  selector: 'mm-search',
  imports: [CanvasFrameComponent, SectionHeaderComponent, EmptyStateComponent],
  templateUrl: './search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class SearchComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly query = signal('design system');
  protected readonly sortMode = signal<SortMode>('relevance');
  protected readonly selectedTypes = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedDateRange = signal<'all' | '7d' | '30d' | '90d'>('all');
  protected readonly selectedAuthors = signal<ReadonlySet<string>>(new Set());

  protected readonly allResults: readonly SearchResult[] = [
    {
      id: 'r-1',
      type: 'doc',
      title: 'Cómo escalar un design system multi-marca',
      snippet:
        'Un design system bien diseñado no es solo una librería de componentes. Es la arquitectura de decisiones que permite que tu equipo construya UI consistente sin reinventar la rueda.',
      author: 'Sofia Reyes',
      tag: 'Design Systems',
      date: 'Hace 2 días',
      dateOrder: 2,
      popularity: 94,
    },
    {
      id: 'r-2',
      type: 'doc',
      title: 'Tokens semánticos vs literales en dark mode',
      snippet:
        'Por qué llamar a un token "ink-charcoal" rompe tu dark mode, y cómo nombrarlos para que sobrevivan a una inversión completa del tema sin parches.',
      author: 'Ana Vega',
      tag: 'Design Systems',
      date: 'Hace 5 días',
      dateOrder: 5,
      popularity: 88,
    },
    {
      id: 'r-3',
      type: 'person',
      title: 'Sofia Reyes',
      snippet:
        'Senior Designer · Lead del design system en MinimalMax. 8 años de experiencia en design tokens, motion y brand systems.',
      author: 'sofia@minimalmax.com',
      tag: 'People',
      date: 'Activa hace 2 min',
      dateOrder: 1,
      popularity: 76,
    },
    {
      id: 'r-4',
      type: 'doc',
      title: 'Migrando de Material a un design system propio',
      snippet:
        'Después de 3 años con Material UI decidimos construir el nuestro. Estas son las decisiones técnicas, los trade-offs, y los componentes que más cambiaron.',
      author: 'Diego Luna',
      tag: 'Engineering',
      date: 'Hace 2 semanas',
      dateOrder: 14,
      popularity: 71,
    },
    {
      id: 'r-5',
      type: 'code',
      title: 'design-tokens.ts · @theme inline configuration',
      snippet:
        'Setup completo de design tokens con Tailwind v4 @theme inline. Incluye paleta brand, semántica de colores para dark mode, radios, sombras y curvas de ease.',
      author: 'Diego Luna',
      tag: 'Code',
      date: 'Hace 1 mes',
      dateOrder: 30,
      popularity: 65,
    },
    {
      id: 'r-6',
      type: 'doc',
      title: 'Auditoría del design system Q1 — qué quitar y qué doblar',
      snippet:
        'Resultado de la auditoría: 12 componentes que nadie usa, 5 patrones duplicados, y 3 que necesitan ser elevados a primitivas del design system.',
      author: 'Sofia Reyes',
      tag: 'Design Systems',
      date: 'Hace 1 mes',
      dateOrder: 28,
      popularity: 59,
    },
    {
      id: 'r-7',
      type: 'image',
      title: 'design-system-overview.png',
      snippet:
        'Mapa visual del design system MinimalMax: tokens · primitivas · componentes · patrones · plantillas. PDF descargable adjunto.',
      author: 'Sofia Reyes',
      tag: 'Resources',
      date: 'Hace 2 meses',
      dateOrder: 60,
      popularity: 52,
    },
    {
      id: 'r-8',
      type: 'doc',
      title: 'Design system contribution guidelines',
      snippet:
        'Cómo proponer un componente nuevo al design system: criterios de aceptación, naming conventions, accesibilidad mínima requerida, y el proceso de review.',
      author: 'Ana Vega',
      tag: 'Process',
      date: 'Hace 3 meses',
      dateOrder: 90,
      popularity: 44,
    },
  ];

  protected readonly typeOptions: readonly {
    id: SearchResult['type'];
    label: string;
    icon: string;
  }[] = [
    {
      id: 'doc',
      label: 'Documentos',
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    },
    {
      id: 'person',
      label: 'Personas',
      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    },
    { id: 'code', label: 'Código', icon: 'm16 18 6-6-6-6M8 6l-6 6 6 6' },
    {
      id: 'image',
      label: 'Imágenes',
      icon: 'M3 3h18v18H3zM8.5 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM21 15l-5-5L5 21',
    },
  ];

  protected readonly dateRanges: readonly { id: 'all' | '7d' | '30d' | '90d'; label: string }[] = [
    { id: 'all', label: 'Cualquier fecha' },
    { id: '7d', label: 'Últimos 7 días' },
    { id: '30d', label: 'Últimos 30 días' },
    { id: '90d', label: 'Últimos 90 días' },
  ];

  protected readonly sortOptions: readonly { id: SortMode; label: string }[] = [
    { id: 'relevance', label: 'Relevancia' },
    { id: 'date', label: 'Fecha (reciente)' },
    { id: 'popularity', label: 'Popularidad' },
  ];

  protected readonly typeFacets = computed<readonly FacetCount[]>(() => {
    const base = this.allResults;
    return this.typeOptions.map((opt) => ({
      id: opt.id,
      label: opt.label,
      count: base.filter((r) => r.type === opt.id).length,
    }));
  });

  protected readonly authorFacets = computed<readonly FacetCount[]>(() => {
    const seen = new Map<string, number>();
    for (const r of this.allResults) {
      if (!r.author) continue;
      seen.set(r.author, (seen.get(r.author) ?? 0) + 1);
    }
    return Array.from(seen.entries())
      .map(([author, count]) => ({ id: author, label: author, count }))
      .sort((a, b) => b.count - a.count);
  });

  protected readonly results = computed<readonly SearchResult[]>(() => {
    const q = this.query().trim().toLowerCase();
    const types = this.selectedTypes();
    const authors = this.selectedAuthors();
    const dateLimit = this.dateLimitDays();

    let list = this.allResults.filter((r) => {
      if (types.size > 0 && !types.has(r.type)) return false;
      if (authors.size > 0 && !authors.has(r.author ?? '')) return false;
      if (dateLimit !== null && r.dateOrder > dateLimit) return false;
      if (q) {
        const haystack = (r.title + ' ' + r.snippet + ' ' + (r.author ?? '')).toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const mode = this.sortMode();
    if (mode === 'date') {
      list = [...list].sort((a, b) => a.dateOrder - b.dateOrder);
    } else if (mode === 'popularity') {
      list = [...list].sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  });

  protected readonly resultCount = computed(() => this.results().length);
  protected readonly totalCount = computed(() => this.allResults.length);

  protected readonly hasActiveFilters = computed(
    () =>
      this.selectedTypes().size > 0 ||
      this.selectedAuthors().size > 0 ||
      this.selectedDateRange() !== 'all',
  );

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clearQuery(): void {
    this.query.set('');
  }

  protected toggleType(id: string): void {
    this.selectedTypes.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected toggleAuthor(id: string): void {
    this.selectedAuthors.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected setDateRange(id: 'all' | '7d' | '30d' | '90d'): void {
    this.selectedDateRange.set(id);
  }

  protected setSortMode(id: SortMode): void {
    this.sortMode.set(id);
  }

  protected clearFilters(): void {
    this.selectedTypes.set(new Set());
    this.selectedAuthors.set(new Set());
    this.selectedDateRange.set('all');
  }

  protected isTypeSelected(id: string): boolean {
    return this.selectedTypes().has(id);
  }

  protected isAuthorSelected(id: string): boolean {
    return this.selectedAuthors().has(id);
  }

  protected typeMeta(type: SearchResult['type']): { icon: string; tone: string } {
    switch (type) {
      case 'doc':
        return {
          icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
          tone: 'bg-primary-200 text-primary-700',
        };
      case 'person':
        return {
          icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
          tone: 'bg-success-bg text-success',
        };
      case 'code':
        return { icon: 'm16 18 6-6-6-6M8 6l-6 6 6 6', tone: 'bg-brand-pink/15 text-brand-pink' };
      case 'image':
        return {
          icon: 'M3 3h18v18H3zM8.5 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
          tone: 'bg-warning-bg text-warning',
        };
    }
  }

  protected highlight(text: string): SafeHtml {
    const q = this.query().trim();
    if (!q) return this.sanitizer.bypassSecurityTrustHtml(this.escape(text));
    const escaped = this.escape(text);
    const pattern = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const replaced = escaped.replace(
      regex,
      '<mark class="rounded-mm-sm bg-amber-200 text-ink-dark px-0.5 font-semibold">$1</mark>',
    );
    return this.sanitizer.bypassSecurityTrustHtml(replaced);
  }

  private escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private dateLimitDays(): number | null {
    switch (this.selectedDateRange()) {
      case '7d':
        return 7;
      case '30d':
        return 30;
      case '90d':
        return 90;
      default:
        return null;
    }
  }

  protected readonly snippetsSearch: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'search.html (extracto)',
      code: `<!-- Layout: facets sidebar + results -->
<div class="grid md:grid-cols-[260px_1fr] gap-6">

  <!-- Facets sidebar (Type · Date · Authors) -->
  <aside class="space-y-5">
    <section>
      <h4 class="text-[11px] uppercase font-semibold mb-2">Tipo</h4>
      @for (facet of typeFacets(); track facet.id) {
        <label class="flex items-center gap-2 cursor-pointer
                      hover:bg-surface-secondary/50 px-2 py-1.5 rounded-mm-sm">
          <input type="checkbox"
                 [checked]="isTypeSelected(facet.id)"
                 (change)="toggleType(facet.id)"
                 class="peer sr-only" />
          <span class="size-4 rounded-mm-sm border-2 peer-checked:bg-brand-6">
            <svg class="size-3 opacity-0 peer-checked:opacity-100"><!-- check --></svg>
          </span>
          <span class="flex-1 text-sm">{{ facet.label }}</span>
          <span class="rounded-mm-pill bg-surface-secondary text-[10px] px-2">
            {{ facet.count }}
          </span>
        </label>
      }
    </section>

    <section><!-- Date range radio --></section>
    <section><!-- Author checkboxes --></section>
  </aside>

  <!-- Results -->
  <section>
    <!-- Search input + sort + count -->
    <div class="flex items-center gap-3">
      <input [value]="query()" (input)="onQuery($event)" placeholder="Buscar..." />
      <select (change)="setSortMode(...)">
        @for (s of sortOptions; track s.id) {
          <option [value]="s.id">{{ s.label }}</option>
        }
      </select>
    </div>

    <!-- Results list con highlighting -->
    <ul data-stagger-rows>
      @for (result of results(); track result.id) {
        <li>
          <h4 [innerHTML]="highlight(result.title)"></h4>
          <p [innerHTML]="highlight(result.snippet)"></p>
          <span>{{ result.author }} · {{ result.date }}</span>
        </li>
      }
    </ul>

    @if (results().length === 0) {
      <mm-empty-state title="Sin resultados" .../>
    }
  </section>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'search.ts (facets + highlighting con DomSanitizer)',
      code: `interface SearchResult {
  readonly id: string;
  readonly type: 'doc' | 'person' | 'image' | 'code';
  readonly title: string;
  readonly snippet: string;
  readonly author?: string;
  readonly date: string;
  readonly dateOrder: number;   // días desde hoy (para sort)
  readonly popularity: number;  // 0-100
}

type SortMode = 'relevance' | 'date' | 'popularity';

protected readonly query = signal('design system');
protected readonly sortMode = signal<SortMode>('relevance');
protected readonly selectedTypes = signal<ReadonlySet<string>>(new Set());
protected readonly selectedAuthors = signal<ReadonlySet<string>>(new Set());
protected readonly selectedDateRange = signal<'all' | '7d' | '30d' | '90d'>('all');

// Computed: lista filtrada + ordenada según todos los facets
protected readonly results = computed<readonly SearchResult[]>(() => {
  const q = this.query().trim().toLowerCase();
  const types = this.selectedTypes();
  const authors = this.selectedAuthors();
  const dateLimit = this.dateLimitDays();

  let list = this.allResults.filter((r) => {
    if (types.size > 0 && !types.has(r.type)) return false;
    if (authors.size > 0 && !authors.has(r.author ?? '')) return false;
    if (dateLimit !== null && r.dateOrder > dateLimit) return false;
    if (q) {
      const haystack = (r.title + ' ' + r.snippet + ' ' + r.author).toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (this.sortMode() === 'date') {
    list = [...list].sort((a, b) => a.dateOrder - b.dateOrder);
  } else if (this.sortMode() === 'popularity') {
    list = [...list].sort((a, b) => b.popularity - a.popularity);
  }
  return list;
});

// Highlight de términos con <mark> (cuidado: usar DomSanitizer)
protected highlight(text: string): SafeHtml {
  const q = this.query().trim();
  if (!q) return this.sanitizer.bypassSecurityTrustHtml(this.escape(text));

  const escaped = this.escape(text);
  const pattern = q.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
  const regex = new RegExp(\`(\${pattern})\`, 'gi');
  const replaced = escaped.replace(
    regex,
    '<mark class="rounded-mm-sm bg-amber-200 text-ink-dark px-0.5 font-semibold">$1</mark>',
  );
  return this.sanitizer.bypassSecurityTrustHtml(replaced);
}

private escape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (highlighting + tokens)',
      code: `/* El <mark> se estiliza con clases Tailwind embebidas en el highlight()
   — no requiere CSS adicional. Solo el componente <mark> nativo. */

/* Si quieres un estilo más vistoso para el mark, agregar en styles.css: */
mark.mm-highlight {
  background: linear-gradient(120deg, transparent 0%, #fde68a 30%, #fde68a 70%, transparent 100%);
  background-size: 200% 100%;
  background-position: 100% 0;
  animation: mm-highlight-sweep 600ms ease-out forwards;
  padding: 0.05em 0.15em;
  border-radius: 0.2em;
  color: inherit;
  font-weight: 600;
}

@keyframes mm-highlight-sweep {
  to { background-position: 0% 0; }
}`,
    },
  ];

  protected readonly snippetsFacets: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'facets-sidebar.html',
      code: `<aside class="space-y-5">
  <!-- Tipo (checkboxes multi) -->
  <section>
    <header class="flex items-center justify-between mb-2">
      <h4 class="text-[11px] uppercase tracking-wider text-ink-secondary font-semibold">
        Tipo
      </h4>
      @if (hasActiveFilters()) {
        <button (click)="clearFilters()" class="text-[10px] text-brand-6 hover:underline">
          Limpiar
        </button>
      }
    </header>
    @for (facet of typeFacets(); track facet.id) {
      <label class="group/facet flex items-center gap-2 cursor-pointer
                    hover:bg-surface-secondary/50 px-2 py-1.5 rounded-mm-sm">
        <input type="checkbox" class="peer sr-only"
               [checked]="isTypeSelected(facet.id)"
               (change)="toggleType(facet.id)" />
        <span class="size-4 rounded-mm-sm border-2 border-border bg-surface-base
                     grid place-items-center peer-checked:bg-brand-6 peer-checked:border-brand-6">
          <svg class="size-2.5 text-white opacity-0 peer-checked:opacity-100
                      transition-opacity duration-200"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </span>
        <span class="flex-1 text-sm">{{ facet.label }}</span>
        <span class="rounded-mm-pill bg-surface-secondary text-ink-secondary
                     px-1.5 py-0.5 text-[10px] font-mono tabular-nums">
          {{ facet.count }}
        </span>
      </label>
    }
  </section>

  <!-- Fecha (radio: all | 7d | 30d | 90d) -->
  <section>
    <h4 class="text-[11px] uppercase font-semibold mb-2">Fecha</h4>
    @for (range of dateRanges; track range.id) {
      <label class="flex items-center gap-2 cursor-pointer px-2 py-1.5">
        <input type="radio" name="date-range" class="peer sr-only"
               [value]="range.id"
               [checked]="selectedDateRange() === range.id"
               (change)="setDateRange(range.id)" />
        <span class="size-4 rounded-full border-2 border-border
                     peer-checked:border-brand-6 grid place-items-center">
          <span class="size-2 rounded-full transition-all"
                [class.bg-brand-6]="selectedDateRange() === range.id"></span>
        </span>
        <span class="text-sm">{{ range.label }}</span>
      </label>
    }
  </section>
</aside>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'facets data (auto-counted)',
      code: `// Type facets con conteo automático
protected readonly typeFacets = computed<readonly FacetCount[]>(() => {
  return this.typeOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    count: this.allResults.filter((r) => r.type === opt.id).length,
  }));
});

// Author facets agrupados + ordenados por count desc
protected readonly authorFacets = computed<readonly FacetCount[]>(() => {
  const seen = new Map<string, number>();
  for (const r of this.allResults) {
    if (!r.author) continue;
    seen.set(r.author, (seen.get(r.author) ?? 0) + 1);
  }
  return Array.from(seen.entries())
    .map(([author, count]) => ({ id: author, label: author, count }))
    .sort((a, b) => b.count - a.count);
});

// Toggle (Set-based para multi-select eficiente)
protected toggleType(id: string): void {
  this.selectedTypes.update((set) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
}`,
    },
  ];

  protected readonly snippetsNoResults: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'no-results-empty.html',
      code: `@if (results().length === 0) {
  <mm-empty-state
    title="Sin resultados"
    [description]="
      query()
        ? 'No encontramos nada para \\'' + query() + '\\'. Prueba con otra búsqueda o quita filtros.'
        : 'Empieza escribiendo en el campo de búsqueda.'
    "
    variant="warning"
  >
    <svg slot="icon" class="relative size-8" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="m21 21-4.3-4.3"></path>
      <path d="M11 8v6M8 11h6"></path>
    </svg>

    @if (hasActiveFilters()) {
      <button slot="actions" (click)="clearFilters()"
              class="rounded-mm-md bg-cta text-cta-fg px-4 py-2 text-sm font-medium">
        Limpiar todos los filtros
      </button>
    }

    <!-- Sugerencias inteligentes -->
    <div slot="actions" class="flex flex-wrap gap-2 mt-4">
      @for (suggestion of ['design tokens', 'dark mode', 'tailwind']; track suggestion) {
        <button (click)="query.set(suggestion)"
                class="rounded-mm-pill border px-3 py-1 text-xs hover:border-ink-dark">
          {{ suggestion }}
        </button>
      }
    </div>
  </mm-empty-state>
}`,
    },
  ];
}
