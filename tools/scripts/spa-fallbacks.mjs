// Gera as cópias do index.html que fazem o GitHub Pages responder 200 nas rotas do app.
//
// O Pages só conhece arquivos: para /experience ele serve o 404.html (a página abre, mas com
// status 404, o que prejudica SEO e aciona erro de console em auditorias). Colocar uma cópia do
// index.html em cada rota resolve. O 404.html continua existindo para rotas desconhecidas.
//
// Uso: node tools/scripts/spa-fallbacks.mjs <pasta-do-build>
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Rotas do app. O teste (spa-fallbacks.spec.mjs) falha se esta lista divergir das rotas no código. */
export const ROUTES = [
  'experience',
  'labs',
  'labs/signals-rxjs',
  'labs/signals-rxjs/local-state',
  'labs/signals-rxjs/derived-state',
  'labs/signals-rxjs/search',
  'labs/signals-rxjs/dependent-http',
  'labs/signals-rxjs/ticker',
  'labs/signals-rxjs/shared-state',
  'labs/api-playground',
];

export function writeFallbacks(dir, routes = ROUTES) {
  const index = join(dir, 'index.html');
  if (!existsSync(index)) throw new Error(`index.html não encontrado em ${dir}`);

  copyFileSync(index, join(dir, '404.html'));
  for (const route of routes) {
    const target = join(dir, route, 'index.html');
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(index, target);
  }
  return routes.length;
}

function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error('✖ informe a pasta do build');
    process.exit(1);
  }
  try {
    console.log(`✔ 404.html e ${writeFallbacks(dir)} rotas com index.html em ${dir}`);
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
