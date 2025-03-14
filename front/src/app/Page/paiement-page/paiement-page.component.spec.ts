import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementPageComponent } from './paiement-page.component';

describe('PaiementPageComponent', () => {
  let component: PaiementPageComponent;
  let fixture: ComponentFixture<PaiementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
