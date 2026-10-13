import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LogEntry } from '../request-log';
import { InstrumentationPanel } from './instrumentation-panel';

describe('InstrumentationPanel', () => {
  function setup(inputs: {
    metrics: { label: string; value: string | number }[];
    log?: LogEntry[];
  }) {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    const fixture = TestBed.createComponent(InstrumentationPanel);
    fixture.componentRef.setInput('metrics', inputs.metrics);
    if (inputs.log) fixture.componentRef.setInput('log', inputs.log);
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }

  it('mostra cada contador com o rótulo e o valor', () => {
    const el = setup({
      metrics: [
        { label: 'Requisições', value: 3 },
        { label: 'Resultado', value: 'sucesso' },
      ],
    });

    expect([...el.querySelectorAll('dt')].map((d) => d.textContent)).toEqual([
      'Requisições',
      'Resultado',
    ]);
    expect([...el.querySelectorAll('dd')].map((d) => d.textContent)).toEqual([
      '3',
      'sucesso',
    ]);
  });

  it('sem o log, mostra só os contadores', () => {
    const el = setup({ metrics: [{ label: 'a', value: 1 }] });

    expect(el.querySelector('.log')).toBeNull();
    expect(el.querySelector('.empty')).toBeNull();
  });

  it('com o log vazio, avisa que ainda não há eventos', () => {
    const el = setup({ metrics: [], log: [] });

    expect(el.querySelector('.log')).toBeNull();
    expect(el.querySelector('.empty')?.textContent).toContain(
      'lab.instrumentation.empty',
    );
  });

  it('risca as linhas canceladas e etiqueta o estado de cada requisição', () => {
    const el = setup({
      metrics: [],
      log: [
        { id: 1, text: 'wi', state: 'canceled' },
        { id: 2, text: 'wire', state: 'done' },
        { id: 3, text: 'erro', state: 'failed' },
      ],
    });

    const rows = [...el.querySelectorAll('.log li')];
    expect(rows[0].querySelector('s')?.textContent).toBe('wi');
    expect(rows[1].querySelector('s')).toBeNull();
    expect(
      rows.map((r) => r.querySelector('p-tag')?.textContent?.trim()),
    ).toEqual([
      'lab.instrumentation.state.canceled',
      'lab.instrumentation.state.done',
      'lab.instrumentation.state.failed',
    ]);
  });

  it('linhas informativas (ações, não requisições) não ganham etiqueta de estado', () => {
    const el = setup({
      metrics: [],
      log: [{ id: 1, text: 'Adicionado: teclado', state: 'info' }],
    });

    expect(el.querySelector('.log li')?.textContent).toContain(
      'Adicionado: teclado',
    );
    expect(el.querySelector('.log p-tag')).toBeNull();
  });
});
