import { TestBed } from '@angular/core/testing';
import { ClassificacaoFaseStepComponent } from './classificacao-fase-step.component';

describe(ClassificacaoFaseStepComponent.name, () => {
  it('deve destacar fase de grupos como ativa por padrao', () => {
    TestBed.configureTestingModule({
      imports: [ClassificacaoFaseStepComponent],
    });

    const fixture = TestBed.createComponent(ClassificacaoFaseStepComponent);
    fixture.componentRef.setInput('faseAtual', 'FASE_DE_GRUPOS');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const grupos = root.querySelector('[data-testid="fase-step-grupos"]');
    const playoffs = root.querySelector('[data-testid="fase-step-playoffs"]');

    expect(grupos?.classList.contains('is-active')).toBe(true);
    expect(playoffs?.classList.contains('is-upcoming')).toBe(true);
  });

  it('deve destacar playoffs como etapa ativa quando faseAtual for playoffs', () => {
    TestBed.configureTestingModule({
      imports: [ClassificacaoFaseStepComponent],
    });

    const fixture = TestBed.createComponent(ClassificacaoFaseStepComponent);
    fixture.componentRef.setInput('faseAtual', 'PLAYOFFS');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const grupos = root.querySelector('[data-testid="fase-step-grupos"]');
    const playoffs = root.querySelector('[data-testid="fase-step-playoffs"]');

    expect(grupos?.classList.contains('is-complete')).toBe(true);
    expect(playoffs?.classList.contains('is-active')).toBe(true);
  });
});
