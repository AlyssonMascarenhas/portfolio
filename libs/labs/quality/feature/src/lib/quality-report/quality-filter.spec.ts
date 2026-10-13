import { QualityReport } from '@portfolio/contracts';
import { fill, filterReport } from './quality-filter';

const scenario = (
  name: string,
  suite: string[] = [],
  cases = 1,
  skipped = false,
) => ({
  name,
  suite,
  cases,
  skipped,
});

const REPORT: QualityReport = {
  generatedAt: '2026-01-01T00:00:00.000Z',
  totals: { areas: 2, specs: 3, scenarios: 7 },
  hasCoverage: true,
  areas: [
    {
      project: 'libs/labs/signals-rxjs/feature',
      scenarioCount: 4,
      coverage: { statements: 90, branches: 80, functions: 70, lines: 60 },
      specs: [
        {
          path: 'libs/labs/signals-rxjs/feature/src/lib/search/search.scenario.spec.ts',
          scenarios: [
            scenario('não dispara requisição a cada tecla', ['SearchScenario']),
            scenario('mostra o erro com alerta', ['SearchScenario']),
          ],
        },
        {
          path: 'libs/labs/signals-rxjs/feature/src/lib/ticker/ticker.scenario.spec.ts',
          scenarios: [
            scenario('status %i', ['mapHttpError'], 2),
            scenario('antigo', [], 1, true),
          ],
        },
      ],
    },
    {
      project: 'libs/shell/layout',
      scenarioCount: 3,
      specs: [
        {
          path: 'libs/shell/layout/src/lib/layout.service.spec.ts',
          scenarios: [
            scenario('alterna o tema'),
            scenario('fecha o menu mobile'),
          ],
        },
      ],
    },
  ],
};

describe('filterReport', () => {
  it('sem busca devolve tudo, contando as linhas das tabelas', () => {
    const { areas, shown } = filterReport(REPORT, '');

    expect(areas).toHaveLength(2);
    expect(shown).toBe(2 + 2 + 1 + 2); // 2 + (2 + 1) + 2
  });

  it('busca sem diferenciar maiúsculas e exige todos os termos', () => {
    expect(filterReport(REPORT, 'ALERTA').shown).toBe(1);
    expect(filterReport(REPORT, 'erro alerta').shown).toBe(1);
    expect(filterReport(REPORT, 'erro tecla').shown).toBe(0);
  });

  it('procura também no describe, no arquivo e na área', () => {
    expect(filterReport(REPORT, 'mapHttpError').shown).toBe(2);
    expect(filterReport(REPORT, 'layout.service').shown).toBe(2);
    expect(
      filterReport(REPORT, 'libs/shell').areas.map((a) => a.project),
    ).toEqual(['libs/shell/layout']);
  });

  it('remove specs e áreas que ficaram sem cenários e recalcula o total da área', () => {
    const { areas } = filterReport(REPORT, 'tecla');

    expect(areas).toHaveLength(1);
    expect(areas[0].specs).toHaveLength(1);
    expect(areas[0].scenarioCount).toBe(1);
    expect(areas[0].specs[0].fileName).toBe('search.scenario.spec.ts');
  });

  it('mantém a cobertura da área e marca os cenários pulados', () => {
    const { areas } = filterReport(REPORT, 'antigo');

    expect(areas[0].coverage?.statements).toBe(90);
    expect(areas[0].specs[0].scenarios[0].skipped).toBe(true);
  });

  it('une a cadeia de describe com separador', () => {
    const [row] = filterReport(REPORT, 'tecla').areas[0].specs[0].scenarios;

    expect(row.suite).toBe('SearchScenario');
  });
});

describe('fill', () => {
  it('substitui as chaves e deixa as desconhecidas como estão', () => {
    expect(fill('{shown} de {total}', { shown: 3, total: 9 })).toBe('3 de 9');
    expect(fill('{n} casos', {})).toBe('{n} casos');
  });
});
