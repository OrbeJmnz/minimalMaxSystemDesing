import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mm-empty-state',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center text-center px-6 py-12 gap-4">
      <div
        class="relative size-20 rounded-mm-pill grid place-items-center shrink-0"
        [class]="iconWrap()"
      >
        <span
          class="absolute inset-0 rounded-mm-pill animate-[glowPulse_2.6s_var(--ease-out)_infinite]"
        ></span>
        <ng-content select="[slot=icon]">
          <svg
            class="relative size-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 3h18v18H3z"></path>
            <path d="M3 9h18M9 21V9"></path>
          </svg>
        </ng-content>
      </div>

      <div class="space-y-1.5 max-w-md">
        <h3 class="font-display text-xl md:text-2xl font-medium text-ink-dark">{{ title() }}</h3>
        @if (description()) {
          <p class="text-sm text-ink-secondary leading-relaxed">{{ description() }}</p>
        }
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly variant = input<'default' | 'brand' | 'success' | 'warning' | 'error'>('default');

  protected iconWrap(): string {
    switch (this.variant()) {
      case 'brand':
        return 'bg-primary-200 text-brand-6';
      case 'success':
        return 'bg-success-bg text-success';
      case 'warning':
        return 'bg-warning-bg text-warning';
      case 'error':
        return 'bg-error-bg text-error';
      default:
        return 'bg-surface-secondary text-ink-muted';
    }
  }
}
