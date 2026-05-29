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
import { OverlayService } from '../../../core/services/overlay.service';

let modalCounter = 0;

@Component({
  selector: 'mm-modal-shell',
  imports: [CdkTrapFocus],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 mm-no-print"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
        style="animation: fadeIn 200ms var(--ease-out) both;"
      >
        <button
          type="button"
          (click)="close.emit()"
          aria-label="Cerrar"
          class="absolute inset-0 bg-black/55 backdrop-blur-sm cursor-default"
        ></button>
        <div
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          class="relative w-full md:max-w-lg rounded-t-mm-3xl md:rounded-mm-3xl bg-surface-base shadow-mm-elevated border border-border-soft overflow-hidden"
          style="animation: scaleIn 240ms var(--ease-out) both;"
        >
          <header
            class="flex items-center justify-between gap-3 px-6 py-4 border-b border-border-soft"
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
              aria-label="Cerrar modal"
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
          <footer
            class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-soft bg-surface-secondary/30"
          >
            <ng-content select="[slot=actions]"></ng-content>
          </footer>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ModalShellComponent {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly eyebrow = input<string>('');
  readonly close = output<void>();

  protected readonly titleId = `mm-modal-title-${++modalCounter}`;
  private readonly overlay = inject(OverlayService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly id = `modal-${modalCounter}`;

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
