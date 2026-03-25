import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { ClassificacaoStatusFaseEnum } from '../../../../data/classificacao/dto/classificacao-status-fase.enum';
import { GetClassificacaoDto } from '../../../../data/classificacao/dto/get-classificacao.dto';
import { ClassificacaoGrupoComponent } from './classificacao-grupo.component';

describe(ClassificacaoGrupoComponent.name, () => {
  beforeEach(() => {
    faker.seed(20260325);
  });

  it('deve renderizar o titulo e os itens recebidos via input sem label de fase fora dos playoffs', () => {
    TestBed.configureTestingModule({
      imports: [ClassificacaoGrupoComponent],
    });

    const fixture = TestBed.createComponent(ClassificacaoGrupoComponent);
    fixture.componentRef.setInput('tituloGrupo', 'GRUPO 1');
    fixture.componentRef.setInput('carregando', false);
    fixture.componentRef.setInput('classificacao', createPayload());
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="group-title"]')?.textContent?.trim()).toBe('GRUPO 1');
    expect(root.querySelectorAll('.classification-row').length).toBe(1);
    expect(root.querySelector('[data-testid="phase-status"]')).toBeNull();
    expect(root.querySelector('[data-testid="classification-legend"]')?.textContent).toContain('Playoffs');
    expect(root.querySelector('[data-testid="classification-legend"]')?.textContent).toContain(
      'Desclassificado',
    );
  });

  it('deve exibir label de fase e classes de borda quando a fase estiver em playoffs', () => {
    TestBed.configureTestingModule({
      imports: [ClassificacaoGrupoComponent],
    });

    const fixture = TestBed.createComponent(ClassificacaoGrupoComponent);
    fixture.componentRef.setInput('tituloGrupo', 'GRUPO 1');
    fixture.componentRef.setInput('carregando', false);
    fixture.componentRef.setInput('faseAtual', 'PLAYOFFS');
    fixture.componentRef.setInput('classificacao', createPayloadPlayoffs());
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const rows = root.querySelectorAll('.classification-row');

    expect(root.querySelectorAll('[data-testid="phase-status"]').length).toBe(2);
    expect(root.querySelector('[data-testid="phase-status"]')?.textContent?.trim()).toBe('Classificado');
    expect(rows[0].classList.contains('classification-row--classified')).toBe(true);
    expect(rows[1].classList.contains('classification-row--eliminated')).toBe(true);
  });

  it('deve emitir recarregar quando clicar em tentar novamente', () => {
    TestBed.configureTestingModule({
      imports: [ClassificacaoGrupoComponent],
    });

    const fixture = TestBed.createComponent(ClassificacaoGrupoComponent);
    const component = fixture.componentInstance;
    const recarregarSpy = vi.fn();

    component.recarregar.subscribe(recarregarSpy);

    fixture.componentRef.setInput('tituloGrupo', 'GRUPO 2');
    fixture.componentRef.setInput('carregando', false);
    fixture.componentRef.setInput('classificacao', []);
    fixture.componentRef.setInput('erro', 'Erro de teste');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const retryButton = root.querySelector('[data-testid="retry-load-button"]') as HTMLButtonElement;

    retryButton.click();

    expect(recarregarSpy).toHaveBeenCalledTimes(1);
  });
});

function createPayload(): GetClassificacaoDto[] {
  return [
    {
      grupo: 'GRUPO 1',
      posicao: 1,
      statusFase: ClassificacaoStatusFaseEnum.CLASSIFICADO,
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

function createPayloadPlayoffs(): GetClassificacaoDto[] {
  const [base] = createPayload();

  return [
    {
      ...base,
      statusFase: ClassificacaoStatusFaseEnum.CLASSIFICADO,
    },
    {
      ...base,
      posicao: 2,
      jogador: faker.person.fullName(),
      statusFase: ClassificacaoStatusFaseEnum.DESCLASSIFICADO,
    },
  ];
}
