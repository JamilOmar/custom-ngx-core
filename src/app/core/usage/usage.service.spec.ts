import { UsageService } from './usage.service';
import { ConfigService, CONFIG } from '../config';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsageKeys } from './usage.keys';

describe('UsageService', () => {
  beforeEach(() => {
  });

  it('should be created', () => {
    const usage: UsageService = new UsageService(<any>{}, <any>{});
    expect(usage).toBeTruthy();
  });
  it('should be created with configuration', () => {

    let configuration = { usage: { url: `http://localhost` } }
    let configureService = new ConfigService(<any>configuration);
    const usage: UsageService = new UsageService(<any>{}, configureService);
    expect(usage).toBeTruthy();
  });
  it('should be created with configuration with module and get url', () => {
    let configuration = { usage: { url: `http://localhost` } }
    TestBed.configureTestingModule({

      imports: [HttpClientTestingModule],
      providers: [
        UsageService,
        ConfigService,
        { provide: CONFIG, useValue: configuration }
      ]
    });
    const usage = TestBed.get(UsageService);
    expect(usage).toBeTruthy();
    const url = usage.getUrl();
    expect(url).toBe(`http://localhost`);
  });
  it('should be created with configuration with module and get url and application', () => {
    let configuration = { usage: { url: `http://localhost`, application: `facility` } }
    TestBed.configureTestingModule({

      imports: [HttpClientTestingModule],
      providers: [
        UsageService,
        ConfigService,
        { provide: CONFIG, useValue: configuration }
      ]
    });
    const usage = TestBed.get(UsageService);
    expect(usage).toBeTruthy();
    const url = usage.getUrl();
    const application = usage.getApplication();
    expect(url).toBe(`http://localhost`);
    expect(application).toBe(`facility`);
  });

  it('should be created with configuration with module and send data', () => {
    let configuration = { usage: { url: `http://localhost`, application: `facility` } }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsageService,
        ConfigService,
        { provide: CONFIG, useValue: configuration }
      ]
    });
    const usage = TestBed.get(UsageService);
    let httpMock = TestBed.get(HttpTestingController);
    expect(usage).toBeTruthy();
    const url = usage.getUrl();
    usage.send({ event: 'mouseClick' });
    const req = httpMock.expectOne(`http://localhost`);
    expect(req.request.method).toBe(`POST`);
    expect(url).toBe(`http://localhost`);
    httpMock.verify();
  });
  it('should be created with configuration with module and send data with no application', () => {
    let configuration = { usage: { url: `http://localhost` } }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsageService,
        ConfigService,
        { provide: CONFIG, useValue: configuration }
      ]
    });
    const usage = TestBed.get(UsageService);
    expect(usage).toBeTruthy();
    expect(() => usage.send({ event: 'mouseClick' })).toThrow(new Error(UsageKeys.USAGE_APPLICATION_ERROR));
  });

  it('should be created with configuration with module and send data with no event', () => {
    let configuration = { usage: { url: `http://localhost`, application: `facility` } }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsageService,
        ConfigService,
        { provide: CONFIG, useValue: configuration }
      ]
    });
    const usage = TestBed.get(UsageService);
    expect(usage).toBeTruthy();
    expect(() => usage.send({})).toThrow(new Error(UsageKeys.USAGE_EVENT_ERROR));
  });

  it('should be created with configuration with module and not send data', () => {
    let configuration = { usage: {} }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsageService,
        ConfigService,
        { provide: CONFIG, useValue: configuration }
      ]
    });
    const usage = TestBed.get(UsageService);
    let httpMock = TestBed.get(HttpTestingController);
    expect(usage).toBeTruthy();
    const url = usage.getUrl();
    expect(url).toBe('');
    usage.send({});
    httpMock.expectNone(`http://localhost`);
    httpMock.verify();
  });
});
