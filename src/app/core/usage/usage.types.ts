export interface UsageConfig {
  url: string,
  application: string
}


export interface UsageItem {
  event: string
  [key: string]: any;
}
