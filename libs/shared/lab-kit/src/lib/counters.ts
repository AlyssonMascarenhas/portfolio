import { afterEveryRender, signal } from '@angular/core';

/**
 * Contadores da instrumentação dos labs.
 *
 * Os valores ficam em campos comuns (não em signals) porque são incrementados de dentro de
 * `computed`, de cleanups de streams e de criação de componentes, onde escrever em signals
 * é proibido ou dispara ExpressionChangedAfterItHasBeenChecked. Depois de cada render, o
 * valor é publicado em `snapshot`, que a UI lê normalmente.
 *
 * Deve ser criada em contexto de injeção (campo de componente ou serviço).
 */
export class Counters {
  private readonly values = new Map<string, number>();
  private readonly _snapshot = signal<Readonly<Record<string, number>>>({});
  readonly snapshot = this._snapshot.asReadonly();

  constructor() {
    afterEveryRender(() => this.publish());
  }

  increment(name: string, by = 1): void {
    this.values.set(name, this.get(name) + by);
  }

  get(name: string): number {
    return this.values.get(name) ?? 0;
  }

  private publish(): void {
    const next = Object.fromEntries(this.values);
    const current = this._snapshot();
    const keys = Object.keys(next);
    const changed =
      keys.length !== Object.keys(current).length ||
      keys.some((key) => next[key] !== current[key]);
    if (changed) this._snapshot.set(next);
  }
}
