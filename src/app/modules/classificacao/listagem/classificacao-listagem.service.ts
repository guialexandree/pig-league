import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ClassificacaoService } from '../../../data/classificacao/classificacao-service';
import { GetClassificacaoDto } from '../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoFaseAtual } from './classificacao-fase-atual.type';

@Injectable({
  providedIn: 'root',
})
export class ClassificacaoListagemService {
  private readonly classificacaoService = inject(ClassificacaoService);

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);

  private readonly respostaClassificacao = signal<GetClassificacaoDto[] | null>(null);

  readonly classificacaoGeral = computed<GetClassificacaoDto[]>(() =>
    this.respostaClassificacao() ?? [],
  );

  private readonly classificacaoPorNumeroGrupo = computed<
    Map<number, GetClassificacaoDto[]>
  >(() => this.buildClassificacaoPorNumeroGrupo(this.classificacaoGeral()));

  readonly classificacaoGrupo1 = computed<GetClassificacaoDto[]>(() =>
    this.classificacaoPorNumeroGrupo().get(1) ?? [],
  );

  readonly classificacaoGrupo2 = computed<GetClassificacaoDto[]>(() =>
    this.classificacaoPorNumeroGrupo().get(2) ?? [],
  );

  readonly faseAtual = computed<ClassificacaoFaseAtual>(() => {
    const classificacaoPorGrupo = this.classificacaoPorNumeroGrupo();

    if (classificacaoPorGrupo.size === 0) {
      return 'FASE_DE_GRUPOS';
    }

    const todosOsGruposFinalizados = Array.from(classificacaoPorGrupo.values()).every(
      (classificacaoGrupo) => this.isGrupoFinalizado(classificacaoGrupo),
    );

    return todosOsGruposFinalizados ? 'PLAYOFFS' : 'FASE_DE_GRUPOS';
  });

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.classificacaoService
      .getClassificacaoGeral()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (classificacao) => {
          this.respostaClassificacao.set(classificacao);
        },
        error: () => {
          this.respostaClassificacao.set(null);
          this.erro.set('Nao foi possivel carregar a classificacao no momento.');
        },
      });
  }

  tentarNovamente(): void {
    this.carregar();
  }

  private buildClassificacaoPorNumeroGrupo(
    classificacao: GetClassificacaoDto[],
  ): Map<number, GetClassificacaoDto[]> {
    const classificacaoByGrupo = new Map<number, GetClassificacaoDto[]>();

    for (const item of classificacao) {
      const numeroGrupo = this.extrairNumeroGrupo(item.grupo);

      if (numeroGrupo === null) {
        continue;
      }

      const classificacaoGrupo = classificacaoByGrupo.get(numeroGrupo) ?? [];
      classificacaoGrupo.push(item);
      classificacaoByGrupo.set(numeroGrupo, classificacaoGrupo);
    }

    return new Map(
      Array.from(classificacaoByGrupo.entries()).map(([numeroGrupo, itensGrupo]) => [
        numeroGrupo,
        this.reindexarPosicaoGrupo(itensGrupo),
      ]),
    );
  }

  private extrairNumeroGrupo(grupo: string): number | null {
    const match = grupo.match(/\d+/);
    if (!match?.[0]) {
      return null;
    }

    return Number(match[0]);
  }

  private isGrupoFinalizado(classificacao: GetClassificacaoDto[]): boolean {
    if (classificacao.length < 2) {
      return false;
    }

    const jogosEsperados = classificacao.length - 1;

    return classificacao.every((item) => item.jogos >= jogosEsperados);
  }

  private reindexarPosicaoGrupo(
    classificacaoGrupo: GetClassificacaoDto[],
  ): GetClassificacaoDto[] {
    return classificacaoGrupo.map((item, index) => ({
      ...item,
      posicao: index + 1,
    }));
  }
}
