import { TestBed } from '@angular/core/testing';

import { CategoryBreadcrumbService } from './breadcrumb.service';

describe('CategoryBreadcrumbService', () => {
  let service: CategoryBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
