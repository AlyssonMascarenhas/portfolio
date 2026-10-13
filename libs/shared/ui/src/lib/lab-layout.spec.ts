import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LabLayout } from './lab-layout';

@Component({
  imports: [LabLayout],
  template: `
    <pf-lab-layout title="Estado local" problem="Um modal abre e fecha.">
      <p demo>conteúdo demo</p>
      <p code>conteúdo code</p>
      <p architecture>conteúdo arquitetura</p>
    </pf-lab-layout>
  `,
})
class Host {}

describe('LabLayout', () => {
  let root: HTMLElement;

  const tabs = () => [
    ...root.querySelectorAll<HTMLButtonElement>('[role=tab]'),
  ];
  const panels = () => [
    ...root.querySelectorAll<HTMLElement>('[role=tabpanel]'),
  ];
  const visible = () =>
    panels()
      .filter((p) => !p.hidden)
      .map((p) => p.textContent?.trim());
  const press = (key: string) => {
    root
      .querySelector('[role=tab][aria-selected=true]')
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
      );
    TestBed.tick();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    const fixture = TestBed.createComponent(Host);
    root = fixture.nativeElement;
    TestBed.tick();
  });

  it('mostra título, problema e começa na aba Demo', () => {
    expect(root.querySelector('h1')?.textContent).toBe('Estado local');
    expect(root.textContent).toContain('Um modal abre e fecha.');
    expect(tabs().map((t) => t.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(visible()).toEqual(['conteúdo demo']);
  });

  it('troca de aba ao clicar, mantendo os painéis montados', () => {
    tabs()[1].click();
    TestBed.tick();

    expect(visible()).toEqual(['conteúdo code']);
    expect(panels()).toHaveLength(3);
  });

  it('liga cada aba ao seu painel por aria-controls e aria-labelledby', () => {
    tabs().forEach((tab, i) => {
      expect(tab.getAttribute('aria-controls')).toBe(panels()[i].id);
      expect(panels()[i].getAttribute('aria-labelledby')).toBe(tab.id);
    });
  });

  it('navega por teclado e só a aba ativa entra na ordem de tab', () => {
    press('ArrowRight');
    expect(visible()).toEqual(['conteúdo code']);
    expect(tabs().map((t) => t.tabIndex)).toEqual([-1, 0, -1]);

    press('End');
    expect(visible()).toEqual(['conteúdo arquitetura']);

    press('ArrowRight'); // dá a volta
    expect(visible()).toEqual(['conteúdo demo']);

    press('ArrowLeft'); // dá a volta no outro sentido
    expect(visible()).toEqual(['conteúdo arquitetura']);

    press('Home');
    expect(visible()).toEqual(['conteúdo demo']);
  });
});
