import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodsManagementComponent } from './payment-methods-management.component';

describe('PaymentMethodsManagementComponent', () => {
  let component: PaymentMethodsManagementComponent;
  let fixture: ComponentFixture<PaymentMethodsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
