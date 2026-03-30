import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetPartidasDto } from '../../../data/partida/dto/get-partidas.dto';
import { GetPartidasTotaisDto } from '../../../data/partida/dto/get-partidas-totais.dto';
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

    expect(listagemServiceMock.carregarDados).toHaveBeenCalledTimes(1);
    expect(partidaServiceMock.getPartidasPendentes).not.toHaveBeenCalled();
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
    const serviceMock = createServiceMock(
      createResponsePayload(),
      {
        totalPartidas: 3,
        totalRealizada: 1,
        totalPendente: 2,
      },
    );

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

  it('deve exibir title de partidas geral sem colunas de data e horario', () => {
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

    expect(root.querySelector('.matches-card__title')?.textContent?.trim()).toBe('PARTIDAS PENDENTES');
    expect(root.querySelector('[data-testid="match-date"]')).toBeNull();
    expect(root.querySelector('[data-testid="match-time"]')).toBeNull();
  });

  it('deve exibir loader local com logo e progress apenas no filtro geral quando estiver carregando', () => {
    const listagemServiceMock = createListagemServiceMock();
    const partidaServiceMock = createServiceMock();
    listagemServiceMock.carregando.set(true);

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [
        { provide: PartidasListagemService, useValue: listagemServiceMock },
        { provide: PartidaService, useValue: partidaServiceMock },
      ],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="pending-matches-loader"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="pending-matches-loader-logo"]')).not.toBeNull();
    expect(root.querySelector('.matches-card-loader__progress .progress-bar')).not.toBeNull();
    expect(root.querySelector('app-screen-loader')).toBeNull();
  });

  it('deve renderizar o subcomponente /partidas-realizadas acima das proximas partidas', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasListagemComponent],
      providers: [{ provide: PartidaService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('app-partidas-realizadas')).not.toBeNull();
    expect(root.textContent).toContain('/partidas-realizadas');
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

    expect(serviceMock.getPartidasPendentes).toHaveBeenCalledTimes(2);
  });

  it('deve permitir tentar novamente quando ocorrer erro ao carregar partidas', () => {
    const payload = createResponsePayload();
    const serviceMock: Pick<
      PartidaService,
      'getPartidasPendentes' | 'getPartidasRealizadas' | 'getPartidasTotais'
    > = {
      getPartidasPendentes: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha de rede')))
        .mockReturnValueOnce(of(payload)),
      getPartidasRealizadas: vi.fn().mockReturnValue(of(payload)),
      getPartidasTotais: vi.fn().mockReturnValue(of({
        totalPartidas: 1,
        totalRealizada: 1,
        totalPendente: 0,
      })),
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

    expect(serviceMock.getPartidasPendentes).toHaveBeenCalledTimes(2);
    expect(root.querySelector('[data-testid="error-state"]')).toBeNull();
    expect(root.querySelectorAll('[data-testid="match-game"]').length).toBeGreaterThan(0);
  });
});

function createServiceMock(
  payload?: GetPartidasDto[],
  totais?: GetPartidasTotaisDto,
): Pick<PartidaService, 'getPartidasPendentes' | 'getPartidasRealizadas' | 'getPartidasTotais'> {
  const payloadPartidas = payload ?? createResponsePayload();

  const payloadTotais = totais ?? {
    totalPartidas: payloadPartidas.length,
    totalRealizada: payloadPartidas.filter(
      (partida) => partida.status === PartidaStatusEnum.REALIZADA,
    ).length,
    totalPendente: payloadPartidas.filter(
      (partida) => partida.status !== PartidaStatusEnum.REALIZADA,
    ).length,
  };

  return {
    getPartidasPendentes: vi.fn().mockReturnValue(of(payloadPartidas)),
    getPartidasRealizadas: vi.fn().mockReturnValue(of(payloadPartidas)),
    getPartidasTotais: vi.fn().mockReturnValue(of(payloadTotais)),
  };
}

function createListagemServiceMock() {
  const carregando = signal(false);
  const erro = signal<string | null>(null);
  const filtroSelecionado = signal<PartidasFiltroUi>('GERAL');
  const partidas = signal<GetPartidasDto[]>(createResponsePayload());

  return {
    carregarDados: vi.fn(),
    selecionarFiltro: vi.fn((filtro: PartidasFiltroUi) => filtroSelecionado.set(filtro)),
    tentarNovamente: vi.fn(),
    carregando,
    erro,
    filtroSelecionado,
    partidas,
  } satisfies Pick<
    PartidasListagemService,
    | 'carregarDados'
    | 'selecionarFiltro'
    | 'tentarNovamente'
    | 'carregando'
    | 'erro'
    | 'filtroSelecionado'
    | 'partidas'
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
