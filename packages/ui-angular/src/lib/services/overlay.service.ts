import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly stack = signal<readonly string[]>([]);

  acquire(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stack.update((list) => (list.includes(id) ? list : [...list, id]));
    this.applyLock();
  }

  release(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stack.update((list) => list.filter((item) => item !== id));
    this.applyLock();
  }

  isTop(id: string): boolean {
    return this.stack().at(-1) === id;
  }

  count(): number {
    return this.stack().length;
  }

  private applyLock(): void {
    if (this.stack().length > 0) {
      const original = document.body.dataset['mmScrollY'] ?? `${window.scrollY}`;
      document.body.dataset['mmScrollY'] = original;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const y = Number(document.body.dataset['mmScrollY'] ?? '0');
      delete document.body.dataset['mmScrollY'];
      if (!Number.isNaN(y)) window.scrollTo(0, y);
    }
  }
}
