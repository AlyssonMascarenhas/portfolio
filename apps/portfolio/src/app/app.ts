import { Component } from '@angular/core';
import { AppLayout } from '@portfolio/shell/layout';

@Component({
  selector: 'pf-root',
  imports: [AppLayout],
  template: `<pf-layout />`,
})
export class App {}
