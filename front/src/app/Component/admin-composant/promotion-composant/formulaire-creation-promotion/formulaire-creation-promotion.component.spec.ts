import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireCreationPromotionComponent } from './formulaire-creation-promotion.component';

describe('FormulaireCreationPromotionComponent', () => {
  let component: FormulaireCreationPromotionComponent;
  let fixture: ComponentFixture<FormulaireCreationPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireCreationPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireCreationPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
