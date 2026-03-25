import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetPartidasDto } from '../../../data/partida/dto/get-partidas.dto';
import { PartidaGrupoEnum } from '../../../data/partida/dto/partida-grupo.enum';
import { PartidaStatusEnum } from '../../../data/partida/dto/partida-status.enum';
import { PartidaService } from '../../../data/partida/partida-service';
import { PartidasListagemComponent } from './partidas-listagem.component';

describe(PartidasListagemComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve carregar partidas sem filtro na inicializacao', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    expect(serviceMock.getPartidas).toHaveBeenCalledTimes(1);
    expect(serviceMock.getPartidas).toHaveBeenCalledWith(undefined);
  });

  it('deve exibir data e horario em colunas separadas', () => {
    const serviceMock = createServiceMock([
      {
        grupo: 'GRUPO 1',
        dataHora: '2026-03-08T21:00:00',
        mandante: faker.company.name(),
        golsMandante: 2,
        golsVisitante: 3,
        visitante: faker.company.name(),
        status: PartidaStatusEnum.REALIZADA,
      },
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const data = root.querySelector('[data-testid="match-date"]')?.textContent;
    const horario = root.querySelector('[data-testid="match-time"]')?.textContent;

    expect(data?.trim()).toBe('08/03/26');
    expect(horario?.trim()).toBe('21:00');
  });

  it('deve exibir "Nao agendado" na coluna de horario quando o status nao for agendado', () => {
    const serviceMock = createServiceMock([
      {
        grupo: 'GRUPO 1',
        dataHora: null,
        mandante: faker.company.name(),
        golsMandante: null,
        golsVisitante: null,
        visitante: faker.company.name(),
        status: PartidaStatusEnum.NAO_AGENDADA,
      },
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const horario = root.querySelector('[data-testid="match-time"]');

    expect(horario?.textContent?.trim()).toBe('Nao agendado');
    expect(root.querySelector('[data-testid="match-status-canceled"]')).toBeNull();
  });

  it('deve exibir badge no final da linha apenas para partida cancelada', () => {
    const serviceMock = createServiceMock([
      {
        grupo: 'GRUPO 1',
        dataHora: '2026-03-08T21:00:00',
        mandante: faker.company.name(),
        golsMandante: null,
        golsVisitante: null,
        visitante: faker.company.name(),
        status: PartidaStatusEnum.CANCELADA,
      },
      {
        grupo: 'GRUPO 1',
        dataHora: '2026-03-09T21:00:00',
        mandante: faker.company.name(),
        golsMandante: null,
        golsVisitante: null,
        visitante: faker.company.name(),
        status: PartidaStatusEnum.AGENDADA,
      },
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const badges = root.querySelectorAll('[data-testid="match-status-canceled"]');

    expect(badges).toHaveLength(1);
    expect(badges[0]?.textContent?.trim()).toBe('Cancelado');
  });

  it('deve enviar grupoId quando o filtro de grupo for selecionado', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const filterButton = root.querySelector(
      '[data-testid="filter-group-1"]',
    ) as HTMLButtonElement;

    filterButton.click();
    fixture.detectChanges();

    expect(serviceMock.getPartidas).toHaveBeenCalledWith({
      grupoId: PartidaGrupoEnum.GRUPO_1,
    });
  });

  it('deve permitir tentar novamente quando ocorrer erro ao carregar partidas', () => {
    const payload = createResponsePayload();
    const serviceMock: Pick<PartidaService, 'getPartidas'> = {
      getPartidas: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha de rede')))
        .mockReturnValueOnce(of(payload)),
    };

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const errorState = root.querySelector('[data-testid="error-state"]');

    expect(errorState).not.toBeNull();

    const retryButton = root.querySelector('[data-testid="retry-load-button"]') as HTMLButtonElement;

    retryButton.click();
    fixture.detectChanges();

    expect(serviceMock.getPartidas).toHaveBeenCalledTimes(2);
    expect(root.querySelector('[data-testid="error-state"]')).toBeNull();
    expect(root.querySelector('[data-testid="match-date"]')?.textContent?.trim()).toBe('08/03/26');
  });
});

function createServiceMock(payload?: GetPartidasDto[]): Pick<PartidaService, 'getPartidas'> {
  return {
    getPartidas: vi.fn().mockReturnValue(of(payload ?? createResponsePayload())),
  };
}

function createResponsePayload(): GetPartidasDto[] {
  return [
    {
      grupo: 'GRUPO 1',
      dataHora: '2026-03-08T21:00:00',
      mandante: faker.company.name(),
      golsMandante: faker.number.int({ min: 0, max: 7 }),
      golsVisitante: faker.number.int({ min: 0, max: 7 }),
      visitante: faker.company.name(),
      status: PartidaStatusEnum.REALIZADA,
    },
  ];
}
