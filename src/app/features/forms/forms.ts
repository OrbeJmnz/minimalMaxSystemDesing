import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { ToastService } from '../../core/services/toast.service';

interface Country {
  readonly code: string;
  readonly label: string;
  readonly flag: string;
}

@Component({
  selector: 'mm-forms',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    CanvasFrameComponent,
    SectionHeaderComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './forms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class FormsComponent {
  private readonly toast = inject(ToastService);

  protected readonly countries: readonly Country[] = [
    { code: 'mx', label: 'México', flag: '🇲🇽' },
    { code: 'us', label: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'es', label: 'España', flag: '🇪🇸' },
    { code: 'ar', label: 'Argentina', flag: '🇦🇷' },
    { code: 'co', label: 'Colombia', flag: '🇨🇴' },
    { code: 'cl', label: 'Chile', flag: '🇨🇱' },
    { code: 'pe', label: 'Perú', flag: '🇵🇪' },
    { code: 'br', label: 'Brasil', flag: '🇧🇷' },
  ];

  protected readonly nativeCountry = new FormControl<string>('mx', { nonNullable: true });

  protected readonly selectOpen = signal(false);
  protected readonly customCountry = signal<Country>(this.countries[0]);

  protected readonly notifications = new FormGroup({
    email: new FormControl(true, { nonNullable: true }),
    push: new FormControl(false, { nonNullable: true }),
    sms: new FormControl(true, { nonNullable: true }),
    marketing: new FormControl(false, { nonNullable: true }),
  });

  protected readonly plan = new FormControl<'free' | 'pro' | 'team'>('pro', { nonNullable: true });

  protected readonly settings = new FormGroup({
    darkMode: new FormControl(false, { nonNullable: true }),
    autoSave: new FormControl(true, { nonNullable: true }),
    betaFeatures: new FormControl(false, { nonNullable: true }),
  });

  protected readonly volume = new FormControl(60, { nonNullable: true });
  protected readonly opacity = new FormControl(85, { nonNullable: true });

  protected readonly demoForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    company: new FormControl('', { nonNullable: true }),
    accept: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submitError = signal(false);

  protected toggleSelect(): void {
    this.selectOpen.update((v) => !v);
  }

  protected pickCountry(country: Country): void {
    this.customCountry.set(country);
    this.selectOpen.set(false);
  }

  protected async submitDemo(): Promise<void> {
    this.demoForm.markAllAsTouched();
    if (this.demoForm.invalid) {
      this.submitError.set(true);
      setTimeout(() => this.submitError.set(false), 420);
      this.toast.error('Revisa los campos en rojo', { title: 'Form inválido' });
      return;
    }
    this.submitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    this.submitting.set(false);
    this.submitted.set(true);
    this.toast.success('Datos guardados correctamente', {
      title: '¡Listo!',
      action: { label: 'Editar otra vez', run: () => this.reset() },
    });
  }

  protected reset(): void {
    this.demoForm.reset({ fullName: '', email: '', company: '', accept: false });
    this.submitted.set(false);
  }

  protected readonly snippetsSelectNative: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms.html',
      code: `<label class="flex flex-col gap-1.5 max-w-md">
  <span class="text-xs font-medium text-ink-dark">País de envío</span>
  <div class="relative">
    <select
      [formControl]="nativeCountry"
      class="w-full appearance-none rounded-mm-md border-2 border-border
             bg-surface-base pl-4 pr-11 py-2.5 text-sm text-ink-dark
             focus:border-primary-500 focus:outline-none
             focus:ring-3 focus:ring-primary-500/10
             transition-[border-color,box-shadow] duration-200 cursor-pointer"
    >
      @for (country of countries; track country.code) {
        <option [value]="country.code">
          {{ country.flag }} {{ country.label }}
        </option>
      }
    </select>
    <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                size-4 text-ink-muted"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </div>
</label>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms.ts (extracto)',
      code: `interface Country {
  readonly code: string;
  readonly label: string;
  readonly flag: string;
}

protected readonly countries: readonly Country[] = [
  { code: 'mx', label: 'México', flag: '🇲🇽' },
  { code: 'us', label: 'Estados Unidos', flag: '🇺🇸' },
  // ...
];

protected readonly nativeCountry = new FormControl<string>('mx', { nonNullable: true });`,
    },
  ];

  protected readonly snippetsSelectCustom: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms.html',
      code: `<div class="relative max-w-md"
     (mmClickOutside)="selectOpen.set(false)"
     [mmClickOutsideEnabled]="selectOpen()">
  <button
    type="button"
    (click)="toggleSelect()"
    [attr.aria-expanded]="selectOpen()"
    aria-haspopup="listbox"
    class="w-full flex items-center justify-between gap-3 rounded-mm-md
           border-2 border-border bg-surface-base px-4 py-2.5 text-sm
           text-ink-dark hover:border-ink-muted focus:border-primary-500
           cursor-pointer mm-press"
    [class.!border-primary-500]="selectOpen()"
  >
    <span class="flex items-center gap-2">
      <span class="text-base">{{ customCountry().flag }}</span>
      <span class="font-medium">{{ customCountry().label }}</span>
    </span>
    <svg class="size-4 text-ink-muted transition-transform duration-300"
         [class.rotate-180]="selectOpen()"
         viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  </button>

  @if (selectOpen()) {
    <div class="absolute z-40 top-full mt-2 left-0 right-0 rounded-mm-xl
                border border-border-soft bg-surface-base shadow-mm-elevated
                overflow-hidden"
         style="animation: scaleIn 200ms var(--ease-out) both; transform-origin: top;"
         role="listbox">
      <ul class="max-h-72 overflow-y-auto py-1">
        @for (country of countries; track country.code) {
          <li>
            <button
              type="button"
              role="option"
              [attr.aria-selected]="country.code === customCountry().code"
              (click)="pickCountry(country)"
              class="w-full flex items-center justify-between gap-3 px-4 py-2.5
                     text-sm hover:bg-surface-secondary transition cursor-pointer"
            >
              <span class="flex items-center gap-2">
                <span class="text-base">{{ country.flag }}</span>
                <span>{{ country.label }}</span>
              </span>
            </button>
          </li>
        }
      </ul>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms.ts (extracto)',
      code: `import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

protected readonly selectOpen = signal(false);
protected readonly customCountry = signal<Country>(this.countries[0]);

protected toggleSelect(): void {
  this.selectOpen.update((v) => !v);
}

protected pickCountry(country: Country): void {
  this.customCountry.set(country);
  this.selectOpen.set(false);
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (keyframe scaleIn)',
      code: `@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}`,
    },
  ];

  protected readonly snippetsCheckboxGroup: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms.html',
      code: `<div [formGroup]="notifications" class="flex flex-col gap-2 max-w-md">
  <label class="flex items-center gap-3 p-3 rounded-mm-md border border-border-soft
                hover:border-border hover:bg-surface-secondary/40
                transition-colors cursor-pointer group">
    <input type="checkbox" formControlName="email" class="peer sr-only" />
    <span class="size-5 shrink-0 rounded-mm-sm border-2 border-border bg-surface-base
                 grid place-items-center transition-all
                 peer-checked:bg-brand-6 peer-checked:border-brand-6
                 peer-focus-visible:ring-3 peer-focus-visible:ring-primary-500/20
                 peer-checked:[&>svg]:opacity-100 peer-checked:[&>svg]:scale-100">
      <svg class="size-3.5 text-white opacity-0 scale-50 transition-all duration-200"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5"></path>
      </svg>
    </span>
    <span class="flex-1">
      <span class="block text-sm font-medium text-ink-dark">Email notifications</span>
      <span class="block text-xs text-ink-muted">Resumen diario por correo.</span>
    </span>
  </label>

  <!-- ... otras opciones con misma estructura ... -->

  <p class="text-xs text-ink-muted font-mono mt-2">
    {{ notifications.value | json }}
  </p>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms.ts (extracto)',
      code: `import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

protected readonly notifications = new FormGroup({
  email: new FormControl(true, { nonNullable: true }),
  push: new FormControl(false, { nonNullable: true }),
  sms: new FormControl(true, { nonNullable: true }),
  marketing: new FormControl(false, { nonNullable: true }),
});`,
    },
  ];

  protected readonly snippetsRadioCards: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms.html',
      code: `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <label
    class="relative flex flex-col gap-2 p-5 rounded-mm-2xl border-2
           cursor-pointer transition-all duration-200 mm-press"
    [class.border-brand-6]="plan.value === 'pro'"
    [class.shadow-mm-brand]="plan.value === 'pro'"
    [class.border-border]="plan.value !== 'pro'"
    [class.hover:border-ink-muted]="plan.value !== 'pro'"
  >
    <input type="radio" [formControl]="plan" value="pro" class="peer sr-only" />
    <div class="flex items-start justify-between">
      <span class="flex items-center gap-2">
        <span class="font-display text-base font-semibold text-ink-dark">Pro</span>
        <span class="rounded-mm-pill bg-primary-200 text-primary-700
                     text-[10px] font-semibold px-2 py-0.5">
          Popular
        </span>
      </span>
      <span class="size-5 rounded-full border-2 border-border grid place-items-center
                   transition-all"
            [class.!border-brand-6]="plan.value === 'pro'">
        <span class="size-2.5 rounded-full bg-brand-6 transition-transform duration-200"
              [class.scale-100]="plan.value === 'pro'"
              [class.scale-0]="plan.value !== 'pro'"></span>
      </span>
    </div>
    <p class="font-display text-3xl font-medium text-ink-dark leading-none">
      $19<span class="text-sm text-ink-muted font-normal"> /mes</span>
    </p>
    <p class="text-xs text-ink-muted">Proyectos ilimitados · soporte prioritario.</p>
  </label>

  <!-- ... otros planes con misma estructura (free, team) ... -->
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms.ts (extracto)',
      code: `protected readonly plan = new FormControl<'free' | 'pro' | 'team'>('pro', {
  nonNullable: true,
});`,
    },
  ];

  protected readonly snippetsToggleSwitch: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms.html',
      code: `<div [formGroup]="settings" class="flex flex-col gap-1 max-w-md">
  <label class="flex items-center justify-between gap-4 p-3 rounded-mm-md
                hover:bg-surface-secondary/50 transition-colors cursor-pointer">
    <span class="flex-1">
      <span class="block text-sm font-medium text-ink-dark">Dark mode</span>
      <span class="block text-xs text-ink-muted">Tema oscuro para el editor.</span>
    </span>
    <input type="checkbox" formControlName="darkMode" class="peer sr-only" />
    <span class="relative inline-flex h-6 w-11 shrink-0 rounded-mm-pill bg-border
                 transition-colors duration-300
                 peer-checked:bg-brand-6
                 peer-focus-visible:ring-3 peer-focus-visible:ring-primary-500/20
                 peer-checked:[&>span]:translate-x-5">
      <span class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white
                   shadow-mm-sm transition-transform duration-300"
            style="transition-timing-function: var(--ease-bounce)"></span>
    </span>
  </label>

  <!-- Variante warning (color naranja para beta features) -->
  <label class="flex items-center justify-between gap-4 p-3 rounded-mm-md
                hover:bg-surface-secondary/50 cursor-pointer">
    <span class="flex-1">
      <span class="flex items-center gap-2 text-sm font-medium text-ink-dark">
        Beta features
        <span class="rounded-mm-pill bg-warning/15 text-warning
                     text-[10px] font-semibold px-2 py-0.5">
          Experimental
        </span>
      </span>
    </span>
    <input type="checkbox" formControlName="betaFeatures" class="peer sr-only" />
    <span class="relative inline-flex h-6 w-11 shrink-0 rounded-mm-pill bg-border
                 peer-checked:bg-warning
                 peer-checked:[&>span]:translate-x-5">
      <span class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white
                   shadow-mm-sm transition-transform duration-300"></span>
    </span>
  </label>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms.ts (extracto)',
      code: `protected readonly settings = new FormGroup({
  darkMode: new FormControl(false, { nonNullable: true }),
  autoSave: new FormControl(true, { nonNullable: true }),
  betaFeatures: new FormControl(false, { nonNullable: true }),
});`,
    },
  ];

  protected readonly snippetsFormValidation: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms.html',
      code: `<form
  [formGroup]="demoForm"
  (ngSubmit)="submitDemo()"
  class="flex flex-col gap-4 max-w-md"
  [class.animate-[shake_380ms_ease-out_both]]="submitError()"
>
  <div class="flex flex-col">
    <div class="relative">
      <input
        type="text"
        formControlName="fullName"
        placeholder=" "
        class="peer w-full rounded-mm-md border-2 border-border bg-surface-base
               px-4 pt-5 pb-1.5 text-sm focus:border-primary-500
               focus:ring-3 focus:ring-primary-500/10"
        [class.!border-error]="
          demoForm.controls.fullName.invalid && demoForm.controls.fullName.touched
        "
      />
      <span class="pointer-events-none absolute left-4 top-1.5 text-xs
                   font-medium text-ink-muted peer-placeholder-shown:top-[1.1rem]
                   peer-focus:top-1.5 peer-focus:text-primary-500">
        Nombre completo *
      </span>
    </div>
    @if (demoForm.controls.fullName.invalid && demoForm.controls.fullName.touched) {
      <span class="text-xs text-error font-medium mt-1">
        @if (demoForm.controls.fullName.hasError('required')) {
          Este campo es obligatorio.
        } @else if (demoForm.controls.fullName.hasError('minlength')) {
          Mínimo 3 caracteres.
        }
      </span>
    }
  </div>

  <!-- ... resto: email, company, accept checkbox ... -->

  <button
    type="submit"
    [disabled]="submitting() || submitted()"
    class="inline-flex items-center gap-2 rounded-mm-md bg-brand-6 px-5 py-2.5
           text-sm font-medium text-white shadow-mm-brand
           hover:shadow-mm-elevated disabled:opacity-70 mm-press"
  >
    @if (submitting()) {
      <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">...</svg>
      Enviando…
    } @else if (submitted()) {
      Enviado
    } @else {
      Enviar
    }
  </button>
</form>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms.ts (extracto)',
      code: `protected readonly demoForm = new FormGroup({
  fullName: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  }),
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
  company: new FormControl('', { nonNullable: true }),
  accept: new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  }),
});
protected readonly submitting = signal(false);
protected readonly submitted = signal(false);
protected readonly submitError = signal(false);

