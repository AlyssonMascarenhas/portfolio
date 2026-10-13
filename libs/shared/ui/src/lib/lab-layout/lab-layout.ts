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
  templateUrl: './lab-layout.html',
  styleUrl: './lab-layout.scss',
})
export class LabLayout {
  readonly title = input.required<string>();
  readonly problem = input.required<string>();

  protected readonly selected = signal<string | number | undefined>('demo');
}
