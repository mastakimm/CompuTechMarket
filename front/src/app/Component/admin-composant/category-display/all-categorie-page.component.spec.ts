import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategoriePageComponent } from './all-categorie-page.component';

describe('AllCategoriePageComponent', () => {
  let component: AllCategoriePageComponent;
  let fixture: ComponentFixture<AllCategoriePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCategoriePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCategoriePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
