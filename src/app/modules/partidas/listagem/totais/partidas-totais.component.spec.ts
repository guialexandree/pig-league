import { TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { faker } from '@faker-js/faker';
import { GetPartidasTotaisDto } from '../../../../data/partida/dto';
import { PartidasTotaisComponent } from './partidas-totais.component';
import { PartidasTotaisService } from './partidas-totais.service';

describe(PartidasTotaisComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve delegar carga inicial para o PartidasTotaisService', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [PartidasTotaisComponent],
      providers: [{ provide: PartidasTotaisService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasTotaisComponent);
    fixture.detectChanges();

    expect(serviceMock.carregar).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar totais carregados no componente', () => {
    const serviceMock = createServiceMock({
      totalPartidas: 42,
      totalRealizada: 24,
      totalPendente: 18,
    });

    TestBed.configureTestingModule({
      imports: [PartidasTotaisComponent],
      providers: [{ provide: PartidasTotaisService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(PartidasTotaisComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="totais-total-partidas"]')?.textContent?.trim()).toBe('42');
    expect(root.querySelector('[data-testid="totais-total-realizadas"]')?.textContent?.trim()).toBe('24');
    expect(root.querySelector('[data-testid="totais-total-pendente"]')?.textContent?.trim()).toBe('18');
  });
});

function createServiceMock(payload?: Partial<GetPartidasTotaisDto>) {
  const totaisSignal = signal<GetPartidasTotaisDto>({
    totalPartidas: 0,
    totalRealizada: 0,
    totalPendente: 0,
    ...payload,
  });

  return {
    carregar: vi.fn(),
    tentarNovamente: vi.fn(),
    carregando: signal(false),
    erro: signal<string | null>(null),
    totais: computed(() => totaisSignal()),
  } satisfies Pick<
    PartidasTotaisService,
    'carregar' | 'tentarNovamente' | 'carregando' | 'erro' | 'totais'
  >;
}
