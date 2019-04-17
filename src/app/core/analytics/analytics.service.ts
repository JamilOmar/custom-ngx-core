import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ConfigService } from '../config';
import { HttpClient } from '@angular/common/http';
import { AnalyticsKeys } from './analytics.keys';
@Injectable()
export class AnalyticsService {

  constructor(private httpClient: HttpClient,
    private configService: ConfigService) { }

  /**
    * @description Get the analytics API service URL
    * @returns {string}
    */
  public getUrl(): string {
    return this.configService.get(AnalyticsKeys.ANALYTICS_URL, '');
  }

  /**
    * @description Checks the analytics API service URL
    * @returns {boolean}
    */
  public hasUrl(): boolean {
    return this.configService.has(AnalyticsKeys.ANALYTICS_URL);
  }

  /**
   * @description Sends a metric object to the analytics service URL
   * @param item - JSON object with metric data
   */
  public send(item: any) {
    if (this.hasUrl()) {
      const url = this.getUrl();
      return this.httpClient.post(
        url,
        item
      ).subscribe();
    }
  }
}
