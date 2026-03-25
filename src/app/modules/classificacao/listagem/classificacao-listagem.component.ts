import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ClassificacaoService } from '../../../data/classificacao/classificacao-service';
import { LoadClassificacaoFiltersDto } from '../../../data/classificacao/dto/get-classificacao-filtros.dto';
import { GetClassificacaoDto } from '../../../data/classificacao/dto/get-classificacao.dto';

type ClassificacaoFiltroUi = 'GERAL' | 1 | 2;

interface FiltroClassificacaoItem {
  label: string;
  value: ClassificacaoFiltroUi;
  testId: string;
}

@Component({
  selector: 'app-classificacao-listagem',
  standalone: true,
  templateUrl: './classificacao-listagem.component.html',
  styleUrl: './classificacao-listagem.component.scss',
})
export class ClassificacaoListagemComponent implements OnInit {
  private readonly classificacaoService = inject(ClassificacaoService);

  readonly filtros: ReadonlyArray<FiltroClassificacaoItem> = [
    { label: 'Geral', value: 'GERAL', testId: 'filter-general' },
    { label: 'Grupo 1', value: 1, testId: 'filter-group-1' },
    { label: 'Grupo 2', value: 2, testId: 'filter-group-2' },
  ];

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);
  readonly filtroSelecionado = signal<ClassificacaoFiltroUi>('GERAL');
  readonly resposta = signal<GetClassificacaoDto[] | null>(null);

  readonly classificacao = computed<GetClassificacaoDto[]>(() =>
    [...(this.resposta() ?? [])].sort((itemA, itemB) => itemA.posicao - itemB.posicao),
  );

  ngOnInit(): void {
    this.carregarClassificacao('GERAL');
  }

  selecionarFiltro(filtro: ClassificacaoFiltroUi): void {
    if (filtro === this.filtroSelecionado() && this.resposta() !== null) {
      return;
    }

    this.carregarClassificacao(filtro);
  }

  isFiltroAtivo(filtro: ClassificacaoFiltroUi): boolean {
    return this.filtroSelecionado() === filtro;
  }

  tentarNovamente(): void {
    this.carregarClassificacao(this.filtroSelecionado());
  }

  recordLabel(item: GetClassificacaoDto): string {
    return `${item.vitorias} - ${item.derrotas}`;
  }

  teamTag(nomeTime: string): string {
    const letters = nomeTime
      .split(/\s+/)
      .filter((chunk) => chunk.trim().length > 0)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? '')
      .join('');

    return letters || 'PL';
  }

  private carregarClassificacao(filtro: ClassificacaoFiltroUi): void {
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

  private toApiFilters(
    filtro: ClassificacaoFiltroUi,
  ): LoadClassificacaoFiltersDto | undefined {
    if (filtro === 'GERAL') {
      return undefined;
    }

    return { grupoId: filtro };
  }
}
