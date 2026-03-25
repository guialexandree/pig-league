import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ClassificacaoService } from '../../../../data/classificacao/classificacao-service';
import { LoadClassificacaoFiltersDto } from '../../../../data/classificacao/dto/get-classificacao-filtros.dto';
import { GetClassificacaoDto } from '../../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoGrupoFiltro } from './classificacao-grupo.types';

@Injectable()
export class ClassificacaoGrupoService {
  private readonly classificacaoService = inject(ClassificacaoService);

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);
  readonly filtroSelecionado = signal<ClassificacaoGrupoFiltro>('GERAL');
  readonly resposta = signal<GetClassificacaoDto[] | null>(null);

  readonly classificacao = computed<GetClassificacaoDto[]>(() =>
    [...(this.resposta() ?? [])].sort((itemA, itemB) => itemA.posicao - itemB.posicao),
  );

  carregarClassificacao(filtro: ClassificacaoGrupoFiltro): void {
    this.filtroSelecionado.set(filtro);
    this.carregando.set(true);
    this.erro.set(null);

    this.classificacaoService
      .getClassificacao(this.toApiFilters(filtro))
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (payload) => this.resposta.set(payload),
        error: () => {
          this.resposta.set(null);
          this.erro.set('Nao foi possivel carregar a classificacao no momento.');
        },
      });
  }

  tentarNovamente(): void {
    this.carregarClassificacao(this.filtroSelecionado());
  }

  private toApiFilters(
    filtro: ClassificacaoGrupoFiltro,
  ): LoadClassificacaoFiltersDto | undefined {
    if (filtro === 'GERAL') {
      return undefined;
    }

    return { grupoId: filtro };
  }
}
