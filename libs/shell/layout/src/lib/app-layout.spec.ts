import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AppLayout } from './app-layout';
import { LayoutService } from './layout.service';

@Component({ template: 'página' })
class Page {}

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'x', component: Page }]),
        provideHttpClient(),
        provideTranslateService(),
      ],
    });
  });

  it('tem o link de pular para o conteúdo e o main como alvo', () => {
    const el: HTMLElement = TestBed.createComponent(AppLayout).nativeElement;
    TestBed.tick();

    const skip = el.querySelector<HTMLAnchorElement>('.skip-link');
    expect(skip?.getAttribute('href')).toBe('#main');
    expect(el.querySelector('main#main')).not.toBeNull();
  });

  it('fecha o menu mobile quando a navegação termina', async () => {
    TestBed.createComponent(AppLayout);
    const layout = TestBed.inject(LayoutService);
    layout.isDesktop.set(false);
    layout.toggleMenu();
    expect(layout.menuOpen()).toBe(true);

    await TestBed.inject(Router).navigateByUrl('/x');

    expect(layout.menuOpen()).toBe(false);
  });
});
