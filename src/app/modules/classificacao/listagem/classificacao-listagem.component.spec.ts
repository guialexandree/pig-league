import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { faker } from '@faker-js/faker';
import { NEVER, of } from 'rxjs';
import { ClassificacaoService } from '../../../data/classificacao/classificacao-service';
import { GetClassificacaoDto } from '../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoFaseStepComponent } from './fase-step/classificacao-fase-step.component';
import { ClassificacaoGrupoComponent } from './grupo/classificacao-grupo.component';
import { ClassificacaoListagemComponent } from './classificacao-listagem.component';

describe(ClassificacaoListagemComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve renderizar grupo 1, grupo 2 e resultado geral', () => {
    const classificacaoServiceMock = createClassificacaoServiceMock();

    configureModule(classificacaoServiceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const grupos = fixture.debugElement.queryAll(By.directive(ClassificacaoGrupoComponent));

    expect(grupos.length).toBe(3);
    expect((grupos[0].componentInstance as ClassificacaoGrupoComponent).tituloGrupo).toBe('GRUPO 1');
    expect((grupos[1].componentInstance as ClassificacaoGrupoComponent).tituloGrupo).toBe('GRUPO 2');
    expect((grupos[2].componentInstance as ClassificacaoGrupoComponent).tituloGrupo).toBe(
      'RESULTADO GERAL FASE DE GRUPOS',
    );
  });

  it('deve buscar classificacao geral apenas uma vez ao carregar a tela', () => {
    const classificacaoServiceMock = createClassificacaoServiceMock();

    configureModule(classificacaoServiceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    expect(classificacaoServiceMock.getClassificacaoGeral).toHaveBeenCalledTimes(1);
  });

  it('deve exibir o step com fase de grupos quando a etapa ainda nao estiver concluida', () => {
    const classificacaoServiceMock = createClassificacaoServiceMock(
      createClassificacaoPayload(1),
    );

    configureModule(classificacaoServiceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const step = fixture.debugElement.query(By.directive(ClassificacaoFaseStepComponent))
      .componentInstance as ClassificacaoFaseStepComponent;

    expect(step.faseAtual).toBe('FASE_DE_GRUPOS');
  });

  it('deve exibir o step com playoffs quando todos os grupos estiverem finalizados', () => {
    const classificacaoServiceMock = createClassificacaoServiceMock(
      createClassificacaoPayload(2),
    );

    configureModule(classificacaoServiceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const step = fixture.debugElement.query(By.directive(ClassificacaoFaseStepComponent))
      .componentInstance as ClassificacaoFaseStepComponent;

    expect(step.faseAtual).toBe('PLAYOFFS');
  });

  it('deve exibir loader de tela enquanto houver carregamento', () => {
    const classificacaoServiceMock: Pick<ClassificacaoService, 'getClassificacaoGeral'> = {
      getClassificacaoGeral: vi.fn().mockReturnValue(NEVER),
    };

    configureModule(classificacaoServiceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="classification-screen-loader"]')).not.toBeNull();
  });
});

function configureModule(
  classificacaoServiceMock: Pick<ClassificacaoService, 'getClassificacaoGeral'>,
): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [ClassificacaoListagemComponent],
    providers: [{ provide: ClassificacaoService, useValue: classificacaoServiceMock }],
  });
}

function createClassificacaoServiceMock(
  payload: GetClassificacaoDto[] = createClassificacaoPayload(),
): Pick<ClassificacaoService, 'getClassificacaoGeral'> {
  return {
    getClassificacaoGeral: vi.fn().mockReturnValue(of(payload)),
  };
}

function createClassificacaoPayload(jogosPorJogador = 1): GetClassificacaoDto[] {
  return [
    createClassificacaoItem({ grupo: 'GRUPO 1', posicao: 1, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: 'GRUPO 1', posicao: 2, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: 'GRUPO 1', posicao: 3, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: 'GRUPO 2', posicao: 1, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: 'GRUPO 2', posicao: 2, jogos: jogosPorJogador }),
    createClassificacaoItem({ grupo: 'GRUPO 2', posicao: 3, jogos: jogosPorJogador }),
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
