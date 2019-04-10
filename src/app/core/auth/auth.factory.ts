import { AuthElectronService } from "./auth.electron.service";
import { AuthWebService } from './auth.web.service';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';
import { ConfigService } from '../config';
import { WindowService, BrowserService } from '../utils';

export const AuthFactory = (client: OidcSecurityService, oidcConfigService: OidcConfigService,
  configService: ConfigService, window: WindowService) => {
  const type = configService.get('appType', 'web');
  switch (type) {
    case 'electron':
      return new AuthElectronService(client, oidcConfigService, configService, window);
    case 'web':
    default:
      return new AuthWebService(client, oidcConfigService, configService, window);
  }
};