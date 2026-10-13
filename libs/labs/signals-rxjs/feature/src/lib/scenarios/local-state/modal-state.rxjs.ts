import { BehaviorSubject } from 'rxjs';

// #region local-state-rxjs
export class DetailsPanelStateRxjs {
  private readonly open$ = new BehaviorSubject(false);
  /** O template precisa do async pipe para ler isto. */
  readonly isOpen$ = this.open$.asObservable();

  toggle(): void {
    this.open$.next(!this.open$.value);
  }
}
// #endregion
