# @minimax/ui-angular

Librería de componentes Angular del **design system MiniMax**: **21 componentes**, **3 directivas** y **5 servicios**, todos `standalone`. Sin `NgModule`.

- **Standalone** — se importan directo en `imports: [...]` del componente consumidor.
- **Signals + `OnPush`** — estado reactivo con `signal()`/`computed()` y `ChangeDetectionStrategy.OnPush` por default.
- **SSR-safe** — sin acceso directo a `window`/`document` fuera de guards de plataforma; funciona con hidratación y prerender.
- **Reactive Forms** — varios inputs implementan `ControlValueAccessor` (ver [Reactive Forms](#reactive-forms)).

> El ADN visual (tokens, keyframes, utilidades `.mm-*`, dark theme) vive en **`@minimax/styles`** + **Tailwind v4**. Esta librería aporta solo la lógica/markup; **el setup de estilos del consumidor es obligatorio** (ver abajo).

---

## Peer dependencies

| Paquete | Rango | Para qué |
|---|---|---|
| `@angular/core` | `^21.2.0` | Runtime base, signals, DI |
| `@angular/common` | `^21.2.0` | Pipes / control flow / `isPlatformBrowser` |
| `@angular/forms` | `^21.2.0` | `ControlValueAccessor` de los inputs |
| `@angular/cdk` | `^21.2.0` | Overlays / portals (modal, drawer, tooltip) |
| `@minimax/styles` | `^0.1.0` | Tokens + keyframes + utilidades `.mm-*` + dark theme |

---

## Instalación

```bash
npm install @minimax/ui-angular @minimax/styles \
  @angular/cdk @angular/common @angular/core @angular/forms
```

---

## Setup de estilos (OBLIGATORIO)

Sin esto los componentes se renderizan **sin estilos**: Tailwind no genera las clases `.mm-*` / `bg-*` que usan los templates de la librería porque no las "ve". En el CSS global del consumidor (`styles.css`):

```css
@import "tailwindcss";
@import "@minimax/styles";

/* Tailwind debe escanear los templates de la librería para no purgar sus clases. */
@source "../node_modules/@minimax/ui-angular/**/*.{html,js,mjs}";
```

Notas:

- Ajusta la ruta de `@source` a tu layout. Si consumes la lib **por source** (monorepo / tsconfig path), apunta al `src`:
  `@source "../../packages/ui-angular/src/**/*.{html,ts}";`
- `@import "@minimax/styles"` ya hace `@import "@minimax/tokens/theme.css"`, así que los tokens `@theme` quedan disponibles.
- Requiere la receta de Tailwind v4 con Angular (`.postcssrc.json` + `@tailwindcss/postcss`).

---

## Uso de un componente

```ts
import { Component } from '@angular/core';
import { SectionHeaderComponent } from '@minimax/ui-angular';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [SectionHeaderComponent],
  template: `
    <mm-section-header
      eyebrow="Componentes"
      title="Section Header"
      subtitle="Encabezado con eyebrow + título + subtítulo." />
  `,
})
export class DemoComponent {}
```

---

## Inventario

### Componentes (21)

| Selector / clase | Categoría | Descripción |
|---|---|---|
| `mm-section-header` · `SectionHeaderComponent` | Layout | Eyebrow + título + subtítulo |
| `mm-chart-bar` · `ChartBarComponent` | Charts | Barras |
| `mm-chart-line` · `ChartLineComponent` | Charts | Líneas |
| `mm-chart-donut` · `ChartDonutComponent` | Charts | Donut |
| `mm-chart-sparkline` · `ChartSparklineComponent` | Charts | Sparkline inline |
| `mm-chart-heatmap` · `ChartHeatmapComponent` | Charts | Heatmap |
| `mm-chart-ring` · `ChartRingComponent` | Charts | Progress ring |
| `mm-pill-tabs` · `PillTabsComponent` | Navegación | Tabs con indicador deslizante |
| `mm-skeleton` · `SkeletonComponent` | Feedback | Skeleton loader shimmer |
| `mm-empty-state` · `EmptyStateComponent` | Feedback | Empty / 404 / mantenimiento |
| `mm-drawer-shell` · `DrawerShellComponent` | Overlays | Drawer slide-in (left/right) |
| `mm-modal-shell` · `ModalShellComponent` | Overlays | Modal con escape + body lock |
| `mm-toast-host` · `ToastHostComponent` | Overlays | Renderer de toasts (pareja de `ToastService`) |
| `mm-tour-host` · `TourHostComponent` | Overlays | Renderer de tour guiado (pareja de `TourService`) |
| `mm-otp-input` · `OtpInputComponent` | Forms | Input OTP multi-celda |
| `mm-rating-stars` · `RatingStarsComponent` | Forms | Rating con estrellas |
| `mm-color-picker` · `ColorPickerComponent` | Forms | Selector de color |
| `mm-pricing-toggle` · `PricingToggleComponent` | Forms | Toggle mensual/anual |
| `mm-rich-text-editor` · `RichTextEditorComponent` | Forms | Editor de texto enriquecido |
| `mm-calendar` · `CalendarComponent` | Display | Calendario / date picker |
| `mm-diff-viewer` · `DiffViewerComponent` | Display | Diff de líneas (LCS-style) |

### Directivas (3)

| Selector | Clase | Descripción |
|---|---|---|
| `[mmRipple]` | `RippleDirective` | Ripple Material al click |
| `[mmTooltip]` | `TooltipDirective` | Tooltip on hover (4 lados) |
| `[mmClickOutside]` | `ClickOutsideDirective` | Emite al hacer click fuera del host |

### Servicios (5)

| Servicio | Descripción |
|---|---|
| `ThemeService` | Dark mode SSR-safe; persiste en `localStorage` |
| `ToastService` | Cola de notificaciones (úsalo con `mm-toast-host`) |
| `OverlayService` | Helper para overlays / portals (CDK) |
| `TourService` | Estado del tour guiado (úsalo con `mm-tour-host`) |
| `MobileNavService` | Estado del drawer de navegación mobile |

---

## Reactive Forms

Estos componentes implementan `ControlValueAccessor`, así que funcionan con `formControlName`, `formControl` y `[(ngModel)]`:

- `mm-otp-input`
- `mm-rating-stars`
- `mm-color-picker`
- `mm-pricing-toggle`

```ts
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RatingStarsComponent } from '@minimax/ui-angular';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RatingStarsComponent],
  template: `<mm-rating-stars [formControl]="rating" />`,
})
export class ReviewComponent {
  rating = new FormControl(4);
}
```

---

## ThemeService

Dark mode SSR-safe. La clave de `localStorage` es configurable vía el `InjectionToken` **`MM_THEME_STORAGE_KEY`** (default `'mm-theme'`):

```ts
import { ApplicationConfig } from '@angular/core';
import { MM_THEME_STORAGE_KEY } from '@minimax/ui-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MM_THEME_STORAGE_KEY, useValue: 'mi-app-theme' },
  ],
};
```

```ts
import { inject } from '@angular/core';
import { ThemeService } from '@minimax/ui-angular';

private readonly theme = inject(ThemeService);
this.theme.toggle();          // alterna light/dark
this.theme.mode();            // signal<'light' | 'dark'>
```

Aplica `[data-theme="dark"]` sobre `<html>`; los overrides de variables CSS vienen de `@minimax/styles`.

---

## Licencia

MIT.
