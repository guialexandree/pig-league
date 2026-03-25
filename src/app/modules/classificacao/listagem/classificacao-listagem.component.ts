import { Component, OnInit, inject } from '@angular/core';
import { ListagemHeaderComponent } from '../../shared/components/listagem-header/listagem-header.component';
import { ScreenLoaderComponent } from '../../shared/components/screen-loader/screen-loader.component';
import { ClassificacaoFaseStepComponent } from './fase-step/classificacao-fase-step.component';
import { ClassificacaoGrupoComponent } from './grupo/classificacao-grupo.component';
import { ClassificacaoListagemService } from './classificacao-listagem.service';

@Component({
  selector: 'app-classificacao-listagem',
  standalone: true,
  imports: [
    ListagemHeaderComponent,
    ScreenLoaderComponent,
    ClassificacaoFaseStepComponent,
    ClassificacaoGrupoComponent,
  ],
  templateUrl: './classificacao-listagem.component.html',
  styleUrl: './classificacao-listagem.component.scss',
})
export class ClassificacaoListagemComponent implements OnInit {
  readonly service = inject(ClassificacaoListagemService);

  ngOnInit(): void {
    this.service.carregar();
  }

  tentarNovamente(): void {
    this.service.tentarNovamente();
  }
}
