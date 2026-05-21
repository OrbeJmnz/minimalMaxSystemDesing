import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
  effect,
  input,
  model,
  signal,
} from '@angular/core';

export interface PillTab {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'mm-pill-tabs',
  imports: [],
  template: `
    <div
      class="relative inline-flex p-1 bg-surface-secondary rounded-mm-pill"
      role="tablist"
    >
      <span
        class="absolute top-1 bottom-1 rounded-mm-pill bg-cta shadow-mm-sm transition-[left,width] duration-300 ease-out"
        [style.left.px]="indicator().left"
        [style.width.px]="indicator().width"
        aria-hidden="true"
      ></span>
      @for (tab of tabs(); track tab.id; let i = $index) {
        <button
          #tabBtn
          type="button"
          role="tab"
          [attr.aria-selected]="active() === tab.id"
          (click)="select(tab.id)"
          class="relative z-10 rounded-mm-pill px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer hover:-translate-y-px active:-translate-y-1"
          [class.text-white]="active() === tab.id"
          [class.text-ink-secondary]="active() !== tab.id"
          [class.hover:text-ink-dark]="active() !== tab.id"
        >
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
})
export class PillTabsComponent implements AfterViewInit {
  readonly tabs = input.required<readonly PillTab[]>();
  readonly active = model.required<string>();

  @ViewChildren('tabBtn') protected tabRefs!: QueryList<ElementRef<HTMLButtonElement>>;

  protected readonly indicator = signal({ left: 4, width: 0 });

  constructor() {
    effect(() => {
      this.active();
      queueMicrotask(() => this.updateIndicator());
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.updateIndicator());
  }

  protected select(id: string): void {
    this.active.set(id);
  }

  @HostListener('window:resize')
  protected updateIndicator(): void {
    const refs = this.tabRefs?.toArray() ?? [];
    const activeIndex = this.tabs().findIndex((t) => t.id === this.active());
    const target = refs[activeIndex]?.nativeElement;
    if (!target) return;
    const parent = target.parentElement;
    if (!parent) return;
    this.indicator.set({
      left: target.offsetLeft,
      width: target.offsetWidth,
    });
  }
}
