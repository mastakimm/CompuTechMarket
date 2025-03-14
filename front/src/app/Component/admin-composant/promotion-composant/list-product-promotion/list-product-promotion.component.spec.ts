import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductPromotionComponent } from './list-product-promotion.component';

describe('ListProductPromotionComponent', () => {
  let component: ListProductPromotionComponent;
  let fixture: ComponentFixture<ListProductPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProductPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProductPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
