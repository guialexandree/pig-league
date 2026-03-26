import { Component, Input } from '@angular/core';
import { GetPartidasDto, PartidaStatusEnum } from '../../../../data/partida/dto';

@Component({
  selector: 'app-partidas-pendentes',
  standalone: true,
  templateUrl: './partidas-pendentes.component.html',
  styleUrl: './partidas-pendentes.component.scss',
})
export class PartidasPendentesComponent {
  @Input() partidas: GetPartidasDto[] = [];
  @Input() isLoading = false;

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
}
