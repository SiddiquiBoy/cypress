import { TestBed } from '@angular/core/testing';

import { LoginCanActivateService } from './login-can-activate.service';

describe('LoginCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginCanActivateService = TestBed.get(LoginCanActivateService);
    expect(service).toBeTruthy();
  });
});
