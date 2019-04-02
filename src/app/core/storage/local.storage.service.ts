"use strict";
import { Injectable } from '@angular/core';
import { Storage } from './storage.types';
import {Browser} from '../utils';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements Storage {
  async getItem(key: string):Promise<string> {
    if (Browser.isChromeApp) {
      return new Promise((resolve, reject) => {
        Browser.chromeApp.storage.get(key, (object) => {
          if (object && object[key]) {
            resolve(object[key]);
          } else {
            reject(key + ' not found');
          }
        });
      });
    } else {
      const value = localStorage.getItem(key);
      if (value) {
        return value;
      } else {
        throw new Error(key + ' not found')
      }
    }
  }
  setItem(key: string, value: string) {
    if (Browser.isChromeApp) {
      const keyValPair = {
        key: null
      };
      keyValPair.key = value;
      Browser.chromeApp.storage.sync.set(keyValPair);
    } else {
      localStorage.setItem(key, value);
    }
  }
  removeItem(key: string) {
    if (Browser.isChromeApp) {
      Browser.chromeApp.storage.sync.remove(key);
    }else{
      localStorage.removeItem(key);
    }
  }
  clear(){
    if (Browser.isChromeApp) {
      Browser.chromeApp.storage.sync.clear();
    }else{
      localStorage.clear();
    }
  }
}
