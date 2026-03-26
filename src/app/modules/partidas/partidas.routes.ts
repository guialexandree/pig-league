import { Routes } from '@angular/router';

export const partidasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./partidas.component').then((m) => m.PartidasComponent),
    title: 'Partidas - Campeonato PigLeague',
    children: [
      {
        path: '',
        title: 'Partidas Geral - Campeonato PigLeague',
        loadComponent: () =>
          import('./listagem/partidas-listagem.component').then((m) => m.PartidasListagemComponent),
      },
    ],
  },
];
