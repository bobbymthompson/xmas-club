import { currentSlidesPerView } from 'ionic-angular/components/slides/swiper';
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import { ScorecardsProvider } from '../../providers/scorecards-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'underscore';
import { Scorecard } from "../../models/scorecard";
import { Score } from "../../models/score";

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  scorecards: Scorecard[];

  constructor(public navCtrl: NavController, private scorecardsProvider: ScorecardsProvider, private dataProvider: XmasClubDataProvider) {
  }

  private async loadScorecardsFromEmail() {

    let currentWeek = await this.dataProvider.currentWeek();
    this.scorecards = await this.scorecardsProvider.loadScorecardsFromEmail(currentWeek.week);
  }

  private async populateScoresFromScorecards() {

    let currentWeek = await this.dataProvider.currentWeek();

    let scores: Score[] = await this.dataProvider.scores.first().toPromise();

    let results = await this.dataProvider.getScorecardResults(currentWeek.week);

    scores.forEach(score => {

      let weeklyScore = 0;

      let scorecard = _.find(results, scorecard => scorecard.nickname === score.$key);
      if (scorecard) {
        weeklyScore = scorecard.score;
      }

      this.dataProvider.addScoreForUser(score.$key, currentWeek.week, weeklyScore);
    });
  }

  private async addNewWeek() {

    this.dataProvider.addWeek();
  }
}
