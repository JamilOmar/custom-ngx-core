import { Injectable } from '@angular/core';
function _window() : any {
  return window;
}
@Injectable({
  providedIn: 'root'
})
export class WindowService {

  get nativeWindow(){
    return _window();
 }
}
