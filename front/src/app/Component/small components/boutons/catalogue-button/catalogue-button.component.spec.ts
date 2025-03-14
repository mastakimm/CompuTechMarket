import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueButtonComponent } from './catalogue-button.component';

describe('CatalogueButtonComponent', () => {
  let component: CatalogueButtonComponent;
  let fixture: ComponentFixture<CatalogueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
