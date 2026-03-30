import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { GetPartidasTotaisDto } from '../../../../data/partida/dto';
import { PartidaService } from '../../../../data/partida/partida-service';

const TOTAIS_DEFAULT: GetPartidasTotaisDto = {
  totalPartidas: 0,
  totalRealizada: 0,
  totalPendente: 0,
};

@Injectable({
  providedIn: 'root',
})
export class PartidasTotaisService {
  private readonly partidaService = inject(PartidaService);

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);

  private readonly resposta = signal<GetPartidasTotaisDto | null>(null);

  readonly totais = computed<GetPartidasTotaisDto>(() => this.resposta() ?? TOTAIS_DEFAULT);

  carregar(): void {
    if (this.resposta() !== null || this.carregando()) {
      return;
    }

    this.buscarTotais();
  }

  tentarNovamente(): void {
    this.buscarTotais();
  }

  private buscarTotais(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.partidaService
      .getPartidasTotais()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (resposta) => this.resposta.set(resposta),
        error: () => {
          this.resposta.set(null);
          this.erro.set('Nao foi possivel carregar os totais de partidas no momento.');
        },
      });
  }
}
