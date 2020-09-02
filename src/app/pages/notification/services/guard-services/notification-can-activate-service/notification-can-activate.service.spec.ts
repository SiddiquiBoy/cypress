import { TestBed } from '@angular/core/testing';

import { NotificationCanActivateService } from './notification-can-activate.service';

describe('NotificationCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationCanActivateService = TestBed.get(NotificationCanActivateService);
    expect(service).toBeTruthy();
  });
});
