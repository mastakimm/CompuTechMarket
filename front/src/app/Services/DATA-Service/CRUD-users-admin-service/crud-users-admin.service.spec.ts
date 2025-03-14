import { TestBed } from '@angular/core/testing';

import { CRUDUsersAdminService } from './crud-users-admin.service';

describe('CRUDUsersAdminService', () => {
  let service: CRUDUsersAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CRUDUsersAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
