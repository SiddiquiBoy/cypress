import { TestBed } from '@angular/core/testing';

import { CallCanActivateService } from './call-can-activate.service';

describe('CallCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallCanActivateService = TestBed.get(CallCanActivateService);
    expect(service).toBeTruthy();
  });
});
