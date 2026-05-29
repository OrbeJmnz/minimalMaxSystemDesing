# MiniMax Design System

Monorepo **Nx** que extrae el ADN visual de **MiniMax** en tres paquetes publicables y los consume desde una galería showcase. La intención es simple: el showcase es un proyecto externo más — consume `@minimax/*` igual que cualquier otra app Angular lo haría.

- **Stack**: Angular 21 (SSR + standalone + zoneless) · Tailwind 4 · Nx 22.7 + npm workspaces · Style Dictionary (tokens) · ng-packagr (librería Angular).
- **ADN**: espacio blanco abundante · pills `9999px` · gradientes vibrantes · sombras purple-tinted · multi-font con propósito (DM Sans · Outfit · Poppins · Roboto).

---

## Estructura

```
minimaxComponents/
├── apps/
│   └── showcase/            # mm-showcase — galería + docs vivo (39 features, ~140 demos)
├── packages/
│   ├── tokens/              # @minimax/tokens   — fuente única de design tokens
│   ├── styles/              # @minimax/styles   — keyframes + utilities .mm-* + dark theme
│   └── ui-angular/          # @minimax/ui-angular — 21 componentes + 3 directivas + 5 servicios
├── nx.json
├── tsconfig.base.json       # paths @minimax/*
└── package.json             # npm workspaces (apps/*, packages/*)
```

El **showcase** documenta en vivo 39 features (botones, inputs, forms, cards, navegación, overlays, dropdowns, exports, mapas, layouts, payments, auth, dashboards, AI lab, etc.), cada uno con sus snippets HTML/TS/CSS copiables.

---

## Los 3 paquetes

| Paquete | Qué expone | Cómo se consume |
|---|---|---|
| **`@minimax/tokens`** | `theme.css` (`@theme` para Tailwind v4) · `tokens.css` (`:root` CSS vars) · `tokens.js` + `tokens.d.ts` (JS/TS) · `figma.tokens.json`. Generado por Style Dictionary desde `src/tokens/*.json`. | `@import "@minimax/tokens/theme.css";` en Tailwind, o `tokens.css` para `:root` plano, o `import { ... } from "@minimax/tokens"` en JS/TS. |
| **`@minimax/styles`** | CSS portable: `keyframes.css` · `utilities.css` (clases `.mm-*`) · `dark.css` · `base.css` agrupados en `index.css` (que ya hace `@import "@minimax/tokens/theme.css"`). | `@import "@minimax/styles";` en tu archivo CSS principal. |
| **`@minimax/ui-angular`** | 21 componentes + 3 directivas + 5 servicios (public API en `src/index.ts`). `ThemeService` con key configurable vía `MM_THEME_STORAGE_KEY`. Empaquetado con ng-packagr. | `import { ... } from "@minimax/ui-angular";` en componentes standalone. Requiere `@angular/cdk` como peer. |

---

## Comandos Nx clave

```bash
npm start                       # nx serve mm-showcase (puerto 4200)
npm run build                   # nx build mm-showcase (SSR + prerender de 39 rutas)
npm test                        # nx test mm-showcase (vitest)
npm run tokens                  # nx build tokens (regenera el ADN desde los JSON)

npx nx run-many -t build        # build de los 3 paquetes + showcase
npx nx run-many -t test         # tests de todo el workspace
```

---

## Consumir el Design System en otro proyecto Angular

**1. Instala los paquetes** (más el peer de Angular CDK):

```bash
npm install @minimax/tokens @minimax/styles @minimax/ui-angular @angular/cdk
```

**2. Importa estilos en tu CSS principal.** `@minimax/styles` ya arrastra los tokens; agrega un `@source` para que Tailwind v4 no purgue las clases `.mm-*` usadas en los templates de la librería:

```css
@import "tailwindcss";
@import "@minimax/styles";

@source "../node_modules/@minimax/ui-angular/**/*.{html,ts,mjs}";
```

**3. Usa los componentes** en tus standalone components. Los componentes de formulario (`mm-rating-stars`, `mm-otp-input`, `mm-color-picker`, `mm-pricing-toggle`) implementan `ControlValueAccessor`, así que funcionan con `formControlName` / `ngModel`:

```ts
import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { RatingStarsComponent, SectionHeaderComponent } from "@minimax/ui-angular";

@Component({
  selector: "app-demo",
  imports: [RatingStarsComponent, SectionHeaderComponent, ReactiveFormsModule],
  template: `
    <mm-section-header eyebrow="Demo" title="MiniMax" />
    <mm-rating-stars [formControl]="rating" />
  `,
})
export class DemoComponent {
  readonly rating = new FormControl(3);
}
```

---

## Consumir solo los tokens (stack no-Angular)

Si solo necesitas el ADN sin componentes ni Angular, consume directamente `@minimax/tokens`:

| Entrypoint | Caso de uso |
|---|---|
| `@minimax/tokens/theme.css` | Proyectos con **Tailwind v4** — expone los tokens vía `@theme`. |
| `@minimax/tokens/tokens.css` | Cualquier stack CSS — expone los tokens como CSS vars en `:root`. |
| `@minimax/tokens` (`tokens.js` / `.d.ts`) | JS/TS — consumo programático de los valores tipados. |

```css
/* CSS plano, sin Tailwind */
@import "@minimax/tokens/tokens.css";

.cta {
  background: var(--color-brand-6);
  border-radius: var(--radius-mm-pill);
}
```

> **Regenerar tokens**: edita `packages/tokens/src/tokens/*.json` y corre `npm run tokens`. Los nombres de CSS var salen de `path.join('-')` (ej. `color.brand-6` → `--color-brand-6`); renombrarlos rompe las utilidades de Tailwind que dependen de ellos.

---

## Notas técnicas

- **Tailwind v4 + Angular 21**: `@angular/build` no procesa `postcss.config.json`; usa `.postcssrc.json` (replicado en `apps/showcase/`).
- **Nx no infiere deps por `@import` CSS**: el showcase depende de `@minimax/tokens` solo vía CSS, por eso los targets declaran `dependsOn: ["tokens:build"]`.
- **Change detection** zoneless en toda la app (`provideZonelessChangeDetection()`), `OnPush` por default, inputs vía `input.required<T>()` + signals.
