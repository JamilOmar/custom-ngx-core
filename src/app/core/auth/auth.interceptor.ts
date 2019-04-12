import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AuthService } from './auth.base.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    if (!_.isEmpty(token)) {
      const header = `Bearer ${this.authService.getAccessToken()}`;
      const headers = req.headers.set('Authorization', header);
      const transformedReq = req.clone({ headers });
      return next.handle(transformedReq);
    } else {
      return next.handle(req);
    }
  }
}