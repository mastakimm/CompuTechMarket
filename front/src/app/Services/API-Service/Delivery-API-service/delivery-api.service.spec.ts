import { TestBed } from '@angular/core/testing';

import { DeliveryApiService } from './delivery-api.service';

describe('DeliveryApiService', () => {
  let service: DeliveryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
