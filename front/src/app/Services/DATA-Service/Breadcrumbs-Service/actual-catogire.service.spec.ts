import { TestBed } from '@angular/core/testing';

import { ActualCatogireService } from './actual-catogire.service';

describe('ActualCatogireService', () => {
  let service: ActualCatogireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualCatogireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
