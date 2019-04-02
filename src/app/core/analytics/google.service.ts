import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {ConfigService} from '../config';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(private httpClient: HttpClient,
    private configService: ConfigService) { }

   /**
     * @description Get the analytics API service URL
     * @returns {string}
     */
    public getUrl(): string {
      return  this.configService.get('analytics.url' , ''); 
  }

  /**
   * @description Sends a metric object to the analytics service URL
   * @param item - JSON object with metric data
   */
  public send(item: any) {
      const url = this.getUrl();
      if (url) {
          return this.httpClient.post(
              url,
              item
          );
      }
  }
}
