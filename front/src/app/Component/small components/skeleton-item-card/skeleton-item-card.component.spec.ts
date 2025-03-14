import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonItemCardComponent } from './skeleton-item-card.component';

describe('SkeletonItemCardComponent', () => {
  let component: SkeletonItemCardComponent;
  let fixture: ComponentFixture<SkeletonItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonItemCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
