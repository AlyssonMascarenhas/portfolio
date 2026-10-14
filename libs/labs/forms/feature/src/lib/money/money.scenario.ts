import { Component } from '@angular/core';
import { localized } from '@portfolio/i18n';
import { ScenarioPage } from '@portfolio/lab-kit';
import { MoneyForm } from './money-form/money-form';
import { MONEY_CONTENT } from './money.content';

@Component({
  selector: 'pf-money-scenario',
  imports: [ScenarioPage, MoneyForm],
  templateUrl: './money.scenario.html',
})
export class MoneyScenario {
  protected readonly text = localized(MONEY_CONTENT);
}
