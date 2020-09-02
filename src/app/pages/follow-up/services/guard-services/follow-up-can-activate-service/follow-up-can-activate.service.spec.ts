import { TestBed } from '@angular/core/testing';

import { FollowUpCanActivateService } from './follow-up-can-activate.service';

describe('FollowUpCanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FollowUpCanActivateService = TestBed.get(FollowUpCanActivateService);
    expect(service).toBeTruthy();
  });
});
