import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { AppSidebar } from '../app-sidebar/app-sidebar';
import { AppTopbar } from '../app-topbar/app-topbar';
import { LayoutService } from '../layout.service';

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
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
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
