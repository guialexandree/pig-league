import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import {
  GetPartidasDto,
  GetPartidasFiltrosDto,
  PartidaGrupoEnum,
} from '../../../data/partida/dto';
import { PartidaService } from '../../../data/partida/partida-service';

export type PartidasFiltroUi = 'GERAL' | PartidaGrupoEnum;

@Injectable({
  providedIn: 'root',
})
export class PartidasListagemService {
  private readonly partidaService = inject(PartidaService);

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);

  private readonly _query = signal<GetPartidasFiltrosDto>({});
  private readonly _partidas = signal<GetPartidasDto[] | null>(null);

  readonly filtroSelecionado = computed<PartidasFiltroUi>(
    () => this._query().grupoId ?? 'GERAL',
  );
  readonly partidas = computed<GetPartidasDto[]>(() => this._partidas() ?? []);

  carregarDados(): void {
    if (this._partidas() !== null || this.carregando()) {
      return;
    }

    this.buscarPartidasPendentes();
  }

  selecionarFiltro(filter: PartidasFiltroUi): void {
    const nextQuery = this.mapFiltroToQuery(filter);

    if (this.isSameQuery(nextQuery)) {
      return;
    }

    this._query.set(nextQuery);
    this.buscarPartidasPendentes();
  }

  tentarNovamente(): void {
    this.buscarPartidasPendentes();
  }

  private buscarPartidasPendentes(): void {
    this.carregando.set(true);
    this._partidas.set(null);
    this.erro.set(null);

    this.partidaService
      .getPartidasPendentes(this._query())
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (resposta) => this._partidas.set(resposta),
        error: () => {
          this._partidas.set(null);
          this.erro.set('Nao foi possivel carregar as partidas no momento.');
        },
      });
  }

  private mapFiltroToQuery(filter: PartidasFiltroUi): GetPartidasFiltrosDto {
    if (filter === 'GERAL') {
      return {};
    }

    return { grupoId: filter };
  }

  private isSameQuery(nextQuery: GetPartidasFiltrosDto): boolean {
    return this._query().grupoId === nextQuery.grupoId;
  }
}
