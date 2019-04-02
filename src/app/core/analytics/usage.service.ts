import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UsageService {
  constructor(private httpClient: HttpClient,
    private configService: ConfigService) { }
   /**
     * @description Get the usage API service URL
     * @returns {string}
     */
    public getUrl(): string {
      return  this.configService.get('usage.url' , ''); 
  }
  /**
   * @description Sends the usage item to the api
   * @param item - JSON object with usage data
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
