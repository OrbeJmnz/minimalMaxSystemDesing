import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

interface TocItem {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'mm-toc',
  imports: [],
  template: `
    @if (items().length > 1) {
      <aside
        class="hidden lg:block w-56 shrink-0 mm-no-print sticky top-24 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto mm-scroll-overlay"
      >
        <div class="flex flex-col gap-3 py-2">
          <span class="text-[11px] uppercase tracking-wider text-ink-muted font-semibold px-3">
            En esta página
          </span>
          <nav class="flex flex-col gap-0.5">
            @for (item of items(); track item.id) {
              <button
                type="button"
                (click)="scrollTo(item.id)"
                class="group relative flex items-center text-left text-sm px-3 py-1.5 rounded-mm-md transition-colors duration-200"
                [class.text-ink-dark]="active() === item.id"
                [class.font-medium]="active() === item.id"
                [class.text-ink-muted]="active() !== item.id"
                [class.hover:text-ink-dark]="active() !== item.id"
              >
                <span
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-mm-pill transition-all duration-300"
                  [class.bg-brand-6]="active() === item.id"
                  [class.h-5]="active() === item.id"
                  [class.bg-transparent]="active() !== item.id"
                ></span>
                <span class="pl-2 truncate">{{ item.label }}</span>
              </button>
            }
          </nav>
        </div>
      </aside>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class TocComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly items = signal<readonly TocItem[]>([]);
  protected readonly active = signal('');

  private observer?: IntersectionObserver;
  private mutationObserver?: MutationObserver;
  private rescanTimer?: number;

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.items.set([]);
          this.scheduleScan();
        }
      });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.mutationObserver?.disconnect();
      if (this.rescanTimer) cancelAnimationFrame(this.rescanTimer);
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.querySelector('main') ?? document.body;
    this.mutationObserver = new MutationObserver(() => this.scheduleScan());
    this.mutationObserver.observe(root, { childList: true, subtree: true });

    this.scheduleScan();
  }

  private scheduleScan(): void {
    if (this.rescanTimer) cancelAnimationFrame(this.rescanTimer);
    this.rescanTimer = requestAnimationFrame(() => this.scan());
  }

  private scan(): void {
    this.observer?.disconnect();

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-mm-toc-id]'));
    const items = targets.map((node) => ({
      id: node.dataset['mmTocId'] ?? '',
      label: node.dataset['mmTocLabel'] ?? '',
    }));

    const current = this.items();
    const same =
      current.length === items.length && current.every((it, i) => it.id === items[i]?.id);
    if (!same) this.items.set(items);

    if (items.length === 0) return;
    if (!current.find((it) => it.id === this.active())) {
      this.active.set(items[0]?.id ?? '');
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) {
          const id = (visible.target as HTMLElement).dataset['mmTocId'] ?? '';
          if (id) this.active.set(id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    targets.forEach((node) => this.observer?.observe(node));
  }

  protected scrollTo(id: string): void {
    const target = document.querySelector(`[data-mm-toc-id="${id}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
