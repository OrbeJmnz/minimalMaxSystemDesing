import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  PLATFORM_ID,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { OverlayService } from '../../services/overlay.service';

let drawerCounter = 0;

@Component({
  selector: 'mm-drawer-shell',
  imports: [CdkTrapFocus],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 mm-no-print"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
      >
        <button
          type="button"
          (click)="close.emit()"
          aria-label="Cerrar"
          class="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
          style="animation: fadeIn 220ms var(--ease-out) both;"
        ></button>
        <aside
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          class="absolute top-0 bottom-0 w-full max-w-md bg-surface-base shadow-mm-elevated border-border-soft overflow-y-auto"
          [class.right-0]="side() === 'right'"
          [class.border-l]="side() === 'right'"
          [class.left-0]="side() === 'left'"
          [class.border-r]="side() === 'left'"
          [style.animation]="
            side() === 'right'
              ? 'slideInRight 320ms var(--ease-out) both'
              : 'slideInLeft 320ms var(--ease-out) both'
          "
        >
          <header
            class="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-border-soft bg-surface-base/95 backdrop-blur-xl"
          >
            <div class="flex-1 min-w-0">
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
              (click)="close.emit()"
              aria-label="Cerrar drawer"
              class="size-9 rounded-mm-md grid place-items-center text-ink-muted hover:text-ink-dark hover:bg-surface-secondary transition mm-press"
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
          <div class="px-6 py-5">
            <ng-content></ng-content>
          </div>
        </aside>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class DrawerShellComponent {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly eyebrow = input<string>('');
  readonly side = input<'left' | 'right'>('right');
  readonly close = output<void>();

  protected readonly titleId = `mm-drawer-title-${++drawerCounter}`;
  private readonly overlay = inject(OverlayService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly id = `drawer-${drawerCounter}`;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (!isPlatformBrowser(this.platformId)) return;
      untracked(() => {
        if (isOpen) this.overlay.acquire(this.id);
        else this.overlay.release(this.id);
      });
    });
    this.destroyRef.onDestroy(() => untracked(() => this.overlay.release(this.id)));
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open() && this.overlay.isTop(this.id)) this.close.emit();
  }
}
