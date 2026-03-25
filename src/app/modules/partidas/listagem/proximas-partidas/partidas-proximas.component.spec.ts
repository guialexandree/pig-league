import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { GetPartidasDto, PartidaStatusEnum } from '../../../../data/partida/dto';
import { PartidasProximasComponent } from './partidas-proximas.component';

describe(PartidasProximasComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve filtrar no computed apenas partidas agendadas', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PartidasProximasComponent],
    }).createComponent(PartidasProximasComponent);

    const payload = createPayload();
    fixture.componentRef.setInput('partidas', payload);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    expect(component.partidasAgendadas().length).toBe(2);
    expect(component.partidasAgendadas().every((partida) => partida.status === PartidaStatusEnum.AGENDADA)).toBe(true);
  });

  it('deve renderizar cards dentro do carousel bootstrap', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PartidasProximasComponent],
    }).createComponent(PartidasProximasComponent);

    fixture.componentRef.setInput('partidas', createPayload());
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('.carousel-item').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('[data-testid="upcoming-card"]').length).toBe(2);
  });

  it('deve derivar titulo final a partir do input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PartidasProximasComponent],
    }).createComponent(PartidasProximasComponent);

    fixture.componentRef.setInput('partidas', createPayload());
    fixture.componentRef.setInput('titulo', '  Jogos agendados  ');
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;

    expect(component.tituloFinal()).toBe('Jogos agendados');
    expect(root.querySelector('[data-testid="upcoming-title"]')?.textContent?.trim()).toBe(
      'Jogos agendados',
    );
  });

  it('deve exibir icone de calendario no cabecalho', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PartidasProximasComponent],
    }).createComponent(PartidasProximasComponent);

    fixture.componentRef.setInput('partidas', createPayload());
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="upcoming-calendar-icon"]')).not.toBeNull();
  });
});

function createPayload(): GetPartidasDto[] {
  return [
    createPartidaItem({ status: PartidaStatusEnum.AGENDADA }),
    createPartidaItem({ status: PartidaStatusEnum.NAO_AGENDADA, dataHora: null }),
    createPartidaItem({ status: PartidaStatusEnum.AGENDADA }),
  ];
}

function createPartidaItem(overrides: Partial<GetPartidasDto> = {}): GetPartidasDto {
  return {
    grupo: 'GRUPO 1',
    dataHora: '2026-03-08T21:00:00',
    mandante: faker.person.firstName(),
    golsMandante: null,
    golsVisitante: null,
    visitante: faker.person.firstName(),
    status: PartidaStatusEnum.REALIZADA,
    ...overrides,
  };
}
