import { ApplicationRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { QualityReport } from '@portfolio/contracts';
import { QualityReportService } from './quality-report.service';

const REPORT: QualityReport = {
  generatedAt: '2026-01-01T00:00:00.000Z',
  totals: { areas: 1, specs: 1, scenarios: 1 },
  hasCoverage: false,
  areas: [],
};

describe('QualityReportService', () => {
  let http: HttpTestingController;
  let service: QualityReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(QualityReportService);
  });

  const settle = () => TestBed.inject(ApplicationRef).whenStable();

  it('carrega o relatório gerado no build', async () => {
    TestBed.tick();
    http.expectOne('quality-report.json').flush(REPORT);
    await settle();

    expect(service.report.hasValue()).toBe(true);
    expect(service.report.value()?.totals.scenarios).toBe(1);
  });

  it('expõe o erro quando o relatório não existe (build sem o gerador)', async () => {
    TestBed.tick();
    http
      .expectOne('quality-report.json')
      .flush(null, { status: 404, statusText: 'Not Found' });
    await settle();

    expect(service.report.error()).toBeTruthy();
  });
});
