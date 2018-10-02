import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

/*
 * The one and only page!
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private loggedIn: boolean = false;

  constructor(private navCtrl: NavController, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getAuthenticatedUser().subscribe(user => {
      this.loggedIn = user != null;
    });
  }

  loginLogout() {
    if (this.loggedIn) {
      this.logout();
    } else {
      this.login();
    }
  }

  private login() {
    console.log("Logging in");
    this.authService.googleLogin();
  }

  private logout() {
    console.log("Logging out");
    this.authService.googleLogout().then(value => {
      console.log("Routing to HomePage");
      this.navCtrl.push(HomePage)
    });
  }
}
