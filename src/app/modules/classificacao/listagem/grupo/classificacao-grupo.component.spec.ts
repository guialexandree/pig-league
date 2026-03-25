import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { ClassificacaoService } from '../../../../data/classificacao/classificacao-service';
import { GetClassificacaoDto } from '../../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoGrupoComponent } from './classificacao-grupo.component';

describe(ClassificacaoGrupoComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve carregar classificacao usando filtro inicial informado', () => {
    const serviceMock = createServiceMock();

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoGrupoComponent);
    fixture.componentRef.setInput('tituloGrupo', 'GRUPO 1');
    fixture.componentRef.setInput('filtroInicial', 1);
    fixture.detectChanges();

    expect(serviceMock.getClassificacao).toHaveBeenCalledTimes(1);
    expect(serviceMock.getClassificacao).toHaveBeenCalledWith({ grupoId: 1 });
  });

  it('deve renderizar o titulo do grupo', () => {
    const serviceMock = createServiceMock();

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoGrupoComponent);
    fixture.componentRef.setInput('tituloGrupo', 'GERAL');
    fixture.componentRef.setInput('filtroInicial', 'GERAL');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="group-title"]')?.textContent?.trim()).toBe('GERAL');
  });

  it('deve permitir tentar novamente quando ocorrer erro', () => {
    const payload = createPayload();
    const serviceMock: Pick<ClassificacaoService, 'getClassificacao'> = {
      getClassificacao: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('falha de rede')))
        .mockReturnValueOnce(of(payload)),
    };

    configureModule(serviceMock);

    const fixture = TestBed.createComponent(ClassificacaoGrupoComponent);
    fixture.componentRef.setInput('tituloGrupo', 'GRUPO 2');
    fixture.componentRef.setInput('filtroInicial', 2);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const retryButton = root.querySelector('[data-testid="retry-load-button"]') as HTMLButtonElement;

    expect(root.querySelector('[data-testid="error-state"]')).not.toBeNull();

    retryButton.click();
    fixture.detectChanges();

    expect(serviceMock.getClassificacao).toHaveBeenCalledTimes(2);
    expect(root.querySelector('[data-testid="error-state"]')).toBeNull();
  });
});

function configureModule(
  serviceMock: Pick<ClassificacaoService, 'getClassificacao'>,
): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [ClassificacaoGrupoComponent],
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
    },
  ];
}
