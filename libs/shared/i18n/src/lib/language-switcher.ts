import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lang } from '@portfolio/contracts';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LanguageService } from './language.service';

@Component({
  selector: 'pf-language-switcher',
  imports: [TranslatePipe, FormsModule, SelectButtonModule],
  host: { class: 'language-switcher' },
  template: `
    <span id="language-label" class="visually-hidden">{{
      'language.label' | translate
    }}</span>
    <p-selectbutton
      [options]="options"
      [ngModel]="language.current()"
      (ngModelChange)="select($event)"
      [allowEmpty]="false"
      size="small"
      ariaLabelledBy="language-label"
    >
      <ng-template #item let-lang>
        {{ 'language.short.' + lang | translate }}
        <span class="visually-hidden">{{
          'language.name.' + lang | translate
        }}</span>
      </ng-template>
    </p-selectbutton>
  `,
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);
  protected readonly options: Lang[] = [...this.language.supported];

  protected select(lang: Lang | null): void {
    if (lang) this.language.use(lang);
  }
}
