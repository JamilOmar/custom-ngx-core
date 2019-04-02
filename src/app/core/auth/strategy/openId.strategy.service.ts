import { Injectable, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as openId from 'angular-oauth2-oidc';
import * as authTypes from '../auth.types';
import { AuthKeys } from '../auth.keys';
const TOKEN_STORED_AT ='access_token_stored_at';
const TOKEN_EXPIRES_AT = 'expires_at';
const TOKEN_NONCE = 'noce';


@Injectable({
  providedIn: 'root'
})
export class OpenIdStrategyService {
  @Output() onAuthenticated = new EventEmitter<any>();
  constructor(private oauthService: openId.OAuthService) { }

  /**
   *@description check if login successfully after login by checking value of `authInfo`
   * @return {boolean}
   */
  public isAuthenticated(): boolean {
    const hasIdToken = this.oauthService.hasValidIdToken();
    const hasAccessToken = this.oauthService.hasValidAccessToken();
    return hasIdToken && hasAccessToken;
  }

  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  public getAccessToken(){
    return sessionStorage.getItem(AuthKeys.ACCESS_TOKEN);
  }

  public configure(config: authTypes.AuthConfig) {
    const openIdConfig = this.mapConfiguration(config);
    this.oauthService.configure(openIdConfig);
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.tokenValidationHandler = new openId.JwksValidationHandler();
    this.oauthService.tryLogin(
      {
        onTokenReceived: context => {
          this.onAuthenticated.emit(context);
        }
    }
    )
  }

  public removeAuthSessionKeys(){
    sessionStorage.removeItem(TOKEN_EXPIRES_AT);
    sessionStorage.removeItem(TOKEN_NONCE);
    sessionStorage.removeItem(TOKEN_STORED_AT);
  }

  private mapConfiguration(config: authTypes.AuthConfig): openId.AuthConfig {
    const openIdConfiguration: openId.AuthConfig = {};
    openIdConfiguration.loginUrl = `${config.url}/auth/${config.organization || 'ls'}/authorize/`;
    openIdConfiguration.oidc = false;
    openIdConfiguration.showDebugInformation =false;
    openIdConfiguration.clearHashAfterLogin =true;
    // URL of the SPA to redirect the user to after login
    openIdConfiguration.redirectUri = config.redirectUri || window.location.origin;
    // The SPA's id. Register SPA with this id at the auth-server
    openIdConfiguration.clientId = config.clientId;
    openIdConfiguration.scope = config.scope || _.join(['openid', 'id_token', 'profile', 'email'], ' ');
    return openIdConfiguration;
  }


}
