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

  it('renderiza o menu lateral, o seletor de idioma e o botão de tema', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    // início, experiência, labs e os dois labs
    expect(el.querySelectorAll('pf-sidebar nav a').length).toBe(5);
    expect(
      el.querySelectorAll('pf-language-switcher p-togglebutton').length,
    ).toBe(2);
    expect(el.querySelector('pf-topbar [aria-label]')).not.toBeNull();
  });

  it('atualiza o atributo lang do documento ao trocar o idioma', async () => {
    const fixture = TestBed.createComponent(App);
    TestBed.inject(LanguageService).use('en-us');
    await fixture.whenStable();

    expect(document.documentElement.lang).toBe('en-US');
  });

  it('alterna o tema escuro pela classe app-dark no <html>', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const toggle = fixture.nativeElement.querySelector(
      'pf-topbar .actions > button',
    ) as HTMLButtonElement;
    const wasDark = document.documentElement.classList.contains('app-dark');

    toggle.click();
    await fixture.whenStable();

    expect(document.documentElement.classList.contains('app-dark')).toBe(
      !wasDark,
    );
  });
});
