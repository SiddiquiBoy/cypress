import { TestBed, async, inject } from '@angular/core/testing';

import { CustomerCanActivateGuard } from './customer-can-activate.guard';

describe('CustomerCanActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerCanActivateGuard]
    });
  });

  it('should ...', inject([CustomerCanActivateGuard], (guard: CustomerCanActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
