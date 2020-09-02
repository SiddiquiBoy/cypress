import { TestBed } from '@angular/core/testing';

import { RegisterCanActivateService } from './register-can-activate.service';

describe('RegisterCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisterCanActivateService = TestBed.get(RegisterCanActivateService);
    expect(service).toBeTruthy();
  });
});
