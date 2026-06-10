import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface WheelItem {
  readonly value: string | number;
  readonly label: string;
}

/** Grados por ítem en el cilindro. */
const ANGLE = 18;
/** Constante de tiempo de la desaceleración del fling (ms). */
const FLING_TAU = 320;
/** Velocidad (px/ms) por debajo de la cual el fling cede al snap. */
const MIN_FLING_V = 0.04;
/** Constante de tiempo del enganche al ítem más cercano (ms). */
const SNAP_TAU = 100;
/** Cap de dt por frame para que un tab en background no dé un salto. */
const MAX_DT = 40;

/**
 * `mm-wheel-picker` — rueda estilo iOS con inercia táctil.
 *
 * El cilindro se arma con UNA sola transform animada sobre el "stage"
 * (`rotateX`), mientras cada ítem lleva una transform estática alrededor del
 * eje; `backface-visibility:hidden` oculta la cara trasera → 60fps sin tocar N
 * bindings por frame. La banda central marca la selección y el ítem centrado es
 * el valor. Física: arrastre 1:1 → fling con fricción exponencial → snap.
 *
 * SSR-safe (sin rAF ni listeners en servidor) · teclado (↑↓ Home End PgUp/Dn) ·
 * rueda de mouse en desktop · `[(value)]` con `model`.
 */
