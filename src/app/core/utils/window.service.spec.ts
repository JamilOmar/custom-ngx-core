import { TestBed } from '@angular/core/testing';

import { WindowService } from './window.service';

describe('Windows.UtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WindowService = TestBed.get(WindowService);
    expect(service).toBeTruthy();
  });
});
