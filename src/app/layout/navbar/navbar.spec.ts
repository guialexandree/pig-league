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
    await fixture.whenStable();
  });

  it('deve renderizar os 4 itens de menu obrigatorios', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-testid="menu-item"]');

    expect(component).toBeTruthy();
    expect(items.length).toBe(4);
    expect(items[0].textContent).toContain('Partidas');
    expect(items[1].textContent).toContain('Classificacao');
    expect(items[2].textContent).toContain('Jogadores');
    expect(items[3].textContent).toContain('Estatisticas');
  });
});
