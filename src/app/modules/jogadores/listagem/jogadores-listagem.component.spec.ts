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

  it('deve renderizar estrutura retrato com area de media e faixa de metricas', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const jogador = payload.jogadores[0];

    expect(root.querySelector(`[data-testid="player-portrait-shell-${jogador.id}"]`)).not.toBeNull();
    expect(root.querySelector(`[data-testid="player-media-${jogador.id}"]`)).not.toBeNull();
    expect(root.querySelector(`[data-testid="player-stats-band-${jogador.id}"]`)).not.toBeNull();
  });

  it('deve aplicar as classes base do visual retrato gamer', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const jogador = payload.jogadores[0];
    const card = root.querySelector(`[data-testid="player-card-${jogador.id}"]`);
    const media = root.querySelector(`[data-testid="player-media-${jogador.id}"]`);
    const statsBand = root.querySelector(`[data-testid="player-stats-band-${jogador.id}"]`);

    expect(card?.classList.contains('player-card--portrait')).toBe(true);
    expect(media?.classList.contains('player-media-stage')).toBe(true);
    expect(statsBand?.classList.contains('player-stats-band')).toBe(true);
  });

  it('deve exibir placeholder com iniciais e descricao acessivel quando nao ha foto', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const jogador = payload.jogadores[0];
    const media = root.querySelector(`[data-testid="player-media-${jogador.id}"]`);
    const initialsNode = root.querySelector(
      `[data-testid="player-placeholder-initials-${jogador.id}"]`,
    );

    expect(media?.getAttribute('aria-label')).toBe(`Retrato de ${jogador.nome}`);
    expect(initialsNode?.textContent?.trim()).toBe(getExpectedInitials(jogador.nome));
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

  it('deve renderizar header dedicado com logo em destaque', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const header = root.querySelector('app-listagem-header');
    const logo = root.querySelector('[data-testid="players-hero-logo"]') as HTMLImageElement | null;

    expect(header).not.toBeNull();
    expect(logo).not.toBeNull();
    expect(logo?.getAttribute('src')).toBe('/assets/img/logo.png');
  });

  it('deve aplicar fallback de caminho para o logo quando ocorrer erro de carregamento', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const logo = root.querySelector('[data-testid="players-hero-logo"]') as HTMLImageElement | null;

    expect(logo?.getAttribute('src')).toBe('/assets/img/logo.png');

    logo?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(logo?.getAttribute('src')).toBe('assets/img/logo.png');

    logo?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(logo?.getAttribute('src')).toBe('/browser/assets/img/logo.png');
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

function getExpectedInitials(nome: string): string {
  const parts = nome
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return 'PL';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
