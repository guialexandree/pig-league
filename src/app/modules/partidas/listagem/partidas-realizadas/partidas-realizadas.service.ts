import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { getTime, isValid, parseISO } from 'date-fns';
import { GetPartidasRealizadasDto, PartidaStatusEnum } from '../../../../data/partida/dto';
import { PartidaService } from '../../../../data/partida/partida-service';

@Injectable({
  providedIn: 'root',
})
export class PartidasRealizadasService {
  private readonly partidaService = inject(PartidaService);

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);

  private readonly resposta = signal<GetPartidasRealizadasDto[] | null>(null);

  readonly partidasRealizadas = computed<GetPartidasRealizadasDto[]>(() =>
    (this.resposta() ?? []));

  carregar(): void {
    if (this.resposta() !== null || this.carregando()) {
      return;
    }

    this.buscarPartidasRealizadas();
  }

  tentarNovamente(): void {
    this.buscarPartidasRealizadas();
  }

  private buscarPartidasRealizadas(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.partidaService
      .getPartidasRealizadas(undefined)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (resposta) => this.resposta.set(resposta),
        error: () => {
          this.resposta.set(null);
          this.erro.set('Nao foi possivel carregar as partidas realizadas no momento.');
        },
      });
  }
}
