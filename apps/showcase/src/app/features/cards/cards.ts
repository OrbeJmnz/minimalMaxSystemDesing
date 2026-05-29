import { ChangeDetectionStrategy, Component, ElementRef, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { ChartSparklineComponent } from '@minimax/ui-angular';

@Component({
  selector: 'mm-cards',
  imports: [CanvasFrameComponent, SectionHeaderComponent, ChartSparklineComponent],
  templateUrl: './cards.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class CardsComponent {
  protected readonly productCards = [
    {
      title: 'Talk-01',
      description: 'Conversational AI model multilingüe con latencia <200ms.',
      gradient: 'from-brand-6 via-primary-500 to-brand-sky',
    },
    {
      title: 'Hailuo Image',
      description: 'Generación de imágenes 4K con consistencia de estilo.',
      gradient: 'from-brand-pink via-fuchsia-500 to-purple-600',
    },
    {
      title: 'Voice-02',
      description: 'Clonación de voz con 5 segundos de audio referencia.',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
    },
  ];

  protected readonly aiCards = [
    { name: 'Speech-02', tag: 'TTS', icon: 'M19 12a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v3m-3-3h6' },
    { name: 'Hailuo Video', tag: 'Video', icon: 'm10 8 6 4-6 4Z' },
    {
      name: 'MinimalMax Chat',
      tag: 'LLM',
      icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-15.6-.6L3 21l1.9-1.5a8.38 8.38 0 0 0 3.8.9',
    },
    {
      name: 'Music-01',
      tag: 'Audio',
      icon: 'M9 18V5l12-2v13M9 13l12-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    },
  ];

  protected readonly stats = [
    { label: 'Componentes', value: '70+', delta: '+8 esta semana' },
    { label: 'Bundles', value: '56kB', delta: 'Shell inicial' },
    { label: 'Build time', value: '0.4s', delta: 'Rebuild watch' },
    { label: 'Tokens', value: '64', delta: '@theme inline' },
  ];

  protected readonly profiles = [
    {
      name: 'Sofia Reyes',
      role: 'Senior Designer',
      bio: 'Design systems · brand · motion',
      initials: 'SR',
      tone: 'from-brand-pink to-fuchsia-500',
      stats: { followers: '2.4k', projects: 18 },
    },
    {
      name: 'Diego Luna',
      role: 'Backend Lead',
      bio: 'Go · Postgres · arquitectura distribuida',
      initials: 'DL',
      tone: 'from-emerald-500 to-teal-500',
      stats: { followers: '1.1k', projects: 24 },
    },
    {
      name: 'Ana Vega',
      role: 'Product Manager',
      bio: 'Estrategia · descubrimiento · roadmaps',
      initials: 'AV',
      tone: 'from-amber-500 to-orange-500',
      stats: { followers: '3.8k', projects: 11 },
    },
  ];

  protected readonly notifications: readonly {
    title: string;
    detail: string;
    time: string;
    variant: 'info' | 'success' | 'warning';
    icon: string;
  }[] = [
    {
      title: 'Nueva mención en Spacer',
      detail: 'Diego te mencionó en "Onboarding flow review"',
      time: 'Hace 2 min',
      variant: 'info',
      icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    },
    {
      title: 'Deployment exitoso',
      detail: 'v0.3.2 está live en producción · 12 commits',
      time: 'Hace 1 hora',
      variant: 'success',
      icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    },
    {
      title: 'Sesión expira pronto',
      detail: 'Tu sesión cerrará en 5 minutos por inactividad',
      time: 'Hace 4 min',
      variant: 'warning',
      icon: 'M12 8v4M12 16h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    },
  ];

  protected readonly articles = [
    {
      title: 'El arte de los floating labels que no compiten con el contenido',
      excerpt:
        'Por qué los labels flotantes mal posicionados rompen el ritmo visual y cómo alinearlos pixel-perfect.',
      tag: 'UI',
      author: 'Sofia Reyes',
      readTime: '6 min',
      gradient: 'from-brand-6 to-primary-500',
    },
    {
      title: 'Drag & drop con pointer events: el patrón cross-platform',
      excerpt:
        'Cómo migrar de drag native HTML5 a pointer events para que funcione en mobile, tablet y desktop con el mismo código.',
      tag: 'Engineering',
      author: 'Diego Luna',
      readTime: '12 min',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Tokens semánticos vs literales en dark mode',
      excerpt:
        'Por qué llamar a un token "ink-charcoal" rompe tu dark mode, y cómo nombrarlos para que sobrevivan a una inversión completa.',
      tag: 'Design Systems',
      author: 'Ana Vega',
      readTime: '8 min',
      gradient: 'from-brand-pink to-fuchsia-500',
    },
  ];

  protected readonly testimonials = [
    {
      quote:
        'MinimalMax nos ahorró 3 semanas de build inicial. Los componentes son portables, accesibles y se ven premium en ambos temas — exactamente lo que necesitábamos para nuestro MVP.',
      author: 'Karina Mendez',
      role: 'CTO @ Spacer',
      initials: 'KM',
      tone: 'from-brand-6 to-brand-pink',
    },
    {
      quote:
        'Después de probar 4 design systems, este es el primero que de verdad respeta el dark mode sin parches. Los floating labels y el drag&drop con touch son joyas.',
      author: 'Luis Mora',
      role: 'Lead Engineer @ InventarioLibero',
      initials: 'LM',
      tone: 'from-emerald-500 to-teal-500',
    },
  ];

  protected readonly comparisonPlans = [
    {
      name: 'MinimalMax base',
      tagline: 'Tu starter actual',
      highlighted: true,
      points: [
        { ok: true, text: '30+ componentes shared' },
        { ok: true, text: 'Dark mode SSR-safe' },
        { ok: true, text: 'Cero dependencias externas' },
        { ok: true, text: 'Bundle inicial 75 KB' },
        { ok: false, text: 'Soporte premium incluido' },
      ],
    },
    {
      name: 'Material Design',
      tagline: 'Lib alternativa',
      highlighted: false,
      points: [
        { ok: true, text: '60+ componentes built-in' },
        { ok: true, text: 'Dark mode out of the box' },
        { ok: false, text: 'Requiere @angular/material (350 KB)' },
        { ok: false, text: 'Bundle inicial 180+ KB' },
        { ok: true, text: 'Soporte oficial Google' },
      ],
    },
  ];

  protected readonly events = [
    {
      day: '17',
      month: 'May',
      title: 'Demo cliente Acme',
      time: '11:00 — 12:00',
      location: 'Sala virtual · Zoom',
      tone: 'from-brand-6 to-primary-500',
      attendees: 4,
    },
    {
      day: '20',
      month: 'May',
      title: 'Workshop accesibilidad',
      time: 'Todo el día',
      location: 'Auditorio CDMX',
      tone: 'from-brand-pink to-fuchsia-500',
      attendees: 28,
    },
    {
      day: '03',
      month: 'Jun',
      title: 'Sprint planning Q3',
      time: '09:30 — 11:00',
      location: 'Oficina · Roma Norte',
      tone: 'from-emerald-500 to-teal-500',
      attendees: 8,
    },
  ];

  protected readonly tracks = [
    {
      title: 'Midnight Run',
      artist: 'The Replays',
      album: 'Neon Tape',
      cover: 'from-violet-600 via-fuchsia-500 to-pink-500',
      duration: '3:42',
      progress: 0.42,
      playing: true,
      wave: [0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.7, 0.5, 0.8, 0.4, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4],
    },
    {
      title: 'Outline',
      artist: 'Modular Sun',
      album: 'Soft Lines',
      cover: 'from-amber-500 via-orange-500 to-red-500',
      duration: '4:18',
      progress: 0,
      playing: false,
      wave: [0.5, 0.3, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5, 0.4, 0.7, 0.6, 0.5, 0.8, 0.3, 0.5, 0.6],
    },
  ];

  protected readonly heroStats = {
    label: 'Ingresos del mes',
    value: '$184,250',
    delta: 14.4,
    trendUp: true,
    spark: [42, 38, 52, 48, 58, 55, 64, 72, 68, 78, 84, 92, 88, 96],
    sublabel: 'vs $161,032 mes anterior',
  };

  protected readonly weather = {
    location: 'Ciudad de México',
    temp: 22,
    condition: 'Parcialmente nublado',
    high: 25,
    low: 17,
    feels: 21,
    forecast: [
      { day: 'Vie', icon: '☀️', high: 26, low: 18 },
      { day: 'Sáb', icon: '⛅', high: 24, low: 17 },
      { day: 'Dom', icon: '🌧️', high: 21, low: 15 },
      { day: 'Lun', icon: '⛈️', high: 19, low: 14 },
      { day: 'Mar', icon: '☀️', high: 23, low: 16 },
    ],
  };

  protected readonly jobs = [
    {
      company: 'Vercel',
      logo: 'V',
      tone: 'from-ink-charcoal to-ink-dark',
      role: 'Senior Frontend Engineer',
      location: 'Remoto · LATAM',
      salary: '$140k–$180k USD',
      skills: ['Angular 21', 'Tailwind 4', 'SSR', 'Signals'],
      posted: 'Hace 2 días',
      tag: 'Featured',
    },
    {
      company: 'Stripe',
      logo: 'S',
      tone: 'from-[#635BFF] to-purple-600',
      role: 'Product Designer',
      location: 'Remoto · Global',
      salary: '$120k–$160k USD',
      skills: ['Design systems', 'Figma', 'Motion', 'Accessibility'],
      posted: 'Hace 5 días',
    },
  ];

  protected readonly snippetsProductCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'product-cards.html',
      code: `<div data-stagger class="grid grid-cols-1 md:grid-cols-3 gap-5">
  @for (card of productCards; track card.title) {
    <article
      [class]="
        'group relative rounded-mm-3xl p-6 text-white shadow-mm-brand bg-linear-to-br
         mm-hover-lift mm-card-shine cursor-pointer ' + card.gradient
      "
    >
      <span
        class="absolute inset-0 bg-linear-to-br from-white/0 via-white/20 to-white/0
               opacity-0 group-hover:opacity-100 transition-opacity duration-500
               pointer-events-none"
      ></span>
      <div class="relative flex justify-between items-start mb-12">
        <span
          class="rounded-mm-pill bg-white/20 px-3 py-1 text-[10px] font-semibold
                 uppercase tracking-wider backdrop-blur"
        >
          Nuevo
        </span>
      </div>
      <h3 class="relative font-display text-2xl font-medium leading-tight mb-2">
        {{ card.title }}
      </h3>
      <p class="relative text-sm text-white/80 leading-relaxed">{{ card.description }}</p>
    </article>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'cards.ts (extracto)',
      code: `protected readonly productCards = [
  {
    title: 'Talk-01',
    description: 'Conversational AI model multilingüe con latencia <200ms.',
    gradient: 'from-brand-6 via-primary-500 to-brand-sky',
  },
  {
    title: 'Hailuo Image',
    description: 'Generación de imágenes 4K con consistencia de estilo.',
    gradient: 'from-brand-pink via-fuchsia-500 to-purple-600',
  },
  {
    title: 'Voice-02',
    description: 'Clonación de voz con 5 segundos de audio referencia.',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
  },
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (mm-card-shine + mm-hover-lift)',
      code: `.mm-card-shine {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.mm-card-shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 850ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
}

.mm-card-shine:hover::after {
  transform: translateX(100%);
}

.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* Stagger entry de los 3 cards */
[data-stagger] > * {
  opacity: 0;
  animation: fadeInUp 600ms var(--ease-out) both;
}
[data-stagger] > *:nth-child(1) { animation-delay: 40ms; }
[data-stagger] > *:nth-child(2) { animation-delay: 100ms; }
[data-stagger] > *:nth-child(3) { animation-delay: 160ms; }`,
    },
  ];

  protected readonly iconBgCards = [
    {
      title: 'Analytics',
      subtitle: 'Métricas en tiempo real',
      description: 'Dashboards con sparklines, drill-down y exportación a Excel.',
      gradient: 'from-brand-6 via-primary-500 to-brand-sky',
      iconColor: 'text-white',
      icon: 'M3 3v18h18M7 14l4-4 4 4 5-5',
    },
    {
      title: 'AI Studio',
      subtitle: 'Modelos generativos',
      description: 'Talk · Hailuo · Voice · Image — toda la familia MinimalMax.',
      gradient: 'from-brand-pink via-fuchsia-500 to-purple-600',
      iconColor: 'text-white',
      icon: 'm12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z',
    },
    {
      title: 'Cloud Storage',
      subtitle: 'Sincronización global',
      description: 'Buckets ilimitados con encriptación E2E y CDN edge.',
      gradient: 'from-cyan-500 via-sky-500 to-blue-600',
      iconColor: 'text-white',
      icon: 'M17.5 19a4.5 4.5 0 1 0-1.42-8.78A7 7 0 1 0 4 14.94',
    },
    {
      title: 'Automation',
      subtitle: 'Workflows sin código',
      description: 'Triggers, condiciones y acciones — Zapier-style pero on-prem.',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      iconColor: 'text-white',
      icon: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
    },
    {
      title: 'Security',
      subtitle: 'Auth y permisos',
      description: 'RBAC granular, audit logs, 2FA y SSO con SAML/OIDC.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      iconColor: 'text-white',
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    },
    {
      title: 'Payments',
      subtitle: 'Cobros y suscripciones',
      description: 'Stripe + Mercado Pago + Apple/Google Pay en un solo SDK.',
      gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
      iconColor: 'text-white',
      icon: 'M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
    },
  ];

  protected readonly tiltState = signal<{ rotateX: number; rotateY: number }>({
    rotateX: 0,
    rotateY: 0,
  });

  protected onTiltMove(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.tiltState.set({
      rotateY: (x - 0.5) * 18,
      rotateX: -(y - 0.5) * 18,
    });
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  }

  protected onTiltLeave(): void {
    this.tiltState.set({ rotateX: 0, rotateY: 0 });
  }

  protected notificationTone(variant: 'info' | 'success' | 'warning'): string {
    switch (variant) {
      case 'success':
        return 'bg-success-bg text-success';
      case 'warning':
        return 'bg-warning-bg text-warning';
      default:
        return 'bg-primary-200 text-primary-700';
    }
  }

  protected readonly snippetsAiCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'ai-cards-matrix.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-4 gap-4">
  @for (card of aiCards; track card.name) {
    <article
      class="group rounded-mm-xl bg-surface-base border border-border-soft p-5
             shadow-mm-sm mm-hover-lift mm-card-spotlight cursor-pointer"
    >
      <div
        class="size-12 rounded-mm-md bg-linear-to-br from-primary-500 to-brand-deep
               grid place-items-center mb-4 shadow-mm-brand
               transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
      >
        <svg class="size-5 text-white" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <path [attr.d]="card.icon"></path>
        </svg>
      </div>
      <p class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-1">
        {{ card.tag }}
      </p>
      <h4 class="font-display text-base font-medium text-ink-dark">{{ card.name }}</h4>
    </article>
  }
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (mm-card-spotlight)',
      code: `.mm-card-spotlight {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.mm-card-spotlight::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    420px circle at var(--mx, 50%) var(--my, 50%),
    rgba(20, 86, 240, 0.18),
    transparent 45%
  );
  opacity: 0;
  transition: opacity 300ms var(--ease-out);
}

.mm-card-spotlight:hover::before { opacity: 1; }`,
    },
  ];

  protected readonly snippetsStatCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'stat-cards.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-4 gap-4">
  @for (stat of stats; track stat.label) {
    <div
      class="rounded-mm-xl bg-surface-base border border-border-soft p-5
             shadow-mm-sm border-l-4 border-l-brand-6 mm-hover-lift"
    >
      <p class="text-xs text-ink-muted mb-1">{{ stat.label }}</p>
      <p class="font-display text-3xl font-medium text-ink-dark leading-none">
        {{ stat.value }}
      </p>
      <p class="text-xs text-success mt-2 font-medium">↑ {{ stat.delta }}</p>
    </div>
  }
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsGlassCard: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'glass-card.html',
      code: `<div
  class="relative rounded-mm-3xl overflow-hidden p-10
         bg-linear-to-br from-brand-deep via-brand-6 to-brand-pink"
>
  <div
    class="relative rounded-mm-2xl border border-white/20 bg-white/10
           backdrop-blur-xl p-8 max-w-md"
  >
    <span
      class="rounded-mm-pill bg-white/20 px-3 py-1 text-[10px] font-semibold
             uppercase tracking-wider text-white backdrop-blur"
    >
      Premium
    </span>
    <h3 class="font-display text-2xl font-medium text-white mt-4 mb-2">
      Componentes vivos
    </h3>
    <p class="text-sm text-white/80 leading-relaxed mb-6">
      Glassmorphism con backdrop-filter:blur(12px) y border 1px white/20 —
      la firma para hero sections y headers translúcidos.
    </p>
    <button
      type="button"
      class="rounded-mm-md bg-white px-5 py-2.5 text-sm font-medium text-ink-dark
             hover:bg-white/90 transition"
    >
      Explorar →
    </button>
  </div>
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'Glassmorphism recipe',
      code: `/* La firma del glass: */
.glass {
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.20);
  border-radius: var(--radius-mm-2xl);
}

/* En Tailwind v4 se logra con: */
/*   class="bg-white/10 backdrop-blur-xl border border-white/20" */`,
    },
  ];

  protected readonly snippetsFeatureCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'feature-cards.html',
      code: `<div data-stagger class="grid grid-cols-1 md:grid-cols-3 gap-5">
  <article
    class="rounded-mm-2xl bg-surface-base border border-border-soft p-6
           shadow-mm-sm mm-hover-lift"
  >
    <div
      class="size-12 rounded-mm-md bg-primary-200 text-primary-700
             grid place-items-center mb-4"
    >
      <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path>
      </svg>
    </div>
    <h3 class="font-display text-lg font-medium text-ink-dark mb-2">Rapidez extrema</h3>
    <p class="text-sm text-ink-secondary mb-4 leading-relaxed">
      Build incremental con esbuild. Cambios visibles en menos de 500ms.
    </p>
    <a class="text-sm font-medium text-brand-6 inline-flex items-center gap-1
              hover:gap-2 transition-all">
      Saber más →
    </a>
  </article>
  <!-- ... resto en cards.html -->
</div>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsProfileCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'profile-cards.html',
      code: `<article
  class="group rounded-mm-2xl bg-surface-base border border-border-soft p-6
         shadow-mm-sm mm-hover-lift mm-card-spotlight mm-card-glow text-center"
>
  <div class="relative inline-block">
    <span
      [class]="
        'size-20 rounded-mm-pill grid place-items-center text-white
         font-display font-semibold text-2xl shadow-mm-brand bg-linear-to-br ' + person.tone
      "
    >
      {{ person.initials }}
    </span>
    <span class="absolute -bottom-1 -right-1 size-5 rounded-mm-pill bg-success
                 ring-3 ring-surface-base"></span>
  </div>
  <h3 class="font-display text-lg font-medium text-ink-dark mt-4">{{ person.name }}</h3>
  <p class="text-xs text-brand-6 font-semibold uppercase tracking-wider">{{ person.role }}</p>
  <p class="text-sm text-ink-secondary mt-2 leading-relaxed">{{ person.bio }}</p>

  <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border-soft text-left">
    <div>
      <p class="text-xs text-ink-muted">Followers</p>
      <p class="font-mono text-sm font-medium">{{ person.stats.followers }}</p>
    </div>
    <div>
      <p class="text-xs text-ink-muted">Proyectos</p>
      <p class="font-mono text-sm font-medium">{{ person.stats.projects }}</p>
    </div>
  </div>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (mm-card-glow)',
      code: `.mm-card-glow {
  transition:
    box-shadow var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}

.mm-card-glow:hover {
  box-shadow:
    0 0 38px -8px rgba(20, 86, 240, 0.35),
    0 20px 40px -12px rgba(0, 0, 0, 0.18);
}`,
    },
  ];

  protected readonly snippetsNotificationCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'notification-cards.html',
      code: `<ul data-stagger class="flex flex-col gap-3 max-w-xl">
  @for (note of notifications; track note.title) {
    <li
      class="group flex items-start gap-4 p-4 rounded-mm-xl bg-surface-base
             border border-border-soft shadow-mm-sm mm-hover-lift cursor-pointer"
    >
      <span
        class="size-10 shrink-0 rounded-mm-md grid place-items-center"
        [class]="notificationTone(note.variant)"
      >
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path [attr.d]="note.icon"></path>
        </svg>
      </span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="font-medium text-ink-dark truncate">{{ note.title }}</p>
          <span class="text-xs text-ink-muted font-mono">{{ note.time }}</span>
        </div>
        <p class="text-sm text-ink-secondary mt-1">{{ note.detail }}</p>
      </div>
    </li>
  }
</ul>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'cards.ts (notificationTone)',
      code: `protected notificationTone(variant: 'info' | 'success' | 'warning'): string {
  switch (variant) {
    case 'success': return 'bg-success-bg text-success';
    case 'warning': return 'bg-warning-bg text-warning';
    default:        return 'bg-primary-200 text-primary-700';
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsArticleCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'article-cards.html',
      code: `<article
  class="group rounded-mm-2xl bg-surface-base border border-border-soft shadow-mm-sm
         overflow-hidden mm-hover-lift mm-card-shine cursor-pointer flex flex-col"
>
  <div [class]="'aspect-16/10 bg-linear-to-br relative overflow-hidden ' + article.gradient">
    <span class="absolute inset-0 bg-grid opacity-30 mix-blend-overlay"></span>
    <span class="absolute top-3 left-3 rounded-mm-pill bg-white/20 backdrop-blur
                 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
      {{ article.tag }}
    </span>
  </div>
  <div class="p-5 flex flex-col flex-1">
    <h3 class="font-display text-lg font-medium text-ink-dark leading-snug
               group-hover:text-brand-6 transition-colors">
      {{ article.title }}
    </h3>
    <p class="text-sm text-ink-secondary mt-2 leading-relaxed flex-1">{{ article.excerpt }}</p>
    <footer class="flex items-center justify-between mt-4 pt-4 border-t border-border-soft">
      <span class="flex items-center gap-2 text-xs text-ink-secondary">
        <span class="size-6 rounded-mm-pill bg-surface-secondary grid place-items-center
                     font-display font-semibold text-[10px] text-ink-dark">
          {{ article.author.charAt(0) }}
        </span>
        {{ article.author }}
      </span>
      <span class="text-xs text-ink-muted font-mono">{{ article.readTime }}</span>
    </footer>
  </div>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift + mm-card-shine',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* mm-card-shine — barrido de luz diagonal en hover */
.mm-card-shine { position: relative; overflow: hidden; isolation: isolate; }
.mm-card-shine::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 850ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.mm-card-shine:hover::after { transform: translateX(100%); }`,
    },
  ];

  protected readonly snippetsPricingHorizontal: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'pricing-horizontal.html',
      code: `<div
  class="rounded-mm-3xl bg-linear-to-r from-surface-inverse to-surface-inverse-deep
         text-white p-6 md:p-8 shadow-mm-brand flex flex-col md:flex-row
         items-start md:items-center gap-6"
>
  <div class="flex-1 min-w-0">
    <span class="inline-flex items-center rounded-mm-pill bg-white/20 backdrop-blur
                 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
      Upgrade a Team
    </span>
    <h3 class="font-display text-2xl md:text-3xl font-medium leading-tight mt-3">
      Tu equipo necesita SSO + audit log
    </h3>
    <ul class="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-white/80">
      <li class="flex items-center gap-1.5">✓ 10 seats incluidos</li>
      <li class="flex items-center gap-1.5">✓ SSO con Google/Microsoft</li>
      <!-- ... -->
    </ul>
  </div>
  <div class="flex flex-col items-start md:items-end gap-3 shrink-0">
    <p class="font-display text-3xl font-medium">
      $49<span class="text-base text-white/60 font-normal"> /mes</span>
    </p>
    <button class="rounded-mm-md bg-brand-6 px-5 py-2.5 text-sm font-medium text-white
                   shadow-mm-brand hover:shadow-mm-elevated transition mm-press">
      Hacer upgrade
    </button>
  </div>
</div>`,
    },
  ];

  protected readonly snippetsTestimonialCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'testimonial-cards.html',
      code: `<article
  class="relative rounded-mm-2xl bg-surface-base border border-border-soft
         p-6 md:p-8 shadow-mm-sm mm-hover-lift"
>
  <!-- Comilla decorativa -->
  <svg class="absolute top-5 right-5 size-10 text-primary-200/60"
       viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 21c0-6.6 4-9.5 8-10v3c-3 1-5 3.5-5 7h5v6H3v-6zm12 0c0-6.6 4-9.5 8-10v3c-3 1-5 3.5-5 7h5v6h-8v-6z"></path>
  </svg>

  <p class="relative font-mid text-base md:text-lg text-ink-dark leading-relaxed">
    "{{ item.quote }}"
  </p>

  <footer class="flex items-center gap-3 mt-6 pt-4 border-t border-border-soft">
    <span [class]="
      'size-10 rounded-mm-pill grid place-items-center text-white
       font-display font-semibold text-sm shadow-mm-sm bg-linear-to-br ' + item.tone
    ">
      {{ item.initials }}
    </span>
    <div>
      <p class="font-medium text-ink-dark">{{ item.author }}</p>
      <p class="text-xs text-ink-muted">{{ item.role }}</p>
    </div>
  </footer>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}`,
    },
  ];

  protected readonly snippetsComparisonCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'comparison-cards.html',
      code: `<article
  class="relative rounded-mm-2xl border-2 p-6 transition-all duration-200
         mm-hover-lift mm-card-gradient-border"
  [class.is-active]="plan.highlighted"
  [class.border-brand-6]="plan.highlighted"
  [class.shadow-mm-brand]="plan.highlighted"
  [class.bg-surface-base]="!plan.highlighted"
  [class.bg-linear-to-br]="plan.highlighted"
  [class.from-primary-200/30]="plan.highlighted"
  [class.to-surface-base]="plan.highlighted"
  [class.border-border-soft]="!plan.highlighted"
