import { TestBed } from '@angular/core/testing';
import { RegrasListagemComponent } from './regras-listagem.component';

describe(RegrasListagemComponent.name, () => {
  it('deve renderizar cabecalho da pagina de regulamento', () => {
    TestBed.configureTestingModule({
      imports: [RegrasListagemComponent],
    });

    const fixture = TestBed.createComponent(RegrasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.rules-hero__eyebrow')?.textContent?.trim()).toBe('REGULAMENTO');
    expect(root.querySelector('.rules-hero__title')?.textContent?.trim()).toBe('REGRAS DO CAMPEONATO');
  });

  it('deve listar os principais blocos do regulamento', () => {
    TestBed.configureTestingModule({
      imports: [RegrasListagemComponent],
    });

    const fixture = TestBed.createComponent(RegrasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const sectionTitles = Array.from(root.querySelectorAll('[data-testid="rules-section-title"]')).map(
      (node) => node.textContent?.trim(),
    );

    expect(sectionTitles).toContain('Formato da competicao');
    expect(sectionTitles).toContain('Criterios de classificacao');
    expect(sectionTitles).toContain('Classificacao para o mata-mata');
    expect(sectionTitles).toContain('Envio de resultados');
  });

  it('deve exibir os cruzamentos das quartas de final', () => {
    TestBed.configureTestingModule({
      imports: [RegrasListagemComponent],
    });

    const fixture = TestBed.createComponent(RegrasListagemComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const crossItems = Array.from(root.querySelectorAll('[data-testid="cross-item"]')).map((node) =>
      node.textContent?.trim(),
    );

    expect(crossItems).toEqual([
      '1o Grupo 1 x 4o Grupo 2',
      '2o Grupo 1 x 3o Grupo 2',
      '1o Grupo 2 x 4o Grupo 1',
      '2o Grupo 2 x 3o Grupo 1',
    ]);
  });
});
