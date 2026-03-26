import { Component, OnInit, computed, inject, input } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { format, isValid, parseISO } from 'date-fns';
import { GetPartidasRealizadasDto } from '../../../../data/partida/dto';
import { ScreenLoaderComponent } from '../../../shared/components/screen-loader/screen-loader.component';
import { PartidasRealizadasService } from './partidas-realizadas.service';

@Component({
  selector: 'app-partidas-realizadas',
  standalone: true,
  imports: [NgbCarouselModule, ScreenLoaderComponent],
  templateUrl: './partidas-realizadas.component.html',
  styleUrl: './partidas-realizadas.component.scss',
})
export class PartidasRealizadasComponent implements OnInit {
  readonly dataService = inject(PartidasRealizadasService);

  readonly slides = computed<GetPartidasRealizadasDto[][]>(() =>
    this.chunk(this.dataService.partidasRealizadas(), 3),
  );

  ngOnInit(): void {
    this.dataService.carregar();
  }

  tentarNovamente(): void {
    this.dataService.tentarNovamente();
  }

  formatarData(dataHora: string | null): string {
    const date = this.parseData(dataHora);
    return date ? format(date, 'dd/MM/yy') : '--';
  }

  formatarHorario(dataHora: string | null): string {
    const date = this.parseData(dataHora);
    return date ? format(date, 'HH:mm') : '--:--';
  }

  placarMandante(partida: GetPartidasRealizadasDto): string {
    return partida.golsMandante === null ? '--' : String(partida.golsMandante);
  }

  placarVisitante(partida: GetPartidasRealizadasDto): string {
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

  private chunk(
    partidas: GetPartidasRealizadasDto[],
    size: number,
  ): GetPartidasRealizadasDto[][] {
    const groups: GetPartidasRealizadasDto[][] = [];

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
