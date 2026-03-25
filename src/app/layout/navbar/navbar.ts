import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  readonly menu = [
    { label: 'Jogos', route: '/partidas' },
    { label: 'Classificação', route: '/classificacao' },
    { label: 'Jogadores', route: '/jogadores' },
    { label: 'Regras', route: '/regras' },
    { label: 'Estatísticas', route: '/estatisticas' },
  ];
}
