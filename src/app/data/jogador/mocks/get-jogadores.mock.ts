import { faker } from '@faker-js/faker';
import { GetJogadorDto, GetJogadoresDto } from '../dto/get-jogadores.dto';

export function generateGetJogadorDto(
  overrides: Partial<GetJogadorDto> = {},
): GetJogadorDto {
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
