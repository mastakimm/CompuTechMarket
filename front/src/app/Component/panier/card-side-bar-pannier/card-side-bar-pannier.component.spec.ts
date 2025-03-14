import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSideBarPannierComponent } from './card-side-bar-pannier.component';

describe('CardSideBarPannierComponent', () => {
  let component: CardSideBarPannierComponent;
  let fixture: ComponentFixture<CardSideBarPannierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSideBarPannierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSideBarPannierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
