import { TestBed } from '@angular/core/testing';

import { ScheduleCanActivateService } from './schedule-can-activate.service';

describe('ScheduleCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleCanActivateService = TestBed.get(ScheduleCanActivateService);
    expect(service).toBeTruthy();
  });
});
