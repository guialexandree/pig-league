import { faker } from '@faker-js/faker';
import { GetJogadorDto, GetJogadoresDto } from '../dto/get-jogadores.dto';
import { JogadorTierEnum } from '../dto/jogador-tier.enum';

export function generateGetJogadorDto(
  overrides: Partial<GetJogadorDto> = {},
): GetJogadorDto {
  const xp = overrides.xp ?? faker.number.int({ min: 0, max: 260 });
  const tier = overrides.tier ?? resolveTier(xp);
  const xpMinimoTier =
    tier === JogadorTierEnum.Silver
      ? 0
      : tier === JogadorTierEnum.Gold
        ? 110
        : 170;
  const xpAtualNoTier = overrides.xpAtualNoTier ?? Math.max(0, xp - xpMinimoTier);
  const xpNecessarioProximoTier =
    overrides.xpNecessarioProximoTier ??
    (tier === JogadorTierEnum.Hero
      ? 0
      : tier === JogadorTierEnum.Gold
        ? 60
        : 110);
  const progressoProximoTierPercentual =
    overrides.progressoProximoTierPercentual ??
    (tier === JogadorTierEnum.Hero
      ? 100
      : Number(((xpAtualNoTier / xpNecessarioProximoTier) * 100).toFixed(2)));

  return {
    id: faker.number.int({ min: 1, max: 200 }),
    nome: faker.person.fullName(),
    gols: faker.number.int({ min: 0, max: 60 }),
    partidas: faker.number.int({ min: 0, max: 40 }),
    vitorias: faker.number.int({ min: 0, max: 40 }),
    percentualVitoria: faker.number.float({
      min: 0,
      max: 100,
      fractionDigits: 2,
    }),
    xp,
    tier,
    xpAtualNoTier,
    xpNecessarioProximoTier,
    progressoProximoTierPercentual,
    ...overrides,
  };
}

export function generateGetJogadoresDto(
  overrides: Partial<GetJogadoresDto> = {},
): GetJogadoresDto {
  return {
    grupo: 'CAMPEONATO',
    atualizadoEm: faker.date.recent().toISOString(),
    jogadores: overrides.jogadores ?? [generateGetJogadorDto()],
    ...overrides,
  };
}

function resolveTier(xp: number): JogadorTierEnum {
  if (xp >= 170) {
    return JogadorTierEnum.Hero;
  }

  if (xp >= 110) {
    return JogadorTierEnum.Gold;
  }

  return JogadorTierEnum.Silver;
}
