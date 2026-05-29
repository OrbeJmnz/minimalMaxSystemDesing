import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

interface Task {
  readonly id: string;
  readonly title: string;
  readonly tone: string;
}

interface GalleryShot {
  readonly src: string;
  readonly alt: string;
  readonly tag?: string;
}

@Component({
  selector: 'mm-multimedia',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './multimedia.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class MultimediaComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly tasks = signal<readonly Task[]>([
    { id: 't1', title: 'Diseñar landing del producto', tone: 'from-brand-6 to-primary-500' },
    { id: 't2', title: 'Migrar tokens al design system', tone: 'from-brand-pink to-fuchsia-500' },
    { id: 't3', title: 'Agregar tests E2E al checkout', tone: 'from-emerald-500 to-teal-500' },
    {
      id: 't4',
      title: 'Auditar accesibilidad de los modales',
      tone: 'from-amber-500 to-orange-500',
    },
    { id: 't5', title: 'Preparar release notes v0.3', tone: 'from-violet-500 to-indigo-500' },
  ]);

  protected readonly draggingId = signal<string | null>(null);
  protected readonly overId = signal<string | null>(null);
  protected readonly dragOffset = signal({ x: 0, y: 0 });
  private startPos: { x: number; y: number } | null = null;

  protected readonly images: readonly GalleryShot[] = [
    {
      src: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=600&q=70&auto=format&fit=crop',
      alt: 'Galaxia espiral',
      tag: 'Cosmos',
    },
    {
      src: 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f?w=600&q=70&auto=format&fit=crop',
      alt: 'Onda violeta',
      tag: 'Abstracto',
    },
    {
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=70&auto=format&fit=crop',
      alt: 'Estrellas y nebulosa',
      tag: 'Cosmos',
    },
    {
      src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=70&auto=format&fit=crop',
      alt: 'Ciudad neón',
      tag: 'Urbano',
    },
    {
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=70&auto=format&fit=crop',
      alt: 'Ola del océano',
      tag: 'Naturaleza',
    },
    {
      src: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=600&q=70&auto=format&fit=crop',
      alt: 'Nebulosa rosa',
      tag: 'Cosmos',
    },
  ];

  protected readonly masonryImages: readonly (GalleryShot & { height: number })[] = [
    {
      src: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=500&q=70&auto=format&fit=crop',
      alt: 'Montaña al atardecer',
      height: 280,
    },
    {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=70&auto=format&fit=crop',
      alt: 'Circuito tech',
      height: 200,
    },
    {
      src: 'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?w=500&q=70&auto=format&fit=crop',
      alt: 'Bosque verde',
      height: 360,
    },
    {
      src: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=500&q=70&auto=format&fit=crop',
      alt: 'Sky reflejo',
      height: 240,
    },
    {
      src: 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=500&q=70&auto=format&fit=crop',
      alt: 'Cordillera con nubes',
      height: 320,
    },
    {
      src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=70&auto=format&fit=crop',
      alt: 'Carretera infinita',
      height: 220,
    },
    {
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&q=70&auto=format&fit=crop',
      alt: 'Ola al amanecer',
      height: 280,
    },
    {
      src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&q=70&auto=format&fit=crop',
      alt: 'Neon city',
      height: 200,
    },
  ];

  protected readonly bentoImages: readonly GalleryShot[] = [
    {
      src: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=900&q=70&auto=format&fit=crop',
      alt: 'Galaxia espiral grande',
    },
    {
      src: 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f?w=600&q=70&auto=format&fit=crop',
      alt: 'Onda violeta',
    },
    {
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=70&auto=format&fit=crop',
      alt: 'Estrellas',
    },
    {
      src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=70&auto=format&fit=crop',
      alt: 'Ciudad neón',
    },
    {
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=70&auto=format&fit=crop',
      alt: 'Ola del océano',
    },
  ];

  protected readonly polaroidImages: readonly (GalleryShot & { rotation: string })[] = [
    {
      src: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&q=70&auto=format&fit=crop',
      alt: 'Atardecer',
      rotation: '-rotate-3',
    },
    {
      src: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400&q=70&auto=format&fit=crop',
      alt: 'Reflejo',
      rotation: 'rotate-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?w=400&q=70&auto=format&fit=crop',
      alt: 'Bosque',
      rotation: '-rotate-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=400&q=70&auto=format&fit=crop',
      alt: 'Cumbres',
      rotation: 'rotate-3',
    },
  ];

  protected readonly carouselImages = this.masonryImages;

  protected readonly previewIndex = signal<number | null>(null);
  protected readonly previewOpen = signal(false);
  protected readonly previewZoom = signal<number>(1);
  protected readonly previewPan = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  protected readonly panning = signal<boolean>(false);
  private previewSource: readonly GalleryShot[] = this.images;
  private panStart: { x: number; y: number } | null = null;

  protected get currentPreviewList(): readonly GalleryShot[] {
    return this.previewSource;
  }

  protected zoomIn(): void {
    this.previewZoom.update((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100));
  }

  protected zoomOut(): void {
    this.previewZoom.update((z) => Math.max(1, Math.round((z - 0.25) * 100) / 100));
    if (this.previewZoom() === 1) this.previewPan.set({ x: 0, y: 0 });
  }

  protected resetZoom(): void {
    this.previewZoom.set(1);
    this.previewPan.set({ x: 0, y: 0 });
  }

  protected onPreviewWheel(event: WheelEvent): void {
    if (!this.previewOpen()) return;
    event.preventDefault();
    if (event.deltaY < 0) this.zoomIn();
    else this.zoomOut();
  }

  protected onPanStart(event: PointerEvent): void {
    if (this.previewZoom() <= 1) return;
    this.panStart = {
      x: event.clientX - this.previewPan().x,
      y: event.clientY - this.previewPan().y,
    };
    this.panning.set(true);
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  protected onPanMove(event: PointerEvent): void {
    if (!this.panStart) return;
    this.previewPan.set({
      x: event.clientX - this.panStart.x,
      y: event.clientY - this.panStart.y,
    });
  }

  protected onPanEnd(): void {
    this.panStart = null;
    this.panning.set(false);
  }

  protected onPointerDown(id: string, event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    this.draggingId.set(id);
    this.overId.set(id);
    this.startPos = { x: event.clientX, y: event.clientY };
    this.dragOffset.set({ x: 0, y: 0 });
  }

  @HostListener('document:pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    if (!this.draggingId() || !this.startPos) return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.dragOffset.set({
      x: event.clientX - this.startPos.x,
      y: event.clientY - this.startPos.y,
    });

    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const item = target?.closest<HTMLElement>('[data-task-id]');
    const id = item?.dataset['taskId'] ?? null;
    if (id && id !== this.overId() && id !== this.draggingId()) {
      this.overId.set(id);
    }
  }

  @HostListener('document:pointerup')
  @HostListener('document:pointercancel')
  protected onPointerUp(): void {
    const sourceId = this.draggingId();
    const targetId = this.overId();
    if (sourceId && targetId && sourceId !== targetId) {
      this.tasks.update((items) => {
        const source = items.find((task) => task.id === sourceId);
        if (!source) return items;
        const filtered = items.filter((task) => task.id !== sourceId);
        const targetIndex = filtered.findIndex((task) => task.id === targetId);
        filtered.splice(targetIndex < 0 ? filtered.length : targetIndex, 0, source);
        return filtered;
      });
    }
    this.draggingId.set(null);
    this.overId.set(null);
    this.dragOffset.set({ x: 0, y: 0 });
    this.startPos = null;
  }

  protected openPreview(index: number, source: readonly GalleryShot[] = this.images): void {
    this.previewSource = source;
    this.previewIndex.set(index);
    this.previewOpen.set(true);
    this.resetZoom();
  }

  protected closePreview(): void {
    this.previewOpen.set(false);
  }

  protected nextImage(): void {
    if (this.previewIndex() === null) return;
    this.previewIndex.update((i) => ((i ?? 0) + 1) % this.previewSource.length);
    this.resetZoom();
  }

  protected prevImage(): void {
    if (this.previewIndex() === null) return;
    this.previewIndex.update(
      (i) => ((i ?? 0) - 1 + this.previewSource.length) % this.previewSource.length,
    );
    this.resetZoom();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.previewOpen()) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prevImage();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closePreview();
    }
  }

  protected readonly snippetsDragDrop: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'multimedia.html',
      code: `<ul class="flex flex-col gap-2 max-w-2xl select-none" [class.touch-none]="draggingId()">
  @for (task of tasks(); track task.id; let i = $index) {

    <!-- Indicator (línea pulsante) cuando el cursor está sobre otra row -->
    @if (overId() === task.id && draggingId() && draggingId() !== task.id) {
      <div
        class="relative h-1 rounded-mm-pill bg-linear-to-r from-brand-6
               via-primary-500 to-brand-pink shadow-mm-brand"
        style="animation: mm-drop-indicator 1.2s var(--ease-out) infinite"
        aria-hidden="true"
      ></div>
    }

    <li
      [attr.data-task-id]="task.id"
      [style.transform]="
        draggingId() === task.id
          ? 'translate3d(' + dragOffset().x + 'px, ' + dragOffset().y + 'px, 0) rotate(2deg) scale(1.03)'
          : ''
      "
      [style.transition]="draggingId() === task.id ? 'none' : 'all 220ms var(--ease-out)'"
      class="flex items-center gap-3 p-3 rounded-mm-xl border bg-surface-base"
      [class.shadow-mm-elevated]="draggingId() === task.id"
      [class.border-brand-6]="draggingId() === task.id"
      [class.opacity-60]="draggingId() && draggingId() !== task.id && overId() !== task.id"
    >
      <button
        type="button"
        aria-label="Mover tarea"
        (pointerdown)="onPointerDown(task.id, $event)"
        class="p-1 -m-1 text-ink-muted cursor-grab active:cursor-grabbing touch-none"
      >
        <svg class="size-5"><!-- grip-vertical icon --></svg>
      </button>
      <span [class]="'size-8 rounded-mm-md grid place-items-center text-white
                       bg-linear-to-br ' + task.tone">{{ i + 1 }}</span>
      <p class="flex-1 text-sm font-medium text-ink-dark">{{ task.title }}</p>
    </li>
  }
</ul>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'multimedia.ts',
      code: `interface Task { readonly id: string; readonly title: string; readonly tone: string; }

