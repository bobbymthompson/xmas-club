import { AuthProvider } from '../../providers/auth.provider';
import { LoginPage } from '../login/login';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = 'WeekPage';
  tab2Root: any = 'WeeksPage';
  tab3Root: any = 'LeaderboardPage';
  tab4Root: any = 'ProfilePage';
  tab5Root: any = 'AdminPage';
  mySelectedIndex: number;

  constructor(private navParams: NavParams, private authProvider: AuthProvider) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
