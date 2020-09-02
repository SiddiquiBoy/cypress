import { TestBed } from '@angular/core/testing';

import { MainCanActivateService } from './main-can-activate.service';

describe('MainCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainCanActivateService = TestBed.get(MainCanActivateService);
    expect(service).toBeTruthy();
  });
});
