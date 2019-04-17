import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
  /**
   * Auth Guard
   *@description: Provides a guard when ng router is used
   */
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService) {}

  /**
   *@description: Validates if the request can be activated
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated();
  }
}