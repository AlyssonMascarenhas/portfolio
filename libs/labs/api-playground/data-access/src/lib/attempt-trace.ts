import { Service, computed, signal } from '@angular/core';

export interface TraceEntry {
  id: number;
  text: string;
  state: 'pending' | 'done' | 'failed' | 'info';
}

/** Linha do tempo das tentativas de uma chamada: o que o interceptor de retry fez, tentativa a tentativa. */
@Service({ autoProvided: false })
export class AttemptTrace {
  private nextId = 1;
  private readonly _entries = signal<readonly TraceEntry[]>([]);
  readonly entries = this._entries.asReadonly();
  readonly attempts = computed(
    () => this._entries().filter((entry) => entry.state !== 'info').length,
  );

  private readonly startedAt = new Map<number, number>();

  reset(): void {
    this._entries.set([]);
    this.startedAt.clear();
  }

  start(text: string): number {
    const id = this.nextId++;
    this.startedAt.set(id, performance.now());
    this._entries.update((list) => [
      ...list,
      {
        id,
        text: `#${list.filter((e) => e.state !== 'info').length + 1} ${text}`,
        state: 'pending',
      },
    ]);
    return id;
  }

  finish(id: number, outcome: { ok: boolean; label: string }): void {
    const elapsed = Math.round(
      performance.now() - (this.startedAt.get(id) ?? 0),
    );
    this._entries.update((list) =>
      list.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              text: `${entry.text} → ${outcome.label} · ${elapsed} ms`,
              state: outcome.ok ? 'done' : 'failed',
            }
          : entry,
      ),
    );
  }

  note(text: string): void {
    this._entries.update((list) => [
      ...list,
      { id: this.nextId++, text, state: 'info' },
    ]);
  }
}
