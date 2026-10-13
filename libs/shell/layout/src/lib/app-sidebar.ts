import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/** Menu lateral no estilo do template Sakai. Fixo no desktop; no mobile abre sobre o conteúdo (o AppLayout o fecha a cada navegação). */
@Component({
  selector: 'pf-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <nav
      id="main-menu"
      class="sidebar"
      [attr.aria-label]="'nav.label' | translate"
    >
      <ul>
        <li>
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
            >{{ 'nav.home' | translate }}</a
          >
        </li>
        <li>
          <a
            routerLink="/experience"
            routerLinkActive="active"
            ariaCurrentWhenActive="page"
            >{{ 'nav.experience' | translate }}</a
          >
        </li>
        <li>
          <a
            routerLink="/labs"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
            >{{ 'nav.labs' | translate }}</a
          >
          <ul class="sub">
            <li>
              <a
                routerLink="/labs/signals-rxjs"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                >{{ 'labs.signalsRxjs.title' | translate }}</a
              >
            </li>
            <li>
              <a
                routerLink="/labs/api-playground"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                >{{ 'labs.apiPlayground.title' | translate }}</a
              >
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  `,
  styles: `
    .sidebar {
      padding: 1rem 0.75rem;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .sub {
      margin: 0.15rem 0 0.35rem 1rem;
      padding-left: 0.5rem;
      border-left: 1px solid var(--color-border);
    }
    a {
      display: block;
      padding: 0.6rem 0.85rem;
      border-radius: var(--radius);
      color: var(--color-text);
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.15s;
    }
    a:hover {
      background: var(--color-accent-soft);
    }
    a.active {
      background: var(--color-accent-soft);
      color: var(--color-accent);
      font-weight: 600;
    }
  `,
})
export class AppSidebar {}
