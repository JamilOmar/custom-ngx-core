import { Injectable } from '@angular/core';
import { ConfigService } from '../config';
import {OpenIdStrategyService} from './strategy'
import {Url}from '../utils';
import * as _ from 'lodash';
import { AuthKeys } from './auth.keys';
import { SessionStorageService } from '../storage';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Wsfed, AuthConfig, Profile } from './auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authClientService : OpenIdStrategyService ,  private httpClient: HttpClient, private sessionStorage: SessionStorageService,
    private ngxCoreConfigService: ConfigService) {

      this.authClientService.onAuthenticated.subscribe(this.onAuthenticated);
     }

  /**
 * @description Authenticates the user using the given token and then
 * stores their profile information in sessionStorage.
 * @param {String} token - A temporary access token
 * @param {Object} [options] - Additional request options
 * @returns {Promise} It is fulfilled or rejected with the profile response data.
 */
  public getProfile(options?: any) {
    const authConfig: AuthConfig = this.ngxCoreConfigService.get(AuthKeys.AUTH_CONFIG);
    const url = Url.joinUrl(authConfig.url, AuthKeys.AUTH_ME_URL);
    return this.httpClient.get<Profile>(url, _.defaultsDeep(options)).pipe(
      tap((profile) => {
        this.sessionStorage.setItem(AuthKeys.AUTH_INFO, JSON.stringify(profile))
        return profile;
      }), catchError((err) => {
        this.removeAuthSessionKeys();
        throw err;
      }));
  }

  /**
   * @description Obtains an access token using the user's WSFederation session
   * @returns {Promise<Profile>|*} Resolves with user profile
   */
  public getTokenFromWSFedSession(options?: {
    ignore401intercept?: boolean,
    withCredentials?: boolean
  }) {
    const authConfig: AuthConfig = this.ngxCoreConfigService.get(AuthKeys.AUTH_CONFIG);
    const url = Url.joinUrl(authConfig.url, AuthKeys.AUTH_WSFED_TOKEN);
    return this.httpClient.post<Wsfed>(url, null, options).pipe(
      tap((response: any) => {
        const data = response.access_token;
        this.sessionStorage.setItem(AuthKeys.ACCESS_TOKEN, data);
        return data;
      }),
      catchError((err) => {
        this.removeAuthSessionKeys();
        throw err;
      })


    )
  }
  /**
   *@description check if login successfully after login by checking value of `authInfo`
   * @return {boolean}
   */
  public isAuthenticated(): boolean {
    return this.authClientService.isAuthenticated();
  }


  public login() {
    this.authClientService.login();
  }

  public logout() {
    this.authClientService.logout();
    this.removeAuthSessionKeys();
  }

  public getAccessToken(){
    return this.authClientService.getAccessToken();
  }

  public configure(config?: AuthConfig ){
    const authConfig =  config || this.ngxCoreConfigService.get('auth',{});
    this.authClientService.configure(authConfig);

  }
  /**
  *@description Removes the auth information from the session storage
  */
  public removeAuthSessionKeys(): void {
    this.sessionStorage.removeItem(AuthKeys.AUTH_INFO);
    this.sessionStorage.removeItem(AuthKeys.ACCESS_TOKEN);
    this.authClientService.removeAuthSessionKeys();
  }

  public onAuthenticated(context){
    this.getProfile().subscribe();
  }

}
