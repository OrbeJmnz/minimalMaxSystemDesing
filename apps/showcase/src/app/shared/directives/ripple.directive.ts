import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[mmRipple]',
  host: { class: 'mm-ripple' },
})
export class RippleDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly color = input<string>('rgba(255, 255, 255, 0.55)');

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    const element = this.host.nativeElement;
    if (element.matches(':disabled, [aria-disabled="true"]')) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 0.9;
    const dot = document.createElement('span');
    dot.className = 'mm-ripple-dot';
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${event.clientX - rect.left - size / 2}px`;
    dot.style.top = `${event.clientY - rect.top - size / 2}px`;
    dot.style.background = this.color();
    element.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }
}
