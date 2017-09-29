import { WeeksProvider } from '../../providers/weeks-provider';
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import { cordovaWarn } from 'ionic-native/dist/esm';
import { GameResult } from '../../models/game-result';
import { Scorecard, Pick, WeeklyScorecard } from '../../models/scorecard';
import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ScorecardsProvider } from '../../providers/scorecards-provider';
import { User } from '../../models/user';
import * as _ from 'underscore';
import { Week } from "../../models/week";
import { LoginPage } from "../login/login";
import { Observable } from 'rxjs/Observable';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from "../../providers/auth.provider";
import { Score } from "../../models/score";

@IonicPage({
  segment: 'week/:week'
})
@Component({
  selector: 'page-week',
  templateUrl: 'week.html',
})
export class WeekPage {

  week: Week;
  scorecards: WeeklyScorecard[];
  favorites: WeeklyScorecard[];
  currentUserScorecard: Scorecard;
  loading: Loading;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private scorecardsProvider: ScorecardsProvider,
    private dataProvider: XmasClubDataProvider,
    private loadingCtrl: LoadingController) {

    this.favorites = [];
  }

  async ionViewDidEnter() {

    this.showLoading();

    if (this.navParams.get('week')) {
      this.week = await this.dataProvider.getWeek(parseInt(this.navParams.get('week')));
    } else {
      this.week = await this.dataProvider.currentWeek();
    }

    this.loadWeeklyScores();

    this.loading.dismiss();
  }

  public login() {
    this.navCtrl.push(LoginPage);
  }

  public viewScorecard(scorecard: WeeklyScorecard) {

    this.navCtrl.push('ScorecardPage', { week: this.week.week, nickname: scorecard.nickname });
  }

  public canCreateScorecard(): boolean {

    if (!this.week) return false;

    /* Only if the current user is authenticated */
    if (!this.authProvider.isAuthenticated) return false;

    /* Only if this is the current users doesn't already have a scorecard for this week */
    if (this.doesCurrentUserHaveScorecardAlready()) return false;

    /* Only if it is before the due date. */
    if (new Date() >= new Date(this.week.dueDate)) return false;

    return true;
  }

  private queriedForScorecard: boolean;
  private doesCurrentUserHaveScorecardAlready(): boolean {

    if (!this.currentUserScorecard) {

      if (this.authProvider.isAuthenticated) {

        if (!this.queriedForScorecard) {

          this.queriedForScorecard = true;

          this.scorecardsProvider.getScorecard(this.week.week, this.authProvider.user.nickname).first().toPromise().then(scorecard => {
            if (scorecard) {
              this.currentUserScorecard = scorecard;
            } else {
              console.log('No scorecard exists for user');
            }

          });
        }
      }
    }
    else {
      return true;
    }

    return false;
  }

  public async createScorecard() {

    /* Create a new scorecard. */
    if (this.authProvider.isAuthenticated && this.authProvider.user != null) {

      this.showLoading();

      if (!this.currentUserScorecard) {

        this.currentUserScorecard = await this.scorecardsProvider.createScorecard(this.week.week, this.authProvider.user.nickname);
      }

      this.navCtrl.push('ScorecardPage', { enableEditMode: true, week: this.week.week, nickname: this.authProvider.user.nickname });
    }
  }

  public viewFavoriteScorecards() {
    this.navCtrl.push('WeeklyLeaderboardPage', { week: this.week.week, favoritesOnly: true });
  }

  public viewAllScorecards() {
    this.navCtrl.push('WeeklyLeaderboardPage', { week: this.week.week });
  }

  private async loadWeeklyScores() {

    let favorites: Array<WeeklyScorecard> = new Array<WeeklyScorecard>();
    let scorecards: Array<WeeklyScorecard> = new Array<WeeklyScorecard>();

    let scores = await this.dataProvider.scores.first().toPromise();
    scores.forEach((score: Score) => {

      let total = 0;
      let submitted = false;
      let weeklyScore = _.find(score.weeklyScores, (ws) => ws.week === this.week.week);
      if (weeklyScore) {

        submitted = (weeklyScore.total != null) || (this.week.winner && this.week.winner.length > 0);
        total = weeklyScore.total ? weeklyScore.total : (weeklyScore.score ? weeklyScore.score : 0);
      }

      let scorecard = {
        nickname: score.$key,
        score: total,
        rank: 0
      };

      if (submitted) {

        if (this.authProvider.isAuthenticated) {

          /* Populate the current user into the favorites list. */
          if (scorecard.nickname == this.authProvider.user.nickname) {
            favorites.push(scorecard);
          }

          /* Populate any favorites for this user. */
          if (this.authProvider.user.favorites) {

            if (_.some<string>(this.authProvider.user.favorites, nickname => nickname == scorecard.nickname)) {
              favorites.push(scorecard);
            }
          }
        }

        scorecards.push(scorecard);
      }
    });

    let orderedScorecards = _.sortBy(scorecards, 'score').reverse();

    let winnerIndex = _.findIndex(orderedScorecards, { nickname: this.week.winner })
    if (winnerIndex > 0) {
      let winner = orderedScorecards[winnerIndex];
      orderedScorecards.splice(winnerIndex, 1);
      orderedScorecards.splice(0, 0, winner);
    }

    let rank: number = 0;
    let previousScore: number = 0;
    for (let scorecard of orderedScorecards) {

      if (rank === 0 && winnerIndex > 0) {
        /* The week is complete and we have a winner, set it so there is only one person who won */
        /* I am ignoring ties at the moment */
        rank = 1;
      } else {

        if (scorecard.score !== previousScore) {
          rank++;
        }

        previousScore = scorecard.score;
      }

      scorecard.rank = rank;
    }

    this.favorites = _.sortBy(favorites, 'rank');

    this.scorecards = orderedScorecards;
  }

  private canViewDetailedScorecardView() {

    if (this.authProvider.isAdministrator) {
      return true;
    }

    if (this.week && new Date() >= new Date(this.week.dueDate)) {
      return true;
    }

    return false;
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
