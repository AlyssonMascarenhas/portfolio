import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Counters } from './counters';

describe('Counters', () => {
  const create = () => TestBed.runInInjectionContext(() => new Counters());

  it('começa zerado: um contador desconhecido vale 0 e o snapshot é vazio', () => {
    const counters = create();

    expect(counters.get('requisicoes')).toBe(0);
    expect(counters.snapshot()).toEqual({});
  });

  it('acumula valores, inclusive negativos (assinatura que fecha)', () => {
    const counters = create();

    counters.increment('assinaturas');
    counters.increment('assinaturas');
    counters.increment('assinaturas', -1);
    counters.increment('emissoes', 5);

    expect(counters.get('assinaturas')).toBe(1);
    expect(counters.get('emissoes')).toBe(5);
  });

  it('só publica no snapshot depois do render, para não mexer em signal durante o ciclo', () => {
    const counters = create();

    counters.increment('recalculos');
    expect(counters.snapshot()).toEqual({}); // ainda não renderizou

    TestBed.tick();

    expect(counters.snapshot()).toEqual({ recalculos: 1 });
  });

  it('atualiza o snapshot a cada render em que um valor mudou e mantém a referência quando nada mudou', async () => {
    @Component({ template: `{{ ping() }}|{{ counters.snapshot()['a'] ?? 0 }}` })
    class Host {
      readonly counters = new Counters();
      readonly ping = signal(0);
    }
    const fixture = TestBed.createComponent(Host);
    const { counters, ping } = fixture.componentInstance;
    const text = () => fixture.nativeElement.textContent;
    await fixture.whenStable();

    counters.increment('a'); // acontece junto de uma mudança de signal, como nas demos
    ping.update((n) => n + 1);
    await fixture.whenStable();
    expect(text()).toBe('1|1');
    const first = counters.snapshot();

    ping.update((n) => n + 1); // renderiza de novo, mas nenhum contador mudou
    await fixture.whenStable();
    expect(counters.snapshot()).toBe(first);

    counters.increment('a');
    ping.update((n) => n + 1);
    await fixture.whenStable();
    expect(text()).toBe('3|2');
  });
});
