import { ApplicationRef } from '@angular/core';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LabProduct } from '@portfolio/contracts';
import { provideScenarioTesting } from '../../testing';
import { DependentHttpScenario } from './dependent-http.scenario';

const KEYBOARD: LabProduct = {
  id: 1,
  name: 'Mechanical Keyboard',
  category: 'keyboards',
};
const MONITOR: LabProduct = {
  id: 6,
  name: 'Monitor 24-inch',
  category: 'monitors',
};

describe('DependentHttpScenario', () => {
  let el: HTMLElement;
  let http: HttpTestingController;

  const settle = async () => {
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();
  };
  const requestsFor = (category: string) =>
    http.match(
      (r) =>
        r.url === 'api/lab/products' && r.params.get('category') === category,
    );
  const pick = (label: string) => {
    const target = [...el.querySelectorAll('label')].find((l) =>
      l.textContent?.includes(label),
    );
    el.querySelector<HTMLInputElement>('#' + target?.htmlFor)?.click();
  };
  const columns = () =>
    [...el.querySelectorAll('.columns section')].map((s) => s.textContent);

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: provideScenarioTesting() });
    http = TestBed.inject(HttpTestingController);
    el = TestBed.createComponent(DependentHttpScenario).nativeElement;
    TestBed.tick();
    http.match('snippets.json').forEach((r) => r.flush({})); // os trechos de código não importam aqui
    TestBed.tick();
  });

  it('as duas abordagens pedem a categoria inicial e mostram o resultado', async () => {
    const [viaRxjs, viaResource] = requestsFor('keyboards');
    viaRxjs.flush([KEYBOARD]);
    viaResource.flush([KEYBOARD]);
    await settle();

    expect(columns().every((c) => c?.includes('Mechanical Keyboard'))).toBe(
      true,
    );
  });

  it('ao trocar de categoria, ambas cancelam a anterior e mostram só a última', async () => {
    const [firstRxjs, firstResource] = requestsFor('keyboards');

    pick('Monitores');
    TestBed.tick(); // sem settle: há requisições pendentes
    pick('Áudio');
    TestBed.tick();

    expect(firstRxjs.cancelled).toBe(true);
    expect(firstResource.cancelled).toBe(true);

    const [rxjs, resource] = requestsFor('audio');
    const speaker: LabProduct = {
      id: 14,
      name: 'Bluetooth Speaker',
      category: 'audio',
    };
    rxjs.flush([speaker]);
    resource.flush([speaker]);
    await settle();

    expect(columns().every((c) => c?.includes('Bluetooth Speaker'))).toBe(true);
    expect(columns().some((c) => c?.includes(MONITOR.name))).toBe(false);
  });

  it('mostra erro com alerta em cada coluna e tenta de novo', async () => {
    const [viaRxjs, viaResource] = requestsFor('keyboards');
    viaRxjs.flush(null, { status: 500, statusText: 'Server Error' });
    viaResource.flush(null, { status: 500, statusText: 'Server Error' });
    await settle();

    expect(el.querySelectorAll('[role=alert]')).toHaveLength(2);

    el.querySelector<HTMLButtonElement>('pf-product-list button')?.click();
    await settle();

    expect(requestsFor('keyboards')).toHaveLength(1);
  });
});
