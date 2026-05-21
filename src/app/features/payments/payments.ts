import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { RippleDirective } from '../../shared/directives/ripple.directive';

@Component({
  selector: 'mm-payments',
  imports: [
    ReactiveFormsModule,
    CanvasFrameComponent,
    SectionHeaderComponent,
    RippleDirective,
  ],
  templateUrl: './payments.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class PaymentsComponent {
  protected readonly cardNumber = new FormControl<string>('4242 4242 4242 4242', {
    nonNullable: true,
  });
  protected readonly cardHolder = new FormControl<string>('Orbe Jimenez', {
    nonNullable: true,
  });
  protected readonly cardExpiry = new FormControl<string>('12/29', { nonNullable: true });
  protected readonly cardCvc = new FormControl<string>('•••', { nonNullable: true });

  protected readonly flipped = signal(false);

  protected readonly displayNumber = computed(() => {
    const value = (this.cardNumber.value ?? '').replace(/\s+/g, '');
    return value.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
  });

  protected readonly cartItems = [
    { name: 'Pro plan · anual', desc: 'Componentes ilimitados', amount: 19000 },
    { name: 'Soporte premium', desc: '24/7 chat + Slack', amount: 4900 },
    { name: 'Onboarding 1:1', desc: 'Setup guiado del DS', amount: 2900 },
  ];

  protected readonly subtotal = this.cartItems.reduce((sum, i) => sum + i.amount, 0);
  protected readonly tax = Math.round(this.subtotal * 0.16);
  protected readonly total = this.subtotal + this.tax;

  protected readonly snippetsCreditCard: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'credit-card-form.html',
      code: `<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <!-- Preview con flip 3D -->
  <div class="relative aspect-16/10 max-w-md rounded-mm-3xl overflow-hidden
              shadow-mm-elevated"
       [style.perspective]="'1000px'">
    <div class="relative w-full h-full transition-transform duration-700"
         style="transform-style: preserve-3d"
         [style.transform]="flipped() ? 'rotateY(180deg)' : 'rotateY(0deg)'">

      <!-- Front -->
      <div class="absolute inset-0 rounded-mm-3xl p-6 text-white
                  bg-linear-to-br from-brand-deep via-brand-6 to-brand-pink
                  flex flex-col justify-between"
           style="backface-visibility: hidden">
        <p class="font-mono text-lg md:text-xl tabular-nums tracking-wider">
          {{ displayNumber() }}
        </p>
        <p class="font-medium text-sm">{{ cardHolder.value }}</p>
      </div>

      <!-- Back (rotateY 180) -->
      <div class="absolute inset-0 rounded-mm-3xl p-6 text-white
                  bg-linear-to-br from-surface-inverse to-surface-inverse-deep"
           style="backface-visibility: hidden; transform: rotateY(180deg)">
        <div class="h-10 bg-black/50 -mx-6"></div>
        <span class="font-mono">{{ cardCvc.value }}</span>
      </div>
    </div>
  </div>

  <!-- Form -->
  <form class="flex flex-col gap-4 max-w-md">
    <label class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-ink-dark">Número de tarjeta</span>
      <input type="text" [formControl]="cardNumber"
             class="rounded-mm-md border-2 border-border px-4 py-2.5 text-sm
                    font-mono focus:border-primary-500 focus:ring-3
                    focus:ring-primary-500/10" />
    </label>
    <!-- ... titular / expiry / cvc ... -->
    <input [formControl]="cardCvc"
           (focus)="flipped.set(true)"
           (blur)="flipped.set(false)" />
  </form>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'payments.ts',
      code: `import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export class PaymentsComponent {
  protected readonly cardNumber = new FormControl('4242 4242 4242 4242', { nonNullable: true });
  protected readonly cardHolder = new FormControl('Orbe Jimenez', { nonNullable: true });
  protected readonly cardExpiry = new FormControl('12/29', { nonNullable: true });
  protected readonly cardCvc = new FormControl('•••', { nonNullable: true });

  // flip se controla con focus/blur del CVC
  protected readonly flipped = signal(false);

  // Formateo automático: 4242424242424242 → 4242 4242 4242 4242
  // y padding con • si el número está incompleto
  protected readonly displayNumber = computed(() => {
    const value = (this.cardNumber.value ?? '').replace(/\\s+/g, '');
    return value.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
  });
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'flip 3D — patrón CSS',
      code: `/* Flip card 3D — requiere 3 propiedades clave */
.card-container {
  perspective: 1000px;          /* profundidad de escena */
}

.card-inner {
  transform-style: preserve-3d; /* hijos respetan 3D */
  transition: transform 700ms;
}

.card-face {
  backface-visibility: hidden;  /* oculta cara trasera */
}

.card-face--back {
  transform: rotateY(180deg);
}

/* Activación */
.card-inner.flipped {
  transform: rotateY(180deg);
}`,
    },
  ];

  protected readonly snippetsWallets: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'wallets.html',
      code: `<div class="flex flex-col gap-3 max-w-md">
  <!-- Apple Pay -->
  <button mmRipple
          class="inline-flex items-center justify-center gap-2 rounded-mm-md
                 bg-black px-5 py-3.5 text-sm font-semibold text-white
                 hover:opacity-90 transition mm-press">
    <svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47..." />
    </svg>
    Pay
  </button>

  <!-- Google Pay -->
  <button mmRipple
          class="inline-flex items-center justify-center gap-2 rounded-mm-md
                 bg-surface-base border-2 border-ink-charcoal px-5 py-3.5
                 text-sm font-semibold text-ink-dark mm-press">
    <span class="font-display text-base">G</span> Pay
  </button>

  <!-- Stripe Link -->
  <button mmRipple
          class="inline-flex items-center justify-center gap-2 rounded-mm-md
                 bg-[#635BFF] px-5 py-3.5 text-sm font-semibold text-white
                 hover:opacity-90 transition mm-press">
    <!-- icono stripe --> Pay with Stripe
  </button>

  <!-- Divider "o" -->
  <div class="relative flex items-center my-2">
    <span class="flex-1 h-px bg-border"></span>
    <span class="px-3 text-xs text-ink-muted">o</span>
    <span class="flex-1 h-px bg-border"></span>
  </div>

  <button class="rounded-mm-md border border-border bg-surface-base px-5 py-2.5
                 text-sm font-medium text-ink-dark hover:border-ink-dark mm-press">
    Pagar con tarjeta de crédito
  </button>
</div>`,
    },
  ];

  protected readonly snippetsCheckoutSummary: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'checkout-summary.html',
      code: `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <!-- Items (2/3 del ancho) -->
  <div class="md:col-span-2 flex flex-col gap-3">
    @for (item of cartItems; track item.name) {
      <div class="flex items-center gap-4 p-4 rounded-mm-xl border
                  border-border-soft bg-surface-base shadow-mm-sm">
        <span class="size-12 rounded-mm-md bg-linear-to-br
                     from-brand-6 to-brand-pink shrink-0"></span>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-ink-dark">{{ item.name }}</p>
          <p class="text-xs text-ink-muted">{{ item.desc }}</p>
        </div>
        <p class="font-mono font-medium tabular-nums">
          \${{ (item.amount / 100).toFixed(2) }}
        </p>
      </div>
    }
  </div>

  <!-- Resumen sticky (1/3) -->
  <aside class="rounded-mm-2xl bg-surface-secondary/40 border border-border-soft
                p-5 h-fit md:sticky md:top-24">
    <h4 class="font-display font-semibold text-ink-dark mb-4">Resumen</h4>
    <dl class="flex flex-col gap-2 text-sm">
      <div class="flex justify-between">
        <dt>Subtotal</dt>
        <dd class="font-mono tabular-nums">\${{ (subtotal / 100).toFixed(2) }}</dd>
      </div>
      <div class="flex justify-between">
        <dt>IVA (16%)</dt>
        <dd class="font-mono tabular-nums">\${{ (tax / 100).toFixed(2) }}</dd>
      </div>
      <hr class="border-border-soft my-2" />
      <div class="flex justify-between items-baseline">
        <dt class="font-display font-semibold">Total</dt>
        <dd class="font-display text-xl font-medium tabular-nums">
          \${{ (total / 100).toFixed(2) }}
        </dd>
      </div>
    </dl>
    <button mmRipple
            class="w-full mt-5 rounded-mm-md bg-brand-6 px-4 py-3 text-sm
                   font-medium text-white shadow-mm-brand mm-press">
      Confirmar y pagar
    </button>
  </aside>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'cart logic',
      code: `// Carrito + cálculo de subtotal, IVA y total
protected readonly cartItems = [
  { name: 'Pro plan · anual', desc: 'Componentes ilimitados', amount: 19000 },
  { name: 'Soporte premium', desc: '24/7 chat + Slack', amount: 4900 },
  { name: 'Onboarding 1:1', desc: 'Setup guiado del DS', amount: 2900 },
];

// Amounts en centavos para evitar floats. Display divide entre 100.
protected readonly subtotal = this.cartItems.reduce((sum, i) => sum + i.amount, 0);
protected readonly tax = Math.round(this.subtotal * 0.16);  // IVA 16% MX
protected readonly total = this.subtotal + this.tax;`,
    },
  ];
}
