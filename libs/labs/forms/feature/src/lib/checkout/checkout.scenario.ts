import { Component } from '@angular/core';
import { localized } from '@portfolio/i18n';
import { ScenarioPage } from '@portfolio/lab-kit';
import { CheckoutForm } from '../checkout-form/checkout-form';
import { CHECKOUT_CONTENT } from './checkout.content';

@Component({
  selector: 'pf-checkout-scenario',
  imports: [ScenarioPage, CheckoutForm],
  templateUrl: './checkout.scenario.html',
})
export class CheckoutScenario {
  protected readonly text = localized(CHECKOUT_CONTENT);
}
