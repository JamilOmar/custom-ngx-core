import { TestBed, async } from '@angular/core/testing';

import { AuthBaseService } from './auth.base.service';
import { AuthModule, OidcConfigService, OidcSecurityService } from 'angular-auth-oidc-client';
import { ConfigService, CONFIG, Config } from '../config';
import { WindowService } from '../utils';
import { AuthWebService } from './auth.web.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OidcNavigationService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { AuthFlowType, AuthConfig } from './auth.types';
import { AuthService } from './auth.service';
import { AuthFactory } from './auth.factory';
import { AuthKeys } from './auth.keys';

describe('AuthService', () => {
  it('should be created', () => {
    const spy = jasmine.createSpyObj('SpecialRouter', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AuthModule.forChild()],
      providers: [
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        AuthWebService,
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
        { provide: OidcNavigationService, useValue: spy },
      ]
    });
    const authService: AuthBaseService = TestBed.get(AuthBaseService);
    expect(authService).toBeTruthy();
  });
  it('should be created with implicity flow', async () => {
    const spy = jasmine.createSpyObj('SpecialRouter', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AuthModule.forChild()],
      providers: [
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
        { provide: OidcNavigationService, useValue: spy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false }
      ]
    });
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ auth: 'url' }))
    //spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({auth:'url'}))
    const authService: AuthService = TestBed.get(AuthService);
    const val = await authService.configure().toPromise();
    expect(authService.authFlowType).toBe(AuthFlowType.implicit);
    expect(val).toBeDefined();
  });
  it('should be created with code flow', async () => {
    const spy = jasmine.createSpyObj('SpecialRouter', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AuthModule.forChild()],
      providers: [
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
        { provide: OidcNavigationService, useValue: spy },
        { provide: AuthService, useFactory: AuthFactory, deps: [OidcSecurityService, OidcConfigService, ConfigService, WindowService], multi: false }
      ]
    });
    spyOn(OidcConfigService.prototype, 'load_well_known_endpoints').and.returnValue(of({ auth: 'url' }))
    //spyOn(OidcSecurityService.prototype, 'setupModule').and.returnValue(of({auth:'url'}))
    const authService: AuthService = TestBed.get(AuthService);
    const val = await authService.configure().toPromise();
    expect(authService.authFlowType).toBe(AuthFlowType.code);
    expect(val).toBeDefined();
  });

  it('should be created and call login', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule', 'authorize']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));
    oidcSecurityServiceSpy.authorize.and.returnValue({});

    const authConfig = {
      auth: {
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService())
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    authService.login();
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorize.calls.count()).toBe(1);
  });
  it('should be created and call login and logout', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule', 'authorize','logoff']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));
    oidcSecurityServiceSpy.authorize.and.returnValue({});
    oidcSecurityServiceSpy.logoff.and.returnValue({});

    const authConfig = {
      auth: {
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService())
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    authService.login();
    authService.logout();
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorize.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.logoff.calls.count()).toBe(1);
  });

  it('should be created and call login , getToken, getRefreshToken and logout', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule','getToken','getRefreshToken', 'authorize','logoff']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));
    oidcSecurityServiceSpy.authorize.and.returnValue({});
    oidcSecurityServiceSpy.logoff.and.returnValue({});
    oidcSecurityServiceSpy.getToken.and.returnValue('TOKEN');
    oidcSecurityServiceSpy.getRefreshToken.and.returnValue('REFRESH_TOKEN');

    const authConfig = {
      auth: {
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService())
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    authService.login();
    const token = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();
    authService.logout();
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorize.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.logoff.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.getToken.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.getRefreshToken.calls.count()).toBe(1);
    expect(token).toBe('TOKEN');
    expect(refreshToken).toBe('REFRESH_TOKEN');
  });

  it('should be created and call login , getToken, getProfile,  requestTokensWithRefreshToken , getRefreshToken and logout', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule','getToken','requestTokensWithRefreshToken','getRefreshToken', 'authorize','logoff','getUserData']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));
    oidcSecurityServiceSpy.authorize.and.returnValue({});
    oidcSecurityServiceSpy.getUserData.and.returnValue(of({username:'TEST'}));
    oidcSecurityServiceSpy.logoff.and.returnValue({});
    oidcSecurityServiceSpy.getToken.and.returnValue('TOKEN');
    oidcSecurityServiceSpy.requestTokensWithRefreshToken.and.returnValue(of({auth_token:'AUTH_TOKEN'}));
    
    oidcSecurityServiceSpy.getRefreshToken.and.returnValue('REFRESH_TOKEN');

    const authConfig = {
      auth: {
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService())
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    authService.login();
    const token = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();
    const requestResult = await authService.requestWithRefreshToken(refreshToken).toPromise();
    const profile = await authService.getProfile().toPromise();
    const isAuthenticated = await authService.isAuthenticated();

    authService.logout();
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorize.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.logoff.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.getToken.calls.count()).toBe(2);
    expect(oidcSecurityServiceSpy.getRefreshToken.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.getUserData.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.requestTokensWithRefreshToken.calls.count()).toBe(1);
    expect(token).toBe('TOKEN');
    expect(refreshToken).toBe('REFRESH_TOKEN');
    expect(isAuthenticated).toBeTruthy();
    expect(profile.username).toBe('TEST');
    expect(requestResult.auth_token).toBe('AUTH_TOKEN');
  });

  it('should be created and response type implicit', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));

    const authConfig = {
      auth: {
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService())
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(authService.responseType).toBe(AuthKeys.AUTH_RESPONSE_TYPE_IMPLICIT);
  });

  it('should be created and response type code', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));

    const authConfig:Config = {
      auth: {
        authFlowType: AuthFlowType.code,
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService())
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(authService.responseType).toBe(AuthKeys.AUTH_RESPONSE_TYPE_CODE);
  });

  it('should get the url without # at the end', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));


    const authConfig = {
      auth: {
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthBaseService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService())
  
    const url = 'http://localhost:7000/_api/?value=12123123';
    const urlWithHash =`${url}#`;
    const urlWitNohHash =url;
   
    expect(authService.uiRouterPatch(urlWithHash)).toBe(url);
    expect(authService.uiRouterPatch(urlWitNohHash)).toBe(url);
  
  });
});
