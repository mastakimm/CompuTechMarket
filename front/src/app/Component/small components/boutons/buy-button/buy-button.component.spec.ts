import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyButtonComponent } from './buy-button.component';

describe('BuyButtonComponent', () => {
  let component: BuyButtonComponent;
  let fixture: ComponentFixture<BuyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
