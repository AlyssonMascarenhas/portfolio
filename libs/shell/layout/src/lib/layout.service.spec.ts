import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('app-dark');
  });

  it('começa no tema claro quando o sistema não pede escuro e nada foi escolhido', () => {
    const layout = TestBed.inject(LayoutService);
    TestBed.tick();

    expect(layout.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('app-dark')).toBe(false);
  });

  it('alterna o tema, aplica a classe app-dark no <html> e lembra a escolha', () => {
    const layout = TestBed.inject(LayoutService);

    layout.toggleTheme();
    TestBed.tick();

    expect(layout.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('app-dark')).toBe(true);
    expect(localStorage.getItem('portfolio.theme')).toBe('dark');

    layout.toggleTheme();
    TestBed.tick();

    expect(document.documentElement.classList.contains('app-dark')).toBe(false);
    expect(localStorage.getItem('portfolio.theme')).toBe('light');
  });

  it('respeita a escolha salva ao iniciar', () => {
    localStorage.setItem('portfolio.theme', 'dark');
    const layout = TestBed.inject(LayoutService);
    TestBed.tick();

    expect(layout.isDark()).toBe(true);
  });

  it('no mobile o botão abre e fecha o menu; fechar é idempotente', () => {
    const layout = TestBed.inject(LayoutService);
    layout.isDesktop.set(false);

    layout.toggleMenu();
    expect(layout.menuOpen()).toBe(true);

    layout.closeMenu();
    layout.closeMenu();
    expect(layout.menuOpen()).toBe(false);
  });

  it('no desktop o botão recolhe e expande o menu fixo', () => {
    const layout = TestBed.inject(LayoutService);
    layout.isDesktop.set(true);

    layout.toggleMenu();
    expect(layout.menuCollapsed()).toBe(true);

    layout.toggleMenu();
    expect(layout.menuCollapsed()).toBe(false);
  });
});
