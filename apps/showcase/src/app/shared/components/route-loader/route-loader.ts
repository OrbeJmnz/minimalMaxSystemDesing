import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mm-route-loader',
  imports: [],
  template: `
    @if (loading()) {
      <div
        class="rounded-mm-2xl border border-border-soft bg-surface-base/80 p-8 backdrop-blur-sm"
        style="animation: fadeIn 220ms var(--ease-out) both;"
        role="status"
        aria-live="polite"
        aria-label="Cargando vista"
      >
        <div class="flex items-center gap-3 mb-6">
          <span class="mm-skeleton h-8 w-32"></span>
          <span class="mm-skeleton h-8 w-20 rounded-mm-pill"></span>
        </div>
        <div class="mm-skeleton h-12 w-3/4 mb-3"></div>
        <div class="mm-skeleton h-4 w-full mb-2"></div>
        <div class="mm-skeleton h-4 w-5/6 mb-8"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          @for (n of [1, 2, 3, 4]; track n) {
            <div class="rounded-mm-xl border border-border-soft bg-surface-base p-4">
              <span class="mm-skeleton size-10 rounded-mm-md block mb-3"></span>
              <span class="mm-skeleton h-3 w-2/3 block mb-2"></span>
              <span class="mm-skeleton h-3 w-1/2 block"></span>
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class RouteLoaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(false);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading.set(false);
      }
    });
  }
}
