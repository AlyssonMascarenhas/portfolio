import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lang } from '@portfolio/contracts';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LanguageService } from '../language.service';

@Component({
  selector: 'pf-language-switcher',
  imports: [TranslatePipe, FormsModule, SelectButtonModule],
  host: { class: 'language-switcher' },
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);
  protected readonly options: Lang[] = [...this.language.supported];

  protected select(lang: Lang | null): void {
    if (lang) this.language.use(lang);
  }
}
