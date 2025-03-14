import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpFormPageComponent } from './otp-form-page.component';

describe('OtpFormPageComponent', () => {
  let component: OtpFormPageComponent;
  let fixture: ComponentFixture<OtpFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
