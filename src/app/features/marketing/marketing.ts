import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ToastService } from '../../core/services/toast.service';

interface CookiePreference {
  readonly id: 'essential' | 'analytics' | 'marketing' | 'personalization';
  readonly label: string;
  readonly description: string;
  readonly required: boolean;
}

@Component({
  selector: 'mm-marketing',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './marketing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class MarketingComponent {
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cookieOpen = signal(true);
  protected readonly cookieExpanded = signal(false);
  protected readonly stickyCtaOpen = signal(false);
  protected readonly stickyCtaUnread = signal(2);
  protected readonly topBannerOpen = signal(true);
  protected readonly newsletterEmail = signal('');
  protected readonly newsletterSubscribed = signal(false);

  protected readonly cookiePrefs = signal<readonly CookiePreference[]>([
    {
      id: 'essential',
      label: 'Esenciales',
      description: 'Necesarias para el funcionamiento del sitio. No se pueden desactivar.',
      required: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Nos ayudan a entender cómo usas el sitio (Plausible · sin tracking personal).',
      required: false,
    },
    {
      id: 'marketing',
      label: 'Marketing',
      description: 'Pixel de campañas para medir la efectividad de anuncios.',
      required: false,
    },
    {
      id: 'personalization',
      label: 'Personalización',
      description: 'Recuerdan tus preferencias de tema y vista entre sesiones.',
      required: false,
    },
  ]);

  protected readonly cookieAccepted = signal<ReadonlySet<string>>(
    new Set(['essential']),
  );

  protected readonly countdownEnd = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(23, 59, 59, 0);
    return d.getTime();
  })();

  protected readonly now = signal(Date.now());

  protected readonly countdown = computed(() => {
    const diff = Math.max(0, this.countdownEnd - this.now());
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);
    return { days, hours, minutes, seconds };
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const tickId = window.setInterval(() => this.now.set(Date.now()), 1000);
      this.destroyRef.onDestroy(() => clearInterval(tickId));
    }
  }

  protected toggleCookiePref(id: string): void {
    if (id === 'essential') return;
    this.cookieAccepted.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected isCookieAccepted(id: string): boolean {
    return this.cookieAccepted().has(id);
  }

  protected acceptAllCookies(): void {
    this.cookieAccepted.set(
      new Set(this.cookiePrefs().map((p) => p.id)),
    );
    this.cookieOpen.set(false);
    this.toast.success('Todas las cookies aceptadas');
  }

  protected rejectOptionalCookies(): void {
    this.cookieAccepted.set(new Set(['essential']));
    this.cookieOpen.set(false);
    this.toast.info('Solo aceptaste cookies esenciales');
  }

  protected saveCookiePrefs(): void {
    this.cookieOpen.set(false);
    this.toast.success(`Preferencias guardadas (${this.cookieAccepted().size} categorías)`);
  }

  protected reopenCookies(): void {
    this.cookieExpanded.set(false);
    this.cookieOpen.set(true);
  }

  protected toggleStickyCta(): void {
    this.stickyCtaOpen.update((v) => !v);
    if (this.stickyCtaOpen()) this.stickyCtaUnread.set(0);
  }

  protected closeStickyCta(): void {
    this.stickyCtaOpen.set(false);
  }

  protected dismissTopBanner(): void {
    this.topBannerOpen.set(false);
    this.toast.info('Banner cerrado');
  }

  protected reopenTopBanner(): void {
    this.topBannerOpen.set(true);
  }

  protected onNewsletterEmail(event: Event): void {
    this.newsletterEmail.set((event.target as HTMLInputElement).value);
  }

  protected subscribeNewsletter(event?: Event): void {
    event?.preventDefault();
    const email = this.newsletterEmail().trim();
    if (!email || !email.includes('@')) {
      this.toast.error('Email inválido');
      return;
    }
    this.newsletterSubscribed.set(true);
    this.toast.success(`Te suscribimos con ${email}`);
  }

  protected resetNewsletter(): void {
    this.newsletterSubscribed.set(false);
    this.newsletterEmail.set('');
  }

  protected readonly snippetsCookie: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'cookie-banner.html',
      code: `<!-- Banner inferior fijo con dos modos: simple y customizable -->
@if (cookieOpen()) {
  <div
    class="sticky bottom-4 mx-auto max-w-2xl rounded-mm-2xl border border-border bg-surface-base
           shadow-mm-elevated overflow-hidden"
    style="animation: fadeInUp 320ms var(--ease-out) both;"
  >
    @if (!cookieExpanded()) {
      <!-- Modo simple: copy breve + 3 botones -->
      <div class="flex flex-col md:flex-row gap-4 p-5">
        <div class="flex items-start gap-3 flex-1">
          <span class="size-10 rounded-mm-md bg-primary-200 text-primary-700 grid place-items-center">
            🍪
          </span>
          <div>
            <h3 class="font-display text-base font-medium">Usamos cookies</h3>
            <p class="text-xs text-ink-secondary">
              Algunas son esenciales · otras nos ayudan a mejorar.
              <a class="text-brand-6 underline">Política de privacidad</a>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="cookieExpanded.set(true)" class="rounded-mm-md border px-3 py-2 text-xs">
            Personalizar
          </button>
          <button (click)="rejectOptionalCookies()" class="rounded-mm-md bg-surface-secondary px-3 py-2 text-xs">
            Solo esenciales
          </button>
          <button (click)="acceptAllCookies()" class="rounded-mm-md bg-cta text-cta-fg px-4 py-2 text-xs">
            Aceptar todas
          </button>
        </div>
      </div>
    } @else {
      <!-- Modo expandido: lista de categorías con toggle por categoría -->
      <div class="p-5">
        @for (pref of cookiePrefs(); track pref.id) {
          <label class="flex items-start gap-3 p-3 rounded-mm-md hover:bg-surface-secondary/40">
            <input type="checkbox"
                   [checked]="isCookieAccepted(pref.id)"
                   [disabled]="pref.required"
                   (change)="toggleCookiePref(pref.id)" />
            <div>
              <p class="font-medium">{{ pref.label }}
                @if (pref.required) { <span class="text-success">· Requerida</span> }
              </p>
              <p class="text-xs text-ink-secondary">{{ pref.description }}</p>
            </div>
          </label>
        }
        <button (click)="saveCookiePrefs()" class="bg-cta text-cta-fg">Guardar preferencias</button>
      </div>
    }
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'cookie-banner.ts (state)',
      code: `interface CookiePreference {
  readonly id: 'essential' | 'analytics' | 'marketing' | 'personalization';
  readonly label: string;
  readonly description: string;
  readonly required: boolean;
}

protected readonly cookieOpen = signal(true);
protected readonly cookieExpanded = signal(false);

protected readonly cookiePrefs = signal<readonly CookiePreference[]>([
  { id: 'essential',       label: 'Esenciales',       description: '...', required: true  },
  { id: 'analytics',       label: 'Analytics',        description: '...', required: false },
  { id: 'marketing',       label: 'Marketing',        description: '...', required: false },
  { id: 'personalization', label: 'Personalización',  description: '...', required: false },
]);

protected readonly cookieAccepted = signal<ReadonlySet<string>>(new Set(['essential']));

protected toggleCookiePref(id: string): void {
  if (id === 'essential') return;  // no permitir desactivar las requeridas
  this.cookieAccepted.update((set) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
}

protected acceptAllCookies(): void {
  this.cookieAccepted.set(new Set(this.cookiePrefs().map((p) => p.id)));
  this.cookieOpen.set(false);
  // POST /api/cookies/accept-all
}

protected rejectOptionalCookies(): void {
  this.cookieAccepted.set(new Set(['essential']));
  this.cookieOpen.set(false);
  // POST /api/cookies/reject-optional
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — cookie banner',
      code: `/* fadeInUp — entrada suave hacia arriba (token --animate-fade-in-up) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* data-stagger aplica este token a cada hijo del contenedor */
[data-stagger] > * { opacity: 0; animation: var(--animate-fade-in-up); }

/* fadeIn — aparición por opacidad */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
    },
  ];

  protected readonly snippetsSticky: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'sticky-cta.html',
      code: `<!-- Floating CTA bubble (estilo Intercom) -->
<div class="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">

  <!-- Panel expandible -->
  @if (stickyCtaOpen()) {
    <div class="w-80 rounded-mm-2xl bg-surface-base border shadow-mm-elevated overflow-hidden"
         style="animation: fadeInUp 320ms var(--ease-out) both;">
      <header class="bg-linear-to-br from-brand-6 to-brand-pink text-white p-4">
        <h3>¿Necesitas ayuda?</h3>
        <p class="text-xs opacity-90">Respondemos en menos de 5 minutos.</p>
      </header>
      <div class="p-4 space-y-3">
        <button class="w-full rounded-mm-md bg-surface-secondary p-3">📚 Documentación</button>
        <button class="w-full rounded-mm-md bg-surface-secondary p-3">💬 Chat con soporte</button>
        <button class="w-full rounded-mm-md bg-surface-secondary p-3">🎥 Tour del producto</button>
      </div>
    </div>
  }

  <!-- Bubble button con badge -->
  <button (click)="toggleStickyCta()"
          class="relative size-14 rounded-mm-pill bg-cta text-cta-fg shadow-mm-elevated
                 hover:scale-105 transition mm-press">
    @if (stickyCtaOpen()) {
      <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
    } @else {
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    }

    @if (!stickyCtaOpen() && stickyCtaUnread() > 0) {
      <span class="absolute -top-1 -right-1 size-5 rounded-full bg-error text-white text-[10px]
                   grid place-items-center"
            style="animation: mm-badge-pop 380ms var(--ease-bounce) both;">
        {{ stickyCtaUnread() }}
      </span>
    }
  </button>
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — sticky CTA',
      code: `/* mm-badge-pop — pop del badge contador */
@keyframes mm-badge-pop {
  0%   { transform: scale(0.6);  opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}

/* mm-ping-strong — onda de ping infinita (bubble CTA) */
@keyframes mm-ping-strong {
  0%   { transform: scale(1);   opacity: 0.75; }
  100% { transform: scale(2.4); opacity: 0; }
}

/* fadeInUp — entrada suave hacia arriba (token --animate-fade-in-up) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* data-stagger aplica este token a cada hijo del contenedor */
[data-stagger] > * { opacity: 0; animation: var(--animate-fade-in-up); }`,
    },
  ];

  protected readonly snippetsBanner: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'top-banner.html',
      code: `<!-- Top banner sticky con countdown live -->
@if (topBannerOpen()) {
  <div class="sticky top-0 z-20 bg-linear-to-r from-brand-6 via-primary-500 to-brand-pink
              text-white px-4 py-2.5"
       style="animation: fadeInDown 240ms var(--ease-out) both;">
    <div class="max-w-7xl mx-auto flex items-center gap-3">
      <span class="rounded-mm-pill bg-white/20 backdrop-blur px-2 py-0.5 text-[10px] font-bold uppercase">
        Oferta
      </span>
      <p class="flex-1 text-sm">
        <strong>30% OFF</strong> en plan Growth · termina en
        <span class="font-mono ml-1">
          {{ countdown().days }}d {{ countdown().hours }}h {{ countdown().minutes }}m {{ countdown().seconds }}s
        </span>
      </p>
      <button class="rounded-mm-pill bg-white text-cta px-4 py-1.5 text-xs font-semibold">
        Aprovechar →
      </button>
      <button (click)="dismissTopBanner()" aria-label="Cerrar">
        <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'countdown.ts',
      code: `protected readonly countdownEnd = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 2);   // 2 días desde hoy
  d.setHours(23, 59, 59, 0);
  return d.getTime();
})();

