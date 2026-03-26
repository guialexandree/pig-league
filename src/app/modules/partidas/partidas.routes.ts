import { Routes } from '@angular/router';

export const partidasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./partidas.component').then((m) => m.PartidasComponent),
    title: 'Partidas - INSIDE CUP FC25',
    children: [
      {
        path: '',
        title: 'Partidas Geral - INSIDE CUP FC25',
        loadComponent: () =>
          import('./listagem/partidas-listagem.component').then((m) => m.PartidasListagemComponent),
      },
    ],
  },
];
