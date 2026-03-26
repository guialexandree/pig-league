import { Routes } from '@angular/router';

export const jogadoresRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./jogadores.component').then((m) => m.JogadoresComponent),
    title: 'Jogadores - INSIDE CUP FC25',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./listagem/jogadores-listagem.component').then(
            (m) => m.JogadoresListagemComponent,
          ),
      },
    ],
  },
];
