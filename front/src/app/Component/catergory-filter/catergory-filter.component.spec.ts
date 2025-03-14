import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatergoryFilterComponent } from './catergory-filter.component';

describe('CatergoryFilterComponent', () => {
  let component: CatergoryFilterComponent;
  let fixture: ComponentFixture<CatergoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatergoryFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatergoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
