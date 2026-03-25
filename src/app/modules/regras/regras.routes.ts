import { Routes } from '@angular/router';

export const regrasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./regras.component').then((m) => m.RegrasComponent),
    title: 'Regras - Campeonato PigLeague',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./listagem/regras-listagem.component').then((m) => m.RegrasListagemComponent),
      },
    ],
  },
];
