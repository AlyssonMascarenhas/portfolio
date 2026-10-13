import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from './language.service';

@Component({
  selector: 'pf-language-switcher',
  imports: [TranslatePipe],
  host: { class: 'language-switcher' },
  template: `
    <div role="group" [attr.aria-label]="'language.label' | translate">
      @for (lang of language.supported; track lang) {
        <button
          type="button"
          [attr.aria-pressed]="language.current() === lang"
          (click)="language.use(lang)"
        >
          {{ 'language.short.' + lang | translate }}
          <span class="visually-hidden">{{
            'language.name.' + lang | translate
          }}</span>
        </button>
      }
    </div>
  `,
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);
}
