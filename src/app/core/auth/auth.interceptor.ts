import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest, HttpEvent
} from '@angular/common/http';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, take, switchMap, filter, mergeMap } from 'rxjs/operators';
import { AuthFlowType } from './auth.types';

/**
  * AuthInterceptor
  *@description: Basic Auth Interceptor
  */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const request = this.addAuthenticationToken(req);
    return next.handle(request).pipe(
      catchError(error => {
        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case
        if (error.status !== 401) {
          this.authService.handleError(error);
          return throwError(error);
        }
        if (this.authService.authFlowType === AuthFlowType.code) {
          const token = this.authService.getRefreshToken();
          return this.authService.requestWithRefreshToken(token).pipe(mergeMap(() => {
            return next.handle(this.addAuthenticationToken(request));
          }), catchError((err) => { this.authService.handleError(err); return throwError(err); })) as Observable<HttpEvent<any>>;
        }
        this.authService.handleError(error);
        return throwError(error);
      })


    )
  }
  // add header token
  private addAuthenticationToken(req) {
    const token = this.authService.getAccessToken();
    if (!token) {
      return req;
    }
    const header = `Bearer ${token}`;
    const headers = req.headers.set('Authorization', header);
    return req.clone({ headers });
  }
}