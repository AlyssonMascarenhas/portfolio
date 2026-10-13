// Prepara a pasta do build para o GitHub Pages:
//  1. copia o index.html para cada rota do app (e para o 404.html), para o Pages responder 200;
//  2. grava o sitemap.xml e a linha "Sitemap:" no robots.txt, a partir da MESMA lista de rotas;
//  3. troca o marcador __SITE_URL__ do index.html pela URL pública (Open Graph exige URL absoluta).
//
// O Pages só conhece arquivos: para /experience ele serve o 404.html (a página abre, mas com
// status 404, o que prejudica SEO e aciona erro de console em auditorias). Colocar uma cópia do
// index.html em cada rota resolve. O 404.html continua existindo para rotas desconhecidas.
//
// Uso: node tools/scripts/spa-fallbacks.mjs <pasta-do-build> [url-do-site]
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
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

export const SITE_URL_PLACEHOLDER = '__SITE_URL__';

const trimSlash = (url) => url.replace(/\/+$/, '');

/** Troca o marcador pela URL pública (sem barra no fim). */
export function withSiteUrl(html, siteUrl) {
  return html.replaceAll(SITE_URL_PLACEHOLDER, trimSlash(siteUrl));
}

export function renderSitemap(siteUrl, routes = ROUTES) {
  const base = trimSlash(siteUrl);
  const urls = ['', ...routes].map(
    (route) => `  <url><loc>${base}/${route}</loc></url>`,
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

export function writeFallbacks(dir, routes = ROUTES, siteUrl) {
  const index = join(dir, 'index.html');
  if (!existsSync(index))
    throw new Error(`index.html não encontrado em ${dir}`);

  if (siteUrl) {
    writeFileSync(index, withSiteUrl(readFileSync(index, 'utf8'), siteUrl));
    writeFileSync(join(dir, 'sitemap.xml'), renderSitemap(siteUrl, routes));
    appendFileSync(
      join(dir, 'robots.txt'),
      `\nSitemap: ${trimSlash(siteUrl)}/sitemap.xml\n`,
    );
  }

  copyFileSync(index, join(dir, '404.html'));
  for (const route of routes) {
    const target = join(dir, route, 'index.html');
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(index, target);
  }
  return routes.length;
}

function main() {
  const [dir, siteUrl] = process.argv.slice(2);
  if (!dir) {
    console.error('✖ informe a pasta do build');
    process.exit(1);
  }
  try {
    const count = writeFallbacks(dir, ROUTES, siteUrl);
    console.log(
      `✔ 404.html e ${count} rotas com index.html em ${dir}` +
        (siteUrl ? `; sitemap.xml e robots.txt para ${siteUrl}` : ''),
    );
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main();
