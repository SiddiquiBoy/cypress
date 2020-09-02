import { TestBed, async, inject } from '@angular/core/testing';

import { ProjectCanActivateGuard } from './project-can-activate.guard';

describe('ProjectCanActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectCanActivateGuard]
    });
  });

  it('should ...', inject([ProjectCanActivateGuard], (guard: ProjectCanActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
