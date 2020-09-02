import { TestBed } from '@angular/core/testing';

import { GeneralCalendarService } from './general-calendar.service';

describe('GeneralCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralCalendarService = TestBed.get(GeneralCalendarService);
    expect(service).toBeTruthy();
  });
});