protected readonly tasks = signal<readonly Task[]>([...]);
protected readonly draggingId = signal<string | null>(null);
protected readonly overId     = signal<string | null>(null);
protected readonly dragOffset = signal({ x: 0, y: 0 });
private startPos: { x: number; y: number } | null = null;

protected onPointerDown(id: string, event: PointerEvent): void {
  if (event.button !== 0 && event.pointerType === 'mouse') return;
  event.preventDefault();
  this.draggingId.set(id);
  this.overId.set(id);
  this.startPos = { x: event.clientX, y: event.clientY };
  this.dragOffset.set({ x: 0, y: 0 });
}

@HostListener('document:pointermove', ['$event'])
protected onPointerMove(event: PointerEvent): void {
  if (!this.draggingId() || !this.startPos) return;
  this.dragOffset.set({
    x: event.clientX - this.startPos.x,
    y: event.clientY - this.startPos.y,
  });
  const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
  const id = target?.closest<HTMLElement>('[data-task-id]')?.dataset['taskId'] ?? null;
  if (id && id !== this.overId() && id !== this.draggingId()) this.overId.set(id);
}

@HostListener('document:pointerup')
protected onPointerUp(): void {
  const src = this.draggingId();
  const tgt = this.overId();
  if (src && tgt && src !== tgt) {
    this.tasks.update((items) => {
      const source = items.find((t) => t.id === src);
      if (!source) return items;
      const filtered = items.filter((t) => t.id !== src);
      const idx = filtered.findIndex((t) => t.id === tgt);
      filtered.splice(idx < 0 ? filtered.length : idx, 0, source);
      return filtered;
    });
  }
  this.draggingId.set(null);
  this.overId.set(null);
  this.dragOffset.set({ x: 0, y: 0 });
  this.startPos = null;
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css',
      code: `/* Línea pulsante "Soltar aquí" entre items */
@keyframes mm-drop-indicator {
  0%, 100% { opacity: 1;   transform: scaleX(1); }
  50%      { opacity: 0.7; transform: scaleX(0.96); }
}`,
    },
  ];

  protected readonly snippetsGridUniforme: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'multimedia.html',
      code: `<!-- Grid clásico — 2 col mobile, 3 col desktop, aspect-square en cada tile. -->
<div data-stagger class="grid grid-cols-2 md:grid-cols-3 gap-3">
  @for (image of images; track image.src; let i = $index) {
    <button
      type="button"
      (click)="openPreview(i, images)"
      [attr.aria-label]="'Ver ' + image.alt + ' en grande'"
      class="group relative aspect-square rounded-mm-xl overflow-hidden
             shadow-mm-sm mm-hover-lift cursor-zoom-in"
    >
      <img
        [src]="image.src"
        [alt]="image.alt"
        loading="lazy"
        class="size-full object-cover transition-transform duration-500
               group-hover:scale-110"
      />
      <!-- Overlay con caption — sólo visible en hover -->
      <span class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity"></span>
      <span class="absolute bottom-3 left-3 right-3 flex items-center justify-between
                   text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="truncate">{{ image.alt }}</span>
        @if (image.tag) {
          <span class="rounded-mm-pill bg-white/20 backdrop-blur px-2 py-0.5 text-[10px]">
            {{ image.tag }}
          </span>
        }
      </span>
    </button>
  }
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css',
      code: `/* mm-hover-lift — translate-Y al hover con sombra elevada */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* data-stagger — entrada escalonada de los hijos (definida en app shell) */`,
    },
  ];

  protected readonly snippetsMasonryPinterest: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'multimedia.html',
      code: `<!-- CSS columns puro — sin JS de layout. Cada hijo: break-inside-avoid + mb-3. -->
