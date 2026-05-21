import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[mmTooltip]',
})
export class TooltipDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly mmTooltip = input.required<string>();
  readonly tooltipSide = input<TooltipSide>('top');

  private tooltipEl?: HTMLElement;
  private removeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  protected show(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.tooltipEl || !this.mmTooltip()) return;
    if (this.removeTimer) {
      clearTimeout(this.removeTimer);
      this.removeTimer = undefined;
    }

    const el = document.createElement('div');
    el.textContent = this.mmTooltip();
    el.setAttribute('role', 'tooltip');
    el.classList.add('mm-no-print');
    el.style.cssText = `
      position: fixed;
      z-index: 9999;
      padding: 6px 10px;
      background: var(--color-surface-inverse);
      color: white;
      font-size: 12px;
      font-weight: 500;
      border-radius: 6px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 160ms var(--ease-out), transform 160ms var(--ease-out);
      white-space: nowrap;
      max-width: 240px;
    `;
    document.body.appendChild(el);

    const rect = this.host.nativeElement.getBoundingClientRect();
    const tipRect = el.getBoundingClientRect();
    const gap = 8;
    let top = 0;
    let left = 0;
    switch (this.tooltipSide()) {
      case 'top':
        top = rect.top - tipRect.height - gap;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.left - tipRect.width - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.right + gap;
        break;
    }
    el.style.top = `${Math.max(8, top)}px`;
    el.style.left = `${Math.max(8, left)}px`;

    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    this.tooltipEl = el;
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  protected hide(): void {
    const el = this.tooltipEl;
    if (!el) return;
    this.tooltipEl = undefined;
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    this.removeTimer = setTimeout(() => el.remove(), 180);
  }

  private cleanup(): void {
    if (this.removeTimer) {
      clearTimeout(this.removeTimer);
      this.removeTimer = undefined;
    }
    this.tooltipEl?.remove();
    this.tooltipEl = undefined;
  }
}
