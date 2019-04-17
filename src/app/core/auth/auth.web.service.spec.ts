import { TestBed } from '@angular/core/testing';

import { AuthBaseService } from './auth.base.service';
import { AuthModule, OidcConfigService, OidcSecurityService } from 'angular-auth-oidc-client';
import { ConfigService ,CONFIG} from '../config';
import { WindowService } from '../utils';
import { AuthWebService } from './auth.web.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OidcNavigationService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { AuthFactory } from './auth.factory';
import { AuthFlowType } from './auth.types';

describe('AuthWebService', () => {

  it('should be created', () => {
    const spy = jasmine.createSpyObj('SpecialRouter', ['navigate']);
    TestBed.configureTestingModule({
      imports:[  HttpClientTestingModule, AuthModule.forChild()],
      providers: [
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        AuthWebService,
        { provide: CONFIG, useValue: {test:1} },
        // Overload for support uirouter navigation
        { provide: OidcNavigationService , useValue: spy },
      ]
    });
    const authWebService: AuthWebService = TestBed.get(AuthWebService);
    expect(authWebService).toBeTruthy();
  });
  it('should get the url and perform implicit callback', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule','moduleSetup','onModuleSetup' ,'authorizedCallbackWithCode','authorizedImplicitFlowCallback','getIsModuleSetup'  ]);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));
    oidcSecurityServiceSpy.moduleSetup.and.returnValue(true);
    oidcSecurityServiceSpy.getIsModuleSetup.and.returnValue(of(true));
    oidcSecurityServiceSpy.onModuleSetup.and.returnValue(of(true));
    oidcSecurityServiceSpy.authorizedCallbackWithCode.and.returnValue(of());
    oidcSecurityServiceSpy.authorizedImplicitFlowCallback.and.returnValue(of());

    class InternalWindowService {
      get nativeWindow(){
        return {
          location:{
            origin:'http://localhost/#code=123',
            hash:'http://localhost/#code=123'
          }
        }
     }}
    const authConfig = {
      auth: {
        authFlowType: AuthFlowType.implicit,
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        redirectUrl:'http://localthost',
        tenant: "ls"
      }
    };
    const authService: AuthWebService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig),new InternalWindowService());
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    authService.onAuthCallback('http://localhost/#code=123');
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorizedCallbackWithCode.calls.count()).toBe(0);
    expect(oidcSecurityServiceSpy.authorizedImplicitFlowCallback.calls.count()).toBe(1);
  });

  it('should get the url and not perform a implicit callback', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule','moduleSetup','onModuleSetup' ,'authorizedCallbackWithCode','authorizedImplicitFlowCallback','getIsModuleSetup'  ]);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));
    oidcSecurityServiceSpy.moduleSetup.and.returnValue(true);
    oidcSecurityServiceSpy.getIsModuleSetup.and.returnValue(of(true));
    oidcSecurityServiceSpy.onModuleSetup.and.returnValue(of(true));
    oidcSecurityServiceSpy.authorizedCallbackWithCode.and.returnValue(of());
    oidcSecurityServiceSpy.authorizedImplicitFlowCallback.and.returnValue(of());

    class InternalWindowService {
      get nativeWindow(){
        return {
          location:{
            origin:'http://localhost/#code=123',
            hash:''
          }
        }
     }}
    const authConfig = {
      auth: {
        authFlowType: AuthFlowType.implicit,
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        redirectUrl:'http://localthost',
        tenant: "ls"
      }
    };
    const authService: AuthWebService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig),new InternalWindowService());
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    authService.onAuthCallback('');
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorizedCallbackWithCode.calls.count()).toBe(0);
    expect(oidcSecurityServiceSpy.authorizedImplicitFlowCallback.calls.count()).toBe(0);
  });

  it('should get the url and perform auth callback', async () => {
    const oidcConfigServiceSpy = jasmine.createSpyObj('OidcConfigService', ['load_well_known_endpoints']);
    oidcConfigServiceSpy.load_well_known_endpoints.and.returnValue(of({ toke: 'http://localhost' }));
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['setupModule','moduleSetup','onModuleSetup' ,'authorizedCallbackWithCode','authorizedImplicitFlowCallback']);
    oidcSecurityServiceSpy.setupModule.and.returnValue(of({}));
    oidcSecurityServiceSpy.moduleSetup.and.returnValue(true);
    oidcSecurityServiceSpy.onModuleSetup.and.returnValue(of(true));
    oidcSecurityServiceSpy.authorizedCallbackWithCode.and.returnValue(of());
    oidcSecurityServiceSpy.authorizedImplicitFlowCallback.and.returnValue(of());
    const authConfig = {
      auth: {
        authFlowType: AuthFlowType.code,
        url: 'http://localhost:7000/_api',
        clientId: "CLIENT",
        clientSecret: "SECRET",
        tenant: "ls"
      }
    };
    const authService: AuthWebService = AuthFactory(oidcSecurityServiceSpy, oidcConfigServiceSpy, new ConfigService(authConfig), new WindowService());
    const val = await authService.configure().toPromise();
    expect(val).toBeDefined();
    authService.onAuthCallback('http://localhost/?code=123');
    expect(oidcConfigServiceSpy.load_well_known_endpoints.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.setupModule.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorizedCallbackWithCode.calls.count()).toBe(1);
    expect(oidcSecurityServiceSpy.authorizedImplicitFlowCallback.calls.count()).toBe(0);
  });
});
