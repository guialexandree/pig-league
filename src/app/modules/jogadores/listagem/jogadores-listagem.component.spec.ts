import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetJogadoresDto } from '../../../data/jogador/dto';
import { JogadorService } from '../../../data/jogador/jogador-service';
import { JogadoresListagemComponent } from './jogadores-listagem.component';

describe(JogadoresListagemComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve carregar jogadores na inicializacao', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    expect(serviceMock.getJogadores).toHaveBeenCalledTimes(1);
  });

  it('deve exibir os dados de gols, partidas e vitorias no card', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('[data-testid="player-card-1"]');

    expect(card?.textContent).toContain('Gols');
    expect(card?.textContent).toContain(String(payload.jogadores[0].gols));
    expect(card?.textContent).toContain(String(payload.jogadores[0].partidas));
    expect(card?.textContent).toContain(String(payload.jogadores[0].vitorias));
  });

  it('deve permitir tentar novamente quando ocorrer erro ao carregar jogadores', () => {
    const payload = createPayload();
    const serviceMock: Pick<JogadorService, 'getJogadores'> = {
      getJogadores: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha de rede')))
        .mockReturnValueOnce(of(payload)),
    };

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const retryButton = root.querySelector('[data-testid="retry-load-button"]') as HTMLButtonElement;

    expect(root.querySelector('[data-testid="error-state"]')).not.toBeNull();

    retryButton.click();
    fixture.detectChanges();

    expect(serviceMock.getJogadores).toHaveBeenCalledTimes(2);
    expect(root.querySelector('[data-testid="error-state"]')).toBeNull();
    expect(root.querySelector('[data-testid="player-card-1"]')).not.toBeNull();
  });
});

function createServiceMock(
  payload: GetJogadoresDto = createPayload(),
): Pick<JogadorService, 'getJogadores'> {
  return {
    getJogadores: vi.fn().mockReturnValue(of(payload)),
  };
}

function createPayload(): GetJogadoresDto {
  return {
    grupo: 'CAMPEONATO',
    atualizadoEm: faker.date.recent().toISOString(),
    jogadores: [
      {
        id: 1,
        nome: faker.person.fullName(),
        gols: faker.number.int({ min: 0, max: 30 }),
        partidas: faker.number.int({ min: 1, max: 20 }),
        vitorias: faker.number.int({ min: 0, max: 20 }),
        percentualVitoria: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
      },
      {
        id: 2,
        nome: faker.person.fullName(),
        gols: faker.number.int({ min: 0, max: 30 }),
        partidas: faker.number.int({ min: 1, max: 20 }),
        vitorias: faker.number.int({ min: 0, max: 20 }),
        percentualVitoria: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
      },
    ],
  };
}
