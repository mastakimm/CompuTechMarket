import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailButtonComponent } from './product-detail-button.component';

describe('ProductDetailButtonComponent', () => {
  let component: ProductDetailButtonComponent;
  let fixture: ComponentFixture<ProductDetailButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
