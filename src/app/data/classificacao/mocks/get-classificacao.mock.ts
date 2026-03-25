import { faker } from '@faker-js/faker';
import { GetClassificacaoDto } from '../dto/get-classificacao.dto';

export function generateGetClassificacaoDto(
  overrides: Partial<GetClassificacaoDto> = {},
): GetClassificacaoDto {
  const jogos = faker.number.int({ min: 0, max: 38 });
  const vitorias = faker.number.int({ min: 0, max: jogos });
  const empates = faker.number.int({ min: 0, max: jogos - vitorias });
  const derrotas = jogos - vitorias - empates;
  const golsPositivo = faker.number.int({ min: 0, max: 120 });
  const golsContra = faker.number.int({ min: 0, max: 120 });

  return {
    grupo: faker.helpers.arrayElement(['GRUPO 1', 'GRUPO 2']),
    posicao: faker.number.int({ min: 1, max: 30 }),
    jogador: faker.person.fullName(),
    jogos,
    vitorias,
    empates,
    derrotas,
    golsPositivo,
    golsContra,
    saldoGols: golsPositivo - golsContra,
    pontos: vitorias * 3 + empates,
    ...overrides,
  };
}

export function generateGetClassificacaoDtoList(
  size = 1,
  itemOverrides: Partial<GetClassificacaoDto> = {},
): GetClassificacaoDto[] {
  return Array.from({ length: size }, () =>
    generateGetClassificacaoDto(itemOverrides),
  );
}

export const getClassificacaoMock = generateGetClassificacaoDto;
