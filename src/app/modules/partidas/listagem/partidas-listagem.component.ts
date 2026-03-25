import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { format, isValid, parseISO } from 'date-fns';
import { finalize } from 'rxjs';
import {
  GetPartidasDto,
  PartidaGrupoEnum,
  PartidaStatusEnum,
} from '../../../data/partida/dto';
import { GetPartidasFiltrosDto } from '../../../data/partida/dto/get-partidas-filtros.dto';
import { PartidaService } from '../../../data/partida/partida-service';
import { ListagemHeaderComponent } from '../../shared/components/listagem-header/listagem-header.component';
import { ScreenLoaderComponent } from '../../shared/components/screen-loader/screen-loader.component';

type PartidasFiltroUi = 'GERAL' | PartidaGrupoEnum;

interface FiltroPartidaItem {
  label: string;
  value: PartidasFiltroUi;
  testId: string;
}

@Component({
  selector: 'app-partidas-listagem',
  standalone: true,
  imports: [ListagemHeaderComponent, ScreenLoaderComponent],
  templateUrl: './partidas-listagem.component.html',
  styleUrl: './partidas-listagem.component.scss',
})
export class PartidasListagemComponent implements OnInit {
  private readonly partidaService = inject(PartidaService);

  readonly filtros: ReadonlyArray<FiltroPartidaItem> = [
    { label: 'Geral', value: 'GERAL', testId: 'filter-general' },
    { label: 'Grupo 1', value: PartidaGrupoEnum.GRUPO_1, testId: 'filter-group-1' },
    { label: 'Grupo 2', value: PartidaGrupoEnum.GRUPO_2, testId: 'filter-group-2' },
  ];

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);
  readonly filtroSelecionado = signal<PartidasFiltroUi>('GERAL');
  readonly resposta = signal<GetPartidasDto[] | null>(null);

  readonly partidas = computed<GetPartidasDto[]>(() => this.resposta() ?? []);

  ngOnInit(): void {
    this.carregarPartidas('GERAL');
  }

  selecionarFiltro(filter: PartidasFiltroUi): void {
    if (filter === this.filtroSelecionado() && this.resposta() !== null) {
      return;
    }

    this.carregarPartidas(filter);
  }

  isFiltroAtivo(filter: PartidasFiltroUi): boolean {
    return this.filtroSelecionado() === filter;
  }

  tentarNovamente(): void {
    this.carregarPartidas(this.filtroSelecionado());
  }

  formatarData(dataHora: string | null): string {
    const date = this.parseData(dataHora);

    return date ? format(date, 'dd/MM/yy') : '--';
  }

  formatarHorario(dataHora: string | null): string {
    const date = this.parseData(dataHora);

    return date ? format(date, 'HH:mm') : '--:--';
  }

  isNaoAgendada(status: PartidaStatusEnum): boolean {
    return status === PartidaStatusEnum.NAO_AGENDADA;
  }

  isCancelada(status: PartidaStatusEnum): boolean {
    return status === PartidaStatusEnum.CANCELADA;
  }

  placarMandante(partida: GetPartidasDto): string {
    return partida.golsMandante === null ? '--' : String(partida.golsMandante);
  }

  placarVisitante(partida: GetPartidasDto): string {
    return partida.golsVisitante === null ? '--' : String(partida.golsVisitante);
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

  private carregarPartidas(filter: PartidasFiltroUi): void {
    this.filtroSelecionado.set(filter);
    this.carregando.set(true);
    this.erro.set(null);

    this.partidaService
      .getPartidas(this.toApiFilters(filter))
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (resposta) => this.resposta.set(resposta),
        error: () => {
          this.resposta.set(null);
          this.erro.set('Nao foi possivel carregar as partidas no momento.');
        },
      });
  }

  private toApiFilters(filter: PartidasFiltroUi): GetPartidasFiltrosDto | undefined {
    if (filter === 'GERAL') {
      return undefined;
    }

    return { grupoId: filter };
  }

  private parseData(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }
}