>
  @if (plan.highlighted) {
    <span class="absolute -top-3 left-6 rounded-mm-pill bg-brand-6 text-white
                 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider
                 shadow-mm-brand">
      Recomendado
    </span>
  }
  <h3 class="font-display text-xl font-medium text-ink-dark">{{ plan.name }}</h3>
  <p class="text-xs text-ink-muted mt-1 mb-5">{{ plan.tagline }}</p>
  <ul class="flex flex-col gap-2.5">
    @for (point of plan.points; track point.text) {
      <li class="flex items-start gap-2 text-sm">
        @if (point.ok) {
          <svg class="size-5 text-success shrink-0 mt-0.5" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
          <span class="text-ink-dark">{{ point.text }}</span>
        } @else {
          <svg class="size-5 text-ink-muted shrink-0 mt-0.5" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6 6 18M6 6l12 12"></path>
          </svg>
          <span class="text-ink-muted line-through">{{ point.text }}</span>
        }
      </li>
    }
  </ul>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (mm-card-gradient-border)',
      code: `.mm-card-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(
    135deg,
    var(--color-brand-6),
    var(--color-brand-pink),
    var(--color-brand-6)
  );
  background-size: 200% 200%;
  -webkit-mask:
    linear-gradient(#fff, #fff) content-box,
    linear-gradient(#fff, #fff);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 400ms var(--ease-out);
  animation: mm-card-gradient-rotate 4s linear infinite;
  pointer-events: none;
}

.mm-card-gradient-border:hover::before,
.mm-card-gradient-border.is-active::before {
  opacity: 1;
}`,
    },
  ];

  protected readonly snippetsEventCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'event-cards.html',
      code: `<article
  class="group flex items-center gap-4 p-4 rounded-mm-2xl bg-surface-base
         border border-border-soft shadow-mm-sm mm-hover-lift
         mm-card-spotlight cursor-pointer"
>
  <!-- Bloque de fecha grande con gradient -->
  <div [class]="
    'shrink-0 size-16 rounded-mm-xl flex flex-col items-center justify-center
     text-white shadow-mm-brand bg-linear-to-br ' + event.tone
  ">
    <span class="text-[10px] uppercase tracking-wider font-semibold opacity-80">
      {{ event.month }}
    </span>
    <span class="font-display text-2xl font-medium leading-none">{{ event.day }}</span>
  </div>

  <div class="flex-1 min-w-0">
    <h4 class="font-display text-base font-medium text-ink-dark
               group-hover:text-brand-6 transition-colors">
      {{ event.title }}
    </h4>
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1
                text-xs text-ink-secondary">
      <span>🕒 {{ event.time }}</span>
      <span>📍 {{ event.location }}</span>
    </div>
  </div>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift + mm-card-spotlight',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* mm-card-spotlight — halo radial que sigue al cursor (--mx/--my vía mousemove) */
.mm-card-spotlight { position: relative; overflow: hidden; isolation: isolate; }
.mm-card-spotlight::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%),
              rgba(20, 86, 240, 0.18), transparent 45%);
  opacity: 0; transition: opacity 300ms var(--ease-out);
}
.mm-card-spotlight:hover::before { opacity: 1; }`,
    },
  ];

  protected readonly snippetsMusicPlayer: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'music-player.html',
      code: `<article
  class="group flex items-center gap-4 p-3 rounded-mm-2xl bg-surface-base
         border border-border-soft shadow-mm-sm mm-hover-lift mm-card-glow-pink"
>
  <!-- Cover art con play overlay -->
  <div [class]="
    'relative shrink-0 size-20 rounded-mm-xl overflow-hidden shadow-mm-brand
     bg-linear-to-br ' + track.cover
  ">
    <div class="absolute inset-0 bg-grid opacity-30 mix-blend-overlay"></div>
    <button class="absolute inset-0 grid place-items-center bg-black/30
                   opacity-0 group-hover:opacity-100 transition-opacity mm-press">
      <span class="size-10 rounded-mm-pill bg-white text-ink-dark
                   grid place-items-center shadow-mm-elevated">
        @if (track.playing) {
          <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        }
      </span>
    </button>
  </div>

  <!-- Info + waveform mock -->
  <div class="flex-1 min-w-0">
    <p class="font-display text-base font-medium truncate">{{ track.title }}</p>
    <p class="text-xs text-ink-muted truncate">{{ track.artist }} · {{ track.album }}</p>
    <div class="flex items-end gap-0.5 mt-2 h-6">
      @for (bar of track.wave; track $index) {
        <span
          class="flex-1 rounded-mm-sm"
          [class.bg-brand-6]="track.playing && $index / track.wave.length < track.progress"
          [class.bg-border]="!track.playing || $index / track.wave.length >= track.progress"
          [style.height.%]="bar * 100"
        ></span>
      }
    </div>
  </div>
</article>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'cards.ts (tracks)',
      code: `protected readonly tracks = [
  {
    title: 'Midnight Run',
    artist: 'The Replays',
    album: 'Neon Tape',
    cover: 'from-violet-600 via-fuchsia-500 to-pink-500',
    duration: '3:42',
    progress: 0.42,
    playing: true,
    wave: [0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.7, 0.5,
           0.8, 0.4, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4],
  },
  // ...
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift + mm-card-glow-pink',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* mm-card-glow-pink — glow rosa en hover */
.mm-card-glow-pink:hover {
  box-shadow: 0 0 38px -8px rgba(234, 94, 193, 0.4),
              0 20px 40px -12px rgba(0, 0, 0, 0.18);
}`,
    },
  ];

  protected readonly snippetsStatsHero: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'stats-hero.html',
      code: `<article
  class="relative rounded-mm-3xl bg-linear-to-br from-surface-inverse to-surface-inverse-deep
         text-white p-8 shadow-mm-brand grid grid-cols-1 md:grid-cols-3 gap-6
         items-center mm-card-shine overflow-hidden"
>
  <div class="md:col-span-2">
    <p class="text-[10px] uppercase tracking-wider text-white/60 font-semibold">
      {{ heroStats.label }}
    </p>
    <div class="flex items-end gap-3 mt-2">
      <p class="font-display text-5xl md:text-6xl font-medium leading-none tabular-nums">
        {{ heroStats.value }}
      </p>
      <span class="inline-flex items-center gap-1 rounded-mm-pill
                   bg-success-bg/20 text-success px-2.5 py-1
                   text-xs font-semibold backdrop-blur">
        ↑ {{ heroStats.delta }}%
      </span>
    </div>
    <p class="text-xs text-white/60 mt-2 font-mono">{{ heroStats.sublabel }}</p>
  </div>
  <div class="h-20 md:h-24">
    <mm-chart-sparkline [data]="heroStats.spark" variant="success" />
  </div>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift + mm-card-shine',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* mm-card-shine — barrido de luz diagonal en hover */
.mm-card-shine { position: relative; overflow: hidden; isolation: isolate; }
.mm-card-shine::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 850ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.mm-card-shine:hover::after { transform: translateX(100%); }`,
    },
  ];

  protected readonly snippetsWeatherCard: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'weather-card.html',
      code: `<article
  class="rounded-mm-3xl bg-linear-to-br from-brand-sky via-primary-500 to-brand-6
         text-white p-6 shadow-mm-brand max-w-md relative overflow-hidden
         mm-card-shine mm-hover-lift"
>
  <div class="absolute inset-0 bg-dotted opacity-20 mix-blend-overlay"></div>

  <header class="relative flex items-center justify-between">
    <div>
      <p class="text-[10px] uppercase tracking-wider text-white/70 font-semibold">
        Hoy · 14:30
      </p>
      <p class="font-display text-base font-medium mt-0.5">{{ weather.location }}</p>
    </div>
    <span class="text-4xl">⛅</span>
  </header>

  <div class="relative mt-6 flex items-end gap-2">
    <span class="font-display text-7xl font-medium leading-none tabular-nums">
      {{ weather.temp }}°
    </span>
    <div class="text-xs text-white/80 pb-2 leading-relaxed">
      <p>{{ weather.condition }}</p>
      <p class="font-mono">↑{{ weather.high }}° · ↓{{ weather.low }}° · Sensación {{ weather.feels }}°</p>
    </div>
  </div>

  <!-- Forecast 5 días -->
  <div class="relative mt-6 pt-4 border-t border-white/20 grid grid-cols-5 gap-2">
    @for (f of weather.forecast; track f.day) {
      <div class="flex flex-col items-center text-center gap-1">
        <span class="text-[10px] uppercase tracking-wider text-white/70">{{ f.day }}</span>
        <span class="text-xl">{{ f.icon }}</span>
        <span class="font-mono text-xs tabular-nums">{{ f.high }}°</span>
      </div>
    }
  </div>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift + mm-card-shine',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* mm-card-shine — barrido de luz diagonal en hover */
.mm-card-shine { position: relative; overflow: hidden; isolation: isolate; }
.mm-card-shine::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 850ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.mm-card-shine:hover::after { transform: translateX(100%); }`,
    },
  ];

  protected readonly snippetsJobCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'job-cards.html',
      code: `<article
  class="group relative rounded-mm-2xl bg-surface-base border border-border-soft
         p-5 shadow-mm-sm mm-hover-lift mm-card-spotlight cursor-pointer"
  [class.mm-card-gradient-border]="job.tag"
>
  @if (job.tag) {
    <span class="absolute top-4 right-4 rounded-mm-pill bg-warning-bg text-warning
                 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
      ⭐ {{ job.tag }}
    </span>
  }
  <header class="flex items-center gap-3">
    <span [class]="
      'size-12 rounded-mm-xl grid place-items-center font-display font-bold
       text-white text-xl shadow-mm-sm bg-linear-to-br ' + job.tone
    ">
      {{ job.logo }}
    </span>
    <div class="min-w-0">
      <p class="font-display text-base font-medium truncate">{{ job.company }}</p>
      <p class="text-xs text-ink-muted">{{ job.posted }}</p>
    </div>
  </header>

  <h4 class="font-display text-lg font-medium mt-4
             group-hover:text-brand-6 transition-colors">{{ job.role }}</h4>

  <div class="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border-soft">
    @for (skill of job.skills; track skill) {
      <span class="rounded-mm-pill bg-surface-secondary text-ink-secondary
                   px-2 py-0.5 text-[10px] font-medium">
        {{ skill }}
      </span>
    }
  </div>
</article>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-lift + mm-card-spotlight + mm-card-gradient-border',
      code: `/* mm-hover-lift — elevación suave en hover */
.mm-hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
  will-change: transform;
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated);
}

/* mm-card-spotlight — halo radial que sigue al cursor (--mx/--my vía mousemove) */
.mm-card-spotlight { position: relative; overflow: hidden; isolation: isolate; }
.mm-card-spotlight::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%),
              rgba(20, 86, 240, 0.18), transparent 45%);
  opacity: 0; transition: opacity 300ms var(--ease-out);
}
.mm-card-spotlight:hover::before { opacity: 1; }

/* mm-card-gradient-border — borde gradiente animado en rotación */
.mm-card-gradient-border::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 2px;
  background: linear-gradient(135deg, var(--color-brand-6), var(--color-brand-pink), var(--color-brand-6));
  background-size: 200% 200%;
  -webkit-mask: linear-gradient(#fff,#fff) content-box, linear-gradient(#fff,#fff);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity 400ms var(--ease-out);
  animation: mm-card-gradient-rotate 4s linear infinite;
}
.mm-card-gradient-border:hover::before { opacity: 1; }
@keyframes mm-card-gradient-rotate {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}`,
    },
  ];

  protected readonly snippetsCategoryCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'category-cards.html',
      code: `<article
  [class]="
    'group relative overflow-hidden rounded-mm-3xl p-7 text-white shadow-mm-brand
     bg-linear-to-br cursor-pointer transition-all duration-500 ease-out
     hover:shadow-mm-elevated hover:-translate-y-1 min-h-56 ' + card.gradient
  "
>
  <!-- Icono gigante en background con rotate al hover -->
  <span
    class="pointer-events-none absolute -right-8 -bottom-8 transition-all
           duration-500 ease-bounce
           group-hover:scale-125 group-hover:-rotate-12
           group-hover:-translate-y-2 group-hover:-translate-x-2"
    [class]="card.iconColor"
  >
    <svg class="size-44 opacity-15 group-hover:opacity-25 transition-opacity
                duration-500 drop-shadow-2xl"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path [attr.d]="card.icon"></path>
    </svg>
  </span>

  <div class="relative flex h-full flex-col">
    <span class="inline-flex items-center gap-1.5 rounded-mm-pill bg-white/20
                 backdrop-blur w-fit px-3 py-1 text-[10px] font-semibold uppercase">
      <span class="size-1.5 rounded-full bg-white animate-pulse"></span>
      {{ card.subtitle }}
    </span>
    <h3 class="font-display text-2xl font-medium leading-tight mt-4">{{ card.title }}</h3>
    <p class="text-sm text-white/80 mt-2 max-w-[80%]">{{ card.description }}</p>
  </div>
</article>`,
    },
  ];

  protected readonly snippetsTiltCard: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'tilt-card.html',
      code: `<div class="flex justify-center py-6" style="perspective: 1200px">
  <article
    (pointermove)="onTiltMove($event)"
    (pointerleave)="onTiltLeave()"
    [style.transform]="
      'rotateX(' + tiltState().rotateX + 'deg) rotateY(' + tiltState().rotateY + 'deg)'
    "
    style="transform-style: preserve-3d; transition: transform 200ms ease-out"
    class="relative w-80 h-96 rounded-mm-3xl bg-linear-to-br
           from-brand-deep via-brand-6 to-brand-pink text-white
           shadow-mm-elevated p-8 cursor-pointer overflow-hidden
           mm-card-tilt-glare"
  >
    <header class="relative" style="transform: translateZ(40px)">
      <span class="rounded-mm-pill bg-white/20 backdrop-blur px-3 py-1
                   text-[10px] font-semibold uppercase">Premium</span>
    </header>
    <div class="absolute bottom-8 left-8 right-8" style="transform: translateZ(60px)">
      <h3 class="font-display text-3xl font-medium leading-tight">
        Tilt 3D con mouse parallax
      </h3>
    </div>
  </article>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'cards.ts (tilt handlers)',
      code: `protected readonly tiltState = signal<{ rotateX: number; rotateY: number }>({
  rotateX: 0,
  rotateY: 0,
});

protected onTiltMove(event: PointerEvent): void {
  const card = event.currentTarget as HTMLElement;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  this.tiltState.set({
    rotateY: (x - 0.5) * 18,
    rotateX: -(y - 0.5) * 18,
  });
  card.style.setProperty('--mx', \`\${x * 100}%\`);
  card.style.setProperty('--my', \`\${y * 100}%\`);
}

protected onTiltLeave(): void {
  this.tiltState.set({ rotateX: 0, rotateY: 0 });
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (mm-card-tilt-glare)',
      code: `.mm-card-tilt-glare::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.25),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 400ms var(--ease-out);
}

.mm-card-tilt-glare:hover::before { opacity: 1; }`,
    },
  ];
}
