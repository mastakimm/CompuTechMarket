import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrousselAccueilComponent } from './carroussel-accueil.component';

describe('CarrousselAccueilComponent', () => {
  let component: CarrousselAccueilComponent;
  let fixture: ComponentFixture<CarrousselAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrousselAccueilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrousselAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
