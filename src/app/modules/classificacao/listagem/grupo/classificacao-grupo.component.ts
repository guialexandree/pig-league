import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ClassificacaoGrupoService } from './classificacao-grupo.service';
import { ClassificacaoGrupoFiltro } from './classificacao-grupo.types';

@Component({
  selector: 'app-classificacao-grupo',
  standalone: true,
  templateUrl: './classificacao-grupo.component.html',
  styleUrl: './classificacao-grupo.component.scss',
  providers: [ClassificacaoGrupoService],
})
export class ClassificacaoGrupoComponent implements OnChanges {
  private readonly classificacaoGrupoService = inject(ClassificacaoGrupoService);
  private filtroCarregado: ClassificacaoGrupoFiltro | null = null;

  @Input({ required: true }) tituloGrupo = '';
  @Input({ required: true }) filtroInicial: ClassificacaoGrupoFiltro = 'GERAL';

  @Output() readonly carregandoChange = new EventEmitter<boolean>();

  readonly carregando = this.classificacaoGrupoService.carregando;
  readonly erro = this.classificacaoGrupoService.erro;
  readonly classificacao = this.classificacaoGrupoService.classificacao;

  constructor() {
    effect(() => {
      this.carregandoChange.emit(this.carregando());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('filtroInicial' in changes) {
      this.carregarClassificacaoInicial();
    }
  }

  tentarNovamente(): void {
    this.classificacaoGrupoService.tentarNovamente();
  }

  recordLabel(vitorias: number, derrotas: number): string {
    return `${vitorias} - ${derrotas}`;
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

  private carregarClassificacaoInicial(): void {
    if (this.filtroCarregado === this.filtroInicial) {
      return;
    }

    this.filtroCarregado = this.filtroInicial;
    this.classificacaoGrupoService.carregarClassificacao(this.filtroInicial);
  }
}
