import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/** Menu lateral no estilo do template Sakai. Fixo no desktop; no mobile abre sobre o conteúdo (o AppLayout o fecha a cada navegação). */
@Component({
  selector: 'pf-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.scss',
})
export class AppSidebar {}
