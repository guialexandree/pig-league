import { Component } from '@angular/core';
import {
  JogadorTierEnum,
  descricaoJogadorTier,
  jogadorTierFaixaXp,
} from '../../../../data/jogador/dto';

interface TierInfoItem {
  readonly nome: string;
  readonly faixaXp: string;
  readonly progressoExemplo: string;
  readonly imagem: string;
  readonly tier: 'silver' | 'gold' | 'hero';
}

interface RegraPontuacaoItem {
  readonly icone: string;
  readonly titulo: string;
  readonly destaque: string;
  readonly subtitulo: string;
  readonly tom: 'silver' | 'gold' | 'hero' | 'amber';
}

@Component({
  selector: 'app-tier-info',
  standalone: true,
  templateUrl: './tier-info.component.html',
  styleUrl: './tier-info.component.scss',
})
export class TierInfoComponent {
  readonly tiers: TierInfoItem[] = [
    {
      nome: descricaoJogadorTier[JogadorTierEnum.Silver],
      faixaXp: jogadorTierFaixaXp[JogadorTierEnum.Silver],
      progressoExemplo: '99/109 XP tier',
      imagem: '/assets/img/controle-silver.png',
      tier: 'silver',
    },
    {
      nome: descricaoJogadorTier[JogadorTierEnum.Gold],
      faixaXp: jogadorTierFaixaXp[JogadorTierEnum.Gold],
      progressoExemplo: '145/169 XP tier',
      imagem: '/assets/img/controle-gold.png',
      tier: 'gold',
    },
    {
      nome: descricaoJogadorTier[JogadorTierEnum.Hero],
      faixaXp: jogadorTierFaixaXp[JogadorTierEnum.Hero],
      progressoExemplo: '170/170 XP tier',
      imagem: '/assets/img/controle-icon.png',
      tier: 'hero',
    },
  ];

  readonly regrasPontuacao: RegraPontuacaoItem[] = [
    {
      icone: '🏆',
      titulo: 'Vitória',
      destaque: '+18 XP',
      subtitulo: 'Empate +10 XP · Derrota +6 XP',
      tom: 'gold',
    },
    {
      icone: '⚽',
      titulo: 'Cada gol feito',
      destaque: '+2 XP',
      subtitulo: 'Performance ofensiva por partida',
      tom: 'amber',
    },
    {
      icone: '🛡️',
      titulo: 'Bônus em vitória com saldo 3+',
      destaque: '+6 XP',
      subtitulo: 'Ativado quando saldo de gols for igual ou maior que 3',
      tom: 'silver',
    },
    {
      icone: '🎖️',
      titulo: 'Cada gol sofrido',
      destaque: '-1 XP',
      subtitulo: 'XP mínimo por partida: 6',
      tom: 'hero',
    },
  ];
}
