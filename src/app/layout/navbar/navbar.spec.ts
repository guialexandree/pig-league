import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavbarComponent } from './navbar';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve renderizar os 5 itens de menu obrigatorios', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-testid="menu-item"]');

    expect(component).toBeTruthy();
    expect(items.length).toBe(5);
    expect(items[0].textContent).toContain('Jogos');
    expect(items[1].textContent).toContain('Classificação');
    expect(items[2].textContent).toContain('Jogadores');
    expect(items[3].textContent).toContain('Regras');
    expect(items[4].textContent).toContain('Estatísticas');
  });

  it('deve usar imagem de controle como logo da navbar', () => {
    const logo = fixture.nativeElement.querySelector('.brand__crest') as HTMLImageElement | null;

    expect(logo).not.toBeNull();
    expect(logo?.getAttribute('src')).toBe('/assets/img/controle.png');
  });
});
