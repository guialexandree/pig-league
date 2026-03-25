import { TestBed } from '@angular/core/testing';
import { ListagemHeaderComponent } from './listagem-header.component';

describe(ListagemHeaderComponent.name, () => {
  it('deve renderizar eyebrow e titulo recebidos via input', () => {
    TestBed.configureTestingModule({
      imports: [ListagemHeaderComponent],
    });

    const fixture = TestBed.createComponent(ListagemHeaderComponent);
    fixture.componentRef.setInput('testIdPrefix', 'players');
    fixture.componentRef.setInput('eyebrow', 'PLAYERS');
    fixture.componentRef.setInput('title', 'JOGADORES');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="players-hero-eyebrow"]')?.textContent?.trim()).toBe('PLAYERS');
    expect(root.querySelector('[data-testid="players-hero-title"]')?.textContent?.trim()).toBe('JOGADORES');
  });

  it('deve ocultar logo quando showLogo for false', () => {
    TestBed.configureTestingModule({
      imports: [ListagemHeaderComponent],
    });

    const fixture = TestBed.createComponent(ListagemHeaderComponent);
    fixture.componentRef.setInput('testIdPrefix', 'players');
    fixture.componentRef.setInput('showLogo', false);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="players-hero-logo"]')).toBeNull();
  });

  it('deve aplicar fallback de logo quando ocorrer erro de carregamento', () => {
    TestBed.configureTestingModule({
      imports: [ListagemHeaderComponent],
    });

    const fixture = TestBed.createComponent(ListagemHeaderComponent);
    fixture.componentRef.setInput('testIdPrefix', 'players');
    fixture.componentRef.setInput('logoSources', ['primary.png', 'fallback.png']);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const logo = root.querySelector('[data-testid="players-hero-logo"]') as HTMLImageElement | null;

    expect(logo?.getAttribute('src')).toBe('primary.png');

    logo?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(logo?.getAttribute('src')).toBe('fallback.png');
  });
});
