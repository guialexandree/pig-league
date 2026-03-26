export enum JogadorTierEnum {
  Silver = 1,
  Gold = 2,
  Hero = 3,
}

export const descricaoJogadorTier: Record<JogadorTierEnum, string> = {
  [JogadorTierEnum.Silver]: 'Silver',
  [JogadorTierEnum.Gold]: 'Gold',
  [JogadorTierEnum.Hero]: 'Icon',
};

export const jogadorTierFaixaXp: Record<JogadorTierEnum, string> = {
  [JogadorTierEnum.Silver]: '0 - 109 XP',
  [JogadorTierEnum.Gold]: '110 - 169 XP',
  [JogadorTierEnum.Hero]: '170+ XP',
};

export const jogadorTierMinXp: Record<JogadorTierEnum, number> = {
  [JogadorTierEnum.Silver]: 0,
  [JogadorTierEnum.Gold]: 110,
  [JogadorTierEnum.Hero]: 170,
};

export const jogadorTierOptions = Object.entries(descricaoJogadorTier).map(
  ([key, label]) => ({
    label,
    value: Number(key) as JogadorTierEnum,
  }),
);
