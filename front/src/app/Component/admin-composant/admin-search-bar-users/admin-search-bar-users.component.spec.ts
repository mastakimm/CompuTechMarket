import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSearchBarUsersComponent } from './admin-search-bar-users.component';

describe('AdminSearchBarUsersComponent', () => {
  let component: AdminSearchBarUsersComponent;
  let fixture: ComponentFixture<AdminSearchBarUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSearchBarUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSearchBarUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
