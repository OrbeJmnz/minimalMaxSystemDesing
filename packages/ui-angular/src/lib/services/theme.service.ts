import { InjectionToken, Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

/**
 * Clave de localStorage para persistir el tema. Configurable por la app consumidora:
 *   providers: [{ provide: MM_THEME_STORAGE_KEY, useValue: 'mi-app-theme' }]
 * Default 'mm-theme' (retrocompatible con el showcase).
 */
export const MM_THEME_STORAGE_KEY = new InjectionToken<string>('MM_THEME_STORAGE_KEY', {
  providedIn: 'root',
  factory: () => 'mm-theme',
});

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = inject(MM_THEME_STORAGE_KEY);
  readonly mode = signal<ThemeMode>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.storageKey) as ThemeMode | null;
      // matchMedia puede no existir en algunos entornos browser (jsdom, navegadores antiguos).
      const prefersDark =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial: ThemeMode = stored ?? (prefersDark ? 'dark' : 'light');
      this.mode.set(initial);
    }

    effect(() => {
      const value = this.mode();
      if (!isPlatformBrowser(this.platformId)) return;
      document.documentElement.setAttribute('data-theme', value);
      document.documentElement.classList.toggle('mm-dark', value === 'dark');
      localStorage.setItem(this.storageKey, value);
    });
  }

  toggle(): void {
    this.mode.update((value) => (value === 'light' ? 'dark' : 'light'));
  }

  set(value: ThemeMode): void {
    this.mode.set(value);
  }
}
