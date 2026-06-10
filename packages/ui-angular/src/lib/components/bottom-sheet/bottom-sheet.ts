import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { OverlayService } from '../../services/overlay.service';

let sheetCounter = 0;

/** ms del slide-out al cerrar (debe coincidir con la transición del panel). */
const EXIT_MS = 340;
/** px de arrastre vertical para descartar al soltar. */
const DISMISS_DISTANCE = 110;
/** px/ms de velocidad descendente que descarta aunque no se cruce la distancia. */
const DISMISS_VELOCITY = 0.55;

/**
 * `mm-bottom-sheet` — hoja modal que sube desde abajo (patrón mobile-nativo).
 *
 * - Grabber + **drag-to-dismiss** (distancia o velocidad de flick), rubber-band al arrastrar hacia arriba.
 * - Backdrop con blur que se desvanece proporcional al arrastre.
 * - Reusa `OverlayService` (scroll-lock + stacking de escape) y `CdkTrapFocus`.
 * - SSR-safe (toda la física vive tras `isPlatformBrowser`).
 *
 * El padre controla `[open]`; el sheet emite `(close)` al descartarse (grabber, backdrop, escape).
 */
@Component({
  selector: 'mm-bottom-sheet',
  imports: [CdkTrapFocus],
  template: `
    @if (render()) {
      <div
        class="fixed inset-0 z-50 flex items-end justify-center mm-no-print"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="title() ? titleId : null"
      >
        <button
          type="button"
          (click)="requestClose()"
          aria-label="Cerrar"
          class="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default transition-opacity duration-300"
          [style.opacity]="backdropOpacity()"
        ></button>

        <section
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          class="relative w-full max-w-lg max-h-[88dvh] flex flex-col rounded-t-mm-3xl bg-surface-base border-t border-border-soft shadow-mm-elevated overflow-hidden will-change-transform"
          [style.transform]="shown() ? 'translateY(' + dragOffset() + 'px)' : 'translateY(101%)'"
          [style.transition]="dragging() ? 'none' : 'transform ' + exitMs + 'ms var(--ease-out)'"
          style="padding-bottom: env(safe-area-inset-bottom)"
        >
          <div
            class="shrink-0 grid place-items-center pt-3 pb-1 cursor-grab active:cursor-grabbing select-none touch-none"
            (pointerdown)="onHandleDown($event)"
            (pointermove)="onHandleMove($event)"
            (pointerup)="onHandleUp($event)"
            (pointercancel)="onHandleUp($event)"
          >
            <span class="block h-1.5 w-11 rounded-mm-pill bg-border" aria-hidden="true"></span>
          </div>

          @if (title()) {
            <header class="shrink-0 flex items-start justify-between gap-3 px-5 pb-3">
              <div class="min-w-0">
                @if (eyebrow()) {
                  <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                    {{ eyebrow() }}
                  </p>
                }
                <h3 [id]="titleId" class="font-display text-lg font-semibold text-ink-dark truncate">
                  {{ title() }}
                </h3>
              </div>
              <button
                type="button"
                (click)="requestClose()"
                aria-label="Cerrar"
                class="-mt-0.5 size-9 shrink-0 rounded-mm-md grid place-items-center text-ink-muted hover:text-ink-dark hover:bg-surface-secondary transition mm-press"
              >
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12"></path>
                </svg>
              </button>
            </header>
          }

          <div class="flex-1 min-h-0 overflow-y-auto mm-scroll-thin px-5 pb-5">
            <ng-content></ng-content>
          </div>

          <ng-content select="[slot=footer]"></ng-content>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class BottomSheetComponent {
  readonly open = input.required<boolean>();
  readonly title = input<string>('');
  readonly eyebrow = input<string>('');
  readonly close = output<void>();

  protected readonly exitMs = EXIT_MS;
  protected readonly titleId = `mm-sheet-title-${++sheetCounter}`;

  private readonly overlay = inject(OverlayService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly id = `sheet-${sheetCounter}`;

  /** Montado en el DOM (se mantiene durante el slide-out). */
  protected readonly render = signal(false);
  /** Panel en su posición de reposo (translateY 0) vs fuera de pantalla. */
  protected readonly shown = signal(false);
  /** Arrastre activo → desactiva la transición para seguir el dedo 1:1. */
  protected readonly dragging = signal(false);
  /** Desplazamiento descendente actual en px (≥ rubber-band negativo pequeño). */
  protected readonly dragOffset = signal(0);

  protected readonly backdropOpacity = computed(() =>
    this.shown() ? Math.max(0, 1 - this.dragOffset() / 320) : 0,
  );

  private startY = 0;
  private lastY = 0;
  private lastT = 0;
  private velocity = 0;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;
  private raf = 0;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (!isPlatformBrowser(this.platformId)) {
        this.render.set(isOpen);
        this.shown.set(isOpen);
        return;
      }
      untracked(() => this.applyOpen(isOpen));
    });

    this.destroyRef.onDestroy(() => {
      this.clearTimers();
      untracked(() => this.overlay.release(this.id));
    });
  }

  private applyOpen(isOpen: boolean): void {
    this.clearTimers();
    if (isOpen) {
      this.dragOffset.set(0);
      this.dragging.set(false);
      this.render.set(true);
      this.overlay.acquire(this.id);
      this.raf = requestAnimationFrame(() =>
        (this.raf = requestAnimationFrame(() => this.shown.set(true))),
      );
    } else {
      this.overlay.release(this.id);
      this.shown.set(false);
      this.exitTimer = setTimeout(() => {
        this.render.set(false);
        this.dragOffset.set(0);
      }, EXIT_MS);
    }
  }

  private clearTimers(): void {
    if (this.exitTimer) clearTimeout(this.exitTimer);
    this.exitTimer = null;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  protected requestClose(): void {
    // Inicia el slide-out de inmediato y notifica al padre (que pondrá open=false).
    this.shown.set(false);
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open() && this.overlay.isTop(this.id)) this.requestClose();
  }

  protected onHandleDown(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    } catch {
      /* noop */
    }
    this.dragging.set(true);
    this.startY = event.clientY;
    this.lastY = event.clientY;
    this.lastT = event.timeStamp;
    this.velocity = 0;
  }

  protected onHandleMove(event: PointerEvent): void {
    if (!this.dragging()) return;
    const dy = event.clientY - this.startY;
    // Arrastre hacia arriba → rubber-band amortiguado (máx -48px).
    const offset = dy < 0 ? Math.max(dy * 0.25, -48) : dy;
    this.dragOffset.set(offset);

    const dt = event.timeStamp - this.lastT;
    if (dt > 0) this.velocity = (event.clientY - this.lastY) / dt;
    this.lastY = event.clientY;
    this.lastT = event.timeStamp;
  }

  protected onHandleUp(event: PointerEvent): void {
    if (!this.dragging()) return;
    try {
      (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    } catch {
      /* noop */
    }
    this.dragging.set(false);

    const shouldDismiss =
      this.dragOffset() > DISMISS_DISTANCE || this.velocity > DISMISS_VELOCITY;
    if (shouldDismiss) {
      this.requestClose();
    } else {
      this.dragOffset.set(0);
    }
  }
}
