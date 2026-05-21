import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';

@Component({
  selector: 'mm-rating-stars',
  imports: [],
  template: `
    <div
      class="inline-flex items-center gap-1"
      role="radiogroup"
      [attr.aria-label]="ariaLabel()"
      (mouseleave)="preview.set(null)"
    >
      @for (i of stars(); track $index) {
        <button
          type="button"
          [attr.role]="readonly() ? null : 'radio'"
          [attr.aria-checked]="readonly() ? null : value() === i"
          [attr.aria-label]="i + ' de ' + max() + ' estrellas'"
          [disabled]="readonly()"
          (click)="pick(i)"
          (mouseenter)="preview.set(i)"
          (focus)="preview.set(i)"
          (blur)="preview.set(null)"
          class="rounded-mm-sm p-0.5 transition-transform mm-press"
          [class.cursor-pointer]="!readonly()"
          [class.cursor-default]="readonly()"
          [class.hover:scale-110]="!readonly()"
        >
          <svg
            [class]="
              'transition-all duration-150 ' +
              (sizeClass()) +
              ' ' +
              (isFilled(i) ? 'text-amber-400 drop-shadow-sm' : 'text-border')
            "
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .32-.988l5.519-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </button>
      }
      @if (showLabel()) {
        <span class="ml-2 text-sm font-medium text-ink-dark tabular-nums">
          {{ effectiveValue() }}<span class="text-ink-muted">/{{ max() }}</span>
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
})
export class RatingStarsComponent {
  readonly value = model<number>(0);
  readonly max = input(5);
  readonly readonly = input(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly showLabel = input(false);
  readonly ariaLabel = input<string>('Rating');

  protected readonly preview = signal<number | null>(null);

  protected readonly stars = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 1),
  );

  protected readonly effectiveValue = computed(() => this.preview() ?? this.value());

  protected readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'size-4';
      case 'lg':
        return 'size-7';
      default:
        return 'size-5';
    }
  });

  protected isFilled(index: number): boolean {
    return this.effectiveValue() >= index;
  }

  protected pick(value: number): void {
    if (this.readonly()) return;
    this.value.set(value);
  }
}
