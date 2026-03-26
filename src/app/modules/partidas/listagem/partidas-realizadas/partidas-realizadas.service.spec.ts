import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetPartidasRealizadasDto, PartidaStatusEnum } from '../../../../data/partida/dto';
import { PartidaService } from '../../../../data/partida/partida-service';
import { PartidasRealizadasService } from './partidas-realizadas.service';

describe(PartidasRealizadasService.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve buscar partidas realizadas sem filtro de grupo e ordenar por data desc', () => {
    const payload: GetPartidasRealizadasDto[] = [
      createPartidaRealizada({ dataHora: '2026-03-08T21:00:00.000Z' }),
      createPartidaRealizada({ dataHora: '2026-03-10T21:00:00.000Z' }),
      createPartidaRealizada({ dataHora: '2026-03-09T21:00:00.000Z' }),
    ];
    const partidaServiceMock = createPartidaServiceMock(payload);

    TestBed.configureTestingModule({
      providers: [
        PartidasRealizadasService,
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const service = TestBed.inject(PartidasRealizadasService);

    service.carregar();

    expect(partidaServiceMock.getPartidasRealizadas).toHaveBeenCalledTimes(1);
    expect(partidaServiceMock.getPartidasRealizadas).toHaveBeenCalledWith(undefined);
    expect(service.partidasRealizadas().map((partida) => partida.dataHora)).toEqual([
      '2026-03-10T21:00:00.000Z',
      '2026-03-09T21:00:00.000Z',
      '2026-03-08T21:00:00.000Z',
    ]);
  });

  it('deve preencher erro quando a busca falhar e permitir retry', () => {
    const payload = [createPartidaRealizada()];
    const partidaServiceMock: Pick<PartidaService, 'getPartidasRealizadas'> = {
      getPartidasRealizadas: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha')))
        .mockReturnValueOnce(of(payload)),
    };

    TestBed.configureTestingModule({
      providers: [
        PartidasRealizadasService,
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const service = TestBed.inject(PartidasRealizadasService);

    service.carregar();

    expect(service.erro()).toBe('Nao foi possivel carregar as partidas realizadas no momento.');
    expect(service.partidasRealizadas()).toEqual([]);

    service.tentarNovamente();

    expect(partidaServiceMock.getPartidasRealizadas).toHaveBeenCalledTimes(2);
    expect(service.erro()).toBeNull();
    expect(service.partidasRealizadas()).toEqual(payload);
  });
});

function createPartidaServiceMock(
  payload: GetPartidasRealizadasDto[],
): Pick<PartidaService, 'getPartidasRealizadas'> {
  return {
    getPartidasRealizadas: vi.fn().mockReturnValue(of(payload)),
  };
}

function createPartidaRealizada(
  overrides: Partial<GetPartidasRealizadasDto> = {},
): GetPartidasRealizadasDto {
  return {
    grupo: 'GRUPO 1',
    dataHora: '2026-03-08T21:00:00.000Z',
    mandante: faker.company.name(),
    golsMandante: faker.number.int({ min: 0, max: 7 }),
    golsVisitante: faker.number.int({ min: 0, max: 7 }),
    visitante: faker.company.name(),
    status: PartidaStatusEnum.REALIZADA,
    ...overrides,
  };
}
