import { ConfigService, CONFIG } from '../config';
import { TestBed } from '@angular/core/testing';

describe('ConfigService', () => {
  let configuration = { analytics: { url: `http://localhost` } };
  let configurationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: CONFIG, useValue: configuration }
      ]
    });
    configurationService = TestBed.get(ConfigService);
  });

  it('should be created', () => {
    expect(configurationService).toBeDefined();
  });
  it('should be created with configuration and injected default configuration', () => {
    const hasConfiguration = configurationService.has('auth')
    expect(hasConfiguration).toBeTruthy();
  });
  it('should be created with configuration and add new values', () => {
    configurationService.set('newValue', 12);
    const hasConfiguration = configurationService.has('newValue')
    expect(hasConfiguration).toBeTruthy();
  });
  it('should be created with configuration and load', () => {
    const val = configurationService.get('analytics.url');
    expect(val).toBeTruthy();
    expect(val).toBe(`http://localhost`);
  });
  it('should be created with configuration and load default value', () => {
    const val = configurationService.get('analytics.test', 'test');
    expect(val).toBeTruthy();
    expect(val).toBe(`test`);
  });

});