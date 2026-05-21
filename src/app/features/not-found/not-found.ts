import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { RippleDirective } from '../../shared/directives/ripple.directive';

@Component({
  selector: 'mm-not-found',
  imports: [EmptyStateComponent, RippleDirective],
  template: `
    <div
      class="rounded-mm-3xl border border-border-soft bg-linear-to-br from-surface-base via-surface-base to-surface-secondary py-20 px-6 shadow-mm-sm"
    >
      <mm-empty-state
        title="Esta página se fue al limbo"
        description="La ruta que buscas no existe o fue movida. Vuelve al inicio o usa la búsqueda del sidebar."
        variant="brand"
      >
        <span slot="icon">
          <span class="relative font-display text-7xl font-medium text-ink-dark leading-none">
            404
          </span>
        </span>
        <div slot="actions">
          <button
            type="button"
            mmRipple
            (click)="goHome()"
            class="rounded-mm-md bg-cta px-5 py-2.5 text-sm font-medium text-white shadow-mm-sm hover:shadow-mm-elevated transition mm-press"
          >
            ← Volver al inicio
          </button>
          <button
            type="button"
            (click)="goBack()"
            class="rounded-mm-md border border-border bg-surface-base px-5 py-2.5 text-sm font-medium text-ink-dark hover:border-ink-dark transition mm-press"
          >
            Página anterior
          </button>
        </div>
      </mm-empty-state>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  protected goHome(): void {
    this.router.navigateByUrl('/overview');
  }

  protected goBack(): void {
    history.length > 1 ? history.back() : this.router.navigateByUrl('/overview');
  }
}
