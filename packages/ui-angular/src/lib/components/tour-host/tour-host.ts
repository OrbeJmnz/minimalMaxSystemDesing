import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TourService } from '../../services/tour.service';

interface TargetBox {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

@Component({
  selector: 'mm-tour-host',
  imports: [],
  template: `
    @if (tour.active() && box()) {
      <div
        class="fixed inset-0 z-60 pointer-events-none mm-no-print"
        role="dialog"
        aria-modal="true"
        aria-label="Tutorial guiado"
      >
        <div
          class="absolute pointer-events-none transition-all duration-400 ease-out"
          [style.top.px]="box()!.top - 8"
          [style.left.px]="box()!.left - 8"
          [style.width.px]="box()!.width + 16"
          [style.height.px]="box()!.height + 16"
          style="
            border-radius: 14px;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 0 2px var(--color-brand-6);
          "
        ></div>

        <div
          class="absolute z-10 w-[min(360px,calc(100vw-2rem))] rounded-mm-2xl bg-surface-base border border-border-soft shadow-mm-elevated p-5 pointer-events-auto transition-all duration-400 ease-out"
          [style.top.px]="popTop()"
          [style.left.px]="popLeft()"
          style="animation: scaleIn 280ms var(--ease-out) both"
        >
          <header class="flex items-center justify-between mb-2">
            <span
              class="rounded-mm-pill bg-primary-200 text-primary-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            >
              {{ tour.currentIndex() + 1 }} de {{ tour.total() }}
            </span>
            <button
              type="button"
              (click)="tour.skip()"
              class="text-xs text-ink-muted hover:text-ink-dark transition"
            >
              Saltar
            </button>
          </header>
          <h3 class="font-display text-lg font-semibold text-ink-dark">
            {{ tour.currentStep()?.title }}
          </h3>
          <p class="text-sm text-ink-secondary mt-1 leading-relaxed">
            {{ tour.currentStep()?.description }}
          </p>

          <div class="flex items-center justify-between mt-4 gap-3">
            <div class="flex items-center gap-1">
              @for (s of dots(); track $index; let i = $index) {
                <span
                  class="size-1.5 rounded-full transition-all"
                  [class.bg-brand-6]="i === tour.currentIndex()"
                  [class.w-4]="i === tour.currentIndex()"
                  [class.bg-border]="i !== tour.currentIndex()"
                ></span>
              }
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="tour.prev()"
                [disabled]="tour.isFirst()"
                class="rounded-mm-md border border-border bg-surface-base px-3 py-1.5 text-xs font-medium text-ink-dark hover:border-ink-dark disabled:opacity-40 disabled:cursor-not-allowed transition mm-press"
              >
                ← Atrás
              </button>
              <button
                type="button"
                (click)="tour.next()"
                class="rounded-mm-md bg-cta px-3 py-1.5 text-xs font-medium text-cta-fg shadow-mm-sm hover:shadow-mm-elevated transition mm-press"
              >
                {{ tour.isLast() ? 'Finalizar 🎉' : 'Siguiente →' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class TourHostComponent implements AfterViewInit {
  protected readonly tour = inject(TourService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly box = signal<TargetBox | null>(null);
  protected readonly popTop = signal(0);
  protected readonly popLeft = signal(0);

  protected readonly dots = computed(() => Array.from({ length: this.tour.total() }));

  constructor() {
    effect(() => {
      const step = this.tour.currentStep();
      if (!step || !isPlatformBrowser(this.platformId)) {
        this.box.set(null);
        return;
      }
      queueMicrotask(() => this.measure(step));
    });

    if (isPlatformBrowser(this.platformId)) {
      const onResize = () => {
        const step = this.tour.currentStep();
        if (step) this.measure(step);
      };
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onResize, true);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onResize, true);
      });
    }
  }

  ngAfterViewInit(): void {
    const step = this.tour.currentStep();
    if (step && isPlatformBrowser(this.platformId)) {
      queueMicrotask(() => this.measure(step));
    }
  }

  private measure(step: { targetId: string; placement?: string }): void {
    const target = document.getElementById(step.targetId);
    if (!target) {
      this.box.set(null);
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const rect = target.getBoundingClientRect();
    const newBox = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
    this.box.set(newBox);

    const popWidth = Math.min(360, window.innerWidth - 32);
    const placement = step.placement ?? 'bottom';
    let top = rect.bottom + 16;
    let left = rect.left + rect.width / 2 - popWidth / 2;

    if (placement === 'top' || rect.bottom + 200 > window.innerHeight) {
      top = rect.top - 16 - 180;
    }
    if (placement === 'right') {
      top = rect.top + rect.height / 2 - 90;
      left = rect.right + 16;
    }
    if (placement === 'left') {
      top = rect.top + rect.height / 2 - 90;
      left = rect.left - popWidth - 16;
    }

    left = Math.max(16, Math.min(window.innerWidth - popWidth - 16, left));
    top = Math.max(16, Math.min(window.innerHeight - 220, top));

    this.popTop.set(top);
    this.popLeft.set(left);
  }
}
