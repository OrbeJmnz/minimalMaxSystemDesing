// Verifica paridad 1:1 entre el @theme original del showcase y el theme.css generado.
// Uso puntual durante la migración (Fase 1). Ejecutar: node packages/tokens/validate-parity.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

const parseTheme = (css) => {
  const block = css.match(/@theme\s*\{([\s\S]*?)\}/);
  if (!block) throw new Error('No @theme block found');
  const map = new Map();
  for (const line of block[1].split('\n')) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?);\s*$/);
    if (m) map.set(m[1], m[2].trim());
  }
  return map;
};

const original = parseTheme(readFileSync(resolve(root, 'apps/showcase/src/styles.css'), 'utf8'));
const generated = parseTheme(readFileSync(resolve(__dirname, 'dist/theme.css'), 'utf8'));

const missing = [...original.keys()].filter((k) => !generated.has(k));
const extra = [...generated.keys()].filter((k) => !original.has(k));
const changed = [...original.keys()].filter((k) => generated.has(k) && generated.get(k) !== original.get(k));

console.log(`Original: ${original.size} tokens | Generado: ${generated.size} tokens`);
if (missing.length) console.log(`❌ FALTAN en generado (${missing.length}):`, missing);
if (extra.length) console.log(`❌ SOBRAN en generado (${extra.length}):`, extra);
if (changed.length) {
  console.log(`❌ VALOR DISTINTO (${changed.length}):`);
  for (const k of changed) console.log(`   ${k}: "${original.get(k)}" -> "${generated.get(k)}"`);
}
if (!missing.length && !extra.length && !changed.length) {
  console.log('✅ PARIDAD 1:1 PERFECTA — todos los tokens coinciden en nombre y valor.');
  process.exit(0);
}
process.exit(1);
