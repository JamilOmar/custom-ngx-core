import { AuthConfig } from '../auth/auth.types';

export interface UsageConfig {
  url: string;
}

export interface AnalyticsConfig {
  url: string
}

export interface Config {
  auth: AuthConfig;
  usage?: UsageConfig;
  analytics?: AnalyticsConfig;
  [key: string]: any;
}