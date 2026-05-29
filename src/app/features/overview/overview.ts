import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';

interface Swatch {
  readonly name: string;
  readonly token: string;
  readonly hex: string;
  readonly text?: 'light' | 'dark';
}

interface TypeSample {
  readonly role: string;
  readonly font: string;
  readonly size: string;
  readonly weight: string;
  readonly className: string;
  readonly sample: string;
}

@Component({
  selector: 'mm-overview',
  imports: [SectionHeaderComponent, CanvasFrameComponent],
  templateUrl: './overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class OverviewComponent {
  protected readonly brandSwatches: readonly Swatch[] = [
    { name: 'Brand Blue', token: 'brand-6', hex: '#1456f0', text: 'light' },
    { name: 'Brand Deep', token: 'brand-deep', hex: '#17437d', text: 'light' },
    { name: 'Sky Blue', token: 'brand-sky', hex: '#3daeff', text: 'dark' },
    { name: 'Brand Pink', token: 'brand-pink', hex: '#ea5ec1', text: 'light' },
  ];

  protected readonly primarySwatches: readonly Swatch[] = [
    { name: 'Primary 200', token: 'primary-200', hex: '#bfdbfe', text: 'dark' },
    { name: 'Primary Light', token: 'primary-light', hex: '#60a5fa', text: 'dark' },
    { name: 'Primary 500', token: 'primary-500', hex: '#3b82f6', text: 'light' },
    { name: 'Primary 600', token: 'primary-600', hex: '#2563eb', text: 'light' },
    { name: 'Primary 700', token: 'primary-700', hex: '#1d4ed8', text: 'light' },
  ];

  protected readonly textSwatches: readonly Swatch[] = [
    { name: 'Ink Base', token: 'ink-base', hex: '#222222', text: 'light' },
    { name: 'Ink Dark', token: 'ink-dark', hex: '#18181b', text: 'light' },
    { name: 'Ink Charcoal', token: 'ink-charcoal', hex: '#181e25', text: 'light' },
    { name: 'Ink Secondary', token: 'ink-secondary', hex: '#45515e', text: 'light' },
    { name: 'Ink Muted', token: 'ink-muted', hex: '#8e8e93', text: 'light' },
  ];

  protected readonly typeSamples: readonly TypeSample[] = [
    {
      role: 'Display Hero',
      font: 'Outfit',
      size: '80px',
      weight: '500',
      className: 'font-display text-7xl font-medium leading-[1.1] text-ink-dark',
      sample: 'Premium o nada',
    },
    {
      role: 'Section Heading',
      font: 'Outfit',
      size: '31px',
      weight: '600',
      className: 'font-display text-3xl font-semibold text-ink-dark',
      sample: 'Componentes reutilizables',
    },
    {
      role: 'Sub-heading',
      font: 'Poppins',
      size: '24px',
      weight: '500',
      className: 'font-mid text-2xl font-medium text-ink-dark',
      sample: 'Setup que ya funciona',
    },
    {
      role: 'Body Large',
      font: 'DM Sans',
      size: '20px',
      weight: '500',
      className: 'font-sans text-xl font-medium text-ink-base',
      sample: 'Cards con sombras tintadas de marca',
    },
    {
      role: 'Body',
      font: 'DM Sans',
      size: '16px',
      weight: '400',
      className: 'font-sans text-base text-ink-base',
      sample: 'Texto estándar para descripciones, párrafos y contenidos largos.',
    },
    {
      role: 'Caption / Tech',
      font: 'Roboto Mono',
      size: '13px',
      weight: '400',
      className: 'font-mono text-sm text-ink-muted',
      sample: 'tokens.css · #1456f0 · 8px → 80px',
    },
  ];

  protected readonly shadows = [
    { name: 'Subtle (Level 1)', className: 'shadow-mm-sm' },
    { name: 'Ambient (Level 2)', className: 'shadow-mm-md' },
    { name: 'Brand Glow (Level 3)', className: 'shadow-mm-brand' },
    { name: 'Elevated (Level 4)', className: 'shadow-mm-elevated' },
  ];

  protected readonly radii = [
    { name: 'sm · 4px', className: 'rounded-mm-sm' },
    { name: 'md · 8px', className: 'rounded-mm-md' },
    { name: 'lg · 13px', className: 'rounded-mm-lg' },
    { name: 'xl · 16px', className: 'rounded-mm-xl' },
    { name: '2xl · 20px', className: 'rounded-mm-2xl' },
    { name: '3xl · 24px', className: 'rounded-mm-3xl' },
    { name: 'pill · 9999px', className: 'rounded-mm-pill' },
  ];

  protected readonly snippetsBrand: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overview.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-4 gap-3">
  @for (swatch of brandSwatches; track swatch.token) {
    <div class="rounded-mm-xl overflow-hidden shadow-mm-sm mm-hover-lift cursor-pointer">
      <div
        class="h-24 flex items-end p-4"
        [style.background-color]="swatch.hex"
        [class.text-white]="swatch.text === 'light'"
        [class.text-[#18181b]]="swatch.text === 'dark'"
      >
        <span class="font-display text-sm font-medium">{{ swatch.name }}</span>
      </div>
      <div class="px-4 py-3 bg-surface-base">
        <p class="font-mono text-xs text-ink-muted">{{ swatch.token }}</p>
        <p class="font-mono text-sm text-ink-dark">{{ swatch.hex }}</p>
      </div>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overview.ts',
      code: `interface Swatch {
  readonly name: string;
  readonly token: string;
  readonly hex: string;
  readonly text?: 'light' | 'dark';
}

protected readonly brandSwatches: readonly Swatch[] = [
  { name: 'Brand Blue', token: 'brand-6', hex: '#1456f0', text: 'light' },
  { name: 'Brand Deep', token: 'brand-deep', hex: '#17437d', text: 'light' },
  { name: 'Sky Blue', token: 'brand-sky', hex: '#3daeff', text: 'dark' },
  { name: 'Brand Pink', token: 'brand-pink', hex: '#ea5ec1', text: 'light' },
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (@theme inline)',
      code: `@theme inline {
  --color-brand-6: #1456f0;
  --color-brand-deep: #17437d;
  --color-brand-sky: #3daeff;
  --color-brand-pink: #ea5ec1;
}

/* Acceso vía utility classes Tailwind: */
/* bg-brand-6, text-brand-pink, border-brand-deep, etc. */`,
    },
  ];

  protected readonly snippetsPrimary: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overview.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-5 gap-3">
  @for (swatch of primarySwatches; track swatch.token) {
    <div class="rounded-mm-xl overflow-hidden shadow-mm-sm mm-hover-scale cursor-pointer">
      <div class="h-20 flex items-end p-3" [style.background-color]="swatch.hex">
        <span class="text-xs font-medium">{{ swatch.name }}</span>
      </div>
      <div class="px-3 py-2 bg-surface-base">
        <p class="font-mono text-xs text-ink-dark">{{ swatch.hex }}</p>
      </div>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overview.ts',
      code: `protected readonly primarySwatches: readonly Swatch[] = [
  { name: 'Primary 200', token: 'primary-200', hex: '#bfdbfe', text: 'dark' },
  { name: 'Primary Light', token: 'primary-light', hex: '#60a5fa', text: 'dark' },
  { name: 'Primary 500', token: 'primary-500', hex: '#3b82f6', text: 'light' },
  { name: 'Primary 600', token: 'primary-600', hex: '#2563eb', text: 'light' },
  { name: 'Primary 700', token: 'primary-700', hex: '#1d4ed8', text: 'light' },
];`,
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

  protected readonly snippetsText: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overview.html',
      code: `<div data-stagger class="grid grid-cols-1 md:grid-cols-5 gap-3">
  @for (swatch of textSwatches; track swatch.token) {
    <div class="rounded-mm-xl overflow-hidden shadow-mm-sm mm-hover-scale">
      <div class="h-20 flex items-end p-3" [style.background-color]="swatch.hex">
        <span class="text-xs font-medium">Aa {{ swatch.name }}</span>
      </div>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overview.ts',
      code: `protected readonly textSwatches: readonly Swatch[] = [
  { name: 'Ink Base', token: 'ink-base', hex: '#222222', text: 'light' },
  { name: 'Ink Dark', token: 'ink-dark', hex: '#18181b', text: 'light' },
  { name: 'Ink Charcoal', token: 'ink-charcoal', hex: '#181e25', text: 'light' },
  { name: 'Ink Secondary', token: 'ink-secondary', hex: '#45515e', text: 'light' },
  { name: 'Ink Muted', token: 'ink-muted', hex: '#8e8e93', text: 'light' },
];`,
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

  protected readonly snippetsType: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overview.html',
      code: `<div class="flex flex-col divide-y divide-border-soft">
  @for (sample of typeSamples; track sample.role) {
    <div class="flex flex-col md:flex-row md:items-end gap-4 py-5 first:pt-0 last:pb-0">
      <div class="md:w-48 shrink-0">
        <p class="text-xs uppercase tracking-wider text-ink-muted">{{ sample.role }}</p>
        <p class="font-mono text-xs text-ink-secondary">
          {{ sample.font }} · {{ sample.size }} · {{ sample.weight }}
        </p>
      </div>
      <p [class]="sample.className">{{ sample.sample }}</p>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overview.ts',
      code: `interface TypeSample {
  readonly role: string;
  readonly font: string;
  readonly size: string;
  readonly weight: string;
  readonly className: string;
  readonly sample: string;
}

protected readonly typeSamples: readonly TypeSample[] = [
  {
    role: 'Display Hero',
    font: 'Outfit',
    size: '80px',
    weight: '500',
    className: 'font-display text-7xl font-medium leading-[1.1] text-ink-dark',
    sample: 'Premium o nada',
  },
  {
    role: 'Body',
    font: 'DM Sans',
    size: '16px',
    weight: '400',
    className: 'font-sans text-base text-ink-base',
    sample: 'Texto estándar para descripciones, párrafos y contenidos largos.',
  },
  // ... más roles
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (font tokens)',
      code: `@theme inline {
  --font-display: 'Outfit', sans-serif;   /* Headings */
  --font-sans:    'DM Sans', sans-serif;  /* UI body */
  --font-mid:     'Poppins', sans-serif;  /* Sub-headings */
  --font-mono:    'Roboto Mono', monospace; /* Code/data */
}`,
    },
  ];

  protected readonly snippetsShadows: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overview.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-4 gap-6 p-2">
  @for (shadow of shadows; track shadow.name) {
    <div class="flex flex-col items-center text-center gap-3 mm-hover-scale">
      <div [class]="'size-24 rounded-mm-2xl bg-surface-base transition-shadow ' + shadow.className"></div>
      <p class="text-xs text-ink-muted">{{ shadow.name }}</p>
      <p class="font-mono text-xs text-ink-dark">{{ shadow.className }}</p>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overview.ts',
      code: `protected readonly shadows = [
  { name: 'Subtle (Level 1)',     className: 'shadow-mm-sm' },
  { name: 'Ambient (Level 2)',    className: 'shadow-mm-md' },
  { name: 'Brand Glow (Level 3)', className: 'shadow-mm-brand' },
  { name: 'Elevated (Level 4)',   className: 'shadow-mm-elevated' },
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css',
      code: `@theme inline {
  --shadow-mm-sm:       0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-mm-md:       0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-mm-brand:    0 0 15px rgba(44, 30, 116, 0.16);  /* firma MinimalMax */
  --shadow-mm-elevated: 0 16px 32px rgba(15, 23, 42, 0.14);
}`,
    },
  ];

  protected readonly snippetsRadii: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'overview.html',
      code: `<div data-stagger class="grid grid-cols-2 md:grid-cols-7 gap-4">
  @for (radius of radii; track radius.name) {
    <div class="flex flex-col items-center text-center gap-2 mm-hover-scale group">
      <div
        [class]="
          'size-20 bg-linear-to-br from-brand-6 to-brand-pink shadow-mm-brand transition-transform duration-300 group-hover:rotate-6 ' +
          radius.className
        "
      ></div>
      <p class="text-xs text-ink-muted">{{ radius.name }}</p>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'overview.ts',
      code: `protected readonly radii = [
  { name: 'sm · 4px',      className: 'rounded-mm-sm' },
  { name: 'md · 8px',      className: 'rounded-mm-md' },
  { name: 'lg · 13px',     className: 'rounded-mm-lg' },
  { name: 'xl · 16px',     className: 'rounded-mm-xl' },
  { name: '2xl · 20px',    className: 'rounded-mm-2xl' },
  { name: '3xl · 24px',    className: 'rounded-mm-3xl' },
  { name: 'pill · 9999px', className: 'rounded-mm-pill' },
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css',
      code: `@theme inline {
  --radius-mm-sm:   4px;
  --radius-mm-md:   8px;
  --radius-mm-lg:   13px;
  --radius-mm-xl:   16px;
  --radius-mm-2xl:  20px;
  --radius-mm-3xl:  24px;
  --radius-mm-pill: 9999px;  /* firma MinimalMax */
}`,
    },
  ];
}
