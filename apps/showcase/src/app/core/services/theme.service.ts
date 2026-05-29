import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'mm-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly mode = signal<ThemeMode>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      const initial: ThemeMode =
        stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      this.mode.set(initial);
    }

    effect(() => {
      const value = this.mode();
      if (!isPlatformBrowser(this.platformId)) return;
      document.documentElement.setAttribute('data-theme', value);
      document.documentElement.classList.toggle('mm-dark', value === 'dark');
      localStorage.setItem(STORAGE_KEY, value);
    });
  }

  toggle(): void {
    this.mode.update((value) => (value === 'light' ? 'dark' : 'light'));
  }

  set(value: ThemeMode): void {
    this.mode.set(value);
  }
}
