import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Señal reactiva del breakpoint actual. SSR-safe: en servidor (o jsdom sin
 * matchMedia) reporta `isMobile() === false` para que el árbol prerenderice la
 * variante desktop, y se hidrata al valor real en el navegador.
 *
 * El breakpoint coincide con el `md` de Tailwind (768px) → `isMobile` es true
 * en `< 768px` (max-width: 767.98px).
 */
@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /** true cuando el viewport es `< md` (768px). */
  readonly isMobile = signal(false);

  private mql: MediaQueryList | null = null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window.matchMedia !== 'function') return;

    this.mql = window.matchMedia('(max-width: 767.98px)');
    this.isMobile.set(this.mql.matches);

    const onChange = (e: MediaQueryListEvent) => this.isMobile.set(e.matches);
    this.mql.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => this.mql?.removeEventListener('change', onChange));
  }
}
