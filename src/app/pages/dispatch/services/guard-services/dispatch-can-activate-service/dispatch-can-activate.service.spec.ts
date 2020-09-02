import { TestBed } from '@angular/core/testing';

import { DispatchCanActivateService } from './dispatch-can-activate.service';

describe('DispatchCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DispatchCanActivateService = TestBed.get(DispatchCanActivateService);
    expect(service).toBeTruthy();
  });
});
