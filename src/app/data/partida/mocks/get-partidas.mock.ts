import { faker } from '@faker-js/faker';
import { GetPartidasDto } from '../dto/get-partidas.dto';
import { PartidaStatusEnum } from '../dto/partida-status.enum';

const PARTIDA_STATUS_VALUES: PartidaStatusEnum[] = [
  PartidaStatusEnum.NAO_AGENDADA,
  PartidaStatusEnum.AGENDADA,
  PartidaStatusEnum.REALIZADA,
  PartidaStatusEnum.CANCELADA,
];

export function generateGetPartidasDto(
  overrides: Partial<GetPartidasDto> = {},
): GetPartidasDto {
  return {
    grupo: faker.helpers.arrayElement(['GRUPO 1', 'GRUPO 2']),
    dataHora: faker.helpers.arrayElement([null, faker.date.soon().toISOString()]),
    mandante: faker.person.fullName(),
    golsMandante: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 0, max: 7 }),
    ]),
    golsVisitante: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 0, max: 7 }),
    ]),
    visitante: faker.person.fullName(),
    status: faker.helpers.arrayElement(PARTIDA_STATUS_VALUES),
    ...overrides,
  };
}
