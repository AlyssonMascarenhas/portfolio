import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { HomePage } from './home-page';

const PROFILE = {
  name: 'Fulano',
  headline: 'Engenheiro',
  tagline: 'Tagline',
  sectors: 'Setor',
  location: 'Cidade',
  careerStart: '2019-01',
  about: ['Sobre'],
  education: [],
  links: { email: 'a@b.c', linkedin: 'https://linkedin.com/in/x' },
};

describe('HomePage', () => {
  it('apresenta os labs na home, com link para cada um, e o CTA principal aponta para /labs', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateService(),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const el: HTMLElement = TestBed.createComponent(HomePage).nativeElement;
    TestBed.tick();

    // o service dispara profile, experience e skills juntos: todos precisam responder, ou o app não estabiliza
    http.expectOne('api/profile').flush(PROFILE);
    http.expectOne('api/experience').flush([]);
    http.expectOne('api/skills').flush([]);
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();

    expect(el.querySelector('.actions a')?.getAttribute('href')).toBe('/labs');
    const labLinks = [...el.querySelectorAll('p-card a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(labLinks).toEqual([
      '/labs/signals-rxjs',
      '/labs/api-playground',
      '/labs/quality',
      '/labs/forms',
    ]);
  });

  it('mostra o erro das competências com botão de tentar de novo e refaz a requisição', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateService(),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const el: HTMLElement = TestBed.createComponent(HomePage).nativeElement;
    TestBed.tick();

    http.expectOne('api/profile').flush(PROFILE);
    http.expectOne('api/experience').flush([]);
    http
      .expectOne('api/skills')
      .flush(null, { status: 500, statusText: 'Server Error' });
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();

    const section = el.querySelector('section[aria-labelledby=skills-title]');
    expect(section?.querySelector('p-message[role=alert]')).not.toBeNull();

    section?.querySelector<HTMLButtonElement>('button')?.click();
    TestBed.tick();

    expect(http.match('api/skills')).toHaveLength(1);
  });
});
