import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { GetClassificacaoDto } from './dto/get-classificacao.dto';

import { ClassificacaoService } from './classificacao-service';

describe(ClassificacaoService.name, () => {
  let service: ClassificacaoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    faker.seed(20260325);
    TestBed.configureTestingModule({
      providers: [
        ClassificacaoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ClassificacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve buscar classificacao em /campeonato/classificacao', () => {
    const response: GetClassificacaoDto[] = [
      {
        grupo: 'CAMPEONATO',
        posicao: 1,
        jogador: faker.person.fullName(),
        jogos: faker.number.int({ min: 0, max: 38 }),
        vitorias: faker.number.int({ min: 0, max: 38 }),
        empates: faker.number.int({ min: 0, max: 38 }),
        derrotas: faker.number.int({ min: 0, max: 38 }),
        golsPositivo: faker.number.int({ min: 0, max: 120 }),
        golsContra: faker.number.int({ min: 0, max: 120 }),
        saldoGols: faker.number.int({ min: -120, max: 120 }),
        pontos: faker.number.int({ min: 0, max: 114 }),
      },
    ];

    let actual: GetClassificacaoDto[] | undefined;

    service.getClassificacao().subscribe((payload) => {
      actual = payload;
    });

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/classificacao'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(response);

    expect(actual).toEqual(response);
  });

  it('deve serializar grupoId quando filtro for informado', () => {
    const grupoId = faker.number.int({ min: 1, max: 2 });
    const response: GetClassificacaoDto[] = [];

    service.getClassificacao({ grupoId }).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/classificacao'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('grupoId')).toBe(String(grupoId));
    req.flush(response);
  });

  it('deve buscar classificacao geral em /campeonato/classificacao/geral', () => {
    const response: GetClassificacaoDto[] = [];

    let actual: GetClassificacaoDto[] | undefined;

    service.getClassificacaoGeral().subscribe((payload) => {
      actual = payload;
    });

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/classificacao/geral'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(response);

    expect(actual).toEqual(response);
  });

  it('deve serializar grupoId na classificacao geral quando filtro for informado', () => {
    const grupoId = faker.number.int({ min: 1, max: 2 });
    const response: GetClassificacaoDto[] = [];

    service.getClassificacaoGeral({ grupoId }).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/classificacao/geral'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('grupoId')).toBe(String(grupoId));
    req.flush(response);
  });
});
