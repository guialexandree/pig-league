import { Routes } from '@angular/router';
import { MainTemplateComponent } from './layout/main-template/main-template';
import { SectionTemplateComponent } from './layout/section-template/section-template';

export const routes: Routes = [
  {
    path: '',
    component: MainTemplateComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'partidas' },
      {
        path: 'partidas',
        loadChildren: () =>
          import('./modules/partidas/partidas.routes').then((m) => m.partidasRoutes),
      },
      {
        path: 'jogadores',
        loadChildren: () =>
          import('./modules/jogadores/jogadores.routes').then((m) => m.jogadoresRoutes),
      },
      {
        path: 'classificacao',
        loadChildren: () =>
          import('./modules/classificacao/classificacao.routes').then(
            (m) => m.classificacaoRoutes,
          ),
      },
      {
        path: 'regras',
        loadChildren: () => import('./modules/regras/regras.routes').then((m) => m.regrasRoutes),
      },
      { path: 'estatisticas', component: SectionTemplateComponent },
    ],
  },
];
