import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { WeeksProvider } from '../../providers/weeks-provider';
import { Score } from '../../models/score';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import { Week } from "../../models/week";
import { XmasClubDataProvider } from "../../providers/xmas-club.provider";
import { ReverseArrayPipe } from '../../pipes/reverse-array';
import { Scorecard } from "../../models/scorecard";

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {
  currentWeek: Week;
  scores: Score[]
  weeks: Week[];
  loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: XmasClubDataProvider,
    private loadingCtrl: LoadingController) { }

  async ionViewDidEnter() {

    this.showLoading();

    this.weeks = await this.dataProvider.getWeeks();
    this.currentWeek = await this.dataProvider.currentWeek();

    let results = await this.dataProvider.getScorecardResults(this.currentWeek.week);

    let scores = await this.dataProvider.scores.first().toPromise();


    scores.forEach((score: Score, index) => {
      score.sortedScores = [];

      _.values(score.weeklyScores).forEach((ws) => {
        score.sortedScores.splice(0, 0, ws.score);
      });

      /* If scores for this week haven't been pushed in, use the current weeks scores */
      if (score.sortedScores.length != this.currentWeek.week) {

        score.sortedScores.splice(0, 0, this.getCurrentWeekScore(results, score.$key));
      }

      /* Calculate the total score. */
      let total: number = 0;
      score.sortedScores.forEach((value) => {
        total += value;
      });
      
      score.total = total;
    });
    
    this.scores = scores.sort((a, b) => {
      return b.total - a.total;
    });

    

    this.loading.dismiss();
  }

  private getCurrentWeekScore(scorecards: Scorecard[], nickname: string): number {

    let scorecard = _.find(scorecards, s => s.nickname === nickname);

    if (scorecard) {
      return scorecard.score;
    }

    return 0;
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
