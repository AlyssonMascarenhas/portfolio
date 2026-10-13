import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageService } from '@portfolio/i18n';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  it('renderiza a navegação e o seletor de idioma', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('.site-header nav a').length).toBe(3);
    expect(el.querySelectorAll('pf-language-switcher button').length).toBe(2);
  });

  it('atualiza o atributo lang do documento ao trocar o idioma', async () => {
    const fixture = TestBed.createComponent(App);
    TestBed.inject(LanguageService).use('en-us');
    await fixture.whenStable();

    expect(document.documentElement.lang).toBe('en-US');
  });
});
