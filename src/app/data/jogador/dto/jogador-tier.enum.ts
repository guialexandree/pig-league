export enum JogadorTierEnum {
  Silver = 1,
  Gold = 2,
  Hero = 3,
}

export const descricaoJogadorTier: Record<JogadorTierEnum, string> = {
  [JogadorTierEnum.Silver]: 'Silver',
  [JogadorTierEnum.Gold]: 'Gold',
  [JogadorTierEnum.Hero]: 'Hero',
};

export const jogadorTierOptions = Object.entries(descricaoJogadorTier).map(
  ([key, label]) => ({
    label,
    value: Number(key) as JogadorTierEnum,
  }),
);
