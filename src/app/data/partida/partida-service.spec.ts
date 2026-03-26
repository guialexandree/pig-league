import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { GetPartidasDto, GetPartidasRealizadasDto } from './dto';
import {
  generateGetPartidasDto,
  generateGetPartidasRealizadasDto,
} from './mocks';
import { PartidaService } from './partida-service';

describe(PartidaService.name, () => {
  let service: PartidaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    faker.seed(20260325);
    TestBed.configureTestingModule({
      providers: [PartidaService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PartidaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve buscar partidas em /campeonato/partidas', () => {
    const response: GetPartidasDto[] = [
      generateGetPartidasDto(),
    ];

    let actual: GetPartidasDto[] | undefined;

    service.getPartidas().subscribe((payload) => {
      actual = payload;
    });

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/partidas'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(response);

    expect(actual).toEqual(response);
  });

  it('deve serializar grupoId quando filtro for informado', () => {
    const grupoId = faker.number.int({ min: 1, max: 2 });
    const response: GetPartidasDto[] = [];

    service.getPartidas({ grupoId }).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/partidas'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('grupoId')).toBe(String(grupoId));
    req.flush(response);
  });

  it('deve buscar partidas pendentes em /campeonato/partidas-pendentes', () => {
    const response: GetPartidasDto[] = [generateGetPartidasDto()];

    let actual: GetPartidasDto[] | undefined;

    service.getPartidasPendentes().subscribe((payload) => {
      actual = payload;
    });

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/partidas-pendentes'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(response);

    expect(actual).toEqual(response);
  });

  it('deve serializar grupoId ao buscar partidas pendentes com filtro', () => {
    const grupoId = faker.number.int({ min: 1, max: 2 });

    service.getPartidasPendentes({ grupoId }).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/partidas-pendentes'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('grupoId')).toBe(String(grupoId));
    req.flush([]);
  });

  it('deve buscar partidas realizadas em /campeonato/partidas-realizadas', () => {
    const response: GetPartidasRealizadasDto[] = [
      generateGetPartidasRealizadasDto(),
    ];

    let actual: GetPartidasRealizadasDto[] | undefined;

    service.getPartidasRealizadas().subscribe((payload) => {
      actual = payload;
    });

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/partidas-realizadas'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(response);

    expect(actual).toEqual(response);
  });

  it('deve serializar grupoId ao buscar partidas realizadas com filtro', () => {
    const grupoId = faker.number.int({ min: 1, max: 2 });

    service.getPartidasRealizadas({ grupoId }).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/campeonato/partidas-realizadas'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('grupoId')).toBe(String(grupoId));
    req.flush([]);
  });
});
