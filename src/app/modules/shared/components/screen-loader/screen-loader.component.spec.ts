import { TestBed } from '@angular/core/testing';
import { ScreenLoaderComponent } from './screen-loader.component';

describe(ScreenLoaderComponent.name, () => {
  it('deve permanecer oculto quando visible for false', () => {
    TestBed.configureTestingModule({
      imports: [ScreenLoaderComponent],
    });

    const fixture = TestBed.createComponent(ScreenLoaderComponent);
    fixture.componentRef.setInput('testIdPrefix', 'classification');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="classification-screen-loader"]')).toBeNull();
  });

  it('deve renderizar mensagem e atributos de acessibilidade quando visivel', () => {
    TestBed.configureTestingModule({
      imports: [ScreenLoaderComponent],
    });

    const fixture = TestBed.createComponent(ScreenLoaderComponent);
    fixture.componentRef.setInput('testIdPrefix', 'classification');
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('message', 'Carregando classificacoes...');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const loader = root.querySelector('[data-testid="classification-screen-loader"]');
    const label = root.querySelector('[data-testid="classification-loader-label"]');
    const progress = root.querySelector('[data-testid="classification-loader-progress"]');
    const progressBar = root.querySelector('[data-testid="classification-loader-progress-bar"]');

    expect(loader?.getAttribute('aria-live')).toBe('polite');
    expect(loader?.getAttribute('aria-busy')).toBe('true');
    expect(label?.textContent?.trim()).toBe('Carregando classificacoes...');
    expect(progress).not.toBeNull();
    expect(progressBar).not.toBeNull();
  });

  it('deve aplicar fallback de logo quando ocorrer erro de carregamento', () => {
    TestBed.configureTestingModule({
      imports: [ScreenLoaderComponent],
    });

    const fixture = TestBed.createComponent(ScreenLoaderComponent);
    fixture.componentRef.setInput('testIdPrefix', 'classification');
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('logoSources', ['primary.png', 'fallback.png']);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const logo = root.querySelector('[data-testid="classification-loader-logo"]') as HTMLImageElement | null;

    expect(logo?.getAttribute('src')).toBe('primary.png');

    logo?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(logo?.getAttribute('src')).toBe('fallback.png');
  });
});
