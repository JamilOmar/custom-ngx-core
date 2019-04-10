import { TestBed } from '@angular/core/testing';

import { AuthBaseService } from './auth.base.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthBaseService = TestBed.get(AuthBaseService);
    expect(service).toBeTruthy();
  });
});
