import { Routes } from '@angular/router';

export const classificacaoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./classificacao.component').then((m) => m.ClassificacaoComponent),
    title: 'Classificacao - Campeonato PigLeague',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./listagem/classificacao-listagem.component').then(
            (m) => m.ClassificacaoListagemComponent,
          ),
      },
    ],
  },
];
