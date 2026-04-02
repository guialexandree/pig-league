import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GetPartidasRealizadasDto } from '../../../../data/partida/dto';
import { DateTimeAtPipe, DiaRelativoPipe, NomePlayerPipe } from '../../../shared/pipes';
import { ScreenLoaderComponent } from '../../../shared/components/screen-loader/screen-loader.component';
import { PartidasRealizadasService } from './partidas-realizadas.service';

type TeamSide = 'mandante' | 'visitante';

@Component({
  selector: 'app-partidas-realizadas',
  standalone: true,
  imports: [
    NgbCarouselModule,
    NgbTooltipModule,
    ScreenLoaderComponent,
    DiaRelativoPipe,
    DateTimeAtPipe,
    NomePlayerPipe,
  ],
  templateUrl: './partidas-realizadas.component.html',
  styleUrl: './partidas-realizadas.component.scss',
})
export class PartidasRealizadasComponent implements OnInit {
  readonly dataService = inject(PartidasRealizadasService);
  readonly currentSlideIndex = signal(0);
  readonly viewportWidth = signal(this.getViewportWidth());
  readonly cardsPerSlide = computed(() => this.resolveCardsPerSlide(this.viewportWidth()));

  readonly slides = computed<GetPartidasRealizadasDto[][]>(() =>
    this.chunk(this.dataService.partidasRealizadas(), this.cardsPerSlide()),
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

  @HostListener('window:resize')
  onWindowResize(): void {
    this.viewportWidth.set(this.getViewportWidth());
    this.currentSlideIndex.set(this.normalizedSlideIndex());
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

  lineOutcomeLabel(partida: GetPartidasRealizadasDto, side: TeamSide): string {
    if (this.isDraw(partida)) {
      return 'EMP';
    }

    return this.isWinner(partida, side) ? 'VIT' : 'DER';
  }

  matchOutcomeLabel(partida: GetPartidasRealizadasDto): string {
    if (this.isDraw(partida)) {
      return 'Empate confirmado';
    }

    return this.isWinner(partida, 'mandante')
      ? `Vitoria: ${partida.mandante}`
      : `Vitoria: ${partida.visitante}`;
  }

  teamTag(nomeTime: string): string {
    const letters = this.normalizePlayerName(nomeTime)
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

  private resolveCardsPerSlide(viewportWidth: number): number {
    if (viewportWidth >= 1400) {
      return 4;
    }

    if (viewportWidth >= 1200) {
      return 3;
    }

    if (viewportWidth >= 768) {
      return 2;
    }

    return 1;
  }

  private getViewportWidth(): number {
    return typeof window === 'undefined' ? 1200 : window.innerWidth;
  }

  private normalizePlayerName(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const nameChunks = value
      .trim()
      .split(/\s+/)
      .filter((chunk) => chunk.length > 0);

    if (nameChunks.length <= 1) {
      return nameChunks[0] ?? '';
    }

    return `${nameChunks[0]} ${nameChunks[nameChunks.length - 1]}`;
  }
}
