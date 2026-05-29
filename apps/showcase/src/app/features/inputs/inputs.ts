import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { RippleDirective } from '@minimax/ui-angular';

@Component({
  selector: 'mm-inputs',
  imports: [ReactiveFormsModule, CanvasFrameComponent, SectionHeaderComponent, RippleDirective],
  templateUrl: './inputs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class InputsComponent {
  protected readonly nameCtrl = new FormControl('', { nonNullable: true });
  protected readonly emailCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly passwordCtrl = new FormControl('', { nonNullable: true });
  protected readonly amountCtrl = new FormControl(120, { nonNullable: true });
  protected readonly quantityCtrl = new FormControl(1, { nonNullable: true });
  protected readonly notesCtrl = new FormControl('', { nonNullable: true });
  protected readonly searchCtrl = new FormControl('', { nonNullable: true });

  protected readonly showPassword = signal(false);

  protected togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  protected step(ctrl: FormControl<number>, delta: number, min = 0, max = 9999): void {
    const next = Math.min(max, Math.max(min, (ctrl.value ?? 0) + delta));
    ctrl.setValue(next);
  }

  protected readonly snippetsFloatingLabels: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs.html',
      code: `<!-- Floating label: estructura clave -->
<div class="flex flex-col">
  <div class="relative">
    <input
      type="text"
      [formControl]="nameCtrl"
      placeholder=" "
      id="mm-name"
      class="peer w-full rounded-mm-md border-2 border-border bg-surface-base
             px-4 pt-5 pb-2 text-sm text-ink-dark
             focus:border-primary-500 focus:outline-none
             focus:ring-3 focus:ring-primary-500/10
             transition-[border-color,box-shadow] duration-200"
    />
    <span
      class="pointer-events-none absolute left-4 origin-left
             transition-all duration-200
             top-1.5 text-xs font-medium text-ink-muted
             peer-placeholder-shown:top-[1.1rem]
             peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
             peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-medium
             peer-focus:text-primary-500"
    >
      Nombre completo
    </span>
  </div>
  <span class="block mt-1 text-xs text-ink-muted">Cómo apareces para tu equipo.</span>
</div>

<!-- Variante con error + shake -->
<div class="flex flex-col">
  <div
    class="relative"
    [class.animate-[shake_380ms_ease-out_both]]="emailCtrl.invalid && emailCtrl.touched"
  >
    <input
      type="email"
      [formControl]="emailCtrl"
      placeholder=" "
      class="peer w-full rounded-mm-md border-2 border-border bg-surface-base
             px-4 pt-5 pb-2 text-sm transition-[border-color,box-shadow]"
      [class.!border-error]="emailCtrl.invalid && emailCtrl.touched"
      [class.!bg-error-bg]="emailCtrl.invalid && emailCtrl.touched"
    />
    <span class="pointer-events-none absolute left-4 top-1.5 text-xs font-medium ...">
      Email
    </span>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs.ts (extracto)',
      code: `import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'mm-inputs',
  imports: [ReactiveFormsModule],
  templateUrl: './inputs.html',
})
export class InputsComponent {
  protected readonly nameCtrl = new FormControl('', { nonNullable: true });
  protected readonly emailCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
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

