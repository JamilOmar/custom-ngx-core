import { Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { OidcSecurityService, OidcConfigService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { AuthConfig, AuthFlowType } from './auth.types';
import { AuthKeys } from './auth.keys';
import { WindowService } from '../utils/window.service';
/**
  * AuthBaseService Service
  *@description: Provides the main functionality for authentication, this is the parent class that uses angular-auth-oidc-clien
  */
@Injectable()
export class AuthBaseService {
  public authConfig: AuthConfig;
  public authFlowType: AuthFlowType;
  constructor(public client: OidcSecurityService, public oidcConfigService: OidcConfigService,
    public configService: ConfigService, public window: WindowService) {
    this.authConfig = this.configService.get(AuthKeys.AUTH_CONFIG, {});
  }

  protected onAuthCodeCallbackLogic(url?: string): void {
    this.client.authorizedCallbackWithCode(url);
  }

  protected onAuthImplicitCallbackLogic(hash?: string): void {
    this.client.authorizedImplicitFlowCallback(hash);
  }

  public requestWithRefreshToken(refreshToken: string) {
    return this.client.requestTokensWithRefreshToken(refreshToken);
  }
  public isAuthenticated() {
    return !_.isEmpty(this.client.getToken());
  }
  public getProfile() {
    return this.client.getUserData();
  }

  public login(urlHandler?) {
    return this.client.authorize(urlHandler);
  }

  public logout(urlHandler?) {
    return this.client.logoff(urlHandler);
  }
  public getAccessToken() {
    return this.client.getToken();
  }
  public getRefreshToken() {
    return this.client.getRefreshToken();
  }

  public configure(config?: AuthConfig) {
    this.authConfig = _.defaultsDeep(this.authConfig, config);
    let stsServer = `${this.authConfig.url}/auth/${this.authConfig.organization  || this.authConfig.tenant|| 'ls'}`;
    return this.oidcConfigService.load_well_known_endpoints(stsServer).pipe(
      map((endPoints) => {
        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = stsServer;
        openIDImplicitFlowConfiguration.redirect_url = _.get(this.authConfig, AuthKeys.REDIRECT_URL_CONFIG, this.window.nativeWindow.location.origin);
        openIDImplicitFlowConfiguration.unauthorized_route = _.get(this.authConfig, AuthKeys.UNAUTHORIZED_URL_CONFIG, '');
        openIDImplicitFlowConfiguration.forbidden_route = _.get(this.authConfig, AuthKeys.FORBIDDEN_URL_CONFIG, '');
        openIDImplicitFlowConfiguration.client_id = this.authConfig.clientId;
        openIDImplicitFlowConfiguration.client_secret = this.authConfig.clientSecret;
        openIDImplicitFlowConfiguration.response_type = this.responseType;
        openIDImplicitFlowConfiguration.scope = _.get(this.authConfig, AuthKeys.AUTH_SCOPE, AuthKeys.AUTH_SCOPE_DEFAULT);; // default scope 
        const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        authWellKnownEndpoints.setWellKnownEndpoints(endPoints);
        return this.client.setupModule(
          openIDImplicitFlowConfiguration,
          authWellKnownEndpoints
        );
      })
    )
  }

  public handleError(error: any) {
    this.client.handleError(error);
  }
  get responseType(): string {
    let responseType = '';
    switch (this.authFlowType) {
      case AuthFlowType.code:
        responseType = AuthKeys.AUTH_RESPONSE_TYPE_CODE;
        break;
      case AuthFlowType.implicit:
      default:
        responseType = AuthKeys.AUTH_RESPONSE_TYPE_IMPLICIT; //'id_token token' Implicit Flow by default
        break;
    }
    return responseType;
  }

  // error with uiRouter , it requires  to remove the last character
  public uiRouterPatch(url:string) {

    if (_.last(url) === '#') {
      return url.slice(0, -1);
    } else {
      return url;
    }
  }
}
