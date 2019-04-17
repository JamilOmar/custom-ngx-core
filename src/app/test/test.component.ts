import { Component, OnInit } from '@angular/core';
import { ConfigService, AuthWebService, AuthService } from '../core';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private nxgCoreConfig: ConfigService , private authService : AuthService) { }

  ngOnInit() {
    this.authService.configure(this.nxgCoreConfig.get('auth')).subscribe();
    this.authService.onAuthCallback();
  }

  onLogin() {
   this.authService.login();
  }

  onRefreshToken(){
    this.authService.requestWithRefreshToken('0dBtv912eQzZJMqO385_7RAIwZj').subscribe((c)=> console.log(c));
  }

  onLogout(){
    this.authService.logout();
  }

  onGetProfile()
  {

    this.authService.getProfile().subscribe((data)=>{

      console.log(data);
    });
  }
  onGetBrowsers():boolean{
    return false;

  }

}
