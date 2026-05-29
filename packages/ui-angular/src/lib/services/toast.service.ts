import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  readonly id: string;
  readonly variant: ToastVariant;
  readonly title?: string;
  readonly message: string;
  readonly duration: number;
  readonly action?: { label: string; run: () => void };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<readonly Toast[]>([]);
  private idCounter = 0;

  show(
    payload: Omit<Toast, 'id' | 'variant' | 'duration'> &
      Partial<Pick<Toast, 'variant' | 'duration'>>,
  ): string {
    const id = `t${++this.idCounter}`;
    const toast: Toast = {
      id,
      variant: payload.variant ?? 'info',
      title: payload.title,
      message: payload.message,
      duration: payload.duration ?? 4000,
      action: payload.action,
    };
    this.toasts.update((items) => [...items, toast]);
    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
    return id;
  }

  success(message: string, options: Partial<Toast> = {}): string {
    return this.show({ ...options, variant: 'success', message });
  }

  error(message: string, options: Partial<Toast> = {}): string {
    return this.show({ ...options, variant: 'error', message });
  }

  info(message: string, options: Partial<Toast> = {}): string {
    return this.show({ ...options, variant: 'info', message });
  }

  warning(message: string, options: Partial<Toast> = {}): string {
    return this.show({ ...options, variant: 'warning', message });
  }

  dismiss(id: string): void {
    this.toasts.update((items) => items.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
