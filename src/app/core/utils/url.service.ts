import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }
  /**
   *
   * @param {string} url
   * @returns {string}
   */
  normalize(url: string): string {
    return url
      .replace(/[\/]+/g, '/')
      .replace(/\:\//g, '://');
  }
  joinUrl(...args: string[]) {
    const url = args.join('/');
    return this.normalize(url);
  }
  /**
     * @description Obtains a query parameter from a URL
     * @param name
     * @param url
     * @returns {any}
     */
  getParameterByName(name: string, url?: string): string {
    let aURL = url,
      params = {},
      pairs = aURL.slice(aURL.indexOf('#') + 1).split('?');

    if (pairs.length > 1) {
      params['page'] = pairs[0];
      pairs = pairs[1].split('&');
    } else {
      pairs = pairs[0].split('&');
    }

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      if (pair.length > 1) {
        params[pair[0]] = pair[1];
      } else {
        params[pair[0]] = null;
      }
    }

    return params[name];
  }
}
