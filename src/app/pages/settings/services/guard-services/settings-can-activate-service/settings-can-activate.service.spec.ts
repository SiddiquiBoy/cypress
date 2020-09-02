import { TestBed } from '@angular/core/testing';

import { SettingsCanActivateService } from './settings-can-activate.service';

describe('SettingsCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsCanActivateService = TestBed.get(SettingsCanActivateService);
    expect(service).toBeTruthy();
  });
});
