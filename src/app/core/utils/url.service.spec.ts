import { TestBed } from '@angular/core/testing';

import { UrlService } from './url.service';

describe('Url.UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlService
      ]
    });
  });

  it('should be created', () => {
    const urlService: UrlService = TestBed.get(UrlService);
    expect(urlService).toBeTruthy();
  });

  it('should be created and join urls', () => {
    const urlService: UrlService = TestBed.get(UrlService);
    const result = urlService.joinUrl('http://localhost' , 'facility')
    expect(result).toBe('http://localhost/facility');
  });
  it('should be created and join urls with /', () => {
    const urlService: UrlService = TestBed.get(UrlService);
    const result = urlService.joinUrl('http://localhost' , '/facility')
    expect(result).toBe('http://localhost/facility');
  });
});
