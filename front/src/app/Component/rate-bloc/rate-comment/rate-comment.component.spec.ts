import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCommentComponent } from './rate-comment.component';

describe('RateCommentComponent', () => {
  let component: RateCommentComponent;
  let fixture: ComponentFixture<RateCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
