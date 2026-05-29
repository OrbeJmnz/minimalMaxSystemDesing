import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, startWith } from 'rxjs/operators';

export interface NavItem {
  label: string;
  path: string;
  badge?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: 'start',
    label: 'Inicio',
    items: [{ label: 'Overview', path: '/overview' }],
  },
  {
    id: 'ai-lab',
    label: 'AI Lab',
    items: [
      { label: 'Prompt Lab', path: '/prompt-lab', badge: 'Nuevo' },
      { label: 'Markdown Editor', path: '/markdown', badge: 'Nuevo' },
    ],
  },
  {
    id: 'productivity',
    label: 'Productividad',
    items: [
      { label: 'Inbox / mail list', path: '/inbox', badge: 'Nuevo' },
      { label: 'Search Results', path: '/search', badge: 'Nuevo' },
      { label: 'Date Range Picker', path: '/date-range', badge: 'Nuevo' },
    ],
  },
  {
    id: 'pages',
    label: 'Páginas completas',
    items: [
      { label: 'Analytics Dashboard', path: '/dashboard', badge: 'Nuevo' },
      { label: 'Profile / Settings', path: '/settings', badge: 'Nuevo' },
      { label: 'Onboarding Flow', path: '/onboarding', badge: 'Nuevo' },
    ],
  },
  {
    id: 'collab',
    label: 'Colaboración',
    items: [
      { label: 'Comments + threading', path: '/comments', badge: 'Nuevo' },
      { label: 'Diff Viewer', path: '/diff', badge: 'Nuevo' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      { label: 'Cookie · CTA · Banner · Newsletter', path: '/marketing', badge: 'Nuevo' },
      { label: 'Empty States ilustrativos', path: '/empty-illustrated', badge: 'Nuevo' },
    ],
  },
  {
    id: 'forms',
    label: 'Formularios',
    items: [
      { label: 'Buttons', path: '/buttons' },
      { label: 'Inputs', path: '/inputs' },
      { label: 'Select · Check · Radio · Toggle', path: '/forms' },
      { label: 'Date · File · Combobox', path: '/forms-advanced' },
      { label: 'OTP · Rating · Color · Rich text', path: '/inputs-pro' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navegación',
    items: [{ label: 'Tabs · Pagination · Stepper', path: '/navigation' }],
  },
  {
    id: 'display',
    label: 'Display',
    items: [
      { label: 'Cards', path: '/cards' },
      { label: 'Badges · Chips · Avatars', path: '/badges' },
    ],
  },
  {
    id: 'data',
    label: 'Datos',
    items: [
      { label: 'Table · List · Accordion · Timeline', path: '/data-display' },
      { label: 'Charts (Line · Bar · Donut · Ring)', path: '/charts' },
      { label: 'Code block · Diff viewer', path: '/code-display' },
      { label: 'Calendar · Range · Events', path: '/calendar' },
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    items: [
      { label: 'Modal · Drawer · Tooltip · Popover', path: '/overlays' },
      { label: 'Toast (demo)', path: '/buttons' },
    ],
  },
  {
    id: 'actions',
    label: 'Acciones',
    items: [
      { label: 'Dropdown · User menu · Cmd+K', path: '/dropdown' },
      { label: 'Chat UI', path: '/chat' },
      { label: 'Social feed', path: '/social' },
      { label: 'Tour / Onboarding', path: '/tour' },
    ],
  },
  {
    id: 'multimedia',
    label: 'Multimedia',
    items: [
      { label: 'Drag & Drop · Image preview', path: '/multimedia' },
      { label: 'Kanban board', path: '/kanban' },
    ],
  },
  {
    id: 'exports',
    label: 'Exports & Maps',
    items: [
      { label: 'PDF · Excel · CSV · Print', path: '/exports' },
      { label: 'Maps', path: '/maps' },
    ],
  },
  {
    id: 'templates',
    label: 'Plantillas',
    items: [
      { label: 'Layouts (Hero · Dashboard · Split)', path: '/layouts' },
      { label: 'Payments (Card · Wallets · Checkout)', path: '/payments' },
      { label: 'Auth (Login · Signup · Forgot)', path: '/auth' },
      { label: 'Estados (Empty · 404)', path: '/states' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class NavService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly groups = signal<readonly NavGroup[]>(NAV_GROUPS);
  readonly query = signal('');
  readonly expanded = signal<string | null>(null);

  readonly filteredGroups = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) return this.groups();
    return this.groups()
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(term)),
      }))
      .filter((group) => group.items.length > 0);
  });

  readonly searching = computed(() => this.query().trim().length > 0);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.autoExpand());
  }

  isExpanded(id: string): boolean {
    if (this.searching()) return true;
    return this.expanded() === id;
  }

  toggleGroup(id: string): void {
    this.expanded.update((current) => (current === id ? null : id));
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  private autoExpand(): void {
    const url = this.router.url.split('?')[0].split('#')[0];
    for (const group of this.groups()) {
      if (group.items.some((item) => item.path === url)) {
        this.expanded.set(group.id);
        return;
      }
    }
  }
}
