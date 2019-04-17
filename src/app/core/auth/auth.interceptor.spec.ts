import { TestBed } from '@angular/core/testing';

import { AuthBaseService } from './auth.base.service';
import { AuthFactory } from './auth.factory';
import { AuthModule, OidcConfigService, OidcSecurityService } from 'angular-auth-oidc-client';
import { ConfigService ,CONFIG} from '../config';
import { WindowService } from '../utils';
import { AuthWebService } from './auth.web.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OidcNavigationService } from 'angular-auth-oidc-client';
import { AuthElectronService } from './auth.electron.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class DataService {
  ROOT_URL = `http://localhost/test`;
  constructor(private http: HttpClient) {}
  getPosts() {
    return this.http.get(`${this.ROOT_URL}/posts`);
  }
}
describe('AuthInterceptor', () => {
  let navigationSpy;
  let oidcSecurityServiceSpy;
  let oidcConfigServiceSpy;
  let configService:ConfigService;
  let windowService:WindowService;
  let instance: AuthService;
  let service;
  let httpMock: HttpTestingController;
  it('should be created', () => {

    navigationSpy = jasmine.createSpyObj('SpecialRouter', ['navigate']);  
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ toke: 'http://localhost' }));
    spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({}));
    spyOn(OidcSecurityService.prototype, 'authorize').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getUserData').and.returnValue(of({username:'TEST'}));
    spyOn(OidcSecurityService.prototype, 'logoff').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getToken').and.returnValue('TOKEN');
    spyOn(OidcSecurityService.prototype, 'requestTokensWithRefreshToken').and.returnValue(of({auth_token:'AUTH_TOKEN'}));
    TestBed.configureTestingModule({    
      imports: [HttpClientTestingModule, AuthModule.forChild()],    
      providers: [
        DataService,
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        {
          provide: CONFIG, useValue: {
            auth: {
              authFlowType: 'implicit',
              url: 'http://localhost:7000/_api',
              clientId: "CLIENT",
              clientSecret: "SECRET",
              tenant: "ls"
            }
          }
        },
        // Overload for support uirouter navigation
        { provide: OidcNavigationService, useValue: navigationSpy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false },
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,}
      ]
    });
    configService = TestBed.get(ConfigService);
    windowService = TestBed.get(WindowService);
    httpMock = TestBed.get(HttpTestingController);
    instance = TestBed.get(AuthService);
    service = TestBed.get(DataService);
    expect( instance instanceof AuthWebService  ).toBeTruthy();
  });
  it('should add an Authorization header', () => {
    navigationSpy = jasmine.createSpyObj('SpecialRouter', ['navigate']);  
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ toke: 'http://localhost' }));
    spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({}));
    spyOn(OidcSecurityService.prototype, 'authorize').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getUserData').and.returnValue(of({username:'TEST'}));
    spyOn(OidcSecurityService.prototype, 'logoff').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getToken').and.returnValue('TOKEN');
    spyOn(OidcSecurityService.prototype, 'requestTokensWithRefreshToken').and.returnValue(of({auth_token:'AUTH_TOKEN'}));
    TestBed.configureTestingModule({    
      imports: [HttpClientTestingModule, AuthModule.forChild()],    
      providers: [
        DataService,
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        {
          provide: CONFIG, useValue: {
            auth: {
              authFlowType: 'implicit',
              url: 'http://localhost:7000/_api',
              clientId: "CLIENT",
              clientSecret: "SECRET",
              tenant: "ls"
            }
          }
        },
        // Overload for support uirouter navigation
        { provide: OidcNavigationService, useValue: navigationSpy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false },
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,}
      ]
    });
    configService = TestBed.get(ConfigService);
    windowService = TestBed.get(WindowService);
    httpMock = TestBed.get(HttpTestingController);
    instance = TestBed.get(AuthService);
    service = TestBed.get(DataService);
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.headers.get('Authorization')).toEqual( 'Bearer TOKEN');
  });

  it('should fail because it is implicit and not call', () => {
    navigationSpy = jasmine.createSpyObj('SpecialRouter', ['navigate']);  
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ toke: 'http://localhost' }));
    spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({}));
    spyOn(OidcSecurityService.prototype, 'authorize').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getUserData').and.returnValue(of({username:'TEST'}));
    spyOn(OidcSecurityService.prototype, 'logoff').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getToken').and.returnValue(undefined);
    spyOn(OidcSecurityService.prototype, 'requestTokensWithRefreshToken').and.returnValue(of({auth_token:'AUTH_TOKEN'}));
    TestBed.configureTestingModule({    
      imports: [HttpClientTestingModule, AuthModule.forChild()],    
      providers: [
        DataService,
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        {
          provide: CONFIG, useValue: {
            auth: {
              authFlowType: 'implicit',
              url: 'http://localhost:7000/_api',
              clientId: "CLIENT",
              clientSecret: "SECRET",
              tenant: "ls"
            }
          }
        },
        // Overload for support uirouter navigation
        { provide: OidcNavigationService, useValue: navigationSpy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false },
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,}
      ]
    });
    configService = TestBed.get(ConfigService);
    windowService = TestBed.get(WindowService);
    httpMock = TestBed.get(HttpTestingController);
    instance = TestBed.get(AuthService);
    service = TestBed.get(DataService);
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.headers.get('Authorization')).toEqual(null);
  });

  it('should fail because it is implicit and error', () => {
    navigationSpy = jasmine.createSpyObj('SpecialRouter', ['navigate']);  
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ toke: 'http://localhost' }));
    spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({}));
    spyOn(OidcSecurityService.prototype, 'authorize').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getUserData').and.returnValue(of({username:'TEST'}));
    spyOn(OidcSecurityService.prototype, 'logoff').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getToken').and.returnValue(undefined);
    spyOn(OidcSecurityService.prototype, 'requestTokensWithRefreshToken').and.returnValue(of({auth_token:'AUTH_TOKEN'}));
    TestBed.configureTestingModule({    
      imports: [HttpClientTestingModule, AuthModule.forChild()],    
      providers: [
        DataService,
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        {
          provide: CONFIG, useValue: {
            auth: {
              authFlowType: 'implicit',
              url: 'http://localhost:7000/_api',
              clientId: "CLIENT",
              clientSecret: "SECRET",
              tenant: "ls"
            }
          }
        },
        // Overload for support uirouter navigation
        { provide: OidcNavigationService, useValue: navigationSpy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false },
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,}
      ]
    });
    configService = TestBed.get(ConfigService);
    windowService = TestBed.get(WindowService);
    httpMock = TestBed.get(HttpTestingController);
    instance = TestBed.get(AuthService);
    service = TestBed.get(DataService);
    let errorResponse;
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    }, response=> errorResponse = response.error);
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    const data = 'Invalid request parameters';
    httpMock.expectOne(`${service.ROOT_URL}/posts`).flush(data, mockErrorResponse);
    expect(errorResponse).toBe(data);
  });
  it('should fail because it is implicit and retry with code flow', () => {
    navigationSpy = jasmine.createSpyObj('SpecialRouter', ['navigate']);  
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ toke: 'http://localhost' }));
    spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({}));
    spyOn(OidcSecurityService.prototype, 'authorize').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getUserData').and.returnValue(of({username:'TEST'}));
    spyOn(OidcSecurityService.prototype, 'logoff').and.returnValue({});
    let getTokenSpy = spyOn(OidcSecurityService.prototype, 'getToken').and.returnValue('AUTH_TOKEN');
    let getRefreshTokenSpy = spyOn(OidcSecurityService.prototype, 'getRefreshToken').and.returnValue('REFRESH_TOKEN');
    let requestTokensWithRefreshTokenSpy =  spyOn(OidcSecurityService.prototype, 'requestTokensWithRefreshToken').and.returnValue(of({auth_token:'AUTH_TOKEN'}));

    TestBed.configureTestingModule({    
      imports: [HttpClientTestingModule, AuthModule.forChild()],    
      providers: [
        DataService,
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        {
          provide: CONFIG, useValue: {
            auth: {
              authFlowType: 'code',
              url: 'http://localhost:7000/_api',
              clientId: "CLIENT",
              clientSecret: "SECRET",
              tenant: "ls"
            }
          }
        },
        // Overload for support uirouter navigation
        { provide: OidcNavigationService, useValue: navigationSpy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false },
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,}
      ]
    });
    configService = TestBed.get(ConfigService);
    windowService = TestBed.get(WindowService);
    httpMock = TestBed.get(HttpTestingController);
    instance = TestBed.get(AuthService);
    service = TestBed.get(DataService);
    let errorResponse;
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    }, response=> errorResponse = response);
    const mockErrorResponse = { status: 401, statusText: 'Unauthorized' };
    const data = 'Unauthorized';
    httpMock.expectOne(`${service.ROOT_URL}/posts`).flush(data, mockErrorResponse);
    expect(getTokenSpy.calls.count()).toBe(2);
    expect(getRefreshTokenSpy.calls.count()).toBe(1);
    expect(requestTokensWithRefreshTokenSpy.calls.count()).toBe(1);
    expect(errorResponse).not.toBeDefined();
  });
  it('should fail because it is implicit and retry with code flow and error', () => {
    navigationSpy = jasmine.createSpyObj('SpecialRouter', ['navigate']);  
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ toke: 'http://localhost' }));
    spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({}));
    spyOn(OidcSecurityService.prototype, 'authorize').and.returnValue({});
    spyOn(OidcSecurityService.prototype, 'getUserData').and.returnValue(of({username:'TEST'}));
    spyOn(OidcSecurityService.prototype, 'logoff').and.returnValue({});
    let getTokenSpy = spyOn(OidcSecurityService.prototype, 'getToken').and.returnValue('AUTH_TOKEN');
    let getRefreshTokenSpy = spyOn(OidcSecurityService.prototype, 'getRefreshToken').and.returnValue('REFRESH_TOKEN');
    let requestTokensWithRefreshTokenSpy =  spyOn(OidcSecurityService.prototype, 'requestTokensWithRefreshToken').and.throwError('Unauthorized');

    TestBed.configureTestingModule({    
      imports: [HttpClientTestingModule, AuthModule.forChild()],    
      providers: [
        DataService,
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        {
          provide: CONFIG, useValue: {
            auth: {
              authFlowType: 'code',
              url: 'http://localhost:7000/_api',
              clientId: "CLIENT",
              clientSecret: "SECRET",
              tenant: "ls"
            }
          }
        },
        // Overload for support uirouter navigation
        { provide: OidcNavigationService, useValue: navigationSpy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false },
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,}
      ]
    });
    configService = TestBed.get(ConfigService);
    windowService = TestBed.get(WindowService);
    httpMock = TestBed.get(HttpTestingController);
    instance = TestBed.get(AuthService);
    service = TestBed.get(DataService);
    let errorResponse;
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    }, response=> errorResponse = response);
    const mockErrorResponse = { status: 401, statusText: 'Unauthorized' };
    const data = 'Unauthorized';
    httpMock.expectOne(`${service.ROOT_URL}/posts`).flush(data, mockErrorResponse);
    expect(getTokenSpy.calls.count()).toBe(1);
    expect(getRefreshTokenSpy.calls.count()).toBe(1);
    expect(requestTokensWithRefreshTokenSpy.calls.count()).toBe(1);
    expect(errorResponse).toBeDefined();
  });
});
