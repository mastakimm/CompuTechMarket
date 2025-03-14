import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousCategoryCardComponent } from './sous-category-card.component';

describe('SousCategoryCardComponent', () => {
  let component: SousCategoryCardComponent;
  let fixture: ComponentFixture<SousCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SousCategoryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
