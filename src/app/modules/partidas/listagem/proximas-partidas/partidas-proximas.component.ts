import { Component, computed, input } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { format, isValid, parseISO } from 'date-fns';
import { GetPartidasDto, PartidaStatusEnum } from '../../../../data/partida/dto';

@Component({
  selector: 'app-partidas-proximas',
  standalone: true,
  imports: [NgbCarouselModule],
  templateUrl: './partidas-proximas.component.html',
  styleUrl: './partidas-proximas.component.scss',
})
export class PartidasProximasComponent {
  readonly partidas = input.required<GetPartidasDto[]>();

  readonly partidasAgendadas = computed<GetPartidasDto[]>(() =>
    this.partidas().filter((partida) => partida.status === PartidaStatusEnum.AGENDADA),
  );

  readonly slides = computed<GetPartidasDto[][]>(() => this.chunk(this.partidasAgendadas(), 3));

  formatarData(dataHora: string | null): string {
    const date = this.parseData(dataHora);
    return date ? format(date, 'dd/MM/yy') : '--';
  }

  formatarHorario(dataHora: string | null): string {
    const date = this.parseData(dataHora);
    return date ? format(date, 'HH:mm') : '--:--';
  }

  placarMandante(partida: GetPartidasDto): string {
    return partida.golsMandante === null ? '--' : String(partida.golsMandante);
  }

  placarVisitante(partida: GetPartidasDto): string {
    return partida.golsVisitante === null ? '--' : String(partida.golsVisitante);
  }

  private chunk(partidas: GetPartidasDto[], size: number): GetPartidasDto[][] {
    const groups: GetPartidasDto[][] = [];

    for (let index = 0; index < partidas.length; index += size) {
      groups.push(partidas.slice(index, index + size));
    }

    return groups;
  }

  private parseData(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }
}
