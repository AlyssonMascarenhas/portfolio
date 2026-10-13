// Confere se todos os arquivos de tradução têm exatamente as mesmas chaves.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'apps/portfolio/public/i18n';
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object'
      ? flatten(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const keysByFile = Object.fromEntries(
  files.map((f) => [
    f,
    new Set(flatten(JSON.parse(readFileSync(join(dir, f), 'utf8')))),
  ]),
);
const allKeys = new Set(Object.values(keysByFile).flatMap((s) => [...s]));

let ok = true;
for (const [file, keys] of Object.entries(keysByFile)) {
  const missing = [...allKeys].filter((k) => !keys.has(k));
  if (missing.length) {
    ok = false;
    console.error(`✖ ${file} sem as chaves:\n  ${missing.join('\n  ')}`);
  }
}

if (ok)
  console.log(
    `✔ ${files.length} arquivos de tradução com ${allKeys.size} chaves cada`,
  );
process.exit(ok ? 0 : 1);
