import { TestBed } from '@angular/core/testing';

import { ReportCanActivateService } from './report-can-activate.service';

describe('ReportCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportCanActivateService = TestBed.get(ReportCanActivateService);
    expect(service).toBeTruthy();
  });
});
