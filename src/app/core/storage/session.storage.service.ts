import { Injectable } from '@angular/core';
import * as utils from '../utils';
import { Storage } from './storage.types';
@Injectable({
  providedIn: 'root'
})

export class SessionStorageService implements Storage {
  getItem(key: string): string {
    let item = sessionStorage.getItem(key);
    return item;

  }
  setItem(key: string, value: string) {
    sessionStorage.setItem(key, value);

  }
  removeItem(key: string) {
    sessionStorage.removeItem(key);

  }
  clear() {
    sessionStorage.clear();
  }
}
