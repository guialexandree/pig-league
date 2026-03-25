import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { GetClassificacaoDto } from '../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoService } from '../../../data/classificacao/classificacao-service';
import { ClassificacaoListagemComponent } from './classificacao-listagem.component';

describe(ClassificacaoListagemComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve carregar classificacao geral na inicializacao', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [ClassificacaoListagemComponent],
      providers: [{ provide: ClassificacaoService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    expect(serviceMock.getClassificacao).toHaveBeenCalledTimes(1);
    expect(serviceMock.getClassificacao).toHaveBeenCalledWith(undefined);
  });

  it('deve exibir header no topo igual aos modulos principais', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [ClassificacaoListagemComponent],
      providers: [{ provide: ClassificacaoService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.classification-hero__eyebrow')?.textContent?.trim()).toBe(
      'RANKING',
    );
    expect(root.querySelector('.classification-hero__title')?.textContent?.trim()).toBe(
      'CLASSIFICACAO',
    );
  });

  it('deve enviar grupoId=1 e grupoId=2 ao trocar filtros', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [ClassificacaoListagemComponent],
      providers: [{ provide: ClassificacaoService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const grupo1Button = root.querySelector(
      '[data-testid="filter-group-1"]',
    ) as HTMLButtonElement;
    const grupo2Button = root.querySelector(
      '[data-testid="filter-group-2"]',
    ) as HTMLButtonElement;

    grupo1Button.click();
    fixture.detectChanges();
    grupo2Button.click();
    fixture.detectChanges();

    expect(serviceMock.getClassificacao).toHaveBeenCalledWith({ grupoId: 1 });
    expect(serviceMock.getClassificacao).toHaveBeenCalledWith({ grupoId: 2 });
  });

  it('deve renderizar colunas V-D, GP, GC e SG com valores da API', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      imports: [ClassificacaoListagemComponent],
      providers: [{ provide: ClassificacaoService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="record"]')?.textContent?.trim()).toBe('3 - 0');
    expect(root.querySelector('[data-testid="goals-for"]')?.textContent?.trim()).toBe('26');
    expect(root.querySelector('[data-testid="goals-against"]')?.textContent?.trim()).toBe('9');
    expect(root.querySelector('[data-testid="goal-diff"]')?.textContent?.trim()).toBe('17');
  });

  it('deve permitir tentar novamente quando ocorrer erro', () => {
    const payload = createPayload();
    const serviceMock: Pick<ClassificacaoService, 'getClassificacao'> = {
      getClassificacao: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha de rede')))
        .mockReturnValueOnce(of(payload)),
    };

    TestBed.configureTestingModule({
      imports: [ClassificacaoListagemComponent],
      providers: [{ provide: ClassificacaoService, useValue: serviceMock }],
    });

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const retryButton = root.querySelector('[data-testid="retry-load-button"]') as HTMLButtonElement;

    expect(root.querySelector('[data-testid="error-state"]')).not.toBeNull();

    retryButton.click();
    fixture.detectChanges();

    expect(serviceMock.getClassificacao).toHaveBeenCalledTimes(2);
    expect(root.querySelector('[data-testid="error-state"]')).toBeNull();
    expect(root.querySelector('[data-testid="record"]')?.textContent?.trim()).toBe('3 - 0');
  });
});

function createServiceMock(
  payload: GetClassificacaoDto[] = createPayload(),
): Pick<ClassificacaoService, 'getClassificacao'> {
  return {
    getClassificacao: vi.fn().mockReturnValue(of(payload)),
  };
}

function createPayload(): GetClassificacaoDto[] {
  return [
    {
      grupo: 'GRUPO 1',
      posicao: 1,
      jogador: faker.company.name(),
      jogos: 3,
      vitorias: 3,
      empates: 0,
      derrotas: 0,
      golsPositivo: 26,
      golsContra: 9,
      saldoGols: 17,
      pontos: 9,
    },
  ];
}
