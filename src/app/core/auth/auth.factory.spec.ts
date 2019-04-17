import { TestBed } from '@angular/core/testing';

import { AuthBaseService } from './auth.base.service';
import { AuthFactory } from './auth.factory';
import { AuthModule, OidcConfigService, OidcSecurityService } from 'angular-auth-oidc-client';
import { ConfigService ,CONFIG} from '../config';
import { WindowService } from '../utils';
import { AuthWebService } from './auth.web.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OidcNavigationService } from 'angular-auth-oidc-client';
import { AuthElectronService } from './auth.electron.service';

describe('AuthFactory', () => {

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
        { provide: CONFIG, useValue: {test:1} },
          // Overload for support uirouter navigation
        { provide: OidcNavigationService , useValue: spy },
      ]
    });
    const client: OidcSecurityService = TestBed.get(OidcSecurityService);
    const oidcConfigService: OidcConfigService = TestBed.get(OidcConfigService);
    const configService: ConfigService = TestBed.get(ConfigService);
    const windowService: WindowService = TestBed.get(WindowService);

    const instance = AuthFactory(client, oidcConfigService, configService, windowService );
    expect( instance instanceof AuthWebService  ).toBeTruthy();
  });

  it('web auth should be created', () => {
    const spy = jasmine.createSpyObj('SpecialRouter', ['navigate']);
    TestBed.configureTestingModule({
      imports:[  HttpClientTestingModule, AuthModule.forChild()],
      providers: [
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        { provide: CONFIG, useValue: {appType:'web'} },
          // Overload for support uirouter navigation
        { provide: OidcNavigationService , useValue: spy },
      ]
    });
    const client: OidcSecurityService = TestBed.get(OidcSecurityService);
    const oidcConfigService: OidcConfigService = TestBed.get(OidcConfigService);
    const configService: ConfigService = TestBed.get(ConfigService);
    const windowService: WindowService = TestBed.get(WindowService);

    const instance = AuthFactory(client, oidcConfigService, configService, windowService );
    expect( instance instanceof AuthWebService  ).toBeTruthy();
  });

  it('electron auth should be created', () => {
    const spy = jasmine.createSpyObj('SpecialRouter', ['navigate']);
    TestBed.configureTestingModule({
      imports:[  HttpClientTestingModule, AuthModule.forChild()],
      providers: [
        ConfigService,
        OidcSecurityService,
        OidcConfigService,
        WindowService,
        AuthBaseService,
        { provide: CONFIG, useValue: {appType:'electron'} },
          // Overload for support uirouter navigation
        { provide: OidcNavigationService , useValue: spy },
      ]
    });
    const client: OidcSecurityService = TestBed.get(OidcSecurityService);
    const oidcConfigService: OidcConfigService = TestBed.get(OidcConfigService);
    const configService: ConfigService = TestBed.get(ConfigService);
    const windowService: WindowService = TestBed.get(WindowService);

    const instance = AuthFactory(client, oidcConfigService, configService, windowService );
    expect( instance instanceof AuthElectronService  ).toBeTruthy();
  });
});
