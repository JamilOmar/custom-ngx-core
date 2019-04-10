import { TestBed } from '@angular/core/testing';

import { AuthWebService } from './auth.web.service';

describe('Auth.WebService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthWebService = TestBed.get(AuthWebService);
    expect(service).toBeTruthy();
  });
});
