import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { NavService } from './nav.service';

export interface Crumb {
  readonly label: string;
  readonly path?: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly nav = inject(NavService);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly crumbs = computed<readonly Crumb[]>(() => {
    const currentUrl = this.url();
    const cleaned = currentUrl.split('?')[0].split('#')[0];
    for (const group of this.nav.groups()) {
      const match = group.items.find((item) => item.path === cleaned);
      if (match) {
        return [
          { label: 'MinimalMax', path: '/overview' },
          { label: group.label },
          { label: match.label, path: match.path },
        ];
      }
    }
    return [{ label: 'MinimalMax', path: '/overview' }];
  });
}
