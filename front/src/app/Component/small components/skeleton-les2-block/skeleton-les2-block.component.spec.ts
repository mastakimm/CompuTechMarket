import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonLes2BlockComponent } from './skeleton-les2-block.component';

describe('SkeletonLes2BlockComponent', () => {
  let component: SkeletonLes2BlockComponent;
  let fixture: ComponentFixture<SkeletonLes2BlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLes2BlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonLes2BlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
