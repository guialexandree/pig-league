import { TestBed } from '@angular/core/testing';
import { TierInfoComponent } from './tier-info.component';

describe(TierInfoComponent.name, () => {
  it('deve renderizar os tres cards de tier e a lista de regras', () => {
    TestBed.configureTestingModule({
      imports: [TierInfoComponent],
    });

    const fixture = TestBed.createComponent(TierInfoComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="tier-card-silver"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="tier-card-gold"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="tier-card-hero"]')).not.toBeNull();
    expect(root.querySelectorAll('[data-testid="tier-rules-list"] li').length).toBe(4);
    expect(root.textContent).toContain('0 - 109 XP');
    expect(root.textContent).toContain('110 - 169 XP');
    expect(root.textContent).toContain('170+ XP');
    expect(root.textContent).toContain('99/109 XP tier');
    expect(root.textContent).toContain('Vitória');
    expect(root.textContent).toContain('+18 XP');
    expect(root.textContent).toContain('Derrota +6 XP');
    expect(root.textContent).toContain('XP mínimo por partida: 6');
  });
});
