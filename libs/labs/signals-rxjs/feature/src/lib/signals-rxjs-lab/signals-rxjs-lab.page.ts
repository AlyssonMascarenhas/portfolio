import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LAB_INTRO, LAB_SCENARIOS } from './signals-rxjs-lab.content';
import { LanguageService } from '@portfolio/i18n';

/** Índice do lab: a ideia central, a regra prática e a lista de cenários. */
@Component({
  selector: 'pf-signals-rxjs-lab',
  imports: [RouterLink],
  templateUrl: './signals-rxjs-lab.page.html',
  styleUrl: './signals-rxjs-lab.page.scss',
})
export class SignalsRxjsLabPage {
  private readonly language = inject(LanguageService);

  protected readonly intro = computed(() => LAB_INTRO[this.language.current()]);
  protected readonly scenarios = computed(() =>
    LAB_SCENARIOS.map(({ path, content }) => ({
      path,
      ...content[this.language.current()],
    })),
  );
}