@Component({
  selector: 'mm-wheel-picker',
  imports: [],
  template: `
    <div class="relative select-none" [style.height.px]="viewportHeight()">
      <!-- Banda central de selección -->
      <div
        class="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 rounded-mm-sm border-y border-border bg-brand-6/5"
        [style.height.px]="itemHeight()"
      ></div>

      <!-- Viewport 3D -->
      <div
        #vp
        tabindex="0"
        role="slider"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="items().length - 1"
        [attr.aria-valuenow]="selectedIndex()"
        [attr.aria-valuetext]="items()[selectedIndex()]?.label"
        class="absolute inset-0 cursor-grab touch-none outline-none focus-visible:ring-2 focus-visible:ring-brand-6/40 rounded-mm-md active:cursor-grabbing"
        style="
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
          mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
        "
        [style.perspective.px]="perspective()"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
        (keydown)="onKeydown($event)"
      >
        <div
          class="absolute inset-x-0 top-1/2 transform-3d"
          [style.transform]="'rotateX(' + stageAngle() + 'deg)'"
        >
          @for (item of items(); track item.value; let i = $index) {
            <div
              class="absolute inset-x-0 grid place-items-center font-mono text-base tabular-nums transition-colors duration-150 backface-hidden"
              [style.height.px]="itemHeight()"
              [style.marginTop.px]="-itemHeight() / 2"
              [style.transform]="itemTransforms()[i]"
              [class.text-ink-dark]="i === selectedIndex()"
              [class.font-semibold]="i === selectedIndex()"
              [class.text-ink-muted]="i !== selectedIndex()"
            >
              {{ item.label }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class WheelPickerComponent {
  readonly items = input.required<readonly WheelItem[]>();
  readonly value = model<string | number | null>(null);
  readonly itemHeight = input(38);
  /** Cantidad de filas visibles (impar recomendado). */
  readonly visible = input(5);
  readonly ariaLabel = input<string>('');

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly vp = viewChild<ElementRef<HTMLElement>>('vp');

  /** Posición continua en px (0 = primer ítem centrado). */
  protected readonly position = signal(0);
  protected readonly dragging = signal(false);

  protected readonly viewportHeight = computed(() => this.itemHeight() * this.visible());
  protected readonly perspective = computed(() => this.viewportHeight() * 3);

  /** Radio del cilindro derivado de itemHeight y ANGLE. */
  private readonly radius = computed(
    () => this.itemHeight() / 2 / Math.tan((ANGLE * Math.PI) / 360),
  );

  protected readonly stageAngle = computed(
    () => -(this.position() / this.itemHeight()) * ANGLE,
  );

  /** Transform estática por ítem (recalcula solo si cambian items o itemHeight). */
  protected readonly itemTransforms = computed(() => {
    const r = this.radius();
    return this.items().map((_, i) => `rotateX(${i * ANGLE}deg) translateZ(${r}px)`);
  });

  protected readonly selectedIndex = computed(() =>
    this.clampIndex(Math.round(this.position() / this.itemHeight())),
  );

  private selfUpdating = false;
  private animating = false;
  private raf = 0;
  private phase: 'fling' | 'snap' = 'snap';
  private vel = 0;
  private lastFrame = 0;
  private startY = 0;
  private startPos = 0;
  private moveLastY = 0;
  private moveLastT = 0;
  private wheelTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Sincroniza la posición al valor externo cuando no hay interacción.
    effect(() => {
      const v = this.value();
      const its = this.items();
      untracked(() => {
        if (this.selfUpdating || this.dragging() || this.animating) return;
        const idx = its.findIndex((it) => it.value === v);
        this.position.set(this.clampIndex(idx < 0 ? 0 : idx) * this.itemHeight());
      });
    });

    // Posición inicial correcta tras el primer render (sin animación).
    afterNextRender(() => {
      const idx = this.items().findIndex((it) => it.value === this.value());
      this.position.set(this.clampIndex(idx < 0 ? 0 : idx) * this.itemHeight());
    });

    this.destroyRef.onDestroy(() => this.stopAnim());
  }

  private clampIndex(i: number): number {
    const n = this.items().length;
    if (n === 0) return 0;
    return Math.min(Math.max(i, 0), n - 1);
  }

  private get maxPos(): number {
    return Math.max(0, this.items().length - 1) * this.itemHeight();
  }

  // ---- Pointer / arrastre -------------------------------------------------

  protected onPointerDown(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopAnim();
    try {
      this.vp()?.nativeElement.setPointerCapture?.(event.pointerId);
    } catch {
      /* pointer capture no disponible (p.ej. eventos sintéticos) */
    }
    this.dragging.set(true);
    this.startY = event.clientY;
    this.startPos = this.position();
    this.moveLastY = event.clientY;
    this.moveLastT = event.timeStamp;
    this.vel = 0;
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) return;
    const raw = this.startPos - (event.clientY - this.startY);
    this.position.set(this.rubberBand(raw));

    const dt = event.timeStamp - this.moveLastT;
    if (dt > 0) {
      // velocidad de la posición (px/ms): la posición sube cuando el dedo sube
      this.vel = -(event.clientY - this.moveLastY) / dt;
      this.moveLastY = event.clientY;
      this.moveLastT = event.timeStamp;
    }
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.dragging()) return;
    try {
      this.vp()?.nativeElement.releasePointerCapture?.(event.pointerId);
    } catch {
      /* noop */
    }
    this.dragging.set(false);
    this.vel = Math.max(-6, Math.min(6, this.vel));
    this.phase = Math.abs(this.vel) > MIN_FLING_V ? 'fling' : 'snap';
    this.startAnim();
  }

  /** Amortigua la posición fuera de [0, maxPos] (efecto rubber-band). */
  private rubberBand(p: number): number {
    const max = this.maxPos;
    if (p < 0) return p * 0.35;
    if (p > max) return max + (p - max) * 0.35;
    return p;
  }

  // ---- Teclado / rueda ----------------------------------------------------

  protected onKeydown(event: KeyboardEvent): void {
    let target = this.selectedIndex();
    switch (event.key) {
      case 'ArrowUp':
        target -= 1;
        break;
      case 'ArrowDown':
        target += 1;
        break;
      case 'PageUp':
        target -= 3;
        break;
      case 'PageDown':
        target += 3;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = this.items().length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.animateToIndex(this.clampIndex(target));
  }

  private onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.stopAnim();
    this.position.set(this.rubberBand(this.position() + event.deltaY));
    if (this.wheelTimer) clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => {
      this.phase = 'snap';
      this.startAnim();
    }, 110);
  };

  // ---- Animación (fling + snap) -------------------------------------------

  private animateToIndex(index: number): void {
    this.stopAnim();
    this.vel = 0;
    this.phase = 'snap';
    this.snapTargetIndex = index;
    this.startAnim();
  }

  private snapTargetIndex: number | null = null;

  private startAnim(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.settle();
      return;
    }
    this.animating = true;
    this.lastFrame = 0;
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number): void => {
    if (this.lastFrame === 0) this.lastFrame = now;
    const dt = Math.min(now - this.lastFrame, MAX_DT) || 16;
    this.lastFrame = now;
    const ih = this.itemHeight();
    const max = this.maxPos;

    if (this.phase === 'fling') {
      let p = this.position() + this.vel * dt;
      if (p < 0) {
        p *= 0.5;
        this.vel *= 0.8;
      } else if (p > max) {
        p = max + (p - max) * 0.5;
        this.vel *= 0.8;
      }
      this.position.set(p);
      this.vel *= Math.exp(-dt / FLING_TAU);
      if (Math.abs(this.vel) < MIN_FLING_V) {
        this.phase = 'snap';
        this.snapTargetIndex = null;
      }
    } else {
      const targetIdx =
        this.snapTargetIndex ?? this.clampIndex(Math.round(this.position() / ih));
      const target = targetIdx * ih;
      const p = this.position();
      const next = p + (target - p) * (1 - Math.exp(-dt / SNAP_TAU));
      if (Math.abs(target - next) < 0.4) {
        this.position.set(target);
        this.commitFromPosition();
        this.stopAnim();
        return;
      }
      this.position.set(next);
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  private settle(): void {
    // Camino SSR/sin-rAF: enganche instantáneo al ítem más cercano.
    const idx = this.snapTargetIndex ?? this.clampIndex(Math.round(this.position() / this.itemHeight()));
    this.position.set(idx * this.itemHeight());
    this.commitFromPosition();
  }

  private commitFromPosition(): void {
    const idx = this.selectedIndex();
    const next = this.items()[idx]?.value ?? null;
    if (next !== this.value()) {
      this.selfUpdating = true;
      this.value.set(next);
      this.selfUpdating = false;
    }
  }

  private stopAnim(): void {
    this.animating = false;
    this.snapTargetIndex = null;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  // Listener de rueda con passive:false (Angular no permite la opción en bindings).
  private readonly _wheelInit = afterNextRender(() => {
    const el = this.vp()?.nativeElement;
    el?.addEventListener('wheel', this.onWheel, { passive: false });
    this.destroyRef.onDestroy(() => el?.removeEventListener('wheel', this.onWheel));
  });
}
