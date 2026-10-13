// Monta o site como o GitHub Pages o serve, para os testes ponta a ponta e o Lighthouse CI:
// .site/portfolio/ com o build, o index.html copiado em cada rota e o 404.html.
// O build precisa ter sido feito com --base-href=/portfolio/ (npm run build:pages).
//
// Uso: node tools/scripts/stage-site.mjs [pasta-do-build] [pasta-de-saida]
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROUTES, writeFallbacks } from './spa-fallbacks.mjs';

const DEFAULT_BUILD = 'dist/apps/portfolio/browser';
const DEFAULT_OUTPUT = '.site';
export const SITE_BASE = 'portfolio';
export const LOCAL_URL = `http://localhost:4300/${SITE_BASE}`;

/** Copia o build para <saida>/portfolio e prepara os fallbacks de rota. Devolve a pasta do site. */
export function stageSite(
  buildDir = DEFAULT_BUILD,
  outputDir = DEFAULT_OUTPUT,
) {
  if (!existsSync(join(buildDir, 'index.html'))) {
    throw new Error(
      `build não encontrado em ${buildDir} (rode npm run build:pages)`,
    );
  }
  const site = join(outputDir, SITE_BASE);
  rmSync(outputDir, { recursive: true, force: true });
  cpSync(buildDir, site, { recursive: true });
  writeFallbacks(site, ROUTES, LOCAL_URL);
  return site;
}

function main() {
  try {
    const site = stageSite(process.argv[2], process.argv[3]);
    console.log(
      `✔ site montado em ${site} (servir a pasta pai em http://localhost:4300)`,
    );
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main();
