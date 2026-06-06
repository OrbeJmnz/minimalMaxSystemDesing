// Launcher de dev-server con auto-incremento de puerto.
// El @angular/build:dev-server falla si el 4200 está ocupado en vez de buscar otro.
// Este script encuentra el primer puerto libre desde 4200 y arranca `nx serve` ahí.
// Uso: node tools/serve.mjs  (o npm start). Acepta flags extra: npm start -- --open
import net from 'node:net';
import { spawn } from 'node:child_process';

const BASE_PORT = 4200;
const MAX_TRIES = 50;

function isFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.once('listening', () => srv.close(() => resolve(true)));
    srv.listen(port, '127.0.0.1');
  });
}

let port = BASE_PORT;
for (let i = 0; i < MAX_TRIES; i++) {
  if (await isFree(port)) break;
  port++;
}

if (port !== BASE_PORT) {
  console.log(`⚠️  Puerto ${BASE_PORT} ocupado → usando el siguiente libre: ${port}\n`);
}

const extraArgs = process.argv.slice(2);
const child = spawn(
  'npx',
  ['nx', 'serve', 'mm-showcase', '--port', String(port), ...extraArgs],
  { stdio: 'inherit', shell: true },
);
child.on('exit', (code) => process.exit(code ?? 0));
