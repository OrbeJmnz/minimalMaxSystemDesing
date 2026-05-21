import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast, ToastService, ToastVariant } from '../../../core/services/toast.service';

@Component({
  selector: 'mm-toast-host',
  imports: [],
  template: `
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none w-[min(420px,calc(100vw-2rem))] mm-no-print"
      role="region"
      aria-label="Notificaciones"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <article
          class="pointer-events-auto rounded-mm-xl shadow-mm-elevated border border-border-soft bg-surface-base px-4 py-3 flex items-start gap-3 mm-toast-enter"
          [class]="cardClass(toast.variant)"
          role="status"
        >
          <span
            class="size-9 shrink-0 rounded-mm-pill grid place-items-center"
            [class]="iconBgClass(toast.variant)"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              @switch (toast.variant) {
                @case ('success') {
                  <path d="M20 6 9 17l-5-5"></path>
                }
                @case ('error') {
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4M12 16h.01"></path>
                }
                @case ('warning') {
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" x2="12" y1="9" y2="13"></line>
                  <line x1="12" x2="12.01" y1="17" y2="17"></line>
                }
                @default {
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4M12 8h.01"></path>
                }
              }
            </svg>
          </span>
          <div class="flex-1 min-w-0">
            @if (toast.title) {
              <p class="font-display text-sm font-semibold text-ink-dark leading-snug">
                {{ toast.title }}
              </p>
            }
            <p class="text-sm text-ink-secondary leading-relaxed">{{ toast.message }}</p>
            @if (toast.action) {
              <button
                type="button"
                (click)="runAction(toast)"
                class="mt-2 text-xs font-semibold text-brand-6 hover:underline"
              >
                {{ toast.action.label }}
              </button>
            }
          </div>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Cerrar"
            class="size-7 rounded-mm-sm grid place-items-center text-ink-muted hover:text-ink-dark hover:bg-surface-secondary transition shrink-0"
          >
            <svg
              class="size-4"
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
        </article>
      }
    </div>
  `,
  styles: [
    `
      .mm-toast-enter {
        animation: slideInRight 320ms var(--ease-out) both;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastHostComponent {
  protected readonly toastService = inject(ToastService);

  protected cardClass(variant: ToastVariant): string {
    switch (variant) {
      case 'success':
        return 'border-l-4 border-l-success';
      case 'error':
        return 'border-l-4 border-l-error';
      case 'warning':
        return 'border-l-4 border-l-warning';
      default:
        return 'border-l-4 border-l-brand-6';
    }
  }

  protected iconBgClass(variant: ToastVariant): string {
    switch (variant) {
      case 'success':
        return 'bg-success-bg text-success';
      case 'error':
        return 'bg-error-bg text-error';
      case 'warning':
        return 'bg-warning-bg text-warning';
      default:
        return 'bg-primary-200 text-primary-700';
    }
  }

  protected runAction(toast: Toast): void {
    toast.action?.run();
    this.toastService.dismiss(toast.id);
  }
}
