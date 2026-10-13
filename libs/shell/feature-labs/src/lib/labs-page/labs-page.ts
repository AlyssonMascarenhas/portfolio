import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

/** Índice dos labs. Só lista e linka: o conteúdo de cada lab vive na rota dele, carregada sob demanda. */
@Component({
  selector: 'pf-labs-page',
  imports: [TranslatePipe, RouterLink, ButtonModule, CardModule],
  templateUrl: './labs-page.html',
  styleUrl: './labs-page.scss',
})
export class LabsPage {}
