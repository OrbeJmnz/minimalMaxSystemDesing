# @minimax/tokens

Design tokens del **ADN visual MiniMax**: la fuente única de verdad para color, tipografía, radios, sombras y movimiento. Se editan como JSON en `src/tokens/*.json`, pasan por **Style Dictionary** (`build.mjs`, `transforms: ['name/kebab']`; la fidelidad 1:1 se logra porque los nombres de variable se derivan de `token.path.join('-')` y los valores se emiten crudos, sin reescalado de unidades) y se emiten a múltiples targets listos para consumir.

```
src/tokens/*.json  ──▶  build.mjs (Style Dictionary)  ──▶  dist/
                                                            ├── theme.css          (Tailwind v4 @theme)
                                                            ├── tokens.css         (:root CSS vars)
                                                            ├── tokens.js          (objeto JS + cssVar)
                                                            ├── tokens.d.ts        (tipos TS)
                                                            └── figma.tokens.json  (Tokens Studio)
```

> `dist/` está en `.gitignore` — siempre se regenera. No edites nunca los archivos de `dist/` a mano.

## Instalación

```bash
npm i @minimax/tokens
```

En este monorepo ya está disponible vía npm workspaces + el path `@minimax/tokens` en `tsconfig.base.json`.

## Uso por target

### a) Tailwind v4 — `theme.css`

Importa el bloque `@theme` directamente; cada token queda como `--color-*`, `--radius-*`, etc. y genera utilidades (`bg-brand-6`, `rounded-mm-md`, `shadow-mm-lift`, `animate-fade-in`...).

```css
@import "tailwindcss";
@import "@minimax/tokens/theme.css";
```

### b) CSS vanilla — `tokens.css`

Las mismas variables expuestas en `:root`, sin depender de Tailwind.

```css
@import "@minimax/tokens/tokens.css";

.btn {
  background: var(--color-brand-6);
  border-radius: var(--radius-mm-md);
  box-shadow: var(--shadow-mm-lift);
  transition: transform var(--duration-normal) var(--ease-out);
}
```

### c) JS / TS — objeto plano + `cssVar`

```ts
import { tokens, cssVar } from '@minimax/tokens';

tokens['color-brand-6'];   // '#1456f0'  (valor literal)
tokens['radius-mm-md'];     // '8px'
cssVar('color-brand-6');    // 'var(--color-brand-6)'  (referencia para inline styles)
```

`tokens` es un objeto plano `clave -> valor` (la clave es el `path` unido por `-`). `cssVar(name)` envuelve esa clave en `var(--…)`, tipado con `TokenName`.

### d) Figma — `figma.tokens.json`

Importa `dist/figma.tokens.json` en el plugin **Tokens Studio** para sincronizar el ADN dentro de Figma.

## Regenerar los tokens

1. Edita el JSON correspondiente en `src/tokens/*.json`.
2. Corre el build:

```bash
npm run tokens        # nx build tokens
# o desde el paquete:  npm run build  (node build.mjs)
```

> **Cicatriz:** los nombres de las CSS vars derivan de `path.join('-')` (ej. `color.brand-6` → `--color-brand-6`). **No renames las claves** sin querer: romperías las utilidades de Tailwind y cualquier `var(--…)` que las consuma.

## Categorías de tokens

| Categoría | Archivo | Prefijo CSS var | Ejemplos |
|---|---|---|---|
| Tipografía | `font.json` | `--font-*` | `font-sans` (DM Sans), `font-display` (Outfit), `font-mid` (Poppins), `font-mono` (Roboto) |
| Color | `color.json` | `--color-*` | `color-brand-6` `#1456f0`, `color-primary-600`, `color-ink-base`, `color-surface-app`, `color-border`, `color-success`/`warning`/`error`, `color-cta` |
| Radio | `radius.json` | `--radius-*` | `radius-mm-sm` 4px → `radius-mm-3xl` 24px, `radius-mm-pill` 9999px |
| Sombra | `shadow.json` | `--shadow-*` | `shadow-mm-sm`, `shadow-mm-md`, `shadow-mm-brand`, `shadow-mm-elevated`, `shadow-mm-lift` |
| Easing | `ease.json` | `--ease-*` | `ease-default`, `ease-out`, `ease-in`, `ease-in-out`, `ease-bounce` |
| Duración | `duration.json` | `--duration-*` | `duration-instant` 0ms, `fast` 150ms, `normal` 300ms, `slow` 500ms, `slower` 800ms |
| Animación | `animation.json` | `--animate-*` | `animate-fade-in`, `fade-in-up`, `scale-in`, `slide-in-right`, `shimmer`, `shake`, `pop` |

### Color — subgrupos

| Subgrupo | Claves |
|---|---|
| brand | `brand-6` · `brand-deep` · `brand-sky` · `brand-pink` |
| primary | `primary-200` · `primary-light` · `primary-500` · `primary-600` · `primary-700` |
| ink (texto) | `ink-base` · `ink-dark` · `ink-charcoal` · `ink-secondary` · `ink-muted` · `ink-helper` |
| surface | `surface-base` · `surface-secondary` · `surface-app` · `surface-glass` · `surface-inverse` · `surface-inverse-deep` |
| border | `border` · `border-soft` |
| status | `success`(+`-bg`) · `warning`(+`-bg`) · `error`(+`-bg`) |
| cta | `cta` · `cta-fg` · `cta-hover` · `cta-soft` · `cta-soft-fg` · `backdrop`(+`-strong`) |

> Las animaciones (`--animate-*`) referencian keyframes globales (`fadeIn`, `scaleIn`, `shimmer`…) que viven en **`@minimax/styles`**, no en este paquete.

## Licencia

MIT
