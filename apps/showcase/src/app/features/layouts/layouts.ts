import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'mm-layouts',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './layouts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class LayoutsComponent {
  protected readonly snippetsHeroCentrado: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'hero-centrado.html',
      code: `<section
  class="rounded-mm-2xl border border-border-soft p-10 md:p-16 text-center
         bg-linear-to-b from-surface-base via-surface-base to-surface-secondary/40"
>
  <span class="inline-flex items-center gap-2 rounded-mm-pill bg-primary-200/60
               text-primary-700 px-3 py-1 text-xs font-semibold">
    <span class="size-1.5 rounded-full bg-primary-700 animate-pulse"></span>
    Lanzamiento v0.3
  </span>

  <h1 class="font-display text-4xl md:text-6xl font-medium leading-[1.05]
             tracking-tight text-ink-dark mt-6 max-w-3xl mx-auto">
    Construye productos premium en menos tiempo.
  </h1>

  <p class="text-base md:text-lg text-ink-secondary mt-5 max-w-xl mx-auto">
    70 componentes accesibles con el ADN MinimalMax.
  </p>

  <div class="flex flex-wrap items-center justify-center gap-3 mt-8">
    <button class="rounded-mm-md bg-cta px-6 py-3 text-sm font-medium text-white
                   shadow-mm-sm hover:shadow-mm-elevated transition mm-press">
      Empezar ahora →
    </button>
    <button class="rounded-mm-md border border-border bg-surface-base px-6 py-3
                   text-sm font-medium text-ink-dark hover:border-ink-dark mm-press">
      Ver demo
    </button>
  </div>

  <!-- Grid de beneficios 3 cols -->
  <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
    <!-- ... cards de beneficios ... -->
  </div>
</section>`,
    },
  ];

  protected readonly snippetsSplitAsymmetric: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'split-asymmetric.html',
      code: `<section
  class="rounded-mm-2xl border border-border-soft bg-surface-base p-8 md:p-12
         grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
>
  <!-- Columna contenido -->
  <div>
    <span class="inline-flex items-center rounded-mm-pill bg-brand-pink/15
                 text-brand-pink px-3 py-1 text-xs font-semibold">
      Producto
    </span>
    <h2 class="font-display text-3xl md:text-4xl font-medium text-ink-dark
               leading-tight mt-4">
      Tu galería de componentes, sin reinventar la rueda.
    </h2>
    <p class="text-base text-ink-secondary mt-4 leading-relaxed">
      Cada pieza es 100% portátil. Copia, pega y funciona.
    </p>
    <ul class="flex flex-col gap-2 mt-6">
      <li class="flex items-center gap-2 text-sm text-ink-dark">
        <!-- icono check --> Tokens consistentes en @theme
      </li>
      <!-- ... más items ... -->
    </ul>
    <button class="mt-8 rounded-mm-md bg-brand-6 px-5 py-2.5 text-sm font-medium
                   text-white shadow-mm-brand hover:shadow-mm-elevated mm-press">
      Explorar componentes
    </button>
  </div>

  <!-- Columna mockup -->
  <div class="aspect-video rounded-mm-2xl bg-linear-to-br from-brand-6
              via-primary-500 to-brand-pink shadow-mm-brand relative overflow-hidden">
    <div class="absolute inset-0 bg-grid opacity-30"></div>
    <div class="absolute inset-6 rounded-mm-xl bg-surface-base/15 backdrop-blur-md
                border border-white/20 flex items-center justify-center">
      <span class="font-display text-white text-4xl font-medium">Mockup</span>
    </div>
  </div>
</section>`,
    },
  ];

  protected readonly snippetsDashboard: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'dashboard-layout.html',
      code: `<div class="rounded-mm-2xl border border-border-soft overflow-hidden">
  <div class="grid grid-cols-12 min-h-[500px]">
    <!-- Sidebar fijo -->
    <aside class="col-span-3 bg-surface-secondary/40 border-r border-border-soft
                  p-4 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <span class="size-8 rounded-mm-md bg-linear-to-br from-brand-6 to-brand-pink"></span>
        <span class="font-display font-semibold text-ink-dark">Acme</span>
      </div>
      <nav class="flex flex-col gap-2">
        <a class="rounded-mm-md bg-cta text-white px-3 py-2 text-sm font-medium">
          Dashboard
        </a>
        <a class="rounded-mm-md text-ink-secondary hover:bg-surface-secondary
                  px-3 py-2 text-sm">Proyectos</a>
        <!-- ... más items ... -->
      </nav>
    </aside>

    <!-- Canvas: topbar + main -->
    <section class="col-span-9 flex flex-col">
      <header class="flex items-center justify-between px-6 py-3
                     border-b border-border-soft">
        <span class="font-display font-medium text-ink-dark">Dashboard</span>
        <span class="size-8 rounded-mm-pill
                     bg-linear-to-br from-brand-6 to-brand-pink"></span>
      </header>

      <div class="flex-1 p-6 space-y-4">
        <!-- Grid de stats 3 cols -->
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-mm-xl bg-surface-base border border-border-soft p-4">
            <p class="text-xs text-ink-muted">MRR</p>
            <p class="font-display text-2xl font-medium text-ink-dark">$24.8K</p>
          </div>
          <!-- ... más stats ... -->
        </div>

        <!-- Bar chart inline -->
        <div class="rounded-mm-xl bg-surface-base border border-border-soft p-4">
          <p class="text-xs text-ink-muted mb-3">Ingresos últimos 30 días</p>
          <div class="flex items-end justify-between gap-1.5 h-24">
            @for (i of [60, 75, 50, 90, 70, 95, 80, 100, 88]; track $index) {
              <span [style.height.%]="i"
                    class="flex-1 rounded-mm-sm
                           bg-linear-to-t from-brand-6 to-primary-500"></span>
            }
          </div>
        </div>
      </div>
    </section>
  </div>
</div>`,
    },
  ];

  protected readonly snippetsMarketing3Cols: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'pricing-3cols.html',
      code: `<section class="rounded-mm-2xl border border-border-soft p-8
                bg-linear-to-b from-surface-secondary/30 to-surface-base">
  <div class="text-center mb-10">
    <h2 class="font-display text-3xl md:text-4xl font-medium text-ink-dark">
      Planes simples
    </h2>
    <p class="text-ink-secondary mt-2">Sin sorpresas. Upgrade o cancela cuando quieras.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
    <!-- Free -->
    <article class="rounded-mm-2xl bg-surface-base border border-border-soft p-6 flex flex-col">
      <h3 class="font-display text-lg font-semibold text-ink-dark">Free</h3>
      <p class="font-display text-4xl font-medium text-ink-dark mt-6">$0</p>
      <ul class="flex flex-col gap-2 mt-6 text-sm text-ink-secondary flex-1">
        <li>✓ Hasta 3 proyectos</li>
        <li>✓ Soporte comunidad</li>
      </ul>
      <button class="mt-6 rounded-mm-md border border-border py-2 text-sm font-medium">
        Empezar gratis
      </button>
    </article>

    <!-- Pro (destacado, -translate-y-2) -->
    <article class="relative rounded-mm-2xl bg-cta text-white p-6 flex flex-col
                    shadow-mm-elevated -translate-y-2">
      <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-mm-pill
                   bg-brand-6 px-3 py-1 text-[10px] font-semibold uppercase
                   tracking-wider shadow-mm-brand">
        Popular
      </span>
      <h3 class="font-display text-lg font-semibold">Pro</h3>
      <p class="font-display text-4xl font-medium mt-6">
        $19<span class="text-base text-white/60 font-normal">/mes</span>
      </p>
      <!-- ... features + CTA ... -->
    </article>

    <!-- Team -->
    <article class="rounded-mm-2xl bg-surface-base border border-border-soft p-6 flex flex-col">
      <!-- ... -->
    </article>
  </div>
</section>`,
    },
  ];

  protected readonly snippetsSettings: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'settings-layout.html',
      code: `<div class="rounded-mm-2xl border border-border-soft overflow-hidden
            grid grid-cols-12 min-h-96">
  <!-- Nav lateral -->
  <aside class="col-span-4 border-r border-border-soft bg-surface-secondary/30 p-4">
    <p class="text-[10px] uppercase tracking-wider font-semibold text-ink-muted
              px-2 mb-2">
      Cuenta
    </p>
    <nav class="flex flex-col gap-2">
      <!-- item activo: bg-surface-base + shadow-mm-sm -->
      <a class="rounded-mm-md bg-surface-base shadow-mm-sm px-3 py-2 text-sm
                font-medium text-ink-dark">
        Perfil
      </a>
      <a class="rounded-mm-md text-ink-secondary hover:bg-surface-secondary
                px-3 py-2 text-sm">
        Notificaciones
      </a>
      <!-- ... -->
    </nav>

    <p class="text-[10px] uppercase tracking-wider font-semibold text-ink-muted
              px-2 mt-4 mb-2">
      Workspace
    </p>
    <nav class="flex flex-col gap-2">
      <!-- ... -->
    </nav>
  </aside>

  <!-- Contenido -->
  <section class="col-span-8 p-6">
    <h3 class="font-display text-xl font-semibold text-ink-dark">Perfil</h3>
    <p class="text-sm text-ink-secondary mt-1">
      Tu información pública en MinimalMax.
    </p>

    <div class="mt-6 flex items-center gap-4">
      <span class="size-16 rounded-mm-pill bg-linear-to-br from-brand-6 to-brand-pink
                   grid place-items-center text-white font-display font-semibold">
        OJ
      </span>
      <div>
        <button class="rounded-mm-md bg-surface-secondary px-3 py-1.5 text-xs">
          Cambiar foto
        </button>
        <p class="text-[11px] text-ink-muted mt-1">PNG o JPG, máx 2 MB.</p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <input type="text" value="Orbe"
             class="rounded-mm-md border-2 border-border bg-surface-base
                    px-3 py-2 text-sm" />
      <input type="text" value="Jimenez"
             class="rounded-mm-md border-2 border-border bg-surface-base
                    px-3 py-2 text-sm" />
    </div>
  </section>
</div>`,
    },
  ];
}
