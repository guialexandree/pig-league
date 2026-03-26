import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import {
  GetPartidasDto,
  PartidaGrupoEnum,
  PartidaStatusEnum,
} from '../../../data/partida/dto';
import { PartidaService } from '../../../data/partida/partida-service';
import { PartidasListagemService } from './partidas-listagem.service';

describe(PartidasListagemService.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve buscar partidas uma unica vez e aplicar filtro local por grupo', () => {
    const payload = createResponsePayload();
    const partidaServiceMock = createPartidaServiceMock(payload);

    TestBed.configureTestingModule({
      providers: [
        PartidasListagemService,
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const service = TestBed.inject(PartidasListagemService);

    service.carregarDados();
    service.selecionarFiltro(PartidaGrupoEnum.GRUPO_1);
    service.selecionarFiltro(PartidaGrupoEnum.GRUPO_2);
    service.selecionarFiltro(PartidaGrupoEnum.GRUPO_1);

    expect(partidaServiceMock.getPartidas).toHaveBeenCalledTimes(1);
    expect(partidaServiceMock.getPartidas).toHaveBeenCalledWith(undefined);
    expect(service.partidas().length).toBe(payload.length);
    expect(service.partidasFiltradas().every((partida) => partida.grupo.includes('1'))).toBe(
      true,
    );
  });

  it('deve preencher erro quando a busca falhar e permitir retry', () => {
    const payload = createResponsePayload();
    const partidaServiceMock: Pick<PartidaService, 'getPartidas'> = {
      getPartidas: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha')))
        .mockReturnValueOnce(of(payload)),
    };

    TestBed.configureTestingModule({
      providers: [
        PartidasListagemService,
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const service = TestBed.inject(PartidasListagemService);

    service.carregarDados();

    expect(service.erro()).toBe('Nao foi possivel carregar as partidas no momento.');
    expect(service.partidas()).toEqual([]);

    service.tentarNovamente();

    expect(partidaServiceMock.getPartidas).toHaveBeenCalledTimes(2);
    expect(service.erro()).toBeNull();
    expect(service.partidas().length).toBe(payload.length);
  });
});

function createPartidaServiceMock(
  payload: GetPartidasDto[] = createResponsePayload(),
): Pick<PartidaService, 'getPartidas'> {
  return {
    getPartidas: vi.fn().mockReturnValue(of(payload)),
  };
}

function createResponsePayload(): GetPartidasDto[] {
  return [
    createPartidaItem({ grupo: 'GRUPO 1', status: PartidaStatusEnum.AGENDADA }),
    createPartidaItem({ grupo: 'GRUPO 1', status: PartidaStatusEnum.NAO_AGENDADA }),
    createPartidaItem({ grupo: 'GRUPO 2', status: PartidaStatusEnum.AGENDADA }),
  ];
}

function createPartidaItem(overrides: Partial<GetPartidasDto> = {}): GetPartidasDto {
  return {
    grupo: 'GRUPO 1',
    dataHora: '2026-03-08T21:00:00',
    mandante: faker.company.name(),
    golsMandante: faker.number.int({ min: 0, max: 7 }),
    golsVisitante: faker.number.int({ min: 0, max: 7 }),
    visitante: faker.company.name(),
    status: PartidaStatusEnum.REALIZADA,
    ...overrides,
  };
}
