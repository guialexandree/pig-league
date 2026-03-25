import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { GetPartidasDto, PartidaGrupoEnum } from '../../../data/partida/dto';
import { PartidaService } from '../../../data/partida/partida-service';

export type PartidasFiltroUi = 'GERAL' | PartidaGrupoEnum;

@Injectable({
  providedIn: 'root',
})
export class PartidasListagemService {
  private readonly partidaService = inject(PartidaService);

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);
  readonly filtroSelecionado = signal<PartidasFiltroUi>('GERAL');

  private readonly resposta = signal<GetPartidasDto[] | null>(null);

  readonly partidas = computed<GetPartidasDto[]>(() => this.resposta() ?? []);

  readonly partidasFiltradas = computed<GetPartidasDto[]>(() => {
    const filtroSelecionado = this.filtroSelecionado();
    const partidas = this.partidas();

    if (filtroSelecionado === 'GERAL') {
      return partidas;
    }

    return partidas.filter((partida) => this.extrairNumeroGrupo(partida.grupo) === filtroSelecionado);
  });

  carregar(): void {
    if (this.resposta() !== null || this.carregando()) {
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);

    this.partidaService
      .getPartidas(undefined)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (resposta) => this.resposta.set(resposta),
        error: () => {
          this.resposta.set(null);
          this.erro.set('Nao foi possivel carregar as partidas no momento.');
        },
      });
  }

  selecionarFiltro(filter: PartidasFiltroUi): void {
    this.filtroSelecionado.set(filter);
  }

  tentarNovamente(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.partidaService
      .getPartidas(undefined)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (resposta) => this.resposta.set(resposta),
        error: () => {
          this.resposta.set(null);
          this.erro.set('Nao foi possivel carregar as partidas no momento.');
        },
      });
  }

  private extrairNumeroGrupo(grupo: string): number | null {
    const match = grupo.match(/\d+/);
    if (!match?.[0]) {
      return null;
    }

    return Number(match[0]);
  }
}
