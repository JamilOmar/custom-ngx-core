import { Injectable } from '@angular/core';
import {WindowService} from './window.service';
@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(private window: WindowService) { }
  get isElectronApp(): boolean {
    const w = this.window && this.window['process'] && this.window['process'].versions && this.window['process'].versions.electron;
    return w !== undefined && w !== null;
  }
  get isCordovaApp(): boolean {
    return !!this.window['cordova'];
  }
}
