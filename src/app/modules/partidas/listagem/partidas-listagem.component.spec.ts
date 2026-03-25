import { TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetPartidasDto } from '../../../data/partida/dto/get-partidas.dto';
import { PartidaGrupoEnum } from '../../../data/partida/dto/partida-grupo.enum';
import { PartidaStatusEnum } from '../../../data/partida/dto/partida-status.enum';
import { PartidaService } from '../../../data/partida/partida-service';
import { PartidasListagemComponent } from './partidas-listagem.component';
import { PartidasFiltroUi, PartidasListagemService } from './partidas-listagem.service';

describe(PartidasListagemComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve delegar carga inicial para o PartidasListagemService', () => {
    const listagemServiceMock = createListagemServiceMock();
    const partidaServiceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [
        { provide: PartidasListagemService, useValue: listagemServiceMock },
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    expect(listagemServiceMock.carregar).toHaveBeenCalledTimes(1);
    expect(partidaServiceMock.getPartidas).not.toHaveBeenCalled();
  });

  it('deve renderizar o subcomponente de proximas partidas', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('app-partidas-proximas')).not.toBeNull();
  });

  it('deve exibir totalizadores acima dos filtros', () => {
    const serviceMock = createServiceMock([
      {
        grupo: 'GRUPO 1',
        dataHora: '2026-03-08T21:00:00',
        mandante: faker.company.name(),
        golsMandante: 2,
        golsVisitante: 1,
        visitante: faker.company.name(),
        status: PartidaStatusEnum.REALIZADA,
      },
      {
        grupo: 'GRUPO 2',
        dataHora: '2026-03-10T21:00:00',
        mandante: faker.company.name(),
        golsMandante: null,
        golsVisitante: null,
        visitante: faker.company.name(),
        status: PartidaStatusEnum.AGENDADA,
      },
      {
        grupo: 'GRUPO 2',
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

    expect(root.querySelector('[data-testid="totais-total-partidas"]')?.textContent?.trim()).toBe('3');
    expect(root.querySelector('[data-testid="totais-total-realizadas"]')?.textContent?.trim()).toBe('1');
    expect(root.querySelector('[data-testid="totais-total-pendente"]')?.textContent?.trim()).toBe('2');
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

    expect(serviceMock.getPartidas).toHaveBeenCalledTimes(1);
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

function createListagemServiceMock() {
  const carregando = signal(false);
  const erro = signal<string | null>(null);
  const filtroSelecionado = signal<PartidasFiltroUi>('GERAL');
  const partidas = signal<GetPartidasDto[]>(createResponsePayload());

  return {
    carregar: vi.fn(),
    selecionarFiltro: vi.fn((filtro: PartidasFiltroUi) => filtroSelecionado.set(filtro)),
    tentarNovamente: vi.fn(),
    carregando,
    erro,
    filtroSelecionado,
    partidas,
    partidasFiltradas: computed(() => partidas()),
  } satisfies Pick<
    PartidasListagemService,
    | 'carregar'
    | 'selecionarFiltro'
    | 'tentarNovamente'
    | 'carregando'
    | 'erro'
    | 'filtroSelecionado'
    | 'partidas'
    | 'partidasFiltradas'
  >;
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
