import { Observable, Subject, of, throwError } from 'rxjs';
import { RequestLog, tracked } from './request-log';

describe('RequestLog', () => {
  it('registra o início como pendente e conta as requisições disparadas', () => {
    const log = new RequestLog();

    log.start('wi');

    expect(log.fired()).toBe(1);
    expect(log.entries()).toEqual([{ id: 1, text: 'wi', state: 'pending' }]);
  });

  it('marca cada requisição como concluída, cancelada ou com falha, e soma por tipo', () => {
    const log = new RequestLog();
    const a = log.start('a');
    const b = log.start('b');
    const c = log.start('c');

    log.finish(a, 'done');
    log.finish(b, 'canceled');
    log.finish(c, 'failed');

    expect([log.done(), log.canceled(), log.failed()]).toEqual([1, 1, 1]);
    expect(log.entries().map((e) => e.state)).toEqual([
      'failed',
      'canceled',
      'done',
    ]);
  });

  it('mostra as mais novas primeiro e limita a lista, sem perder os totais', () => {
    const log = new RequestLog();

    for (let i = 1; i <= 15; i++) log.start(`req ${i}`);

    expect(log.entries()).toHaveLength(12);
    expect(log.entries()[0].text).toBe('req 15');
    expect(log.fired()).toBe(15);
  });
});

describe('tracked', () => {
  it('só registra quando alguém assina (é adiado com defer)', () => {
    const log = new RequestLog();

    of(1).pipe(tracked(log, 'x'));

    expect(log.fired()).toBe(0);
  });

  it('marca como concluída quando a resposta chega', () => {
    const log = new RequestLog();

    of('ok').pipe(tracked(log, 'x')).subscribe();

    expect([log.fired(), log.done(), log.canceled()]).toEqual([1, 1, 0]);
  });

  it('marca como falha quando a requisição dá erro', () => {
    const log = new RequestLog();

    throwError(() => new Error('500'))
      .pipe(tracked(log, 'x'))
      .subscribe({ error: () => undefined });

    expect([log.failed(), log.done(), log.canceled()]).toEqual([1, 0, 0]);
  });

  it('marca como cancelada quando a assinatura é desfeita antes da resposta (switchMap)', () => {
    const log = new RequestLog();
    const pending = new Subject<string>();

    const subscription = (pending as Observable<string>)
      .pipe(tracked(log, 'x'))
      .subscribe();
    subscription.unsubscribe();

    expect([log.canceled(), log.done(), log.failed()]).toEqual([1, 0, 0]);
    expect(log.entries()[0].state).toBe('canceled');
  });

  it('não marca como cancelada uma requisição que já respondeu e depois foi desassinada', () => {
    const log = new RequestLog();

    const subscription = of('ok').pipe(tracked(log, 'x')).subscribe();
    subscription.unsubscribe();

    expect([log.done(), log.canceled()]).toEqual([1, 0]);
  });
});
