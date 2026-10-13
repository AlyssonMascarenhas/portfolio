import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Router, TitleStrategy, provideRouter } from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { PortfolioTitleStrategy } from './portfolio-title.strategy';

@Component({ template: 'página' })
class Page {}

const PT = {
  title: { labs: 'Labs', ticker: 'Fluxo contínuo' },
  meta: { default: 'Descrição padrão', labs: 'Descrição dos labs' },
};
const EN = {
  title: { labs: 'Labs', ticker: 'Continuous stream' },
  meta: { default: 'Default description', labs: 'Labs description' },
};

describe('PortfolioTitleStrategy', () => {
  let router: Router;
  let translate: TranslateService;
  const descriptionTag = (name: string) =>
    TestBed.inject(Meta).getTag(`name="${name}"`)?.content;

  async function go(url: string) {
    await router.navigateByUrl(url);
    TestBed.tick();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'labs',
            title: 'title.labs',
            data: { description: 'meta.labs' },
            component: Page,
          },
          {
            path: 'lab',
            data: { description: 'meta.labs' },
            children: [
              { path: 'ticker', title: 'title.ticker', component: Page },
            ],
          },
          { path: 'sem-titulo', component: Page },
        ]),
        provideTranslateService(),
        { provide: TitleStrategy, useExisting: PortfolioTitleStrategy },
      ],
    });
    router = TestBed.inject(Router);
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('pt-br', PT);
    translate.setTranslation('en-us', EN);
    translate.use('pt-br');
    TestBed.inject(PortfolioTitleStrategy);
    TestBed.tick();
  });

  it('monta o título traduzido com o nome do site', async () => {
    await go('/labs');

    expect(TestBed.inject(Title).getTitle()).toBe('Labs · Alysson Mascarenhas');
  });

  it('atualiza a descrição (e as versões Open Graph e Twitter)', async () => {
    await go('/labs');

    expect(descriptionTag('description')).toBe('Descrição dos labs');
    expect(descriptionTag('twitter:description')).toBe('Descrição dos labs');
    expect(
      TestBed.inject(Meta).getTag('property="og:description"')?.content,
    ).toBe('Descrição dos labs');
  });

  it('herda a descrição da rota pai quando só o filho tem título', async () => {
    await go('/lab/ticker');

    expect(TestBed.inject(Title).getTitle()).toBe(
      'Fluxo contínuo · Alysson Mascarenhas',
    );
    expect(descriptionTag('description')).toBe('Descrição dos labs');
  });

  it('refaz título e descrição quando o idioma muda', async () => {
    await go('/lab/ticker');

    translate.use('en-us');
    TestBed.tick();

    expect(TestBed.inject(Title).getTitle()).toBe(
      'Continuous stream · Alysson Mascarenhas',
    );
  });

  it('sem título na rota, usa só o nome do site e a descrição padrão', async () => {
    await go('/sem-titulo');

    expect(TestBed.inject(Title).getTitle()).toBe('Alysson Mascarenhas');
    expect(descriptionTag('description')).toBe('Descrição padrão');
  });
});
