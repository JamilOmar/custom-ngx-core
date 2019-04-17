import { Injectable } from '@angular/core';
import { AuthConfig, AuthFlowType } from './auth.types';


 /**
   * AuthService Service
   *@description: Class Interface for Authentication
   * https://angular.io/guide/dependency-injection-in-action#class-interface
   */
@Injectable()
export abstract class AuthService{
    public authConfig: AuthConfig;
    public authFlowType: AuthFlowType;
    /**
     *@description invokes the refresh token method
     *@param refreshToken - Refresh token
     * @return {boolean}
     */
    abstract requestWithRefreshToken(refreshToken: string);
    /**
     *@description check if login successfully after login by checking value of `authInfo`
     * @return {boolean}
     */
    abstract isAuthenticated();
    /**
    *@description gets the user profile
    * @return {object}
    */
    abstract getProfile();
    /**
    *@description performs the login method
    *@param urlHandler - Optional function for handle the request
    */
    abstract login(urlHandler?);
    /**
    *@description performs the logout method
    *@param urlHandler - Optional function for handle the request
    */
    abstract logout(urlHandler?);
    /**
    *@description gets the Access token
    * @return {string}
    */
    abstract getAccessToken();
    /**
    *@description gets the Refresh token
    * @return {string}
    */
   abstract getRefreshToken();
     /**
    *@description Configures the auth method.\
    *@param config - Optional configuration overload, if is not defined, it will grab the configuration from ngxConfig
    */
    abstract configure(config?: AuthConfig);
    /**
    *@description Obtains the type of grant type
    * @return {string}
    */
    abstract get responseType(): string;
     /**
    *@description Action to be performed when the user performed the auth | implicit flow - Must be defined in the constructor
    */
    abstract onAuthCallback(): void;
    /**
    *@description Action to be performed when there is an error
    */
   abstract handleError(error:any): void;

}
