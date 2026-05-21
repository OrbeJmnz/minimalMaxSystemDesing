import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { OtpInputComponent } from '../../shared/components/otp-input/otp-input';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars';
import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker';
import {
  PricingPeriod,
  PricingToggleComponent,
} from '../../shared/components/pricing-toggle/pricing-toggle';
import { RichTextEditorComponent } from '../../shared/components/rich-text-editor/rich-text-editor';

@Component({
  selector: 'mm-inputs-pro',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    OtpInputComponent,
    RatingStarsComponent,
    ColorPickerComponent,
    PricingToggleComponent,
    RichTextEditorComponent,
  ],
  templateUrl: './inputs-pro.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class InputsProComponent {
  protected readonly otpValue = signal<string>('');
  protected readonly otp4Value = signal<string>('');
  protected readonly rating = signal<number>(0);
  protected readonly readonlyRating = signal<number>(4);
  protected readonly brandColor = signal<string>('#1456f0');
  protected readonly period = signal<PricingPeriod>('monthly');
  protected readonly bio = signal<string>(
    '<p>Soy <b>Orbe</b> y construyo cosas con MinimalMax. Aquí va una <i>bio</i> editable.</p>',
  );

  protected readonly snippetsOtp: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs-pro.html',
      code: `<div class="flex flex-col gap-2">
  <span class="text-xs font-medium text-ink-dark">Código de 6 dígitos</span>
  <mm-otp-input [(value)]="otpValue" [length]="6" />
  <p class="text-xs text-ink-muted font-mono mt-1">
    Valor: <span class="text-ink-dark">{{ otpValue() || '—' }}</span>
  </p>
</div>

<div class="flex flex-col gap-2">
  <span class="text-xs font-medium text-ink-dark">PIN de 4 dígitos</span>
  <mm-otp-input [(value)]="otp4Value" [length]="4" />
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs-pro.ts (extracto)',
      code: `import { OtpInputComponent } from '../../shared/components/otp-input/otp-input';

@Component({
  selector: 'mm-inputs-pro',
  imports: [OtpInputComponent /* ... */],
  templateUrl: './inputs-pro.html',
})
export class InputsProComponent {
  protected readonly otpValue = signal<string>('');
  protected readonly otp4Value = signal<string>('');
}

// mm-otp-input expone:
//   [(value)]: model<string>   — two-way binding al string completo
//   [length]:  input<number>   — número de slots (default 6)
// Internamente: auto-focus al siguiente slot al tipear,
// backspace navega atrás, paste reparte los dígitos.`,
    },
  ];

  protected readonly snippetsRating: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs-pro.html',
      code: `<!-- Interactivo con label dinámico -->
<mm-rating-stars [(value)]="rating" size="lg" [showLabel]="true" />

<!-- Tamaños sm / md / lg -->
<div class="flex items-center gap-6">
  <mm-rating-stars [value]="3" size="sm" [readonly]="true" />
  <mm-rating-stars [value]="4" size="md" [readonly]="true" />
  <mm-rating-stars [value]="5" size="lg" [readonly]="true" />
</div>

<!-- Readonly con label -->
<mm-rating-stars
  [(value)]="readonlyRating"
  [readonly]="true"
  [showLabel]="true"
  [max]="5"
/>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs-pro.ts (extracto)',
      code: `import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars';

protected readonly rating = signal<number>(0);
protected readonly readonlyRating = signal<number>(4);

// API mm-rating-stars:
//   [(value)]:    model<number>            — rating actual
//   [max]:        input<number> (5)        — número total de estrellas
//   [size]:       input<'sm'|'md'|'lg'>
//   [readonly]:   input<boolean>           — desactiva hover/click
//   [showLabel]:  input<boolean>           — muestra "4 de 5"`,
    },
  ];

  protected readonly snippetsColorPicker: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs-pro.html',
      code: `<div class="max-w-md">
  <mm-color-picker [(value)]="brandColor" [showContrast]="true" />
  <p class="text-xs text-ink-muted mt-3 font-mono">
    Color seleccionado:
    <span class="text-ink-dark">{{ brandColor() }}</span>
  </p>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs-pro.ts (extracto)',
      code: `import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker';

protected readonly brandColor = signal<string>('#1456f0');

// API mm-color-picker:
//   [(value)]:        model<string>     — hex color #RRGGBB
//   [showContrast]:   input<boolean>    — muestra ratio WCAG AA/AAA en vivo
// Interno: swatches de la paleta + native color input + hex manual.`,
    },
  ];

  protected readonly snippetsPricingToggle: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs-pro.html',
      code: `<mm-pricing-toggle [(period)]="period" [discount]="20" />

<div class="rounded-mm-2xl bg-surface-base border border-border-soft p-8
            shadow-mm-sm w-full max-w-sm">
  <p class="text-xs text-ink-muted uppercase tracking-wider font-semibold">
    Plan Pro
  </p>
  <p class="font-display text-5xl font-medium text-ink-dark mt-2 tabular-nums">
    @if (period() === 'monthly') {
      $19<span class="text-base text-ink-muted font-normal">/mes</span>
    } @else {
      $15<span class="text-base text-ink-muted font-normal">/mes</span>
    }
  </p>
  @if (period() === 'yearly') {
    <p class="text-xs text-success mt-1 font-semibold"
       style="animation: fadeInUp 280ms var(--ease-out) both">
      Facturado anualmente — $180/año
    </p>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs-pro.ts (extracto)',
      code: `import {
  PricingPeriod,
  PricingToggleComponent,
} from '../../shared/components/pricing-toggle/pricing-toggle';

protected readonly period = signal<PricingPeriod>('monthly');

// API mm-pricing-toggle:
//   [(period)]:  model<'monthly'|'yearly'>
//   [discount]:  input<number>            — % de descuento mostrado como badge
// Internamente: switch animado + badge "Ahorra X%" al activar yearly.`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (keyframe fadeInUp)',
      code: `@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    },
  ];

  protected readonly snippetsRichText: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs-pro.html',
      code: `<div class="flex flex-col gap-3 max-w-2xl">
  <mm-rich-text-editor
    [(value)]="bio"
    placeholder="Escribe tu bio…"
  />

  <details class="rounded-mm-md bg-surface-secondary/40 border border-border-soft">
    <summary class="px-4 py-2 text-xs font-medium text-ink-dark cursor-pointer">
      Ver HTML generado
    </summary>
    <pre class="px-4 pb-3 text-xs font-mono text-ink-secondary
                overflow-x-auto whitespace-pre-wrap">{{ bio() }}</pre>
  </details>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs-pro.ts (extracto)',
      code: `import { RichTextEditorComponent } from '../../shared/components/rich-text-editor/rich-text-editor';

protected readonly bio = signal<string>(
  '<p>Soy <b>Orbe</b> y construyo cosas con MinimalMax. ' +
  'Aquí va una <i>bio</i> editable.</p>',
);

// API mm-rich-text-editor:
//   [(value)]:    model<string>     — HTML del contenido
//   [placeholder]: input<string>    — texto cuando está vacío
// Interno: contenteditable + execCommand, toolbar con estados activos
// (bold, italic, underline, link). Cero dependencias.`,
    },
  ];
}
