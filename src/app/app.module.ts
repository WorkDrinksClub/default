import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { firebaseConfig } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddUser } from '../components/add-user.component';

import { ChangesService } from '../services/changes.service';
import { MemberService } from '../services/firestore.member.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { MembersComponent } from '../components/members.component';
import { InventoryComponent } from '../components/inventory.component';
import { DetailsComponent } from '../components/details.component';
import { ChangesComponent } from '../components/changes.component';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddUser,
    ChangesComponent,
    InventoryComponent,
    MembersComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ChangesService,
    MemberService,
    AuthService,
    ToastService
  ]
})
export class AppModule { }
