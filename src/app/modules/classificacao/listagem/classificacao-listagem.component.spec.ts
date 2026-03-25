import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { faker } from '@faker-js/faker';
import { NEVER, of } from 'rxjs';
import { ClassificacaoService } from '../../../data/classificacao/classificacao-service';
import { GetClassificacaoDto } from '../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoGrupoComponent } from './grupo/classificacao-grupo.component';
import { ClassificacaoListagemComponent } from './classificacao-listagem.component';

describe(ClassificacaoListagemComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve renderizar grupo 1, grupo 2 e geral com filtros iniciais corretos', () => {
    const serviceMock = createServiceMock();

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const grupos = fixture.debugElement.queryAll(By.directive(ClassificacaoGrupoComponent));

    expect(grupos.length).toBe(3);
    expect((grupos[0].componentInstance as ClassificacaoGrupoComponent).tituloGrupo).toBe('GRUPO 1');
    expect((grupos[0].componentInstance as ClassificacaoGrupoComponent).filtroInicial).toBe(1);
    expect((grupos[1].componentInstance as ClassificacaoGrupoComponent).tituloGrupo).toBe('GRUPO 2');
    expect((grupos[1].componentInstance as ClassificacaoGrupoComponent).filtroInicial).toBe(2);
    expect((grupos[2].componentInstance as ClassificacaoGrupoComponent).tituloGrupo).toBe('RESULTADO GERAL');
    expect((grupos[2].componentInstance as ClassificacaoGrupoComponent).filtroInicial).toBe('GERAL');
  });

  it('deve exibir fase regular uma unica vez na listagem', () => {
    const serviceMock = createServiceMock();

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const phaseLabels = root.querySelectorAll('[data-testid="phase-label"]');

    expect(phaseLabels.length).toBe(1);
    expect(phaseLabels[0]?.textContent?.trim()).toBe('Fase Regular');
  });

  it('deve exibir loader de tela enquanto houver grupos carregando', () => {
    const serviceMock: Pick<ClassificacaoService, 'getClassificacao'> = {
      getClassificacao: vi.fn().mockReturnValue(NEVER),
    };

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="classification-screen-loader"]')).not.toBeNull();
    expect(serviceMock.getClassificacao).toHaveBeenCalledTimes(3);
    expect(
      (root.querySelector('[data-testid="classification-loader-logo"]') as HTMLImageElement | null)?.getAttribute(
        'src',
      ),
    ).toBe('/assets/img/logo.png');
  });

  it('deve aplicar fallback de logo no loader quando houver erro de carregamento da imagem', () => {
    const serviceMock: Pick<ClassificacaoService, 'getClassificacao'> = {
      getClassificacao: vi.fn().mockReturnValue(NEVER),
    };

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const logo = root.querySelector('[data-testid="classification-loader-logo"]') as HTMLImageElement | null;

    expect(logo?.getAttribute('src')).toBe('/assets/img/logo.png');

    logo?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(logo?.getAttribute('src')).toBe('assets/img/logo.png');

    logo?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(logo?.getAttribute('src')).toBe('/browser/assets/img/logo.png');
  });

  it('deve ocultar loader de tela quando todos os grupos terminarem o carregamento', () => {
    const serviceMock = createServiceMock();

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="classification-screen-loader"]')).toBeNull();
  });
});

function configureModule(
  serviceMock: Pick<ClassificacaoService, 'getClassificacao'>,
): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [ClassificacaoListagemComponent],
    providers: [{ provide: ClassificacaoService, useValue: serviceMock }],
  });
}

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
      grupo: 'GERAL',
      posicao: 1,
      jogador: faker.person.fullName(),
      jogos: 1,
      vitorias: 1,
      empates: 0,
      derrotas: 0,
      golsPositivo: 2,
      golsContra: 0,
      saldoGols: 2,
      pontos: 3,
    },
  ];
}
