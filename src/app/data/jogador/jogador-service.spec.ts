import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { GetJogadoresDto, JogadorTierEnum } from './dto';
import { JogadorService } from './jogador-service';

describe(JogadorService.name, () => {
  let service: JogadorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    faker.seed(20260325);
    TestBed.configureTestingModule({
      providers: [JogadorService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(JogadorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve buscar jogadores em /campeonato/jogadores', () => {
    const response: GetJogadoresDto = {
      grupo: 'CAMPEONATO',
      atualizadoEm: faker.date.recent().toISOString(),
      jogadores: [
        {
          id: 1,
          nome: faker.person.fullName(),
          gols: faker.number.int({ min: 0, max: 50 }),
          partidas: faker.number.int({ min: 0, max: 30 }),
          vitorias: faker.number.int({ min: 0, max: 30 }),
          percentualVitoria: faker.number.float({
            min: 0,
            max: 100,
            fractionDigits: 2,
          }),
          xp: 73,
          tier: JogadorTierEnum.Silver,
          xpAtualNoTier: 73,
          xpNecessarioProximoTier: 110,
          progressoProximoTierPercentual: 66.36,
        },
        {
          id: 2,
          nome: faker.person.fullName(),
          gols: faker.number.int({ min: 0, max: 50 }),
          partidas: faker.number.int({ min: 0, max: 30 }),
          vitorias: faker.number.int({ min: 0, max: 30 }),
          percentualVitoria: faker.number.float({
            min: 0,
            max: 100,
            fractionDigits: 2,
          }),
          xp: 126,
          tier: JogadorTierEnum.Gold,
          xpAtualNoTier: 16,
          xpNecessarioProximoTier: 60,
          progressoProximoTierPercentual: 26.67,
        },
      ],
    };

    let actual: GetJogadoresDto | undefined;

    service.getJogadores().subscribe((payload) => {
      actual = payload;
    });

    const req = httpMock.expectOne('/campeonato/jogadores');
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(actual).toEqual(response);
  });
});
