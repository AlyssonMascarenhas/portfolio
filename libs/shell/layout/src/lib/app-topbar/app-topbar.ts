import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '@portfolio/i18n';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../layout.service';

/** Barra superior no estilo do template Sakai: menu, marca, tema e idioma. */
@Component({
  selector: 'pf-topbar',
  imports: [RouterLink, TranslatePipe, ButtonModule, LanguageSwitcher],
  templateUrl: './app-topbar.html',
  styleUrl: './app-topbar.scss',
})
export class AppTopbar {
  protected readonly layout = inject(LayoutService);

  protected readonly expanded = computed(() =>
    this.layout.isDesktop()
      ? !this.layout.menuCollapsed()
      : this.layout.menuOpen(),
  );
}
