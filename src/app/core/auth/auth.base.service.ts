import { Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { OidcSecurityService, OidcConfigService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import * as _ from 'lodash';
import { filter, take, map } from 'rxjs/operators';
import { AuthConfig, Auth, AuthFlowType } from './auth.types';
import { WindowService } from '../utils/window.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AuthService implements Auth {
  protected authConfig: AuthConfig;
  protected authFlowType: AuthFlowType;
  constructor(public client: OidcSecurityService, public oidcConfigService: OidcConfigService,
    public configService: ConfigService, public window: WindowService) {
      this.authConfig = this.configService.get('auth', {});
      this.authFlowType = AuthFlowType.implicit;
  }

  protected onAuthCodeCallbackLogic(url?: string): void {
    this.client.authorizedCallbackWithCode(url);
  }

  protected onAuthImplicitCallbackLogic(hash?:string): void {
    this.client.authorizedImplicitFlowCallback(hash);
  }

  public refreshToken(refreshToken: string) {
    return this.client.requestTokensWithRefreshToken(refreshToken);
  }
  /**
   *@description check if login successfully after login by checking value of `authInfo`
   * @return {boolean}
   */
  public isAuthenticated() {
    return _.isEmpty(this.client.getToken());
  }
  /**
  *@description check if login successfully after login by checking value of `authInfo`
  * @return {boolean}
  */
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

  public configure(config?: AuthConfig) {
    debugger
    this.authConfig = _.defaultsDeep(this.authConfig, config);
    let stsServer = `${this.authConfig.url}/auth/${this.authConfig.organization || 'ls'}`;
    return this.oidcConfigService.load_well_known_endpoints(stsServer).pipe(
      map((endPoints)=>{
        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = stsServer;
        openIDImplicitFlowConfiguration.redirect_url = _.get(this.authConfig, 'redirectUrl', this.window.nativeWindow.location.origin);
        openIDImplicitFlowConfiguration.unauthorized_route = ''; // TODO: add in config
        openIDImplicitFlowConfiguration.forbidden_route = ''; // TODO: add in config
        openIDImplicitFlowConfiguration.client_id = this.authConfig.clientId;
        openIDImplicitFlowConfiguration.client_secret = this.authConfig.clientSecret;
        openIDImplicitFlowConfiguration.response_type = this.responseType;
        openIDImplicitFlowConfiguration.scope = _.get(this.authConfig, 'scope', 'openid profile offline_access ');; // default scope 
        const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        authWellKnownEndpoints.setWellKnownEndpoints(endPoints);
        return this.client.setupModule(
          openIDImplicitFlowConfiguration,
          authWellKnownEndpoints
        );
      })
    )
  }
  


  get responseType(): string {
    let responseType = '';
    const type = _.get( this.authConfig ,  'authFlowType' , this.authFlowType);
    switch (type) {
      case AuthFlowType.auth:
        responseType = 'code';
        break;
      case AuthFlowType.implicit:
      default:
        responseType = 'id_token token'; //'id_token token' Implicit Flow by default
        break;
    }
    return responseType;
  }

  abstract onAuthCallback(url?: string);

}
