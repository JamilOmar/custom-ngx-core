import { Injectable } from '@angular/core';
import { AuthService } from './auth.base.service';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';
import { ConfigService } from '../config';
import { AuthFlowType, Auth, AuthConfig } from './auth.types';
import { WindowService } from '../utils/window.service';
import { filter, take } from 'rxjs/operators';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class AuthWebService extends AuthService implements Auth {
  constructor(public client: OidcSecurityService, public oidcConfigService: OidcConfigService,
    public configService: ConfigService, public window: WindowService) {
    super(client, oidcConfigService, configService, window)
    this.authFlowType = AuthFlowType.auth;
  }
  public onAuthCallback(url?: string) {
    if (this.authFlowType == AuthFlowType.auth) {
      if (this.client.moduleSetup) {
        this.onAuthCodeCallbackLogic(window.location.toString());
      } else {
        this.client.onModuleSetup.subscribe(() => {
          this.onAuthCodeCallbackLogic(window.location.toString());
        });
      }

    } else {
      this.client.getIsModuleSetup().pipe(
        filter((isModuleSetup: boolean) => isModuleSetup),
        take(1)
      ).subscribe((isModuleSetup: boolean) => {
        this.onAuthImplicitCallbackLogic();
      });
    }
  }
}
