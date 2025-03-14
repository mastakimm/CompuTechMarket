import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoriePageComponent } from './new-categorie-page.component';

describe('NewCategoriePageComponent', () => {
  let component: NewCategoriePageComponent;
  let fixture: ComponentFixture<NewCategoriePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCategoriePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCategoriePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
