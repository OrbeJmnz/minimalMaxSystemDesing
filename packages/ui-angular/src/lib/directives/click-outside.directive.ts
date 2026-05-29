import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[mmClickOutside]',
})
export class ClickOutsideDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly mmClickOutside = output<PointerEvent>();
  readonly mmClickOutsideEnabled = input<boolean>(true);

  private listener?: (event: PointerEvent) => void;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    effect(() => {
      const enabled = this.mmClickOutsideEnabled();
      this.detach();
      if (!enabled) return;

      this.listener = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (target && this.host.nativeElement.contains(target)) return;
        this.mmClickOutside.emit(event);
      };
      setTimeout(() => document.addEventListener('pointerdown', this.listener!, true), 0);
    });

    this.destroyRef.onDestroy(() => this.detach());
  }

  private detach(): void {
    if (this.listener) {
      document.removeEventListener('pointerdown', this.listener, true);
      this.listener = undefined;
    }
  }
}
