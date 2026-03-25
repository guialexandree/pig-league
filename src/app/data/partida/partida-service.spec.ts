import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { GetPartidasDto } from './dto/get-partidas.dto';
import { PartidaStatusEnum } from './dto/partida-status.enum';
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
      {
        grupo: 'GRUPO 1',
        dataHora: faker.date.soon().toISOString(),
        mandante: faker.person.fullName(),
        golsMandante: faker.number.int({ min: 0, max: 7 }),
        golsVisitante: faker.number.int({ min: 0, max: 7 }),
        visitante: faker.person.fullName(),
        status: PartidaStatusEnum.REALIZADA,
      },
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
});
