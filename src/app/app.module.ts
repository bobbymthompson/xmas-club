import { IonicStorageModule } from '@ionic/storage/es2015';
import { LoginPage } from '../pages/login/login';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Settings } from '../providers/settings';
import { XmasClubApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { XmasClubDataProvider } from '../providers/xmas-club.provider';
import { WeeksProvider } from '../providers/weeks-provider';
import { ScorecardsProvider } from '../providers/scorecards-provider';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth.provider';
import { RegisterPage } from "../pages/register/register";

export const firebaseConfig = {
  apiKey: "AIzaSyDgh6wIiKbNUFhqgtmRuPHw6bGJ8KrIqg0",
  authDomain: "xmas-club.firebaseapp.com",
  databaseURL: "https://xmas-club.firebaseio.com",
  projectId: "xmas-club",
  storageBucket: "",
  messagingSenderId: "260309513061"
};

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true
  });
}

/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  XmasClubApp,
  TabsPage,
  LoginPage,
  RegisterPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    ScorecardsProvider,
    XmasClubDataProvider,
    AuthProvider,

    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(XmasClubApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule { }

