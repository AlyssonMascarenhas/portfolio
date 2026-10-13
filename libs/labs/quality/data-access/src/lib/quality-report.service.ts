import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { QualityReport } from '@portfolio/contracts';

/**
 * Relatório do lab de qualidade: os cenários que os testes garantem e, quando existe, a cobertura.
 * O JSON é gerado no build por `tools/scripts/build-quality-report.mjs` a partir dos specs reais.
 * Exclusivo do lab: é provido nas rotas dele, não na raiz.
 */
@Service({ autoProvided: false })
export class QualityReportService {
  readonly report = httpResource<QualityReport>(() => 'quality-report.json');
}
