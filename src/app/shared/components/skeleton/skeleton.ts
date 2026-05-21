import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mm-skeleton',
  imports: [],
  template: `
    <span
      class="block mm-skeleton"
      [style.width]="width()"
      [style.height]="height()"
      [style.borderRadius]="radius()"
      aria-hidden="true"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
})
export class SkeletonComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('1em');
  readonly radius = input<string>('var(--radius-mm-md)');
}