protected async submitDemo(): Promise<void> {
  this.demoForm.markAllAsTouched();
  if (this.demoForm.invalid) {
    this.submitError.set(true);
    setTimeout(() => this.submitError.set(false), 420);
    return;
  }
  this.submitting.set(true);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  this.submitting.set(false);
  this.submitted.set(true);
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (keyframe shake)',
      code: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}`,
    },
  ];

  protected readonly snippetsRangeSlider: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms.html',
      code: `<div class="flex flex-col gap-6 max-w-md">
  <label class="flex flex-col gap-2">
    <span class="flex items-center justify-between text-xs font-medium text-ink-dark">
      Volumen
      <span class="font-mono text-ink-muted">{{ volume.value }}%</span>
    </span>
    <input
      type="range"
      min="0" max="100"
      [formControl]="volume"
      class="mm-range"
      [style.--mm-range-progress.%]="volume.value"
    />
  </label>

  <label class="flex flex-col gap-2">
    <span class="flex items-center justify-between text-xs font-medium text-ink-dark">
      Opacidad
      <span class="font-mono text-ink-muted">{{ opacity.value }}%</span>
    </span>
    <input
      type="range"
      min="0" max="100"
      [formControl]="opacity"
      class="mm-range"
      [style.--mm-range-progress.%]="opacity.value"
    />
  </label>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms.ts (extracto)',
      code: `protected readonly volume = new FormControl(60, { nonNullable: true });
protected readonly opacity = new FormControl(85, { nonNullable: true });`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (.mm-range)',
      code: `.mm-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    var(--color-brand-6) 0%,
    var(--color-brand-6) var(--mm-range-progress, 0%),
    var(--color-border) var(--mm-range-progress, 0%),
    var(--color-border) 100%
  );
  outline: none;
  cursor: pointer;
}

.mm-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-surface-base);
  border: 2px solid var(--color-brand-6);
  box-shadow: var(--shadow-mm-brand);
  cursor: pointer;
  transition: transform 200ms var(--ease-out);
}

.mm-range::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}`,
    },
  ];
}
