// Extrai as regiões `// #region <id>` ... `// #endregion` do código dos labs para um JSON,
// para que a aba "Code" mostre exatamente o código que roda na demo.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const SOURCE_DIR = 'libs/labs';
const OUTPUT_FILE = 'apps/portfolio/public/snippets.json';

const REGION_START = /^\s*\/\/\s*#region\s+(\S+)\s*$/;
const REGION_END = /^\s*\/\/\s*#endregion\s*$/;

function dedent(lines) {
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => l.match(/^\s*/)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut));
}

/** Devolve [{ id, code }] das regiões de um arquivo. Lança erro se houver região mal formada. */
export function extractRegions(source, file = '<arquivo>') {
  const regions = [];
  let current = null;

  source.split(/\r?\n/).forEach((line, index) => {
    const where = `${file}:${index + 1}`;
    const start = line.match(REGION_START);
    if (start) {
      if (current)
        throw new Error(
          `${where}: região "${start[1]}" dentro de "${current.id}" (aninhamento não é suportado)`,
        );
      current = { id: start[1], lines: [] };
    } else if (REGION_END.test(line)) {
      if (!current) throw new Error(`${where}: #endregion sem #region`);
      regions.push({
        id: current.id,
        code: dedent(current.lines).join('\n').trim(),
      });
      current = null;
    } else if (current) {
      current.lines.push(line);
    }
  });

  if (current)
    throw new Error(`${file}: região "${current.id}" sem #endregion`);
  return regions;
}

function listSourceFiles(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(
      (e) =>
        e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts'),
    )
    .map((e) => join(e.parentPath, e.name));
}

/** Monta { [id]: { file, code } } a partir dos arquivos; ids duplicados são erro. */
export function buildSnippets(files, read = (f) => readFileSync(f, 'utf8')) {
  const snippets = {};
  for (const path of files) {
    const file = path.split(sep).join('/');
    for (const { id, code } of extractRegions(read(path), file)) {
      if (snippets[id])
        throw new Error(
          `id "${id}" duplicado em ${file} e ${snippets[id].file}`,
        );
      snippets[id] = { file, code };
    }
  }
  return Object.fromEntries(
    Object.entries(snippets).sort(([a], [b]) => a.localeCompare(b)),
  );
}

function main() {
  const snippets = buildSnippets(listSourceFiles(SOURCE_DIR));
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, `${JSON.stringify(snippets, null, 2)}\n`);
  console.log(
    `✔ ${Object.keys(snippets).length} trechos em ${relative('.', OUTPUT_FILE)}`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main();
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }
}
