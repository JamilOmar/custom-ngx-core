import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG, ConfigService, WindowService } from './core';
import { TestComponent } from './test/test.component';
import { environment } from '../environments/environment';
import {
  AuthModule, OidcSecurityService, OidcConfigService,
} from 'angular-auth-oidc-client';
import { AuthInterceptor, AuthBaseService, AuthFactory } from './core/auth';
@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot()
  ],
  providers: [ 
    { provide: AuthBaseService,  useFactory: AuthFactory,
      deps: [OidcSecurityService,OidcConfigService,ConfigService, WindowService]},
    { provide:CONFIG , useValue: environment },
   ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
