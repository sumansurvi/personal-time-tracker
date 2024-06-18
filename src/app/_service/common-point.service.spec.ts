import { TestBed } from '@angular/core/testing';

import { CommonPointService } from './common-point.service';

describe('CommonPointService', () => {
  let service: CommonPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
