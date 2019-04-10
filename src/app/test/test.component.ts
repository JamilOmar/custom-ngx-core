import { Component, OnInit } from '@angular/core';
import { ConfigService, AuthWebService, AuthBaseService } from '../core';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private nxgCoreConfig: ConfigService , private authService : AuthBaseService) { }

  ngOnInit() {
    this.authService.configure(this.nxgCoreConfig.get('auth'));
    this.authService.onAuthCallback();
  }

  onLogin() {
   this.authService.login();
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
