// @minimax/tokens — Style Dictionary build
// Genera los tokens del ADN MiniMax a múltiples targets desde una sola fuente JSON.
//
// Fidelidad 1:1: usamos `transforms: []` (cero transforms de valor) y derivamos el
// nombre de la CSS var directamente de `token.path.join('-')`. Así el output reproduce
// EXACTAMENTE los nombres/valores del bloque @theme original — crítico porque Tailwind v4
// genera las utilidades (bg-brand-6, rounded-mm-md, …) a partir del nombre de la variable.

import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, 'src/tokens/*.json');
const OUT = resolve(__dirname, 'dist') + '/';

const cssVar = (token) => `--${token.path.join('-')}`;

// Tipo Figma/Tokens Studio según la categoría raíz del token.
const FIGMA_TYPE = {
  color: 'color',
  font: 'fontFamilies',
  radius: 'borderRadius',
  shadow: 'boxShadow',
  ease: 'cubicBezier',
  duration: 'duration',
  animate: 'other',
};

// --- Formats ---------------------------------------------------------------

// Bloque @theme para Tailwind v4 (consumido por @minimax/styles → showcase).
StyleDictionary.registerFormat({
  name: 'css/mm-theme',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((t) => `  ${cssVar(t)}: ${t.value};`);
    return `/* Generado por @minimax/tokens — NO editar a mano. Fuente: src/tokens/*.json */\n@theme {\n${lines.join('\n')}\n}\n`;
  },
});

// Bloque :root portable para consumidores sin Tailwind (vanilla / React / Vue).
StyleDictionary.registerFormat({
  name: 'css/mm-root',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((t) => `  ${cssVar(t)}: ${t.value};`);
    return `/* Generado por @minimax/tokens — NO editar a mano. */\n:root {\n${lines.join('\n')}\n}\n`;
  },
});

// Objeto JS plano { "color-brand-6": "#1456f0", … } para uso multi-framework.
StyleDictionary.registerFormat({
  name: 'javascript/mm-tokens',
  format: ({ dictionary }) => {
    const entries = dictionary.allTokens
      .map((t) => `  ${JSON.stringify(t.path.join('-'))}: ${JSON.stringify(t.value)},`)
      .join('\n');
    return (
      `// Generado por @minimax/tokens — NO editar a mano.\n` +
      `export const tokens = {\n${entries}\n};\n\n` +
      `/** Devuelve la referencia CSS var() de un token, ej. cssVar('color-brand-6') -> 'var(--color-brand-6)'. */\n` +
      `export const cssVar = (name) => \`var(--\${name})\`;\n\n` +
      `export default tokens;\n`
    );
  },
});

// Tipos para el objeto JS.
StyleDictionary.registerFormat({
  name: 'typescript/mm-dts',
  format: ({ dictionary }) => {
    const keys = dictionary.allTokens
      .map((t) => `  readonly ${JSON.stringify(t.path.join('-'))}: string;`)
      .join('\n');
    return (
      `// Generado por @minimax/tokens — NO editar a mano.\n` +
      `export declare const tokens: {\n${keys}\n};\n` +
      `export type TokenName = keyof typeof tokens;\n` +
      `export declare const cssVar: (name: TokenName) => string;\n` +
      `export default tokens;\n`
    );
  },
});

// JSON estilo Tokens Studio para importar el ADN a Figma.
StyleDictionary.registerFormat({
  name: 'json/mm-figma',
  format: ({ dictionary }) => {
    const out = {};
    for (const t of dictionary.allTokens) {
      const [group, ...rest] = t.path;
      out[group] ??= {};
      out[group][rest.join('-')] = { value: t.value, type: FIGMA_TYPE[group] ?? 'other' };
    }
    return JSON.stringify(out, null, 2) + '\n';
  },
});

// --- Build -----------------------------------------------------------------

const sd = new StyleDictionary({
  source: [SRC],
  platforms: {
    css: {
      transforms: [],
      buildPath: OUT,
      files: [
        { destination: 'theme.css', format: 'css/mm-theme' },
        { destination: 'tokens.css', format: 'css/mm-root' },
      ],
    },
    js: {
      transforms: [],
      buildPath: OUT,
      files: [
        { destination: 'tokens.js', format: 'javascript/mm-tokens' },
        { destination: 'tokens.d.ts', format: 'typescript/mm-dts' },
      ],
    },
    figma: {
      transforms: [],
      buildPath: OUT,
      files: [{ destination: 'figma.tokens.json', format: 'json/mm-figma' }],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
console.log('✅ @minimax/tokens generado en dist/');
