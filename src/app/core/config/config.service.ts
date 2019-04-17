import { Injectable, Optional, InjectionToken, Inject } from '@angular/core';
import {Config} from './config.types';
import defaults from './default.config.service';
import * as _ from 'lodash';
import { ConfigKeys } from './config.keys';
export const CONFIG= new InjectionToken<any>(ConfigKeys.CONFIG_TOKEN);
@Injectable()
export class ConfigService {

  private config:Config;
  constructor(@Optional() @Inject(CONFIG) configuration: Config) {
    this.load(configuration);
   }

   /**
     * @description Saves a configuration value. Undefined values are ignored. Nested objects are supported.
     * @param key
     * @param value
     */
    public set(key: string, value): void {
      if (_.isUndefined(value)) {
          return;
      }
      if (_.isObject(value)) {
          this.config[key] = _.defaults(value, this.config[key]);
      } else {
          this.config[key] = value;
      }
  }

  /**
   * @description Gets a value from the LabShare config object. Since it wraps the Lodash get() method,
   * the key can be a string or an array of strings.
   * @example
   * NgxCoreConfig.get('myKey') => 'value'
   * NgxCoreConfig.get('my.nested.value') => 'nested value'
   * @returns {IConfig}
   */
  public get(key: string , defaultValue?: any): any {
      return _.get(this.config, key, defaultValue);
  }

  /**
   * @description Validates if the property exists in the LabShare configuration
   * @example
   * NgxCoreConfig.has('myKey') => true
   * @returns {IConfig}
   */
  public has(key: string): boolean {
      return _.has(this.config, key);
  }

  public load(configuration? : Config){
    this.config = _.defaultsDeep( configuration , defaults);
  }
}
