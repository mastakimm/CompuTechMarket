import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousCategoryPageComponent } from './sous-category-page.component';

describe('SousCategoryPageComponent', () => {
  let component: SousCategoryPageComponent;
  let fixture: ComponentFixture<SousCategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SousCategoryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousCategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
