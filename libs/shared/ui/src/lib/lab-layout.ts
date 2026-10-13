import {
  Component,
  ElementRef,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type LabTab = 'demo' | 'code' | 'architecture';

const TAB_IDS: readonly LabTab[] = ['demo', 'code', 'architecture'];
let nextLayoutId = 0;

/**
 * Moldura comum dos cenários dos labs: título, problema e as abas Demo, Code e Architecture.
 * O conteúdo de cada aba entra por projeção (`demo`, `code`, `architecture`); os três painéis
 * ficam montados, só o ativo fica visível, então a demo mantém seu estado ao trocar de aba.
 */
@Component({
  selector: 'pf-lab-layout',
  imports: [TranslatePipe],
  template: `
    <header>
      <h1>{{ title() }}</h1>
      <p class="problem">{{ problem() }}</p>
    </header>

    <div role="tablist" [attr.aria-label]="'lab.tabs.label' | translate">
      @for (tab of tabs; track tab.id) {
        <button
          #tabButton
          type="button"
          role="tab"
          [id]="tab.tabId"
          [attr.aria-controls]="tab.panelId"
          [attr.aria-selected]="selected() === tab.id"
          [tabindex]="selected() === tab.id ? 0 : -1"
          (click)="select(tab.id)"
          (keydown)="onKeydown($event)"
        >
          {{ tab.label | translate }}
        </button>
      }
    </div>

    <div
      role="tabpanel"
      tabindex="0"
      [id]="tabs[0].panelId"
      [attr.aria-labelledby]="tabs[0].tabId"
      [hidden]="selected() !== 'demo'"
    >
      <ng-content select="[demo]" />
    </div>
    <div
      role="tabpanel"
      tabindex="0"
      [id]="tabs[1].panelId"
      [attr.aria-labelledby]="tabs[1].tabId"
      [hidden]="selected() !== 'code'"
    >
      <ng-content select="[code]" />
    </div>
    <div
      role="tabpanel"
      tabindex="0"
      [id]="tabs[2].panelId"
      [attr.aria-labelledby]="tabs[2].tabId"
      [hidden]="selected() !== 'architecture'"
    >
      <ng-content select="[architecture]" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      max-width: var(--measure);
      margin: 0 auto;
      padding: var(--space);
    }
    .problem {
      color: var(--color-muted);
    }
    [role='tablist'] {
      display: flex;
      gap: 0.25rem;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--space);
      overflow-x: auto;
    }
    [role='tab'] {
      font: inherit;
      padding: 0.5rem 1rem;
      border: 0;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    [role='tab'][aria-selected='true'] {
      border-bottom-color: var(--color-accent);
      color: var(--color-accent);
      font-weight: 600;
    }
  `,
})
export class LabLayout {
  readonly title = input.required<string>();
  readonly problem = input.required<string>();

  protected readonly selected = signal<LabTab>('demo');
  private readonly buttons =
    viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  private readonly layoutId = nextLayoutId++;
  protected readonly tabs = TAB_IDS.map((id) => ({
    id,
    label: `lab.tabs.${id}`,
    tabId: `pf-lab-${this.layoutId}-tab-${id}`,
    panelId: `pf-lab-${this.layoutId}-panel-${id}`,
  }));

  protected select(tab: LabTab): void {
    this.selected.set(tab);
  }

  /** Padrão WAI-ARIA de tabs: setas, Home e End movem o foco e a seleção. */
  protected onKeydown(event: KeyboardEvent): void {
    const current = TAB_IDS.indexOf(this.selected());
    const last = TAB_IDS.length - 1;
    const target = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;

    event.preventDefault();
    this.select(TAB_IDS[target]);
    this.buttons()[target]?.nativeElement.focus();
  }
}
