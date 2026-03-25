import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTemplateComponent } from './section-template';

describe('SectionTemplateComponent', () => {
  let component: SectionTemplateComponent;
  let fixture: ComponentFixture<SectionTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionTemplateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('deve criar o SectionTemplateComponent', () => {
    expect(component).toBeTruthy();
  });
});
