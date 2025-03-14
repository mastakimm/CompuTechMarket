import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLogComponent } from './form-log.component';

describe('FormLogComponent', () => {
  let component: FormLogComponent;
  let fixture: ComponentFixture<FormLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
