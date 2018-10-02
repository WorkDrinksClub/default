import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs';
import { ToastService } from './toast.service';

/*
 * Service to authenticate with Firebase - currently only supports Google accounts
 */
@Injectable()
export class AuthService {

  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(private afAuth: AngularFireAuth, private toastService: ToastService) {
    this.user = afAuth.authState;
    this.user.subscribe((user) => {
      this.userDetails = (user) ? user : null;
    });
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider).catch(reason => {
      console.log("Failed to login: " + reason);
      this.toastService.presentToast("Failed to login, please try again later");
    });
  }

  googleLogout() {
    return this.afAuth.auth.signOut().catch(reason => {
      console.log("Failed to logout: " + reason);
      this.toastService.presentToast("There was a problem logging out");
    });
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  public isAuthenticated(): boolean {
    return this.userDetails != null;
  }

  public getAuthenticatedUser(): Observable<firebase.User> {
    return this.user;
  }
}
