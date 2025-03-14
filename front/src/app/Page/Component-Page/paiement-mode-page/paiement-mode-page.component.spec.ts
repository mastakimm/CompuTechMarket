import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementModePageComponent } from './paiement-mode-page.component';

describe('PaiementModePageComponent', () => {
  let component: PaiementModePageComponent;
  let fixture: ComponentFixture<PaiementModePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementModePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementModePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
