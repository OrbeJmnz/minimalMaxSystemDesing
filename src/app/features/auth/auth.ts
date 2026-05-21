import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { PillTab, PillTabsComponent } from '../../shared/components/pill-tabs/pill-tabs';

@Component({
  selector: 'mm-auth',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    RippleDirective,
    PillTabsComponent,
  ],
  templateUrl: './auth.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class AuthComponent {
  protected readonly authTabs: readonly PillTab[] = [
    { id: 'login', label: 'Login' },
    { id: 'signup', label: 'Sign up' },
    { id: 'forgot', label: 'Recuperar' },
  ];
  protected readonly activeTab = signal<string>('login');

  protected readonly snippetsAuth: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'auth.html (estructura split-screen)',
      code: `<!-- Pill tabs para alternar Login / Sign up / Forgot -->
<div class="flex justify-center mb-6">
  <mm-pill-tabs [tabs]="authTabs" [(active)]="activeTab" />
</div>

<!-- Grid split-screen: branding (izquierda) + formulario (derecha) -->
<div class="rounded-mm-3xl border border-border-soft overflow-hidden
            shadow-mm-elevated grid grid-cols-1 md:grid-cols-2 min-h-[500px]">

  <!-- Aside con gradiente vibrante MinimalMax -->
  <aside class="hidden md:flex relative flex-col justify-between p-8
                bg-linear-to-br from-brand-deep via-brand-6 to-brand-pink
                text-white overflow-hidden">
    <div class="absolute inset-0 bg-dotted opacity-30 mix-blend-overlay"></div>
    <div class="relative flex items-center gap-2">
      <span class="size-9 rounded-mm-md bg-white/20 backdrop-blur grid place-items-center
                   font-display font-semibold">M</span>
      <span class="font-display text-base font-semibold">MinimalMax</span>
    </div>
    <h2 class="font-display text-3xl font-medium leading-tight relative">
      Bienvenido a tu galería de componentes.
    </h2>
    <!-- ... avatares + claim ... -->
  </aside>

  <!-- Section con switch entre 3 vistas -->
  <section class="p-8 md:p-10 flex flex-col justify-center bg-surface-base">
    @switch (activeTab()) {
      @case ('login') {
        <form class="max-w-sm mx-auto w-full flex flex-col gap-3">
          <!-- OAuth buttons + divider + email/password + CTA -->
          <input type="email" class="rounded-mm-md border-2 border-border
                 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/10" />
          <input type="password" class="rounded-mm-md border-2 border-border" />
          <button mmRipple class="rounded-mm-md bg-cta px-4 py-3 text-white mm-press">
            Iniciar sesión
          </button>
        </form>
      }
      @case ('signup') { <!-- ... Nombre + Apellido grid + email + password + terms ... --> }
      @case ('forgot') { <!-- ... Email + magic link CTA + volver al login ... --> }
    }
  </section>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'auth.ts',
      code: `import { Component, signal } from '@angular/core';
import { PillTab } from '../../shared/components/pill-tabs/pill-tabs';

@Component({
  selector: 'mm-auth',
  templateUrl: './auth.html',
})
export class AuthComponent {
  protected readonly authTabs: readonly PillTab[] = [
    { id: 'login', label: 'Login' },
    { id: 'signup', label: 'Sign up' },
    { id: 'forgot', label: 'Recuperar' },
  ];
  protected readonly activeTab = signal<string>('login');
}

// Para producción con Reactive Forms + Supabase Auth:
// import { FormBuilder, Validators } from '@angular/forms';
//
// private fb = inject(FormBuilder);
// protected loginForm = this.fb.nonNullable.group({
//   email: ['', [Validators.required, Validators.email]],
//   password: ['', [Validators.required, Validators.minLength(8)]],
// });
//
// protected async submit() {
//   const { email, password } = this.loginForm.getRawValue();
//   await this.supabase.auth.signInWithPassword({ email, password });
// }`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (extracto)',
      code: `/* Tokens MinimalMax usados en este patrón */
--color-brand-deep: #1d0d4e;
--color-brand-6: #1456f0;
--color-brand-pink: #ff3d8b;
--color-cta: #181e25;
--color-surface-base: #ffffff;
--color-border: #e6e8eb;
--color-border-soft: #f0f2f4;
--radius-mm-md: 8px;
--radius-mm-3xl: 32px;
--shadow-mm-elevated: 0 20px 50px -10px rgba(20, 30, 60, 0.18);

/* Patrón dotted del aside */
.bg-dotted {
  background-image: radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px);
  background-size: 24px 24px;
}`,
    },
  ];
}
