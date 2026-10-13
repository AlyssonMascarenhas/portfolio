import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '@portfolio/i18n';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from './layout.service';

/** Barra superior no estilo do template Sakai: menu, marca, tema e idioma. */
@Component({
  selector: 'pf-topbar',
  imports: [RouterLink, TranslatePipe, ButtonModule, LanguageSwitcher],
  template: `
    <header class="topbar">
      <div class="start">
        <button
          pButton
          type="button"
          class="icon-button"
          severity="secondary"
          [text]="true"
          [rounded]="true"
          [attr.aria-label]="'layout.menu' | translate"
          [attr.aria-expanded]="expanded()"
          aria-controls="main-menu"
          (click)="layout.toggleMenu()"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <a class="brand" routerLink="/">
          <span class="mark" aria-hidden="true">AM</span>
          <span class="name">Alysson Mascarenhas</span>
        </a>
      </div>

      <div class="actions">
        <pf-language-switcher />
        <button
          pButton
          type="button"
          class="icon-button"
          severity="secondary"
          [text]="true"
          [rounded]="true"
          [attr.aria-label]="
            (layout.isDark() ? 'layout.themeLight' : 'layout.themeDark')
              | translate
          "
          (click)="layout.toggleTheme()"
        >
          @if (layout.isDark()) {
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          }
        </button>
      </div>
    </header>
  `,
  styles: `
    .topbar {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 997;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .start,
    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      color: var(--color-text);
      font-weight: 700;
      letter-spacing: -0.01em;
      text-decoration: none;
    }
    .mark {
      display: inline-grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: var(--color-accent);
      color: var(--color-on-accent);
      font-size: 0.8rem;
      font-weight: 700;
    }
    /* Em telas estreitas só a marca "AM" aparece, mas o nome continua no nome acessível do link. */
    @media (max-width: 480px) {
      .name {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
    }
  `,
})
export class AppTopbar {
  protected readonly layout = inject(LayoutService);

  protected readonly expanded = computed(() =>
    this.layout.isDesktop()
      ? !this.layout.menuCollapsed()
      : this.layout.menuOpen(),
  );
}
