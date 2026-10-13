// Gera apps/portfolio/src/app/primeng-license.generated.ts com a chave de licença do PrimeNG.
// A chave vem de PRIME_NG_LICENSE_KEY (CI: secret do GitHub) ou de .env.local (desenvolvimento,
// ignorado pelo git). Sem chave, gera uma string vazia e o PrimeNG mostra o aviso de licença.
//
// Atenção: a verificação é offline e roda no navegador, então a chave vai dentro do bundle
// publicado e é visível a quem inspecionar o site. O secret só a mantém fora do repositório.
// O valor da chave nunca é impresso.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const KEY_NAME = 'PRIME_NG_LICENSE_KEY';
const ENV_FILE = '.env.local';
const OUTPUT_FILE = 'apps/portfolio/src/app/primeng-license.generated.ts';

/** Lê o valor de `name` em um texto no formato KEY=value (aceita aspas e comentários com #). */
export function parseEnvValue(text, name) {
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || match[1] !== name) continue;
    return match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return '';
}

/** A variável de ambiente vence o arquivo. */
export function resolveKey(env, fileText) {
  return (env[KEY_NAME] ?? '').trim() || parseEnvValue(fileText ?? '', KEY_NAME);
}

export function renderModule(key) {
  return [
    '// Gerado por tools/scripts/write-license.mjs. Não edite nem commite (está no .gitignore).',
    `export const PRIMENG_LICENSE: string = ${JSON.stringify(key)};`,
    '',
  ].join('\n');
}

function main() {
  const fileText = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : '';
  const key = resolveKey(process.env, fileText);
  writeFileSync(OUTPUT_FILE, renderModule(key));
  console.log(
    key
      ? '✔ chave de licença do PrimeNG encontrada'
      : `⚠ ${KEY_NAME} não definida (env ou ${ENV_FILE}): o PrimeNG vai exibir o aviso de licença`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
