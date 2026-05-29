# @minimax/styles

Capa **CSS portable** del ADN MiniMax: keyframes, utilities `.mm-*`, dark theme y un base reset opinado. CSS puro (sin Angular, sin JS), construido sobre los design tokens de [`@minimax/tokens`](../tokens). Consúmelo desde cualquier proyecto con Tailwind v4.

## Qué es

| Módulo | Subpath | Contenido |
|---|---|---|
| Tokens | _(auto)_ | `@theme` + CSS vars del ADN — se importan primero |
| Keyframes | `@minimax/styles/keyframes.css` | Definiciones `@keyframes` reutilizables |
| Dark theme | `@minimax/styles/dark.css` | Override de tokens en `[data-theme='dark']` + variante `mm-dark` |
| Base | `@minimax/styles/base.css` | Reset opinado: tipografía, selección, focus, reduced-motion |
| Utilities | `@minimax/styles/utilities.css` | Clases `.mm-*`, fondos y `[data-stagger]` |

El barril `index.css` importa los cinco en el **orden correcto**.

## Instalación

```bash
npm install @minimax/styles @minimax/tokens
```

`@minimax/tokens` es **peerDependency** (`^0.1.0`): debe estar resoluble en el consumidor, ya que `index.css` lo importa para que keyframes, dark y utilities tengan sus variables.

## Uso con Tailwind v4

En el CSS de entrada de tu app, después de Tailwind:

```css
@import "tailwindcss";
@import "@minimax/styles";
```

`@minimax/styles` ya hace `@import "@minimax/tokens/theme.css"` por dentro, así que **no** necesitas importar los tokens a mano. Activa dark mode poniendo `data-theme="dark"` en `<html>`.

> **El orden importa.** Los tokens se cargan primero (`@theme` + CSS vars); todo lo demás referencia esas variables. Si rompes el orden, las animaciones y utilities quedan sin valores.

### Uso granular (subpaths)

Si solo quieres una pieza —por ejemplo reutilizar los keyframes sin el reset— importa el módulo suelto. Recuerda traer los tokens tú mismo primero:

```css
@import "@minimax/tokens/theme.css";
@import "@minimax/styles/keyframes.css";
@import "@minimax/styles/dark.css";
@import "@minimax/styles/base.css";
@import "@minimax/styles/utilities.css";
```

## Qué incluye cada módulo

### `keyframes.css`

Animaciones de entrada y micro-interacción listas para usar vía `animation:` o las utilities:

`fadeIn` · `fadeInUp` · `fadeInDown` · `scaleIn` · `slideInRight` · `slideInLeft` · `shimmer` · `shake` · `press` · `pop` · `ripple` · `skeleton-loading` · `spinSweep` · `glowPulse` · `mm-card-gradient-rotate` · `mm-card-pulse-border` · `mm-drop-indicator` · `mm-tab-underline` · `mm-row-in` · `mm-check-pop` · `mm-line-fill` · `mm-step-active` · `mm-ping-strong` · `mm-badge-pop`. Las duraciones/easings salen de los tokens (`--duration-*`, `--ease-*`).

### `utilities.css`

Clases utilitarias con prefijo `.mm-*` más fondos decorativos y stagger:

| Categoría | Clases |
|---|---|
| Card FX | `.mm-card-shine` · `.mm-card-glow` · `.mm-card-glow-pink` · `.mm-card-spotlight` · `.mm-card-gradient-border` · `.mm-card-pulse` · `.mm-card-tilt-glare` |
| Hover | `.mm-hover-lift` · `.mm-hover-scale` · `.mm-hover-glow` |
| Press / feedback | `.mm-press` · `.mm-ripple` |
| Loading | `.mm-skeleton` (shimmer) |
| Scroll | `.mm-scroll-*` |
| Inputs | `.mm-input-bare` · `.mm-range` |
| Fondos | `.bg-dotted` · `.bg-grid` |
| Entrada escalonada | `[data-stagger]` (delays incrementales en los hijos) |

### `dark.css`

Activa el tema oscuro con `[data-theme='dark']` en `<html>`: override de los tokens de color (surface, ink, cta, estados…) sin tocar el markup. Expone la variante Tailwind **`@variant mm-dark`** para escribir `mm-dark:` en tus templates:

```css
@variant mm-dark (&:where([data-theme='dark'], [data-theme='dark'] *));
```

### `base.css`

Reset opinado del ADN MiniMax:

- Tipografía base (familias y rendering de las fuentes MiniMax)
- Color y fondo de **selección** de texto
- `:focus-visible` accesible (anillo de foco coherente con los tokens)
- Cursores y estilos de **inputs de fecha** nativos
- Respeto a `prefers-reduced-motion` (desactiva animaciones cuando el usuario lo pide)

## Portabilidad

CSS puro y `sideEffects: ["*.css"]` — funciona en cualquier bundler que entienda `@import`. Para Angular/React/Vue solo necesitas el paso de Tailwind v4 de arriba. Para entornos sin Tailwind, importa `@minimax/tokens/tokens.css` (`:root`) en vez de `theme.css` y luego los módulos sueltos.

## Licencia

MIT
