import { QualityCoverage, QualityReport } from '@portfolio/contracts';

export interface ScenarioRow {
  /** Cadeia de describe, já unida (vazia fora de um describe). */
  suite: string;
  name: string;
  cases: number;
  skipped: boolean;
}

export interface SpecRow {
  path: string;
  fileName: string;
  scenarios: ScenarioRow[];
}

export interface AreaRow {
  project: string;
  /** Casos que sobraram depois do filtro. */
  scenarioCount: number;
  coverage?: QualityCoverage;
  specs: SpecRow[];
}

export interface FilteredReport {
  areas: AreaRow[];
  /** Casos exibidos (conta as linhas de it.each). */
  shown: number;
}

/** Preenche {chave} em um texto de interface. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Filtra o relatório por termos (todos precisam aparecer, sem diferenciar maiúsculas) no nome do
 * cenário, no describe, no arquivo ou na área. Áreas e specs sem cenário sobrando saem da lista.
 */
export function filterReport(
  report: QualityReport,
  query: string,
): FilteredReport {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (haystack: string) =>
    terms.every((term) => haystack.includes(term));

  let shown = 0;
  const areas: AreaRow[] = [];

  for (const area of report.areas) {
    const specs: SpecRow[] = [];
    let areaCount = 0;

    for (const spec of area.specs) {
      const scenarios = spec.scenarios
        .filter((s) =>
          matches(
            [area.project, spec.path, ...s.suite, s.name]
              .join(' ')
              .toLowerCase(),
          ),
        )
        .map((s) => ({
          suite: s.suite.join(' › '),
          name: s.name,
          cases: s.cases,
          skipped: s.skipped,
        }));
      if (!scenarios.length) continue;

      areaCount += scenarios.reduce((sum, s) => sum + s.cases, 0);
      specs.push({
        path: spec.path,
        fileName: spec.path.split('/').pop() ?? spec.path,
        scenarios,
      });
    }

    if (!specs.length) continue;
    shown += areaCount;
    areas.push({
      project: area.project,
      scenarioCount: areaCount,
      coverage: area.coverage,
      specs,
    });
  }

  return { areas, shown };
}
