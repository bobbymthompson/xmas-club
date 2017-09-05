import { AuthProvider } from '../providers/auth.provider';
import { LoginPage } from '../pages/login/login';
import { PageInterface } from '../models/page-interface';
import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class XmasClubApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Home', component: TabsPage, icon: 'home' }
  ];

  rootPage: any;

  constructor(
    public events: Events,
    public menu: MenuController,
    public platform: Platform,
    public storage: Storage) {

    this.rootPage = TabsPage;

    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      Splashscreen.hide();
      StatusBar.backgroundColorByHexString('#3EB29A');
    });

    /* Load any initial configuration that is needed */
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });

    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      // setTimeout(() => {
      //   this.userData.logout();
      // }, 1000);
    }
  }
}
