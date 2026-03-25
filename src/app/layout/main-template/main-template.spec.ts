import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainTemplateComponent } from './main-template';

describe('MainTemplateComponent', () => {
  let component: MainTemplateComponent;
  let fixture: ComponentFixture<MainTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainTemplateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('deve renderizar o navbar e um router-outlet no shell', () => {
    const navbar = fixture.nativeElement.querySelector('app-navbar');
    const outlet = fixture.nativeElement.querySelector('router-outlet');

    expect(component).toBeTruthy();
    expect(navbar).toBeTruthy();
    expect(outlet).toBeTruthy();
  });
});
