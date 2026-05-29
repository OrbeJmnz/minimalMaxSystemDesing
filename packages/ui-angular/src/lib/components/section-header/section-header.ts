import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mm-section-header',
  imports: [],
  template: `
    <header class="flex flex-col gap-3 mb-8">
      @if (eyebrow()) {
        <span
          class="inline-flex w-fit items-center gap-2 rounded-mm-pill bg-primary-200/60 px-3 py-1 text-xs font-medium text-primary-700"
        >
          {{ eyebrow() }}
        </span>
      }
      <h2
        class="font-display text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight text-ink-dark"
      >
        {{ title() }}
      </h2>
      @if (description()) {
        <p class="text-lg text-ink-secondary max-w-2xl leading-relaxed">
          {{ description() }}
        </p>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class SectionHeaderComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
