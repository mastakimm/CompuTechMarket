import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateBlocComponent } from './rate-bloc.component';

describe('RateBlocComponent', () => {
  let component: RateBlocComponent;
  let fixture: ComponentFixture<RateBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateBlocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
