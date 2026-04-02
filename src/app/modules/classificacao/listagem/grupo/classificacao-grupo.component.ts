import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClassificacaoStatusFaseEnum } from '../../../../data/classificacao/dto/classificacao-status-fase.enum';
import { GetClassificacaoDto } from '../../../../data/classificacao/dto/get-classificacao.dto';
import { NomePlayerPipe } from '../../../shared/pipes/nome-player/nome-player.pipe';
import { ClassificacaoFaseAtual } from '../classificacao-fase-atual.type';

@Component({
  selector: 'app-classificacao-grupo',
  standalone: true,
  imports: [NomePlayerPipe],
  templateUrl: './classificacao-grupo.component.html',
  styleUrl: './classificacao-grupo.component.scss',
})
export class ClassificacaoGrupoComponent {
  @Input({ required: true }) tituloGrupo = '';
  @Input({ required: true }) classificacao: GetClassificacaoDto[] = [];
  @Input({ required: true }) carregando = false;
  @Input() faseAtual: ClassificacaoFaseAtual = 'FASE_DE_GRUPOS';
  @Input() erro: string | null = null;

  @Output() readonly recarregar = new EventEmitter<void>();

  recordLabel(vitorias: number, empates: number, derrotas: number): string {
    return `${vitorias} - ${empates} - ${derrotas}`;
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

  statusFaseLabel(statusFase?: ClassificacaoStatusFaseEnum): string {
    return statusFase === ClassificacaoStatusFaseEnum.DESCLASSIFICADO
      ? 'Desclassificado'
      : 'Classificado';
  }

  isClassificado(statusFase?: ClassificacaoStatusFaseEnum): boolean {
    return statusFase !== ClassificacaoStatusFaseEnum.DESCLASSIFICADO;
  }

  mostrarStatusFase(): boolean {
    return this.faseAtual === 'PLAYOFFS';
  }

  onRecarregar(): void {
    this.recarregar.emit();
  }
}
