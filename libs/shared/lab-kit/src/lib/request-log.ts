import { Signal, computed, signal } from '@angular/core';
import { Observable, defer, finalize, tap } from 'rxjs';

/** 'info' é para linhas de log que não são requisições (sem rótulo de estado). */
export type LogState = 'pending' | 'done' | 'canceled' | 'failed' | 'info';

export interface LogEntry {
  id: number;
  text: string;
  state: LogState;
}

const MAX_ENTRIES = 12;

/** Registro de requisições de um cenário: o que foi disparado, concluído, cancelado ou falhou. */
export class RequestLog {
  private nextId = 1;
  private readonly _entries = signal<readonly LogEntry[]>([]);
  readonly entries = this._entries.asReadonly();

  // Os totais vêm de contadores próprios, para não perder contagem quando as linhas antigas saem da lista.
  private readonly totals = signal({
    fired: 0,
    done: 0,
    canceled: 0,
    failed: 0,
  });
  readonly fired: Signal<number> = computed(() => this.totals().fired);
  readonly done: Signal<number> = computed(() => this.totals().done);
  readonly canceled: Signal<number> = computed(() => this.totals().canceled);
  readonly failed: Signal<number> = computed(() => this.totals().failed);

  start(text: string): number {
    const id = this.nextId++;
    this._entries.update((list) =>
      [{ id, text, state: 'pending' as const }, ...list].slice(0, MAX_ENTRIES),
    );
    this.totals.update((t) => ({ ...t, fired: t.fired + 1 }));
    return id;
  }

  finish(id: number, state: Exclude<LogState, 'pending' | 'info'>): void {
    this._entries.update((list) =>
      list.map((entry) => (entry.id === id ? { ...entry, state } : entry)),
    );
    this.totals.update((t) => ({ ...t, [state]: t[state] + 1 }));
  }
}

/**
 * Operador de instrumentação: registra início, resposta, erro e, principalmente, cancelamento
 * (unsubscribe antes de qualquer resposta, que é o que o switchMap faz com a requisição anterior).
 */
export function tracked<T>(log: RequestLog, text: string) {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      const id = log.start(text);
      let settled = false;
      return source.pipe(
        tap({
          next: () => {
            settled = true;
            log.finish(id, 'done');
          },
          error: () => {
            settled = true;
            log.finish(id, 'failed');
          },
        }),
        finalize(() => {
          if (!settled) log.finish(id, 'canceled');
        }),
      );
    });
}
