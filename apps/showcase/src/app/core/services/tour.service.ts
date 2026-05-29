import { Injectable, computed, signal } from '@angular/core';

export interface TourStep {
  readonly targetId: string;
  readonly title: string;
  readonly description: string;
  readonly placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly _steps = signal<readonly TourStep[]>([]);
  private readonly _index = signal<number>(-1);

  readonly active = computed(() => this._index() >= 0);
  readonly currentStep = computed(() => {
    const idx = this._index();
    return idx >= 0 ? (this._steps()[idx] ?? null) : null;
  });
  readonly currentIndex = computed(() => this._index());
  readonly total = computed(() => this._steps().length);
  readonly isFirst = computed(() => this._index() === 0);
  readonly isLast = computed(() => this._index() === this._steps().length - 1);

  start(steps: readonly TourStep[]): void {
    this._steps.set(steps);
    this._index.set(0);
  }

  next(): void {
    if (this.isLast()) {
      this.complete();
      return;
    }
    this._index.update((i) => i + 1);
  }

  prev(): void {
    this._index.update((i) => Math.max(0, i - 1));
  }

  skip(): void {
    this.complete();
  }

  complete(): void {
    this._index.set(-1);
    this._steps.set([]);
  }
}
