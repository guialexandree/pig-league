import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { format, isValid, parseISO } from 'date-fns';
import { GetPartidasRealizadasDto } from '../../../../data/partida/dto';
import { ScreenLoaderComponent } from '../../../shared/components/screen-loader/screen-loader.component';
import { PartidasRealizadasService } from './partidas-realizadas.service';

type TeamSide = 'mandante' | 'visitante';

@Component({
  selector: 'app-partidas-realizadas',
  standalone: true,
  imports: [NgbCarouselModule, ScreenLoaderComponent],
  templateUrl: './partidas-realizadas.component.html',
  styleUrl: './partidas-realizadas.component.scss',
})
export class PartidasRealizadasComponent implements OnInit {
  readonly dataService = inject(PartidasRealizadasService);
  readonly currentSlideIndex = signal(0);

  readonly slides = computed<GetPartidasRealizadasDto[][]>(() =>
    this.chunk(this.dataService.partidasRealizadas(), 3),
  );
  readonly canGoPrev = computed(() => this.normalizedSlideIndex() > 0);
  readonly canGoNext = computed(() => this.normalizedSlideIndex() < this.slides().length - 1);

  private readonly normalizedSlideIndex = computed(() => {
    const maxIndex = Math.max(this.slides().length - 1, 0);
    return Math.min(Math.max(this.currentSlideIndex(), 0), maxIndex);
  });

  totalPartidas = this.dataService.partidasRealizadas().length;

  ngOnInit(): void {
    this.dataService.carregar();
  }

  tentarNovamente(): void {
    this.dataService.tentarNovamente();
  }

  onSlide(event: NgbSlideEvent): void {
    this.currentSlideIndex.set(this.slideIndexFromId(event.current));
  }

  goToPrevious(carousel: NgbCarousel): void {
    if (!this.canGoPrev()) {
      return;
    }

    carousel.prev();
  }

  goToNext(carousel: NgbCarousel): void {
    if (!this.canGoNext()) {
      return;
    }

    carousel.next();
  }

  formatarData(dataHora: string | null): string | null {
    const date = this.parseData(dataHora);
    return date ? format(date, "dd/MM/yyyy 'às' HH:mm") : null;
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

  isWinner(partida: GetPartidasRealizadasDto, side: TeamSide): boolean {
    const scoreDiff = this.scoreDiff(partida, side);
    return scoreDiff !== null && scoreDiff > 0;
  }

  isLoser(partida: GetPartidasRealizadasDto, side: TeamSide): boolean {
    const scoreDiff = this.scoreDiff(partida, side);
    return scoreDiff !== null && scoreDiff < 0;
  }

  isDraw(partida: GetPartidasRealizadasDto): boolean {
    const scoreDiff = this.scoreDiff(partida, 'mandante');
    return scoreDiff !== null && scoreDiff === 0;
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

  private scoreDiff(partida: GetPartidasRealizadasDto, side: TeamSide): number | null {
    if (partida.golsMandante === null || partida.golsVisitante === null) {
      return null;
    }

    if (side === 'mandante') {
      return partida.golsMandante - partida.golsVisitante;
    }

    return partida.golsVisitante - partida.golsMandante;
  }

  private slideIndexFromId(slideId: string): number {
    const slidePrefix = 'done-slide-';

    if (!slideId.startsWith(slidePrefix)) {
      return 0;
    }

    const slideIndex = Number.parseInt(slideId.slice(slidePrefix.length), 10);
    return Number.isNaN(slideIndex) || slideIndex < 0 ? 0 : slideIndex;
  }
}
