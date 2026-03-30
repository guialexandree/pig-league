import { faker } from '@faker-js/faker';
import { GetPartidasTotaisDto } from '../dto';

export function generateGetPartidasTotaisDto(
  overrides: Partial<GetPartidasTotaisDto> = {},
): GetPartidasTotaisDto {
  const totalPartidas = faker.number.int({ min: 0, max: 100 });
  const totalRealizada = faker.number.int({ min: 0, max: totalPartidas });

  return {
    totalPartidas,
    totalRealizada,
    totalPendente: totalPartidas - totalRealizada,
    ...overrides,
  };
}
