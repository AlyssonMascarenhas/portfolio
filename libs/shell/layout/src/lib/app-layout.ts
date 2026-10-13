import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import { LayoutService } from './layout.service';

/**
 * Casca do site no estilo do template Sakai: barra superior, menu lateral, conteúdo e rodapé.
 * Em telas estreitas o menu abre sobre o conteúdo, com uma máscara que o fecha ao toque.
 */
@Component({
  selector: 'pf-layout',
  imports: [RouterOutlet, TranslatePipe, AppTopbar, AppSidebar],
  host: {
    '[class.collapsed]': 'layout.menuCollapsed()',
    '[class.open]': 'layout.menuOpen()',
  },
  template: `
    <a class="skip-link" href="#main">{{
      'common.skipToContent' | translate
    }}</a>
    <pf-topbar />
    <aside class="side" [class.hidden]="hidden()">
      <pf-sidebar />
    </aside>
    <div class="mask" aria-hidden="true" (click)="layout.closeMenu()"></div>
    <div class="content">
      <main id="main" tabindex="-1">
        <router-outlet />
      </main>
      <footer class="footer">
        <span>© Alysson Mascarenhas</span>
        <span>{{ 'layout.builtWith' | translate }}</span>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
    .side {
      position: fixed;
      top: 4rem;
      bottom: 0;
      left: 0;
      z-index: 996;
      width: 17rem;
      overflow-y: auto;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      transition:
        transform 0.25s,
        visibility 0s;
    }
    .side.hidden {
      visibility: hidden;
      transition:
        transform 0.25s,
        visibility 0s 0.25s;
    }
    .content {
      padding-top: 4rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.25s;
    }
    main {
      flex: 1;
      padding: 2rem 1rem 3rem;
    }
    main:focus {
      outline: none;
    }
    .footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid var(--color-border);
      color: var(--color-muted);
      font-size: 0.875rem;
    }
    /* Enquanto a rota ainda não renderizou nada, o rodapé fica invisível: ele não "pula" quando o conteúdo chega (CLS). */
    .content:has(main > router-outlet:last-child) .footer {
      visibility: hidden;
    }
    .mask {
      display: none;
    }

    @media (min-width: 992px) {
      .content {
        margin-left: 17rem;
      }
      main {
        padding: 2.5rem 2rem 4rem;
      }
      :host(.collapsed) .side {
        transform: translateX(-100%);
      }
      :host(.collapsed) .content {
        margin-left: 0;
      }
    }

    @media (max-width: 991px) {
      .side {
        transform: translateX(-100%);
        box-shadow: 0 0 2rem rgb(0 0 0 / 0.25);
      }
      :host(.open) .side {
        transform: none;
      }
      :host(.open) .mask {
        display: block;
        position: fixed;
        inset: 4rem 0 0 0;
        z-index: 995;
        background: rgb(0 0 0 / 0.4);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .side,
      .content {
        transition: none;
      }
    }
  `,
})
export class AppLayout {
  protected readonly layout = inject(LayoutService);

  constructor() {
    // No mobile, escolher uma página fecha o menu.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.layout.closeMenu());
  }

  /** Fora da tela (e fora da ordem de tab) quando o menu está recolhido ou fechado. */
  protected readonly hidden = computed(() =>
    this.layout.isDesktop()
      ? this.layout.menuCollapsed()
      : !this.layout.menuOpen(),
  );
}
