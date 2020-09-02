import { TestBed } from '@angular/core/testing';

import { MainUiService } from './main-ui.service';

describe('MainUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainUiService = TestBed.get(MainUiService);
    expect(service).toBeTruthy();
  });
});
