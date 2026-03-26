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

  it('deve exibir data e horario da partida formatados no card', () => {
    const serviceMock = createServiceMock([
      generateGetPartidasRealizadasDto({
        dataHora: '2026-03-26T00:00:00',
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

    expect(dateElement?.textContent?.trim()).toBe('26/03/2026 às 00:00');
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

  it('deve derivar titulo final a partir do input', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasRealizadasComponent],
      providers: [{ provide: PartidasRealizadasService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasRealizadasComponent);
    fixture.componentRef.setInput('titulo', '  /partidas-realizadas  ');
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;

    expect(component.tituloFinal()).toBe('/partidas-realizadas');
    expect(root.querySelector('[data-testid="done-title"]')?.textContent?.trim()).toBe(
      '/partidas-realizadas',
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
