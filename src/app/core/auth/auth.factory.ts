import { AuthElectronService } from "./auth.electron.service";
import { AuthWebService } from './auth.web.service';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';
import { ConfigService } from '../config';
import { WindowService } from '../utils';
import {GlobalKeys, AppType} from '../global';
 /**
   * AuthFactory
   *@description: Factory method for creating Auth Instances, for example given the configuration
   * it can create a web authentication or an electron authentication
   */
export const AuthFactory = (client: OidcSecurityService, oidcConfigService: OidcConfigService,
  configService: ConfigService, window: WindowService) => {
  const type = configService.get(GlobalKeys.APP_TYPE, AppType.web);
  switch (type) {
    case AppType.electron:
      return new AuthElectronService(client, oidcConfigService, configService, window);
    case AppType.web:
    default:
      return new AuthWebService(client, oidcConfigService, configService, window);
  }
};