import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetPartidasTotaisDto } from '../../../../data/partida/dto';
import { PartidaService } from '../../../../data/partida/partida-service';
import { PartidasTotaisService } from './partidas-totais.service';

describe(PartidasTotaisService.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve buscar totais sem filtros e salvar resposta', () => {
    const payload = createTotaisPayload();
    const partidaServiceMock = createPartidaServiceMock(payload);

    TestBed.configureTestingModule({
      providers: [
        PartidasTotaisService,
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const service = TestBed.inject(PartidasTotaisService);

    service.carregar();

    expect(partidaServiceMock.getPartidasTotais).toHaveBeenCalledTimes(1);
    expect(partidaServiceMock.getPartidasTotais).toHaveBeenCalledWith();
    expect(service.totais()).toEqual(payload);
  });

  it('deve preencher erro quando a busca falhar e permitir retry', () => {
    const payload = createTotaisPayload();
    const partidaServiceMock: Pick<PartidaService, 'getPartidasTotais'> = {
      getPartidasTotais: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha')))
        .mockReturnValueOnce(of(payload)),
    };

    TestBed.configureTestingModule({
      providers: [
        PartidasTotaisService,
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const service = TestBed.inject(PartidasTotaisService);

    service.carregar();

    expect(service.erro()).toBe('Nao foi possivel carregar os totais de partidas no momento.');
    expect(service.totais()).toEqual({
      totalPartidas: 0,
      totalRealizada: 0,
      totalPendente: 0,
    });

    service.tentarNovamente();

    expect(partidaServiceMock.getPartidasTotais).toHaveBeenCalledTimes(2);
    expect(service.erro()).toBeNull();
    expect(service.totais()).toEqual(payload);
  });
});

function createPartidaServiceMock(
  payload: GetPartidasTotaisDto,
): Pick<PartidaService, 'getPartidasTotais'> {
  return {
    getPartidasTotais: vi.fn().mockReturnValue(of(payload)),
  };
}

function createTotaisPayload(
  overrides: Partial<GetPartidasTotaisDto> = {},
): GetPartidasTotaisDto {
  return {
    totalPartidas: faker.number.int({ min: 0, max: 100 }),
    totalRealizada: faker.number.int({ min: 0, max: 100 }),
    totalPendente: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  };
}
