import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';

interface TeamMember {
  readonly name: string;
  readonly role: string;
  readonly initials: string;
  readonly tone: string;
  readonly status: 'online' | 'away' | 'offline';
}

@Component({
  selector: 'mm-badges',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './badges.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class BadgesComponent {
  protected readonly team: readonly TeamMember[] = [
    {
      name: 'Orbe Jimenez',
      role: 'Lead Dev',
      initials: 'OJ',
      tone: 'from-brand-6 to-primary-500',
      status: 'online',
    },
    {
      name: 'Sofia Reyes',
      role: 'Design',
      initials: 'SR',
      tone: 'from-brand-pink to-fuchsia-500',
      status: 'online',
    },
    {
      name: 'Diego Luna',
      role: 'Backend',
      initials: 'DL',
      tone: 'from-emerald-500 to-teal-500',
      status: 'away',
    },
    {
      name: 'Ana Vega',
      role: 'Product',
      initials: 'AV',
      tone: 'from-amber-500 to-orange-500',
      status: 'offline',
    },
    {
      name: 'Luis Mora',
      role: 'QA',
      initials: 'LM',
      tone: 'from-violet-500 to-indigo-500',
      status: 'online',
    },
  ];

  protected readonly stats = [
    { label: 'Componentes', value: '70+', trend: '+8', icon: 'M3 3h18v18H3z' },
    {
      label: 'Bundle inicial',
      value: '74 kB',
      trend: '-12%',
      icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    },
    { label: 'Build time', value: '0.4s', trend: '⚡', icon: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' },
    {
      label: 'A11y score',
      value: '98',
      trend: 'AAA',
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    },
  ];

  protected statusClass(status: TeamMember['status']): string {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'away':
        return 'bg-warning';
      default:
        return 'bg-ink-muted';
    }
  }

  protected readonly snippetsBadgesStatus: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'badges-status.html',
      code: `<div class="flex flex-wrap items-center gap-3">
  <span class="inline-flex items-center gap-1.5 rounded-mm-pill bg-success-bg text-success px-2.5 py-1 text-xs font-semibold">
    <span class="size-1.5 rounded-full bg-success"></span>
    Activo
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-mm-pill bg-warning-bg text-warning px-2.5 py-1 text-xs font-semibold">
    <span class="size-1.5 rounded-full bg-warning"></span>
    Pendiente
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-mm-pill bg-error-bg text-error px-2.5 py-1 text-xs font-semibold">
    <span class="size-1.5 rounded-full bg-error"></span>
    Bloqueado
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-mm-pill bg-primary-200 text-primary-700 px-2.5 py-1 text-xs font-semibold">
    <span class="size-1.5 rounded-full bg-primary-700"></span>
    En revisión
  </span>
  <span class="rounded-mm-pill bg-cta text-white px-2.5 py-1 text-xs font-semibold">
    Premium
  </span>
  <span class="rounded-mm-pill bg-surface-secondary text-ink-secondary px-2.5 py-1 text-xs font-semibold">
    Draft
  </span>
</div>`,
    },
  ];

  protected readonly snippetsChips: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'chips.html',
      code: `<div class="flex flex-wrap items-center gap-2">
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-mm-pill bg-primary-200 text-primary-700
           pl-3 pr-1 py-1 text-xs font-medium hover:bg-primary-200/80 transition"
  >
    Angular 21
    <span class="size-5 rounded-full grid place-items-center hover:bg-surface-secondary">
      <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6 6 18M6 6l12 12"></path>
      </svg>
    </span>
  </button>

  <button
    type="button"
    class="inline-flex items-center gap-1.5 rounded-mm-pill border border-border
           bg-surface-base px-3 py-1 text-xs font-medium text-ink-dark
           hover:border-ink-dark transition"
  >
    <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M12 5v14M5 12h14"></path>
    </svg>
    Agregar filtro
  </button>
</div>`,
    },
  ];

  protected readonly snippetsAvatars: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'avatars.html',
      code: `<div data-stagger class="flex items-center gap-4">
  @for (member of team; track member.name) {
    <div class="flex flex-col items-center gap-2 mm-hover-scale">
      <div class="relative">
        <span
          [class]="
            'size-12 rounded-mm-pill grid place-items-center font-display font-semibold
             text-white text-sm shadow-mm-sm bg-linear-to-br ' + member.tone
          "
        >
          {{ member.initials }}
        </span>
        <span
          [class]="
            'absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full ring-2
             ring-surface-base ' + statusClass(member.status)
          "
        ></span>
      </div>
      <p class="text-[11px] text-ink-muted text-center font-medium">{{ member.role }}</p>
    </div>
  }
</div>

<!-- Stack overlap: margin-left negativo + z-index decreciente -->
<div class="flex items-center">
  @for (member of team; track member.name; let i = $index) {
    <span
      [class]="
        'relative size-9 rounded-mm-pill grid place-items-center font-display
         font-semibold text-white text-xs shadow-mm-sm ring-2 ring-surface-base
         bg-linear-to-br ' + member.tone
      "
      [style.margin-left.px]="i === 0 ? 0 : -10"
      [style.z-index]="team.length - i"
    >
      {{ member.initials }}
    </span>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'badges.ts (extracto)',
      code: `interface TeamMember {
  readonly name: string;
  readonly role: string;
  readonly initials: string;
  readonly tone: string;
  readonly status: 'online' | 'away' | 'offline';
}

