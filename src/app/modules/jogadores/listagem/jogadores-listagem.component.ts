import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { format, isValid, parseISO } from 'date-fns';
import { finalize } from 'rxjs';
import { GetJogadorDto, GetJogadoresDto } from '../../../data/jogador/dto';
import { JogadorService } from '../../../data/jogador/jogador-service';

@Component({
  selector: 'app-jogadores-listagem',
  standalone: true,
  templateUrl: './jogadores-listagem.component.html',
  styleUrl: './jogadores-listagem.component.scss',
})
export class JogadoresListagemComponent implements OnInit {
  private readonly jogadorService = inject(JogadorService);

  readonly carregando = signal<boolean>(false);
  readonly erro = signal<string | null>(null);
  readonly resposta = signal<GetJogadoresDto | null>(null);

  readonly atualizadoEmFormatado = computed<string | null>(() =>
    this.formatarAtualizadoEm(this.resposta()?.atualizadoEm ?? null),
  );

  readonly jogadores = computed<GetJogadorDto[]>(() =>
    [...(this.resposta()?.jogadores ?? [])].sort((itemA, itemB) => {
      if (itemB.percentualVitoria !== itemA.percentualVitoria) {
        return itemB.percentualVitoria - itemA.percentualVitoria;
      }

      if (itemB.gols !== itemA.gols) {
        return itemB.gols - itemA.gols;
      }

      if (itemB.vitorias !== itemA.vitorias) {
        return itemB.vitorias - itemA.vitorias;
      }

      return itemA.nome.localeCompare(itemB.nome, 'pt-BR', {
        sensitivity: 'base',
      });
    }),
  );

  ngOnInit(): void {
    this.carregarJogadores();
  }

  tentarNovamente(): void {
    this.carregarJogadores();
  }

  toWinAngle(percentual: number): string {
    const sanitizedPercentual = this.sanitizePercentual(percentual);
    return `${sanitizedPercentual * 3.6}deg`;
  }

  formatPercentual(percentual: number): string {
    const sanitizedPercentual = this.sanitizePercentual(percentual);
    return `${sanitizedPercentual.toFixed(1)}%`;
  }

  private carregarJogadores(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.jogadorService
      .getJogadores()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (payload) => this.resposta.set(payload),
        error: () => {
          this.resposta.set(null);
          this.erro.set('Nao foi possivel carregar os jogadores no momento.');
        },
      });
  }

  private sanitizePercentual(percentual: number): number {
    if (!Number.isFinite(percentual)) {
      return 0;
    }

    return Math.min(Math.max(percentual, 0), 100);
  }

  private formatarAtualizadoEm(value: string | null): string | null {
    if (!value) {
      return null;
    }

    const parsed = parseISO(value);
    if (!isValid(parsed)) {
      return null;
    }

    return format(parsed, 'dd/MM/yyyy HH:mm');
  }
}
