import { TestBed } from '@angular/core/testing';

import { PannierService } from './pannier.service';

describe('PannierService', () => {
  let service: PannierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PannierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
