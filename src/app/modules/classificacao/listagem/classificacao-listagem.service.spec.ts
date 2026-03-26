import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { ClassificacaoService } from '../../../data/classificacao/classificacao-service';
import { GetClassificacaoDto } from '../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoListagemService } from './classificacao-listagem.service';

describe(ClassificacaoListagemService.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve carregar classificacao geral em uma unica busca', () => {
    const classificacaoPayload = createClassificacaoPayload();
    const classificacaoServiceMock = createClassificacaoServiceMock(classificacaoPayload);

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoListagemService,
        { provide: ClassificacaoService, useValue: classificacaoServiceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoListagemService);

    service.carregar();

    expect(classificacaoServiceMock.getClassificacaoGeral).toHaveBeenCalledTimes(1);
    expect(service.classificacaoGrupo1().length).toBe(3);
    expect(service.classificacaoGrupo2().length).toBe(3);
    expect(service.classificacaoGeral().length).toBe(6);
    expect(service.faseAtual()).toBe('FASE_DE_GRUPOS');
  });

  it('deve marcar fase atual como playoffs quando todos os grupos estiverem finalizados', () => {
    const classificacaoServiceMock = createClassificacaoServiceMock(
      createClassificacaoPayload(2),
    );

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoListagemService,
        { provide: ClassificacaoService, useValue: classificacaoServiceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoListagemService);

    service.carregar();

    expect(service.faseAtual()).toBe('PLAYOFFS');
  });

  it('deve agrupar por numero do grupo mesmo quando a api devolver GRUPO1 ou GRUPO2', () => {
    const classificacaoServiceMock = createClassificacaoServiceMock(
      createClassificacaoPayload(1, ['GRUPO1', 'GRUPO2']),
    );

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoListagemService,
        { provide: ClassificacaoService, useValue: classificacaoServiceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoListagemService);

    service.carregar();

    expect(service.classificacaoGrupo1().length).toBe(3);
    expect(service.classificacaoGrupo2().length).toBe(3);
  });

  it('deve preencher erro quando a busca da classificacao falhar', () => {
    const classificacaoServiceMock: Pick<ClassificacaoService, 'getClassificacaoGeral'> = {
      getClassificacaoGeral: vi.fn().mockReturnValue(throwError(() => new Error('falha'))),
    };

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoListagemService,
        { provide: ClassificacaoService, useValue: classificacaoServiceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoListagemService);

    service.carregar();

    expect(service.erro()).toBe('Nao foi possivel carregar a classificacao no momento.');
    expect(service.classificacaoGeral()).toEqual([]);
    expect(service.faseAtual()).toBe('FASE_DE_GRUPOS');
  });
});

function createClassificacaoServiceMock(
  payload: GetClassificacaoDto[] = createClassificacaoPayload(),
): Pick<ClassificacaoService, 'getClassificacaoGeral'> {
  return {
    getClassificacaoGeral: vi.fn().mockReturnValue(of(payload)),
  };
}

function createClassificacaoPayload(
  jogosPorJogador = 1,
  grupos: [string, string] = ['GRUPO 1', 'GRUPO 2'],
): GetClassificacaoDto[] {
  const [grupo1, grupo2] = grupos;

  return [
    createClassificacaoItem({ grupo: grupo1, posicao: 1, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: grupo1, posicao: 2, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: grupo1, posicao: 3, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: grupo2, posicao: 1, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: grupo2, posicao: 2, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: grupo2, posicao: 3, jogos: jogosPorJogador }),
  ];
}

function createClassificacaoItem(
  overrides: Partial<GetClassificacaoDto> = {},
): GetClassificacaoDto {
  return {
    grupo: 'GRUPO 1',
    posicao: 1,
    jogador: faker.person.fullName(),
    jogos: faker.number.int({ min: 1, max: 4 }),
    vitorias: faker.number.int({ min: 0, max: 4 }),
    empates: faker.number.int({ min: 0, max: 4 }),
    derrotas: faker.number.int({ min: 0, max: 4 }),
    golsPositivo: faker.number.int({ min: 0, max: 20 }),
    golsContra: faker.number.int({ min: 0, max: 20 }),
    saldoGols: faker.number.int({ min: -20, max: 20 }),
    pontos: faker.number.int({ min: 0, max: 12 }),
    ...overrides,
  };
}
