import { Component } from '@angular/core';

type RuleSection = {
  title: string;
  items: string[];
  ordered?: boolean;
};

@Component({
  selector: 'app-regras-listagem',
  standalone: true,
  templateUrl: './regras-listagem.component.html',
  styleUrl: './regras-listagem.component.scss',
})
export class RegrasListagemComponent {
  readonly sections: RuleSection[] = [
    {
      title: 'Formato da competicao',
      items: [
        'O campeonato sera dividido em 2 grupos.',
        'Os jogadores se enfrentam em formato todos contra todos dentro do grupo.',
        'Vitoria: 3 pontos.',
        'Empate: 1 ponto.',
        'Derrota: 0 pontos.',
      ],
    },
    {
      title: 'Criterios de classificacao',
      ordered: true,
      items: ['Pontos.', 'Numero de vitorias.', 'Saldo de gols.', 'Confronto direto.'],
    },
    {
      title: 'Classificacao para o mata-mata',
      items: ['Os 4 primeiros colocados de cada grupo avancam.'],
    },
    {
      title: 'Mata-mata',
      items: [
        'Quartas de final, semifinal e final.',
        'Em caso de empate: prorrogacao e, persistindo, penaltis.',
      ],
    },
    {
      title: 'Duracao das partidas',
      items: ['5 minutos cada tempo.', 'Total de 10 minutos por partida.'],
    },
    {
      title: 'Regras de jogo',
      items: [
        'Cada jogador pode escolher qualquer time disponivel no momento da partida.',
        'E permitido escolher o mesmo time que o adversario.',
        'E obrigatorio manter respeito e fair play durante toda a competicao.',
      ],
    },
    {
      title: 'Agendamento dos jogos',
      items: [
        'Os jogos nao possuem data fixa.',
        'Os jogadores devem se organizar entre si.',
        'Pode haver mais de um jogo por dia.',
      ],
    },
    {
      title: 'Envio de resultados',
      items: ['Apos a partida, o resultado deve ser enviado no Teams.'],
    },
  ];

  readonly quarterFinalCrosses = [
    '1o Grupo 1 x 4o Grupo 2',
    '2o Grupo 1 x 3o Grupo 2',
    '1o Grupo 2 x 4o Grupo 1',
    '2o Grupo 2 x 3o Grupo 1',
  ];
}