  protected readonly snippetsPasswordToggle: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs.html',
      code: `<div class="relative max-w-md">
  <input
    [type]="showPassword() ? 'text' : 'password'"
    [formControl]="passwordCtrl"
    placeholder=" "
    class="peer w-full rounded-mm-md border-2 border-border bg-surface-base
           pl-4 pr-12 py-3 text-sm text-ink-dark
           focus:border-primary-500 focus:outline-none
           focus:ring-3 focus:ring-primary-500/10
           transition-[border-color,box-shadow] duration-200"
  />
  <span class="pointer-events-none absolute left-4 top-1.5 text-xs font-medium
               text-ink-muted peer-placeholder-shown:top-3.5
               peer-placeholder-shown:text-sm peer-focus:top-1.5
               peer-focus:text-primary-500">
    Contraseña
  </span>

  <button
    type="button"
    (click)="togglePassword()"
    [attr.aria-label]="showPassword() ? 'Ocultar' : 'Mostrar'"
    class="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-mm-sm
           grid place-items-center text-ink-muted hover:text-ink-dark
           hover:bg-surface-secondary transition mm-press"
  >
    <!-- icono eye / eye-off según showPassword() -->
  </button>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs.ts (extracto)',
      code: `protected readonly passwordCtrl = new FormControl('', { nonNullable: true });
protected readonly showPassword = signal(false);

protected togglePassword(): void {
  this.showPassword.update((value) => !value);
}`,
    },
  ];

  protected readonly snippetsNumberPrefixSuffix: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs.html',
      code: `<!-- Precio con prefijo $ y sufijo MXN -->
<label class="flex flex-col gap-1.5">
  <span class="text-xs font-medium text-ink-dark">Precio</span>
  <div class="group flex items-center h-11 rounded-mm-md border-2 border-border
              bg-surface-base focus-within:border-primary-500
              focus-within:ring-3 focus-within:ring-primary-500/10
              transition-[border-color,box-shadow] duration-200 overflow-hidden">
    <span class="inline-flex items-center pl-4 pr-1 text-sm font-medium
                 text-ink-muted group-focus-within:text-primary-500">
      $
    </span>
    <input
      type="number"
      [formControl]="amountCtrl"
      min="0"
      class="mm-input-bare flex-1 min-w-0 px-1 text-sm text-ink-dark tabular-nums"
    />
    <span class="inline-flex items-center pl-1 pr-4 text-[11px] font-semibold
                 uppercase tracking-wider text-ink-muted
                 border-l border-border-soft ml-2">
      MXN
    </span>
  </div>
</label>

<!-- Buscador pill con icono lupa -->
<label class="flex flex-col gap-1.5">
  <span class="text-xs font-medium text-ink-dark">Buscar</span>
  <div class="group flex items-center h-11 rounded-mm-pill border-2 border-border
              bg-surface-base focus-within:border-primary-500
              focus-within:shadow-mm-sm overflow-hidden">
    <span class="inline-flex items-center pl-4">
      <!-- icono search con group-focus-within:scale-110 -->
    </span>
    <input
      type="search"
      [formControl]="searchCtrl"
      placeholder="Buscar producto…"
      class="mm-input-bare flex-1 min-w-0 px-3 text-sm text-ink-dark"
    />
  </div>
</label>`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — oculta los spinners nativos del input number',
      code: `/* Oculta los spinners del navegador en input[type=number] */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Input "desnudo" para usarse dentro de un wrapper que ya tiene borde/focus */
.mm-input-bare,
.mm-input-bare:focus,
.mm-input-bare:focus-visible {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: 0;
  outline: 0;
  box-shadow: none;
}`,
    },
  ];

  protected readonly snippetsStepper: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs.html',
      code: `<label class="flex flex-col gap-1.5 max-w-xs">
  <span class="text-xs font-medium text-ink-dark">Cantidad</span>
  <div class="group flex items-center h-11 rounded-mm-md border-2 border-border
              bg-surface-base focus-within:border-primary-500
              focus-within:ring-3 focus-within:ring-primary-500/10
              overflow-hidden">
    <button
      type="button"
      mmRipple
      [color]="'rgba(0,0,0,0.08)'"
      (click)="step(quantityCtrl, -1, 1, 99)"
      [disabled]="quantityCtrl.value <= 1"
      aria-label="Restar"
      class="inline-flex items-center justify-center w-11 text-ink-dark
             hover:bg-surface-secondary disabled:opacity-40
             disabled:cursor-not-allowed mm-press"
    >
      <!-- icono minus -->
    </button>
    <input
      type="number"
      [formControl]="quantityCtrl"
      min="1" max="99"
      class="mm-input-bare flex-1 min-w-0 text-center text-sm font-medium
             text-ink-dark tabular-nums"
    />
    <button
      type="button"
      mmRipple
      [color]="'rgba(0,0,0,0.08)'"
      (click)="step(quantityCtrl, 1, 1, 99)"
      [disabled]="quantityCtrl.value >= 99"
      aria-label="Sumar"
      class="inline-flex items-center justify-center w-11 text-ink-dark
             hover:bg-surface-secondary disabled:opacity-40 mm-press"
    >
      <!-- icono plus -->
    </button>
  </div>
</label>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs.ts (extracto)',
      code: `protected readonly quantityCtrl = new FormControl(1, { nonNullable: true });

protected step(ctrl: FormControl<number>, delta: number, min = 0, max = 9999): void {
  const next = Math.min(max, Math.max(min, (ctrl.value ?? 0) + delta));
  ctrl.setValue(next);
}`,
    },
  ];

  protected readonly snippetsTextarea: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs.html',
      code: `<div class="flex flex-col max-w-2xl">
  <div class="relative">
    <textarea
      rows="4"
      [formControl]="notesCtrl"
      placeholder=" "
      class="peer w-full rounded-mm-md border-2 border-border bg-surface-base
             px-4 pt-6 pb-3 text-sm text-ink-dark
             focus:border-primary-500 focus:outline-none
             focus:ring-3 focus:ring-primary-500/10
             transition-[border-color,box-shadow] duration-200 resize-y"
    ></textarea>
    <span class="pointer-events-none absolute left-4 top-1.5 text-xs
                 font-medium text-ink-muted
                 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
                 peer-placeholder-shown:font-normal peer-focus:top-1.5
                 peer-focus:text-primary-500">
      Notas
    </span>
  </div>
  <div class="flex justify-between items-center mt-1 text-xs text-ink-muted">
    <span>Markdown soportado</span>
    <span class="font-mono" [class.text-warning]="notesCtrl.value.length > 400">
      {{ notesCtrl.value.length }} / 500
    </span>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'inputs.ts (extracto)',
      code: `protected readonly notesCtrl = new FormControl('', { nonNullable: true });`,
    },
  ];

  protected readonly snippetsStates: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'inputs.html',
      code: `<!-- Default -->
<input
  type="text"
  placeholder="Default"
  class="rounded-mm-md border-2 border-border bg-surface-base px-4 py-2.5
         text-sm text-ink-dark placeholder:text-ink-muted transition
         focus:outline-none focus:border-primary-500
         focus:ring-3 focus:ring-primary-500/10"
/>

<!-- Focus permanente (filled + active) -->
<input
  type="text"
  value="Filled value"
  class="rounded-mm-md border-2 border-primary-500 bg-surface-base px-4 py-2.5
         text-sm text-ink-dark ring-3 ring-primary-500/10"
/>

<!-- Error -->
<input
  type="text"
  value="Email inválido"
  class="rounded-mm-md border-2 border-error bg-error-bg px-4 py-2.5
         text-sm text-ink-dark"
/>

<!-- Disabled -->
<input
  type="text"
  value="No editable"
  disabled
  class="rounded-mm-md border-2 border-border bg-surface-secondary px-4 py-2.5
         text-sm text-ink-muted cursor-not-allowed"
/>`,
    },
  ];
}
