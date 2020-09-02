import { TestBed } from '@angular/core/testing';

import { PriceBookCanActivateService } from './price-book-can-activate.service';

describe('PriceBookCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceBookCanActivateService = TestBed.get(PriceBookCanActivateService);
    expect(service).toBeTruthy();
  });
});
