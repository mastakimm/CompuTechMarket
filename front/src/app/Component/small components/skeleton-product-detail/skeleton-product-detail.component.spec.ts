import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonProductDetailComponent } from './skeleton-product-detail.component';

describe('SkeletonProductDetailComponent', () => {
  let component: SkeletonProductDetailComponent;
  let fixture: ComponentFixture<SkeletonProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonProductDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
