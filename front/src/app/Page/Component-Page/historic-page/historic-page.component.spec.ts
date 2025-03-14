import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricPageComponent } from './historic-page.component';

describe('HistoricPageComponent', () => {
  let component: HistoricPageComponent;
  let fixture: ComponentFixture<HistoricPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
