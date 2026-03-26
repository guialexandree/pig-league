import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetJogadoresDto, JogadorTierEnum } from '../../../data/jogador/dto';
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

  it('deve usar container fluido para a listagem de jogadores', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const layoutContainer = root.querySelector('[data-testid="players-list-container"]');

    expect(layoutContainer).not.toBeNull();
    expect(layoutContainer?.classList.contains('container-fluid')).toBe(true);
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

  it('deve exibir descricao acessivel da area de media quando nao ha foto', () => {
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

    expect(media?.getAttribute('aria-label')).toBe(`Retrato de ${jogador.nome}`);
  });

  it('deve aplicar atributo data-tier no card conforme tier do jogador', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const cardSilver = root.querySelector('[data-testid="player-card-1"]');
    const cardGold = root.querySelector('[data-testid="player-card-2"]');
    const cardHero = root.querySelector('[data-testid="player-card-3"]');

    expect(cardSilver?.getAttribute('data-tier')).toBe(String(JogadorTierEnum.Silver));
    expect(cardGold?.getAttribute('data-tier')).toBe(String(JogadorTierEnum.Gold));
    expect(cardHero?.getAttribute('data-tier')).toBe(String(JogadorTierEnum.Hero));
  });

  it('deve exibir barra de progresso com percentual retornado pelo backend', () => {
    const payload = createPayload();
    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      imports: [JogadoresListagemComponent],
      providers: [{ provide: JogadorService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(JogadoresListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const fillGold = root.querySelector(
      '[data-testid="player-tier-progress-fill-2"]',
    ) as HTMLElement | null;
    const fillHero = root.querySelector(
      '[data-testid="player-tier-progress-fill-3"]',
    ) as HTMLElement | null;

    expect(fillGold?.style.width).toBe('35%');
    expect(fillHero?.style.width).toBe('100%');
  });

  it('deve exibir imagem padrao de jogador quando nao houver foto', () => {
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
    const fallbackImage = root.querySelector(
      `[data-testid="player-placeholder-image-${jogador.id}"]`,
    ) as HTMLImageElement | null;

    expect(fallbackImage).not.toBeNull();
    expect(fallbackImage?.getAttribute('src')).toBe('/assets/img/player-empty.png');
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

  it('deve ocultar o indicador OVR e manter os demais indicadores', () => {
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

    expect(card?.textContent).not.toContain('OVR');
    expect(card?.textContent).toContain('Gols');
    expect(card?.textContent).toContain('Partidas');
    expect(card?.textContent).toContain('Vitorias');
    expect(card?.textContent).toContain('Aprov.');
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
        xp: 350,
        tier: JogadorTierEnum.Silver,
        xpAtualNoTier: 350,
        xpNecessarioProximoTier: 1000,
        progressoProximoTierPercentual: 35,
      },
      {
        id: 2,
        nome: faker.person.fullName(),
        gols: faker.number.int({ min: 0, max: 30 }),
        partidas: faker.number.int({ min: 1, max: 20 }),
        vitorias: faker.number.int({ min: 0, max: 20 }),
        percentualVitoria: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
        xp: 1350,
        tier: JogadorTierEnum.Gold,
        xpAtualNoTier: 350,
        xpNecessarioProximoTier: 1000,
        progressoProximoTierPercentual: 35,
      },
      {
        id: 3,
        nome: faker.person.fullName(),
        gols: faker.number.int({ min: 0, max: 30 }),
        partidas: faker.number.int({ min: 1, max: 20 }),
        vitorias: faker.number.int({ min: 0, max: 20 }),
        percentualVitoria: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
        xp: 2350,
        tier: JogadorTierEnum.Hero,
        xpAtualNoTier: 350,
        xpNecessarioProximoTier: 0,
        progressoProximoTierPercentual: 100,
      },
    ],
  };
}
