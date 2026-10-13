import { ApplicationRef } from '@angular/core';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { QualityReport } from '@portfolio/contracts';
import { provideQualityTesting } from '../testing';
import { QualityScenario } from './quality.scenario';

const scenario = (name: string, suite: string[] = [], cases = 1) => ({
  name,
  suite,
  cases,
  skipped: false,
});

const REPORT: QualityReport = {
  generatedAt: '2026-03-10T15:30:00.000Z',
  totals: { areas: 2, specs: 2, scenarios: 5 },
  hasCoverage: true,
  areas: [
    {
      project: 'libs/labs/signals-rxjs/feature',
      scenarioCount: 3,
      coverage: { statements: 91.2, branches: 80, functions: 75.5, lines: 90 },
      specs: [
        {
          path: 'libs/labs/signals-rxjs/feature/src/lib/search.scenario.spec.ts',
          scenarios: [
            scenario('não dispara requisição a cada tecla', ['SearchScenario']),
            scenario('cancela a requisição anterior', ['SearchScenario']),
            scenario('status %i', ['mapHttpError'], 1),
          ],
        },
      ],
    },
    {
      project: 'libs/shell/layout',
      scenarioCount: 2,
      specs: [
        {
          path: 'libs/shell/layout/src/lib/layout.service.spec.ts',
          scenarios: [scenario('alterna o tema'), scenario('fecha o menu')],
        },
      ],
    },
  ],
};

describe('QualityScenario', () => {
  let el: HTMLElement;
  let http: HttpTestingController;

  const settle = async () => {
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();
  };
  const loadReport = async (report: QualityReport = REPORT) => {
    http.expectOne('quality-report.json').flush(report);
    await settle();
  };
  const search = async (term: string) => {
    const input = el.querySelector<HTMLInputElement>('input[type=search]');
    if (!input) throw new Error('campo de busca não encontrado');
    input.value = term;
    input.dispatchEvent(new Event('input'));
    await settle();
  };
  const metrics = () =>
    [...el.querySelectorAll('pf-instrumentation-panel dd')].map((d) =>
      d.textContent?.trim(),
    );
  const count = () => el.querySelector('.count')?.textContent?.trim();

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideQualityTesting() });
    http = TestBed.inject(HttpTestingController);
    el = TestBed.createComponent(QualityScenario).nativeElement;
    TestBed.tick();
  });

  it('usa o singular quando a área tem um cenário só', async () => {
    await loadReport({
      ...REPORT,
      areas: [
        {
          ...REPORT.areas[0],
          scenarioCount: 1,
          specs: [
            { ...REPORT.areas[0].specs[0], scenarios: [scenario('um só')] },
          ],
        },
      ],
    });

    expect(
      el.querySelector('p-accordion-header p-tag')?.textContent?.trim(),
    ).toBe('1 cenário');
  });

  it('mostra o carregamento enquanto o relatório não chega', () => {
    expect(el.querySelector('.loading[aria-busy=true]')).not.toBeNull();
    expect(el.querySelector('pf-quality-report')).toBeNull();
  });

  it('lista uma área por projeto, com o total de cenários de cada uma', async () => {
    await loadReport();

    const headers = [...el.querySelectorAll('p-accordion-header')].map((h) =>
      h.textContent?.replace(/\s+/g, ' ').trim(),
    );
    expect(headers).toEqual([
      'libs/labs/signals-rxjs/feature3 cenários',
      'libs/shell/layout2 cenários',
    ]);
    expect(count()).toBe('5 de 5 cenários');
    expect(metrics()).toEqual(['5', '5', '2']); // total, exibidos, áreas
  });

  it('filtra pela busca, atualiza a contagem e abre as áreas com resultado', async () => {
    await loadReport();

    await search('tema');

    expect(count()).toBe('1 de 5 cenários');
    expect(metrics()[1]).toBe('1');
    expect(el.querySelectorAll('p-accordion-panel')).toHaveLength(1);
    const report = el.querySelector('pf-quality-report')?.textContent;
    expect(report).toContain('alterna o tema');
    expect(report).not.toContain('cancela a requisição anterior');
  });

  it('avisa quando nenhum cenário combina com a busca', async () => {
    await loadReport();

    await search('zzz');

    expect(count()).toBe('0 de 5 cenários');
    expect(el.querySelector('.empty')?.textContent).toContain(
      'Nenhum cenário encontrado',
    );
    expect(el.querySelector('p-accordion')).toBeNull();
  });

  it('mostra a cobertura por área só como contexto, com o aviso do que ela não mede', async () => {
    await loadReport();

    const rows = [...el.querySelectorAll('tbody tr')].map((r) =>
      [...r.children].map((c) => c.textContent?.trim()),
    );
    expect(rows).toEqual([
      ['libs/labs/signals-rxjs/feature', '91.2%', '80%', '75.5%', '90%'],
    ]);
    expect(el.querySelector('.coverage .note')?.textContent).toContain(
      'não que o comportamento certo foi verificado',
    );
  });

  it('sem relatório de cobertura, explica como gerar e não mostra a tabela', async () => {
    await loadReport({ ...REPORT, hasCoverage: false });

    expect(el.querySelector('table')).toBeNull();
    expect(el.textContent).toContain('npm run quality:report');
  });

  it('mostra o erro com botão de tentar de novo quando o relatório não existe', async () => {
    http
      .expectOne('quality-report.json')
      .flush(null, { status: 404, statusText: 'Not Found' });
    await settle();

    expect(el.querySelector('p-message[role=alert]')).not.toBeNull();

    el.querySelector<HTMLButtonElement>('.retry')?.click();
    TestBed.tick();

    expect(http.match('quality-report.json')).toHaveLength(1);
  });
});
