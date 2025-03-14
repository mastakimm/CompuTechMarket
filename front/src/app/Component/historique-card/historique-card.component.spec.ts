import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueCardComponent } from './historique-card.component';

describe('HistoriqueCardComponent', () => {
  let component: HistoriqueCardComponent;
  let fixture: ComponentFixture<HistoriqueCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
