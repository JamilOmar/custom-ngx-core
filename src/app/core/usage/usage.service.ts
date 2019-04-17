import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config';
import { UsageItem } from './usage.types';
import * as _ from 'lodash';
import { UsageKeys } from './usage.keys';
@Injectable()
export class UsageService {
  constructor(private httpClient: HttpClient,
    private configService: ConfigService) { }
  /**
    * @description Get the usage API service URL
    * @returns {string}
    */
  public getUrl(): string {
    return this.configService.get(UsageKeys.USAGE_URL, '');
  }

  /**
    * @description Get the usage API service metadata
    * @returns {string}
    */
  public getApplication(): string {
    return this.configService.get(UsageKeys.USAGE_APPLICATION, '');
  }

  /**
    * @description Checks the usage API service URL
    * @returns {string}
    */
  public hasUrl(): boolean {
    return this.configService.has(UsageKeys.USAGE_URL);
  }

  /**
    * @description Checks the usage API service application
    * @returns {string}
    */
  public hasApplication(): boolean {
    return this.configService.has(UsageKeys.USAGE_APPLICATION);
  }
  /**
   * @description Sends the usage item to the api
   * @param item - JSON object with usage data
   */
  public send(item: UsageItem) {
    if (this.hasUrl()) {
      if (!this.hasApplication()) {
        throw new Error(UsageKeys.USAGE_APPLICATION_ERROR);
      }
      if (!_.has(item, UsageKeys.USAGE_EVENT)) {
        throw new Error(UsageKeys.USAGE_EVENT_ERROR);
      }
      const url = this.getUrl();
      const application = this.getApplication();
      item = _.mergeWith(item, { application });
      return this.httpClient.post(
        url,
        item
      ).subscribe();
    }
  }
}
