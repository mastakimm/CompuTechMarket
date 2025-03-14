import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSearchBarProductComponent } from './admin-search-bar-product.component';

describe('AdminSearchBarComponent', () => {
  let component: AdminSearchBarProductComponent;
  let fixture: ComponentFixture<AdminSearchBarProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSearchBarProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSearchBarProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
