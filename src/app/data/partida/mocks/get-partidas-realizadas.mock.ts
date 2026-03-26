import { faker } from '@faker-js/faker';
import { GetPartidasRealizadasDto, PartidaStatusEnum } from '../dto';
import { generateGetPartidasDto } from './get-partidas.mock';

export function generateGetPartidasRealizadasDto(
  overrides: Partial<GetPartidasRealizadasDto> = {},
): GetPartidasRealizadasDto {
  return {
    ...generateGetPartidasDto({
      status: PartidaStatusEnum.REALIZADA,
      dataHora: faker.date.recent().toISOString(),
      golsMandante: faker.number.int({ min: 0, max: 7 }),
      golsVisitante: faker.number.int({ min: 0, max: 7 }),
    }),
    ...overrides,
  };
}
