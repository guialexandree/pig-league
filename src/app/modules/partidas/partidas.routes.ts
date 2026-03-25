import { Routes } from '@angular/router';

export const partidasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./partidas.component').then((m) => m.PartidasComponent),
    title: 'Partidas - Campeonato PigLeague',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'partidas',
      },
      {
        path: 'partidas',
        loadComponent: () =>
          import('./listagem/partidas-listagem.component').then((m) => m.PartidasListagemComponent),
      },
    ],
  },
];
