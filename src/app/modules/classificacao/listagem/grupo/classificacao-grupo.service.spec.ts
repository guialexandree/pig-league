import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { ClassificacaoService } from '../../../../data/classificacao/classificacao-service';
import { GetClassificacaoDto } from '../../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoGrupoService } from './classificacao-grupo.service';

describe(ClassificacaoGrupoService.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve buscar classificacao geral sem filtros na API', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoGrupoService,
        { provide: ClassificacaoService, useValue: serviceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoGrupoService);

    service.carregarClassificacao('GERAL');

    expect(serviceMock.getClassificacao).toHaveBeenCalledWith(undefined);
  });

  it('deve enviar grupoId quando filtro for numerico', () => {
    const serviceMock = createServiceMock();

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoGrupoService,
        { provide: ClassificacaoService, useValue: serviceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoGrupoService);

    service.carregarClassificacao(2);

    expect(serviceMock.getClassificacao).toHaveBeenCalledWith({ grupoId: 2 });
  });

  it('deve ordenar classificacao por posicao', () => {
    const payload: GetClassificacaoDto[] = [
      { ...createItem(), posicao: 2 },
      { ...createItem(), posicao: 1 },
    ];

    const serviceMock = createServiceMock(payload);

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoGrupoService,
        { provide: ClassificacaoService, useValue: serviceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoGrupoService);

    service.carregarClassificacao('GERAL');

    expect(service.classificacao().map((item) => item.posicao)).toEqual([1, 2]);
  });

  it('deve preencher mensagem de erro quando API falhar', () => {
    const serviceMock: Pick<ClassificacaoService, 'getClassificacao'> = {
      getClassificacao: vi.fn().mockReturnValue(throwError(() => new Error('falha'))),
    };

    TestBed.configureTestingModule({
      providers: [
        ClassificacaoGrupoService,
        { provide: ClassificacaoService, useValue: serviceMock },
      ],
    });

    const service = TestBed.inject(ClassificacaoGrupoService);

    service.carregarClassificacao(1);

    expect(service.erro()).toBe('Nao foi possivel carregar a classificacao no momento.');
    expect(service.classificacao().length).toBe(0);
  });
});

function createServiceMock(
  payload: GetClassificacaoDto[] = [createItem()],
): Pick<ClassificacaoService, 'getClassificacao'> {
  return {
    getClassificacao: vi.fn().mockReturnValue(of(payload)),
  };
}

function createItem(): GetClassificacaoDto {
  return {
    grupo: 'GRUPO 1',
    posicao: 1,
    jogador: faker.person.fullName(),
    jogos: 3,
    vitorias: 3,
    empates: 0,
    derrotas: 0,
    golsPositivo: 26,
    golsContra: 9,
    saldoGols: 17,
    pontos: 9,
  };
}
