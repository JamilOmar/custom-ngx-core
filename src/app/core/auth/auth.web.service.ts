import { Injectable } from '@angular/core';
import { AuthBaseService } from './auth.base.service';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';
import { ConfigService } from '../config';
import { AuthFlowType, AuthConfig } from './auth.types';
import { WindowService } from '../utils/window.service';
import { filter, take } from 'rxjs/operators';
import * as _ from 'lodash';

/**
  * AuthWebService Service
  *@description: Provides the main functionality for web app authentication
  */
@Injectable()
export class AuthWebService extends AuthBaseService {
  constructor(public client: OidcSecurityService, public oidcConfigService: OidcConfigService,
    public configService: ConfigService, public window: WindowService) {
    super(client, oidcConfigService, configService, window);
    // implicit flow by default
    this.authFlowType = this.authConfig.authFlowType || AuthFlowType.implicit;
  }
  // this must be at the constructor
  public onAuthCallback(url?: string) {
    // when the page loads it will perform the callback for the defined authentication method
    if (this.authFlowType == AuthFlowType.code) {
      if (this.client.moduleSetup) {
        this.onAuthCodeCallbackLogic(this.uiRouterPatch(this.window.nativeWindow.location.toString()));
      } else {
        this.client.onModuleSetup.subscribe(() => {
          this.onAuthCodeCallbackLogic(this.uiRouterPatch(this.window.nativeWindow.location.toString()));
        });
      }

    } else {
      this.client.getIsModuleSetup().pipe(
        filter((isModuleSetup: boolean) => isModuleSetup),
        take(1)
      ).subscribe((isModuleSetup: boolean) => {
        if (this.window.nativeWindow.location.hash !== '') {
          this.onAuthImplicitCallbackLogic(this.window.nativeWindow.location.hash.substr(1));
        }
      });
    }
  }
}
