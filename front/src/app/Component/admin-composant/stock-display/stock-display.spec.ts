import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDisplay } from './stock-display';

describe('StockManagementComponent', () => {
  let component: StockDisplay;
  let fixture: ComponentFixture<StockDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