protected readonly team: readonly TeamMember[] = [
  { name: 'Orbe Jimenez', role: 'Lead Dev', initials: 'OJ',
    tone: 'from-brand-6 to-primary-500', status: 'online' },
  { name: 'Sofia Reyes', role: 'Design', initials: 'SR',
    tone: 'from-brand-pink to-fuchsia-500', status: 'online' },
  // ...
];

protected statusClass(status: TeamMember['status']): string {
  switch (status) {
    case 'online': return 'bg-success';
    case 'away':   return 'bg-warning';
    default:       return 'bg-ink-muted';
  }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — mm-hover-scale',
      code: `/* mm-hover-scale — escala 1.04 en hover */
.mm-hover-scale { transition: transform var(--duration-normal) var(--ease-out); }
.mm-hover-scale:hover { transform: scale(1.04); }`,
    },
  ];

  protected readonly snippetsStats: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'stats-cards.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-4 gap-4">
  @for (stat of stats; track stat.label) {
    <div
      class="group rounded-mm-2xl bg-surface-base border border-border-soft p-5
             shadow-mm-sm mm-hover-lift"
    >
      <div class="flex items-start justify-between mb-4">
        <span
          class="size-10 rounded-mm-md bg-primary-200 text-primary-700 grid place-items-center
                 transition-transform duration-300 group-hover:rotate-6"
        >
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path [attr.d]="stat.icon"></path>
          </svg>
        </span>
        <span class="rounded-mm-pill bg-success-bg text-success px-2 py-0.5 text-[10px] font-semibold">
          {{ stat.trend }}
        </span>
      </div>
      <p class="text-xs text-ink-muted mb-1 font-medium">{{ stat.label }}</p>
      <p class="font-display text-3xl font-medium text-ink-dark leading-none tabular-nums">
        {{ stat.value }}
      </p>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'badges.ts (stats)',
      code: `protected readonly stats = [
  { label: 'Componentes', value: '70+', trend: '+8', icon: 'M3 3h18v18H3z' },
  { label: 'Bundle inicial', value: '74 kB', trend: '-12%',
    icon: 'M21 16V8a2 2 0 0 0-1-1.73...' },
  { label: 'Build time', value: '0.4s', trend: '⚡', icon: 'M13 2 3 14h9...' },
  { label: 'A11y score', value: '98', trend: 'AAA',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];`,
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

  protected readonly snippetsNotificationDot: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'notification-dot.html',
      code: `<!-- Bell con ping rojo -->
<button
  type="button"
  class="group relative size-11 rounded-mm-md grid place-items-center
         bg-surface-secondary text-ink-dark hover:bg-border transition mm-press"
  aria-label="Notificaciones"
>
  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
  <span class="absolute top-1 right-1 flex size-3">
    <span
      class="absolute inset-0 rounded-full bg-error"
      style="animation: mm-ping-strong 1.6s var(--ease-out) infinite"
    ></span>
    <span class="relative inline-flex size-3 rounded-full bg-error ring-2 ring-surface-secondary"></span>
  </span>
</button>

<!-- Botón con count badge animado -->
<button class="group relative inline-flex items-center gap-2 rounded-mm-md px-4 py-2
               text-sm font-medium bg-surface-secondary text-ink-dark">
  Mensajes
  <span
    class="rounded-mm-pill bg-error text-white px-2 py-0.5 text-[10px] font-bold"
    style="animation: mm-badge-pop 380ms var(--ease-bounce) both"
  >
    12
  </span>
</button>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (animaciones)',
      code: `@keyframes mm-ping-strong {
  0%   { transform: scale(1);   opacity: 0.75; }
  100% { transform: scale(2.4); opacity: 0;    }
}

@keyframes mm-badge-pop {
  0%   { transform: scale(0.6);  opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}`,
    },
  ];
}
