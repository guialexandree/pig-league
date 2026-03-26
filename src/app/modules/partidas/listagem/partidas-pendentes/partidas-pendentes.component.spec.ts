import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { GetPartidasDto, PartidaStatusEnum } from '../../../../data/partida/dto';
import { PartidasPendentesComponent } from './partidas-pendentes.component';

describe(PartidasPendentesComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260326);
  });

  it('deve renderizar loader com logo e progress quando isLoading for true', () => {
    TestBed.configureTestingModule({
      imports: [PartidasPendentesComponent],
    });

    const fixture = TestBed.createComponent(PartidasPendentesComponent);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="pending-matches-loader"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="pending-matches-loader-logo"]')).not.toBeNull();
    expect(root.querySelector('.matches-card-loader__progress .progress-bar')).not.toBeNull();
    expect(root.querySelector('[data-testid="match-game"]')).toBeNull();
  });

  it('deve renderizar lista de partidas quando nao estiver carregando', () => {
    TestBed.configureTestingModule({
      imports: [PartidasPendentesComponent],
    });

    const fixture = TestBed.createComponent(PartidasPendentesComponent);
    fixture.componentRef.setInput('partidas', [createPartida(PartidaStatusEnum.AGENDADA)]);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="pending-matches-loader"]')).toBeNull();
    expect(root.querySelectorAll('[data-testid="match-game"]')).toHaveLength(1);
    expect(root.textContent).toContain('VS');
  });

  it('deve exibir badge de cancelado quando status da partida for CANCELADA', () => {
    TestBed.configureTestingModule({
      imports: [PartidasPendentesComponent],
    });

    const fixture = TestBed.createComponent(PartidasPendentesComponent);
    fixture.componentRef.setInput('partidas', [createPartida(PartidaStatusEnum.CANCELADA)]);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const canceledBadge = root.querySelector('[data-testid="match-status-canceled"]');

    expect(canceledBadge).not.toBeNull();
    expect(canceledBadge?.textContent?.trim()).toBe('Cancelado');
  });
});

function createPartida(status: PartidaStatusEnum): GetPartidasDto {
  return {
    grupo: faker.helpers.arrayElement(['GRUPO 1', 'GRUPO 2']),
    dataHora: faker.date.soon().toISOString(),
    mandante: faker.company.name(),
    golsMandante: faker.number.int({ min: 0, max: 5 }),
    golsVisitante: faker.number.int({ min: 0, max: 5 }),
    visitante: faker.company.name(),
    status,
  };
}
