import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviLivraisonComponent } from './suivi-livraison.component';

describe('SuiviLivraisonComponent', () => {
  let component: SuiviLivraisonComponent;
  let fixture: ComponentFixture<SuiviLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviLivraisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
