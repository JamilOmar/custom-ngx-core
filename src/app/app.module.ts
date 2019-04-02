import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './core';
import { TestComponent } from './test/test.component';
import { environment } from '../environments/environment';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthInterceptor } from './core/auth';
@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [  { provide:CONFIG , useValue: environment },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
