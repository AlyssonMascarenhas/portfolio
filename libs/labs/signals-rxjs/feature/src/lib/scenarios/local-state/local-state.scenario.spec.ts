import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { provideScenarioTesting } from '../../testing';
import { DetailsPanelStateRxjs } from './modal-state.rxjs';
import { LocalStateScenario } from './local-state.scenario';

describe('LocalStateScenario', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: provideScenarioTesting() }),
  );

  it('abre e fecha o painel e reflete o valor do signal na instrumentação', () => {
    const fixture = TestBed.createComponent(LocalStateScenario);
    const el: HTMLElement = fixture.nativeElement;
    TestBed.tick();

    const button = el.querySelector<HTMLButtonElement>(
      'button[aria-controls=details-panel]',
    );
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('#details-panel')).toBeNull();
    expect(el.querySelector('dd')?.textContent).toBe('false');

    button?.click();
    TestBed.tick();

    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('#details-panel')).not.toBeNull();
    expect(el.querySelector('dd')?.textContent).toBe('true');
  });

  it('a variante com BehaviorSubject se comporta igual', async () => {
    const state = new DetailsPanelStateRxjs();
    expect(await firstValueFrom(state.isOpen$)).toBe(false);

    state.toggle();
    expect(await firstValueFrom(state.isOpen$)).toBe(true);
  });
});