protected readonly now = signal(Date.now());

// Computed que recalcula días/horas/minutos/segundos cada vez que now() cambia
protected readonly countdown = computed(() => {
  const diff = Math.max(0, this.countdownEnd - this.now());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
});

// Tick cada segundo en browser (SSR-safe con isPlatformBrowser)
constructor() {
  if (isPlatformBrowser(this.platformId)) {
    const id = window.setInterval(() => this.now.set(Date.now()), 1000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — top banner',
      code: `/* fadeInDown — entrada desde arriba (token --animate-fade-in-down) */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
    },
  ];

  protected readonly snippetsNewsletter: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'newsletter-inline.html',
      code: `<!-- Newsletter inline con estado success -->
<section class="rounded-mm-3xl bg-linear-to-br from-brand-6 via-primary-500 to-brand-pink
                text-white p-8 md:p-10 shadow-mm-brand overflow-hidden relative">
  @if (!newsletterSubscribed()) {
    <header class="mb-5 max-w-md">
      <p class="text-[10px] uppercase tracking-wider opacity-80">Newsletter</p>
      <h3 class="font-display text-2xl md:text-3xl mt-1">
        Recibe lo mejor cada lunes
      </h3>
      <p class="text-sm opacity-90 mt-2">
        Patrones nuevos, cicatrices encontradas y recursos de diseño. Sin spam.
      </p>
    </header>

    <form (submit)="subscribeNewsletter($event)" class="flex flex-col sm:flex-row gap-2">
      <input type="email"
             [value]="newsletterEmail()"
             (input)="onNewsletterEmail($event)"
             placeholder="tu@email.com"
             class="flex-1 rounded-mm-md bg-white/15 backdrop-blur px-4 py-3 text-white
                    placeholder:text-white/60 outline-none focus:bg-white/25" />
      <button type="submit" class="rounded-mm-md bg-white text-cta px-5 py-3 font-semibold">
        Suscribirme
      </button>
    </form>
  } @else {
    <!-- Success state -->
    <div style="animation: scaleIn 380ms var(--ease-bounce) both;">
      <span class="size-14 rounded-mm-pill bg-white/20 backdrop-blur grid place-items-center mb-3">
        ✓
      </span>
      <h3 class="font-display text-2xl">¡Listo!</h3>
      <p class="opacity-90">Te enviaremos el primer newsletter el lunes a las 9am.</p>
      <button (click)="resetNewsletter()" class="mt-4 text-sm underline">
        Cambiar email
      </button>
    </div>
  }
</section>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — newsletter',
      code: `/* scaleIn — entrada con escala (token --animate-scale-in) */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

/* mm-check-pop — pop del check al activarse */
@keyframes mm-check-pop {
  0%   { transform: scale(0);   opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}

/* fadeInUp — entrada suave hacia arriba (token --animate-fade-in-up) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* data-stagger aplica este token a cada hijo del contenedor */
[data-stagger] > * { opacity: 0; animation: var(--animate-fade-in-up); }`,
    },
  ];
}
