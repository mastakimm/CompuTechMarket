import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationCommandePageComponent } from './information-commande-page.component';

describe('InformationCommandePageComponent', () => {
  let component: InformationCommandePageComponent;
  let fixture: ComponentFixture<InformationCommandePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationCommandePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationCommandePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
