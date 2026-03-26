import { Component, OnInit, computed, inject } from '@angular/core';
import { PartidaGrupoEnum, PartidaStatusEnum } from '../../../data/partida/dto';
import { ListagemHeaderComponent } from '../../shared/components/listagem-header/listagem-header.component';
import { PartidasPendentesComponent } from './partidas-pendentes/partidas-pendentes.component';
import { PartidasProximasComponent } from './proximas-partidas/partidas-proximas.component';
import { PartidasRealizadasComponent } from './partidas-realizadas/partidas-realizadas.component';
import { PartidasFiltroUi, PartidasListagemService } from './partidas-listagem.service';
import { PartidasTotaisComponent } from './totais/partidas-totais.component';

interface FiltroPartidaItem {
  label: string;
  value: PartidasFiltroUi;
  testId: string;
}

@Component({
  selector: 'app-partidas-listagem',
  standalone: true,
  imports: [
    ListagemHeaderComponent,
    PartidasRealizadasComponent,
    PartidasProximasComponent,
    PartidasPendentesComponent,
    PartidasTotaisComponent,
  ],
  templateUrl: './partidas-listagem.component.html',
  styleUrl: './partidas-listagem.component.scss',
})
export class PartidasListagemComponent implements OnInit {
  readonly service = inject(PartidasListagemService);

  readonly filtros: ReadonlyArray<FiltroPartidaItem> = [
    { label: 'Geral', value: 'GERAL', testId: 'filter-general' },
    { label: 'Grupo 1', value: PartidaGrupoEnum.GRUPO_1, testId: 'filter-group-1' },
    { label: 'Grupo 2', value: PartidaGrupoEnum.GRUPO_2, testId: 'filter-group-2' },
  ];

  readonly totalizadores = computed(() => {
    const partidas = this.service.partidas();
    const totalPartidas = partidas.length;
    const totalRealizadas = partidas.filter(
      (partida) => partida.status === PartidaStatusEnum.REALIZADA,
    ).length;
    const totalPendentes = partidas.filter((partida) =>
      [PartidaStatusEnum.AGENDADA, PartidaStatusEnum.NAO_AGENDADA].includes(partida.status),
    ).length;

    return {
      totalPartidas,
      totalRealizadas,
      totalPendentes,
    };
  });

  ngOnInit(): void {
    this.service.carregarDados();
  }

  selecionarFiltro(filter: PartidasFiltroUi): void {
    this.service.selecionarFiltro(filter);
  }

  isFiltroAtivo(filter: PartidasFiltroUi): boolean {
    return this.service.filtroSelecionado() === filter;
  }

  tentarNovamente(): void {
    this.service.tentarNovamente();
  }
}
