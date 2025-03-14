import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarPannierComponent } from './side-bar-pannier.component';

describe('SideBarPannierComponent', () => {
  let component: SideBarPannierComponent;
  let fixture: ComponentFixture<SideBarPannierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarPannierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarPannierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
