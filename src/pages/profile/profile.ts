import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScorecardsProvider } from "../../providers/scorecards-provider";
import { XmasClubDataProvider } from "../../providers/xmas-club.provider";
import { AuthProvider } from "../../providers/auth.provider";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private scorecardsProvider: ScorecardsProvider,
    private dataProvider: XmasClubDataProvider,
    private authProvider: AuthProvider, ) {
  }

  ionViewDidLoad() {

    if (!this.authProvider.isAuthenticated) {
      this.navCtrl.push(LoginPage);
    } else {
      console.log('Loading Profile page');
    }
  }

  private login() {
    this.navCtrl.push(LoginPage);
  }

  private logout() {
    this.authProvider.logoutUser();
    this.navCtrl.parent.select(1);
  }
}
