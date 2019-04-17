import { AuthConfig } from '../auth/auth.types';
import { AnalyticsConfig } from '../analytics';
import { UsageConfig } from '../usage';


export interface Config {
  auth?: AuthConfig;
  usage?: UsageConfig;
  analytics?: AnalyticsConfig;
  [key: string]: any;
}