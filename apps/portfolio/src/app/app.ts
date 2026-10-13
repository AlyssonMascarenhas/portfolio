import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '@portfolio/i18n';

@Component({
  selector: 'pf-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcher,
  ],
  template: `
    <a class="skip-link" href="#main">{{
      'common.skipToContent' | translate
    }}</a>
    <header class="site-header">
      <nav [attr.aria-label]="'nav.label' | translate">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          ariaCurrentWhenActive="page"
        >
          {{ 'nav.home' | translate }}
        </a>
        <a
          routerLink="/experience"
          routerLinkActive="active"
          ariaCurrentWhenActive="page"
        >
          {{ 'nav.experience' | translate }}
        </a>
        <a
          routerLink="/labs"
          routerLinkActive="active"
          ariaCurrentWhenActive="page"
        >
          {{ 'nav.labs' | translate }}
        </a>
      </nav>
      <pf-language-switcher />
    </header>
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
  `,
})
export class App {}
