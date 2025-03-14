import { TestBed } from '@angular/core/testing';

import { CrudComponentService } from './crud-component.service';

describe('CRUDProductAdminService', () => {
  let service: CrudComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