<div class="columns-2 md:columns-3 gap-3 &>*:mb-3 &>*:break-inside-avoid">
  @for (image of masonryImages; track image.src; let i = $index) {
    <button
      type="button"
      (click)="openPreview(i, masonryImages)"
      [attr.aria-label]="'Ver ' + image.alt"
      class="group relative w-full rounded-mm-xl overflow-hidden
             shadow-mm-sm mm-hover-lift cursor-zoom-in block"
    >
      <img
        [src]="image.src"
        [alt]="image.alt"
        loading="lazy"
        [style.height.px]="image.height"
        class="w-full object-cover transition-transform duration-500
               group-hover:scale-110"
      />
      <span class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent
                   to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
    </button>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'multimedia.ts',
      code: `// Cada item lleva una altura distinta — esa es la clave del look Pinterest.
protected readonly masonryImages: readonly (GalleryShot & { height: number })[] = [
  { src: '...', alt: 'Montaña al atardecer', height: 280 },
  { src: '...', alt: 'Circuito tech',         height: 200 },
  { src: '...', alt: 'Bosque verde',          height: 360 },
  // ...
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsBentoGrid: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'multimedia.html',
      code: `<!-- Hero (col-span-2 row-span-2) + 3 thumbs (col-span-2 + 2 sueltos). -->
<div class="grid grid-cols-4 grid-rows-2 gap-3 h-[460px]">
  <button
    type="button"
    (click)="openPreview(0, bentoImages)"
    class="group relative col-span-2 row-span-2 rounded-mm-2xl overflow-hidden
           shadow-mm-sm mm-hover-lift cursor-zoom-in"
  >
    <img [src]="bentoImages[0].src" [alt]="bentoImages[0].alt" loading="lazy"
         class="size-full object-cover transition-transform duration-500
                group-hover:scale-105" />
    <span class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></span>
    <span class="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-white text-left">
      <span class="rounded-mm-pill bg-white/20 backdrop-blur px-2.5 py-0.5
                   text-[10px] font-semibold uppercase tracking-wider self-start">
        Featured
      </span>
      <span class="font-display text-xl font-medium">{{ bentoImages[0].alt }}</span>
    </span>
  </button>

  <button (click)="openPreview(1, bentoImages)"
          class="col-span-2 rounded-mm-2xl overflow-hidden mm-hover-lift">
    <img [src]="bentoImages[1].src" [alt]="bentoImages[1].alt"
         class="size-full object-cover" />
  </button>

  <button (click)="openPreview(2, bentoImages)" class="rounded-mm-2xl overflow-hidden mm-hover-lift">
    <img [src]="bentoImages[2].src" class="size-full object-cover" />
  </button>
  <button (click)="openPreview(3, bentoImages)" class="rounded-mm-2xl overflow-hidden mm-hover-lift">
    <img [src]="bentoImages[3].src" class="size-full object-cover" />
  </button>
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsCarouselScrollSnap: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'multimedia.html',
      code: `<!-- Sin JS. snap-x + snap-mandatory + snap-center hacen toda la magia. -->
<div
  class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6
         [&::-webkit-scrollbar]:h-1.5
         [&::-webkit-scrollbar-thumb]:bg-border
         [&::-webkit-scrollbar-thumb]:rounded-full"
>
  @for (image of carouselImages; track image.src; let i = $index) {
    <button
      type="button"
      (click)="openPreview(i, carouselImages)"
      [attr.aria-label]="'Ver ' + image.alt"
      class="group relative shrink-0 w-72 aspect-4/5 snap-center
             rounded-mm-2xl overflow-hidden shadow-mm-sm mm-hover-lift cursor-zoom-in"
    >
      <img [src]="image.src" [alt]="image.alt" loading="lazy"
           class="size-full object-cover transition-transform duration-500
                  group-hover:scale-105" />
      <span class="absolute inset-x-0 bottom-0 p-4
                   bg-linear-to-t from-black/85 to-transparent text-white">
        <span class="font-display text-sm font-medium block">{{ image.alt }}</span>
        <span class="text-xs text-white/70">
          Foto {{ i + 1 }} de {{ carouselImages.length }}
        </span>
      </span>
    </button>
  }
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsPolaroidScattered: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'multimedia.html',
      code: `<div class="flex flex-wrap justify-center gap-6 py-6">
  @for (image of polaroidImages; track image.src; let i = $index) {
    <button
      type="button"
      (click)="openPreview(i, polaroidImages)"
      [attr.aria-label]="'Ver ' + image.alt"
      [class]="
        'group relative bg-white rounded-mm-sm shadow-mm-elevated p-3 pb-12
         transition-all duration-300 hover:scale-105 hover:rotate-0! hover:z-10 '
        + image.rotation
      "
    >
      <!-- "Tape" decorativo arriba del polaroid -->
      <span class="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5
                   bg-amber-100/80 rotate-3 shadow-mm-sm" aria-hidden="true"></span>

      <img [src]="image.src" [alt]="image.alt" loading="lazy"
           class="size-44 object-cover block" />
      <span class="absolute bottom-3 left-3 right-3 font-mid text-xs
                   text-ink-dark text-center">
        {{ image.alt }}
      </span>
    </button>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'multimedia.ts',
      code: `// Cada polaroid lleva su propia rotación inicial en una clase Tailwind.
// hover:rotate-0! la cancela para que se "enderece" al pasar el cursor.
protected readonly polaroidImages: readonly (GalleryShot & { rotation: string })[] = [
  { src: '...', alt: 'Atardecer', rotation: '-rotate-3' },
  { src: '...', alt: 'Reflejo',   rotation: 'rotate-2' },
  { src: '...', alt: 'Bosque',    rotation: '-rotate-1' },
  { src: '...', alt: 'Cumbres',   rotation: 'rotate-3' },
];`,
    },
  ];
}
