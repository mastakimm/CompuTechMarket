import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierPageComponent } from './panier-page.component';

describe('PanierPageComponent', () => {
  let component: PanierPageComponent;
  let fixture: ComponentFixture<PanierPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanierPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanierPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
