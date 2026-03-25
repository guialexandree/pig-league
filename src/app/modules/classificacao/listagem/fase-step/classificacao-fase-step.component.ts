import { Component, Input } from '@angular/core';
import { ClassificacaoFaseAtual } from '../classificacao-fase-atual.type';

@Component({
  selector: 'app-classificacao-fase-step',
  standalone: true,
  templateUrl: './classificacao-fase-step.component.html',
  styleUrl: './classificacao-fase-step.component.scss',
})
export class ClassificacaoFaseStepComponent {
  @Input({ required: true }) faseAtual: ClassificacaoFaseAtual = 'FASE_DE_GRUPOS';

  isFaseGruposAtiva(): boolean {
    return this.faseAtual === 'FASE_DE_GRUPOS';
  }

  isPlayoffsAtivo(): boolean {
    return this.faseAtual === 'PLAYOFFS';
  }
}
