import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductPageComponent } from './new-product-page.component';

describe('NewComponentPageComponent', () => {
  let component: NewProductPageComponent;
  let fixture: ComponentFixture<NewProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
