import { WeeksProvider } from '../../providers/weeks-provider';
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import { cordovaWarn } from 'ionic-native/dist/esm';
import { GameResult } from '../../models/game-result';
import { Scorecard, Pick } from '../../models/scorecard';
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

@IonicPage({
  segment: 'week/:week'
})
@Component({
  selector: 'page-week',
  templateUrl: 'week.html',
})
export class WeekPage {

  week: Week;
  scorecards: Scorecard[];
  favorites: Scorecard[];
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

    this.loadScorecards();

    this.loading.dismiss();
  }

  public login() {
    this.navCtrl.push(LoginPage);
  }

  public viewScorecard(scorecard: Scorecard) {

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

      let scorecard = await this.scorecardsProvider.createScorecard(this.week.week, this.authProvider.user.nickname);

      this.navCtrl.push('ScorecardPage', { enableEditMode: true, week: this.week.week, nickname: this.authProvider.user.nickname });
    }
  }

  public viewFavoriteScorecards() {

  }

  public viewAllScorecards() {

  }

  private async loadScorecards() {

    let favorites: Array<Scorecard> = new Array<Scorecard>();

    let scorecards = await this.dataProvider.getScorecardResults(this.week.week);

    scorecards.forEach(scorecard => {

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

    });

    this.favorites = favorites; // _.sortBy(favorites, 'score').reverse();

    this.scorecards = scorecards;
  }

  private canViewTieBreakerScore() : boolean {

    if (this.authProvider.isAdministrator) {
      return true;
    }

    /* Only if it is before the due date. */
    if (new Date() >= new Date(this.week.dueDate)) {
      return true;
    }

    return false;
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
