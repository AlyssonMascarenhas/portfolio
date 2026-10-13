import { Component, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';

export type LabTab = 'demo' | 'code' | 'architecture';

/**
 * Moldura comum dos cenários dos labs: título, problema e as abas Demo, Code e Architecture
 * (PrimeNG Tabs, que já traz o padrão WAI-ARIA e a navegação por teclado). O conteúdo de cada
 * aba entra por projeção (`demo`, `code`, `architecture`); os três painéis ficam montados,
 * só o ativo fica visível, então a demo mantém seu estado ao trocar de aba.
 */
@Component({
  selector: 'pf-lab-layout',
  imports: [TranslatePipe, TabsModule],
  template: `
    <header>
      <h1>{{ title() }}</h1>
      <p class="problem">{{ problem() }}</p>
    </header>

    <p-tabs [(value)]="selected">
      <p-tablist
        [pt]="{ content: { 'aria-label': ('lab.tabs.label' | translate) } }"
      >
        <p-tab value="demo">{{ 'lab.tabs.demo' | translate }}</p-tab>
        <p-tab value="code">{{ 'lab.tabs.code' | translate }}</p-tab>
        <p-tab value="architecture">{{
          'lab.tabs.architecture' | translate
        }}</p-tab>
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel value="demo"><ng-content select="[demo]" /></p-tabpanel>
        <p-tabpanel value="code"><ng-content select="[code]" /></p-tabpanel>
        <p-tabpanel value="architecture"
          ><ng-content select="[architecture]"
        /></p-tabpanel>
      </p-tabpanels>
    </p-tabs>
  `,
  styles: `
    :host {
      display: block;
      max-width: var(--measure);
      margin: 0 auto;
    }
    .problem {
      color: var(--color-muted);
    }
  `,
})
export class LabLayout {
  readonly title = input.required<string>();
  readonly problem = input.required<string>();

  protected readonly selected = signal<string | number | undefined>('demo');
}
