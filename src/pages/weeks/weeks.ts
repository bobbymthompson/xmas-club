import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import { Observable } from 'rxjs/Observable';
import { Week } from "../../models/week";
import * as _ from "underscore";

@IonicPage()
@Component({
  selector: 'page-weeks',
  templateUrl: 'weeks.html',
})
export class WeeksPage {

  weeks: Week[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider: XmasClubDataProvider) { }

  async ionViewDidLoad() {

    this.weeks = await this.dataProvider.getWeeks();
  }

  public viewWeek(week: any) {

    this.navCtrl.push('WeekPage', { week: week.week });
  }
}
