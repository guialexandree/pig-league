import { TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { faker } from '@faker-js/faker';
import { GetPartidasRealizadasDto } from '../../../../data/partida/dto';
import { generateGetPartidasRealizadasDto } from '../../../../data/partida/mocks';
import { PartidasRealizadasComponent } from './partidas-realizadas.component';
import { PartidasRealizadasService } from './partidas-realizadas.service';

describe(PartidasRealizadasComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 27, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    setViewportWidth(1024);
  });

  it('deve delegar carga inicial para o PartidasRealizadasService', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    expect(serviceMock.carregar).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar cards do carousel com partidas realizadas do service', () => {
    const serviceMock = createServiceMock([
      generateGetPartidasRealizadasDto(),
      generateGetPartidasRealizadasDto(),
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('.carousel-item').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('[data-testid="done-card"]').length).toBe(2);
  });

  it('deve exibir apenas primeiro e ultimo nome dos jogadores no card', () => {
    const serviceMock = createServiceMock([
      generateGetPartidasRealizadasDto({
        mandante: '  Ronaldo   Nazario  de  Lima ',
        visitante: 'Ada Lovelace',
      }),
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const playerNames = Array.from(root.querySelectorAll('.done-card__name')).map((element) =>
      element.textContent?.trim(),
    );

    expect(playerNames).toEqual(['Ronaldo Lima', 'Ada Lovelace']);
  });

  it('deve exibir 4 itens por slide em monitor grande', () => {
    setViewportWidth(1600);
    const serviceMock = createServiceMock([
      generateGetPartidasRealizadasDto(),
      generateGetPartidasRealizadasDto(),
      generateGetPartidasRealizadasDto(),
      generateGetPartidasRealizadasDto(),
      generateGetPartidasRealizadasDto(),
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    expect(component.slides()).toHaveLength(2);
    expect(component.slides()[0]).toHaveLength(4);
    expect(component.slides()[1]).toHaveLength(1);
  });

  it('deve exibir nome do visitante no card em viewport mobile', () => {
    setViewportWidth(360);
    const serviceMock = createServiceMock([
      generateGetPartidasRealizadasDto({
        mandante: 'Gabriel Teles',
        visitante: 'Matheus Smek',
      }),
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const playerNames = Array.from(root.querySelectorAll('.done-card__name')).map((element) =>
      element.textContent?.trim(),
    );

    expect(playerNames).toContain('Matheus Smek');
  });

  it('deve exibir data e horario da partida formatados no card', () => {
    const serviceMock = createServiceMock([
      generateGetPartidasRealizadasDto({
        dataHora: '2026-03-26T10:15:00',
      }),
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const dateElement = root.querySelector('[data-testid="done-card-date"]');

    expect(dateElement?.textContent?.trim()).toBe('ontem às 10:15');
  });

  it('nao deve exibir data quando partida nao tiver dataHora', () => {
    const serviceMock = createServiceMock([
      generateGetPartidasRealizadasDto({
        dataHora: null,
      }),
    ]);

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const dateElement = root.querySelector('[data-testid="done-card-date"]');

    expect(dateElement).toBeNull();
  });

  it('deve exibir o titulo padrao do card', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="done-title"]')?.textContent?.trim()).toBe(
      'Partidas Realizadas',
    );
  });

  it('deve permitir nova tentativa quando houver erro', () => {
    const serviceMock = createServiceMock();
    serviceMock.erro.set('erro');

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const retryButton = root.querySelector('[data-testid="done-retry-button"]') as HTMLButtonElement;

    retryButton.click();

    expect(serviceMock.tentarNovamente).toHaveBeenCalledTimes(1);
  });

  it('deve gerar teamTag com iniciais do primeiro e ultimo nome', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.teamTag('Ronaldo Nazario de Lima')).toBe('RL');
  });
});

function createServiceMock(payload: GetPartidasRealizadasDto[] = [generateGetPartidasRealizadasDto()]) {
  const partidasRealizadas = signal<GetPartidasRealizadasDto[]>(payload);
  const carregando = signal(false);
  const erro = signal<string | null>(null);

  return {
    carregar: vi.fn(),
    tentarNovamente: vi.fn(),
    carregando,
    erro,
    partidasRealizadas: computed(() => partidasRealizadas()),
  } satisfies Pick<
    PartidasRealizadasService,
    'carregar' | 'tentarNovamente' | 'carregando' | 'erro' | 'partidasRealizadas'
  >;
}

function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
}
