import { Component, OnInit } from '@angular/core';
import { ConfigService, AuthService } from '../core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private nxgCoreConfig: ConfigService , private authService : AuthService) { }

  ngOnInit() {

    console.log(this.nxgCoreConfig.get('test'));
    this.authService.configure(this.nxgCoreConfig.get('auth'));
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

}
