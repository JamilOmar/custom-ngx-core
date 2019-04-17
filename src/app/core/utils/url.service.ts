import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
  constructor() { }
  /**
   *
   * @param {string} url
   * @returns {string}
   */
  public normalize(url: string): string {
    return url
      .replace(/[\/]+/g, '/')
      .replace(/\:\//g, '://');
  }
  /**
   *
   * @param {string[]} urls to joing
   * @returns {string}
   */
  public joinUrl(...args: string[]) {
    const url = args.join('/');
    return this.normalize(url);
  }
}
