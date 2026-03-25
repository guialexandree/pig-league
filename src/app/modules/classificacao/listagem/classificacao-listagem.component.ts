import { Component, computed, signal } from '@angular/core';
import { ListagemHeaderComponent } from '../../shared/components/listagem-header/listagem-header.component';
import { ScreenLoaderComponent } from '../../shared/components/screen-loader/screen-loader.component';
import { ClassificacaoGrupoComponent } from './grupo/classificacao-grupo.component';

type GrupoIdTela = 'grupo1' | 'grupo2' | 'geral';

@Component({
  selector: 'app-classificacao-listagem',
  standalone: true,
  imports: [ListagemHeaderComponent, ScreenLoaderComponent, ClassificacaoGrupoComponent],
  templateUrl: './classificacao-listagem.component.html',
  styleUrl: './classificacao-listagem.component.scss',
})
export class ClassificacaoListagemComponent {
  readonly carregandoPorGrupo = signal<Record<GrupoIdTela, boolean>>({
    grupo1: true,
    grupo2: true,
    geral: true,
  });

  readonly carregandoTela = computed<boolean>(() =>
    Object.values(this.carregandoPorGrupo()).some((isLoading) => isLoading),
  );

  atualizarCarregamento(grupoId: GrupoIdTela, carregando: boolean): void {
    this.carregandoPorGrupo.update((state) => ({
      ...state,
      [grupoId]: carregando,
    }));
  }
}
