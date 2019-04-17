import { AnalyticsService } from './analytics.service';
import { ConfigService , CONFIG } from '../config';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AnalyticsService', () => {
  beforeEach(() =>{
  });

  it('should be created', () => {
    const analytics: AnalyticsService = new AnalyticsService(<any>{},<any>{});
    expect(analytics).toBeTruthy();
  });
  it('should be created with configuration', () => {

    let configuration = {analytics:{url : `http://localhost`}}
    let configureService = new ConfigService(configuration);
    const analytics: AnalyticsService = new AnalyticsService(<any>{},configureService);
    expect(analytics).toBeTruthy();
  });
  it('should be created with configuration with module and get url', () => {
    let configuration  = {analytics:{url : `http://localhost`}}
    TestBed.configureTestingModule({

      imports:[HttpClientTestingModule],
      providers: [
        AnalyticsService,
        ConfigService,
        { provide: CONFIG , useValue: configuration }
      ]
    });
    const analytics = TestBed.get(AnalyticsService);
    expect(analytics).toBeTruthy();
    const url = analytics.getUrl();
    expect(url).toBe(`http://localhost`);
  });

  it('should be created with configuration with module and send data', () => {
    let configuration  = {analytics:{url : `http://localhost`}}
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        AnalyticsService,
        ConfigService,
        { provide: CONFIG , useValue: configuration }
      ]
    });
    const analytics = TestBed.get(AnalyticsService);
    let httpMock = TestBed.get(HttpTestingController);
    expect(analytics).toBeTruthy();
    const url = analytics.getUrl();
    analytics.send({});
    const req = httpMock.expectOne(`http://localhost`);
    expect(req.request.method).toBe(`POST`);
    expect(url).toBe(`http://localhost`);
    httpMock.verify();
  });

  it('should be created with configuration with module and not send data', () => {
    let configuration  = {analytics:{}}
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        AnalyticsService,
        ConfigService,
        { provide: CONFIG , useValue: configuration }
      ]
    });
    const analytics = TestBed.get(AnalyticsService);
    let httpMock = TestBed.get(HttpTestingController);
    expect(analytics).toBeTruthy();
    const url = analytics.getUrl();
    expect(analytics.hasUrl()).toBe(false);
    expect(url).toBe('');
    analytics.send({});
    httpMock.expectNone(`http://localhost`);
    httpMock.verify();
  });
});
