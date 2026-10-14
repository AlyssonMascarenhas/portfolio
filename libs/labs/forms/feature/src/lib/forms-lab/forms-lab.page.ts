import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '@portfolio/i18n';
import { FORMS_INTRO, FORMS_SCENARIOS } from './forms-lab.content';

/** Índice do lab: a ideia central e a lista de cenários. */
@Component({
  selector: 'pf-forms-lab',
  imports: [RouterLink],
  templateUrl: './forms-lab.page.html',
  styleUrl: './forms-lab.page.scss',
})
export class FormsLabPage {
  private readonly language = inject(LanguageService);

  protected readonly intro = computed(
    () => FORMS_INTRO[this.language.current()],
  );
  protected readonly scenarios = computed(() =>
    FORMS_SCENARIOS.map(({ path, content }) => ({
      path,
      ...content[this.language.current()],
    })),
  );
}
