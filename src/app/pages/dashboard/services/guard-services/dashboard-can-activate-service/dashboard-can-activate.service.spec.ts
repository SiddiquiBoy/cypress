import { TestBed } from '@angular/core/testing';

import { DashboardCanActivateService } from './dashboard-can-activate.service';

describe('DashboardCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardCanActivateService = TestBed.get(DashboardCanActivateService);
    expect(service).toBeTruthy();
  });
});
