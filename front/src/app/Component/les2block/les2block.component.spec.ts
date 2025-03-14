import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Les2blockComponent } from './les2block.component';

describe('Les2blockComponent', () => {
  let component: Les2blockComponent;
  let fixture: ComponentFixture<Les2blockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Les2blockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Les2blockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
