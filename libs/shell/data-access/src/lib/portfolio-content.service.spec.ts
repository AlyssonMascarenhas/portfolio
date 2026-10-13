import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageService } from '@portfolio/i18n';
import { PortfolioContentService } from './portfolio-content.service';

describe('PortfolioContentService', () => {
  let http: HttpTestingController;
  let language: LanguageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    language = TestBed.inject(LanguageService);
    TestBed.inject(PortfolioContentService);
  });

  // Os três recursos (profile, experience, skills) disparam juntos; descartamos os que o teste não usa.
  afterEach(() => http.match(() => true));

  it('envia o idioma atual no header Accept-Language', () => {
    language.use('pt-br');
    TestBed.tick();

    const req = http.expectOne('api/experience');
    expect(req.request.headers.get('Accept-Language')).toBe('pt-BR');
    req.flush([]);
  });

  it('refaz a requisição quando o idioma muda', () => {
    language.use('pt-br');
    TestBed.tick();
    http.expectOne('api/experience').flush([]);

    language.use('en-us');
    TestBed.tick();

    const req = http.expectOne('api/experience');
    expect(req.request.headers.get('Accept-Language')).toBe('en-US');
    req.flush([]);
  });
});
