import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** px de desplazamiento horizontal antes de bloquear el eje del gesto. */
const AXIS_LOCK = 8;

/**
 * `mmSwipeActions` — swipe-to-reveal mobile-nativo (estilo iOS Mail).
 *
 * Se aplica al elemento de primer plano de una fila; detrás se renderiza la
 * bandeja de acciones. Al deslizar a la izquierda revela la bandeja (`actionWidth`);
 * un deslizamiento largo más allá del umbral dispara `(commit)` directo.
 * `touch-action: pan-y` deja el scroll vertical al navegador y captura solo el
 * gesto horizontal. SSR-safe · single-pointer (ignora toques secundarios).
 *
 * Tras un gesto horizontal el navegador sintetiza un `click`; el consumidor debe
 * guardarlo con `consumeSwipeClick()` para que un swipe no dispare también el tap
 * de la fila — p.ej. `(click)="sw.consumeSwipeClick() ? null : open()"`.
 */
@Directive({
  selector: '[mmSwipeActions]',
  exportAs: 'mmSwipeActions',
  host: {
    '[style.transform]': 'hostTransform()',
    '[style.transition]': 'hostTransition()',
    '[style.touch-action]': '"pan-y"',
    '(pointerdown)': 'onDown($event)',
    '(pointermove)': 'onMove($event)',
    '(pointerup)': 'onUp($event)',
    '(pointercancel)': 'onCancel($event)',
  },
})
export class SwipeActionsDirective {
  /** Ancho revelado (px) al quedar abierto. */
  readonly actionWidth = input(80);
  readonly disabled = input(false);
  /** Estado abierto/cerrado (two-way; el padre puede cerrar todas las filas). */
  readonly opened = model(false);
  /** Deslizamiento largo más allá del umbral → acción primaria directa. */
  readonly commit = output<void>();
  /** Progreso de revelado 0..1 (para que el consumidor anime la bandeja). */
  readonly progress = output<number>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly offset = signal(0);
  private readonly dragging = signal(false);

  /** Desplazamiento horizontal actual (px, ≤ 0). Útil para revelar la bandeja solo al deslizar. */
  readonly offsetX = this.offset.asReadonly();

  protected readonly hostTransform = computed(() => `translateX(${this.offset()}px)`);
  protected readonly hostTransition = computed(() =>
    this.dragging() ? 'none' : 'transform 280ms var(--ease-out)',
  );

  private startX = 0;
  private startY = 0;
  private startOffset = 0;
  private axis: 'none' | 'x' | 'y' = 'none';
  private activePointerId: number | null = null;
  /** El navegador sintetiza un click tras el gesto; lo marcamos para tragarlo. */
  private pendingClick = false;

  constructor() {
    // El padre puede forzar cierre/apertura vía `opened`; refleja el snap.
    effect(() => {
      const open = this.opened();
      untracked(() => {
        if (this.dragging()) return;
        const target = open ? -this.actionWidth() : 0;
        if (this.offset() !== target) this.offset.set(target);
      });
    });
  }

  /** El consumidor llama esto en su `(click)`: true ⇒ fue un gesto, no abrir. */
  consumeSwipeClick(): boolean {
    if (this.pendingClick) {
      this.pendingClick = false;
      return true;
    }
    return false;
  }

  protected onDown(event: PointerEvent): void {
    if (this.disabled() || !isPlatformBrowser(this.platformId)) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (this.dragging()) return; // ya hay un puntero activo → ignora el segundo
    this.pendingClick = false;
    this.activePointerId = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startOffset = this.offset();
    this.axis = 'none';
    this.dragging.set(true);
  }

  protected onMove(event: PointerEvent): void {
    if (!this.dragging() || event.pointerId !== this.activePointerId) return;
    // Si se deshabilita a mitad del gesto (cruce de breakpoint), aborta limpio.
    if (this.disabled()) {
      this.endDrag();
      this.snapClosed();
      return;
    }
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    if (this.axis === 'none') {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      this.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (this.axis === 'x') {
        this.pendingClick = true; // gesto horizontal real → traga el click siguiente
        try {
          this.host.nativeElement.setPointerCapture?.(event.pointerId);
        } catch {
          /* noop */
        }
      }
    }
    if (this.axis !== 'x') return;

    const max = this.actionWidth();
    let next = this.startOffset + dx;
    if (next > 0) next *= 0.3; // resistencia al cerrar de más (derecha)
    if (next < -max) next = -max + (next + max) * 0.4; // rubber-band al abrir de más
    this.offset.set(next);
    this.progress.emit(Math.min(1, Math.max(0, -next / max)));
  }

  protected onUp(event: PointerEvent): void {
    if (!this.dragging() || event.pointerId !== this.activePointerId) return;
    const wasX = this.axis === 'x';
    this.endDrag();
    if (!wasX) return;

    const max = this.actionWidth();
    const o = this.offset();
    if (o <= -max * 1.15) {
      this.commit.emit();
      this.snapClosed();
    } else if (o <= -max * 0.5) {
      this.offset.set(-max);
      this.opened.set(true);
    } else {
      this.snapClosed();
    }
  }

  protected onCancel(event: PointerEvent): void {
    if (!this.dragging() || event.pointerId !== this.activePointerId) return;
    this.endDrag();
    if (this.offset() > -this.actionWidth() * 0.5) this.snapClosed();
    else this.offset.set(-this.actionWidth());
  }

  /** Cierra la fila (API pública para el padre / botón de la bandeja). */
  close(): void {
    this.snapClosed();
  }

  private endDrag(): void {
    try {
      if (this.activePointerId !== null) {
        this.host.nativeElement.releasePointerCapture?.(this.activePointerId);
      }
    } catch {
      /* noop */
    }
    this.dragging.set(false);
    this.axis = 'none';
    this.activePointerId = null;
  }

  private snapClosed(): void {
    this.offset.set(0);
    this.opened.set(false);
  }
}
