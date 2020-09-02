import { TestBed } from '@angular/core/testing';

import { CompanyCanActivateService } from './company-can-activate.service';

describe('CompanyCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyCanActivateService = TestBed.get(CompanyCanActivateService);
    expect(service).toBeTruthy();
  });
});
