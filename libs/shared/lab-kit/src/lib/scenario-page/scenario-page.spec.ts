import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ScenarioPage } from './scenario-page';
import { ScenarioText } from '../scenario-text';
import { SNIPPET_SOURCE, SnippetSource } from '../snippet-source';

const TEXT: ScenarioText<null> = {
  title: 'Cenário',
  summary: 'resumo',
  problem: 'Um problema.',
  demo: null,
  question: {
    prompt: 'O que usar?',
    suggestedId: 'a',
    options: [
      { id: 'a', label: 'Opção A', answer: 'Resposta A' },
      { id: 'b', label: 'Opção B', answer: 'Resposta B' },
    ],
  },
  snippets: [{ id: 'demo', label: 'Trecho' }],
  why: ['Porque sim.'],
  alternatives: [{ name: 'Alt', text: 'Texto da alternativa' }],
  differently: ['Se mudasse X.'],
};

@Component({
  imports: [ScenarioPage],
  template: `<pf-scenario-page [text]="text"
    ><p>demo aqui</p></pf-scenario-page
  >`,
})
class Host {
  text = TEXT;
}

describe('ScenarioPage', () => {
  let el: HTMLElement;
  const value = signal<ReturnType<SnippetSource['value']>>(undefined);
  const error = signal<unknown>(undefined);
  const reload = vi.fn();

  beforeEach(() => {
    value.set(undefined);
    error.set(undefined);
    reload.mockClear();
    const source: SnippetSource = {
      error: () => error(),
      hasValue: () => value() !== undefined,
      value: () => value(),
      reload,
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: SNIPPET_SOURCE, useValue: source },
      ],
    });
    el = TestBed.createComponent(Host).nativeElement;
    TestBed.tick();
  });

  it('projeta a demo e mostra a seção "quando eu escolheria diferente"', () => {
    expect(el.textContent).toContain('demo aqui');
    expect(el.textContent).toContain('lab.scenario.differently');
    expect(el.textContent).toContain('Se mudasse X.');
  });

  it('responde à escolha sem chamar nenhuma opção de "errada"', () => {
    el.querySelectorAll<HTMLInputElement>('input[type=radio]')[1].click();
    TestBed.tick();

    expect(el.querySelector('[role=status]')?.textContent).toContain(
      'Resposta B',
    );
    expect(el.querySelector('.mine')?.textContent).toContain(
      'lab.scenario.myChoice',
    );

    el.querySelectorAll<HTMLInputElement>('input[type=radio]')[0].click();
    TestBed.tick();
    expect(el.querySelector('.mine')?.textContent).toContain(
      'lab.scenario.sameChoice',
    );
  });

  it('indica carregamento enquanto os trechos não chegam', () => {
    expect(el.querySelector('pf-code-viewer [aria-busy=true]')).not.toBeNull();
  });

  it('mostra o trecho de código vindo da fonte', () => {
    value.set({
      demo: { file: 'libs/labs/x.ts', code: 'const open = signal(false);' },
    });
    TestBed.tick();

    expect(el.querySelector('pf-code-viewer code')?.textContent).toBe(
      'const open = signal(false);',
    );
    expect(el.querySelector('figcaption')?.textContent).toContain(
      'libs/labs/x.ts',
    );
  });

  it('mostra erro e pede para recarregar', () => {
    error.set(new Error('404'));
    TestBed.tick();

    expect(el.querySelector('pf-code-viewer [role=alert]')).not.toBeNull();

    el.querySelector<HTMLButtonElement>('pf-code-viewer button')?.click();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
