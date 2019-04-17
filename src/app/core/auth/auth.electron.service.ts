import { Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';
import * as _ from 'lodash';
import { AuthFlowType } from './auth.types';
import { AuthBaseService } from './auth.base.service';
import { WindowService } from '../utils/window.service';
import { AuthKeys } from './auth.keys';
 /**
   * AuthElectronService Service
   *@description: Provides the main functionality for authentication with electron
   */
@Injectable()
export class AuthElectronService extends AuthBaseService {
    private authWindow;
    constructor(public client: OidcSecurityService, public oidcConfigService: OidcConfigService,
        public configService: ConfigService, public window: WindowService) {
        super(client, oidcConfigService, configService, window)
          // auth flow by default
          this.authFlowType =    this.authConfig.authFlowType || AuthFlowType.code;
          this.authConfig.redirectUrl =  this.authConfig.redirectUrl ||AuthKeys.ELECTRON_DEFAULT_REDIRECT_URL;
    }
    public login() {
        // creates a new popup window for authentication
        const BrowserWindow = this.window.nativeWindow.require('electron').remote.BrowserWindow;
        this.authWindow = new BrowserWindow({
            title: 'Login',
            height: 600,
            width: 800,
            show: false,
            webPreferences: {
                nodeIntegration: false
            }
        });
        this.authWindow.on('close', () => {
            this.authWindow = null;  // Destroy reference
        }, false);
        this.authWindow.webContents.on('did-redirect-navigation', (event, url: string, isInPlace, isMainFrame, frameProcessId, frameRoutingId) => {

            if (this.authFlowType == AuthFlowType.code) {
                // validates  URL?code=.....
                const validationString = `(${this.authConfig.redirectUrl}.*).*\?.*(\A?code=[^&]+&*)`;
                const isValidUri = RegExp(validationString)
                if (isValidUri.test(url)) {
                    this.onAuthCodeCallbackLogic(this.uiRouterPatch(url));
                    this.destroyAuthWin();
                }
            } else {
                // validates  URL?#id_token=.....
                const validationString = `(${this.authConfig.redirectUrl}.*).*\?.*(\A?id_token=[^&]+&*)`;
                const isValidUri = RegExp(validationString)
                if (isValidUri.test(url)) {
                    const indexOfHash = url.indexOf('#');
                    this.onAuthImplicitCallbackLogic(url.substring(indexOfHash).substr(1));
                    this.destroyAuthWin();
                }

            }
        });
        // Hide the window if the connection to the authentication server could not be established
        this.authWindow.webContents.on('did-navigate', (event, url, httpResponseCode, httpStatusText) => {
            if (httpResponseCode === 404) {
                this.destroyAuthWin();
            }
        });
        super.login(this.authWindow.loadURL);
        this.authWindow.show();
    }
    public onAuthCallback(url?: string) {
    }
    // destroys the popup window
    private destroyAuthWin(): void {
        if (!this.authWindow) return;
        this.authWindow.close();
        this.authWindow = null;
    }

}
