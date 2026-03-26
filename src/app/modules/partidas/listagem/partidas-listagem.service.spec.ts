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

  it('deve buscar partidas pendentes na API e reaplicar filtro por grupo na API', () => {
    const geralPayload = createResponsePayload();
    const grupo1Payload = [createPartidaItem({ grupo: 'GRUPO 1' })];
    const grupo2Payload = [createPartidaItem({ grupo: 'GRUPO 2' })];

    const partidaServiceMock: Pick<PartidaService, 'getPartidasPendentes'> = {
      getPartidasPendentes: vi
        .fn()
        .mockReturnValueOnce(of(geralPayload))
        .mockReturnValueOnce(of(grupo1Payload))
        .mockReturnValueOnce(of(grupo2Payload)),
    };

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
    service.selecionarFiltro(PartidaGrupoEnum.GRUPO_2);

    expect(partidaServiceMock.getPartidasPendentes).toHaveBeenCalledTimes(3);
    expect(partidaServiceMock.getPartidasPendentes).toHaveBeenNthCalledWith(1, {});
    expect(partidaServiceMock.getPartidasPendentes).toHaveBeenNthCalledWith(2, {
      grupoId: PartidaGrupoEnum.GRUPO_1,
    });
    expect(partidaServiceMock.getPartidasPendentes).toHaveBeenNthCalledWith(3, {
      grupoId: PartidaGrupoEnum.GRUPO_2,
    });
    expect(service.filtroSelecionado()).toBe(PartidaGrupoEnum.GRUPO_2);
    expect(service.partidas()).toEqual(grupo2Payload);
  });

  it('deve preencher erro quando a busca falhar e permitir retry', () => {
    const payload = createResponsePayload();
    const partidaServiceMock: Pick<PartidaService, 'getPartidasPendentes'> = {
      getPartidasPendentes: vi
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

    expect(partidaServiceMock.getPartidasPendentes).toHaveBeenCalledTimes(2);
    expect(partidaServiceMock.getPartidasPendentes).toHaveBeenNthCalledWith(1, {});
    expect(partidaServiceMock.getPartidasPendentes).toHaveBeenNthCalledWith(2, {});
    expect(service.erro()).toBeNull();
    expect(service.partidas().length).toBe(payload.length);
  });
});

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
