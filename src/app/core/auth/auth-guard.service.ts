import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthBaseService } from './auth.base.service';

@Injectable()
export class AuthGuardService  implements CanActivate {

  constructor(private authService: AuthBaseService) {

  }

  canActivate(route: ActivatedRouteSnapshot , state: RouterStateSnapshot) {
    return this.authService.isAuthenticated();
  }
}