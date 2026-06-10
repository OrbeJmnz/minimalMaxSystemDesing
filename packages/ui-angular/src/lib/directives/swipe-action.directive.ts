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
 * gesto horizontal. SSR-safe.
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

  protected onDown(event: PointerEvent): void {
    if (this.disabled() || !isPlatformBrowser(this.platformId)) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startOffset = this.offset();
    this.axis = 'none';
    this.dragging.set(true);
  }

  protected onMove(event: PointerEvent): void {
    if (!this.dragging()) return;
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    if (this.axis === 'none') {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      this.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (this.axis === 'x') {
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
  }

  protected onUp(event: PointerEvent): void {
    if (!this.dragging()) return;
    try {
      this.host.nativeElement.releasePointerCapture?.(event.pointerId);
    } catch {
      /* noop */
    }
    this.dragging.set(false);
    if (this.axis !== 'x') {
      this.axis = 'none';
      return;
    }
    this.axis = 'none';

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
    if (!this.dragging()) return;
    try {
      this.host.nativeElement.releasePointerCapture?.(event.pointerId);
    } catch {
      /* noop */
    }
    this.dragging.set(false);
    this.axis = 'none';
    if (this.offset() > -this.actionWidth() * 0.5) this.snapClosed();
    else this.offset.set(-this.actionWidth());
  }

  /** Cierra la fila (API pública para el padre / botón de la bandeja). */
  close(): void {
    this.snapClosed();
  }

  private snapClosed(): void {
    this.offset.set(0);
    this.opened.set(false);
  }
}
