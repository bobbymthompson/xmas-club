import { currentSlidesPerView } from 'ionic-angular/components/slides/swiper';
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import { ScorecardsProvider } from '../../providers/scorecards-provider';
import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import * as _ from 'underscore';
import { Scorecard } from "../../models/scorecard";
import { Score } from "../../models/score";
import { Week } from "../../models/week";

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  scorecards: Scorecard[];
  currentWeek: Week;
  loading: Loading;
  weeklyScoresOutput: string;

  constructor(public navCtrl: NavController,
    private scorecardsProvider: ScorecardsProvider,
    private dataProvider: XmasClubDataProvider,
    private loadingCtrl: LoadingController,
    private alertController: AlertController) {

    this.dataProvider.currentWeek().then((week) => {
      this.currentWeek = week;
    });
  }

  public async loadScorecardsFromEmail() {

    this.showLoading();

    let currentWeek = await this.dataProvider.currentWeek();
    
    let result = await this.scorecardsProvider.loadScorecardsFromEmail(currentWeek.week);

    this.scorecards = result.Results;

    let list = this.scorecards.map(sc => sc.nickname);

    if (result.Errors && result.Errors.length > 0) {

      list.push(`***ERRORS***`);

      result.Errors.forEach(error => {
        list.push(error)
      });
    }

    this.navCtrl.push('ListPage', {
      title: 'Loaded scorecards',
      list: list
    });

    this.loading.dismiss();
  }

  public async previewEmailInbox() {
    this.showLoading();

    let currentWeek = await this.dataProvider.currentWeek();
    
    let results = await this.scorecardsProvider.showEmailsInInbox(currentWeek.week);

    let list: string[] = [];

    results.forEach(result => {

      let user = result.User ? result.User : 'NO NAME';
      list.push(`${user} (${result.FromEmail})`);

      if (result.Attachments) {
        result.Attachments.forEach(attachment => {
          list.push(`-----${attachment.Name} (Valid: ${attachment.IsValid ? 'Yes' : 'No'})`);
          if (!attachment.IsValid) {
            list.push(`-----${attachment.InvalidDetails}`);
          }
        })
      }
    });

    this.navCtrl.push('ListPage', {
      title: 'Emails',
      list: list
    });

    this.loading.dismiss();
  }

  private async populateScoresFromScorecards() {

    this.showLoading();

    let weeks = await this.dataProvider.getWeeks();

    let currentWeek = _.find(weeks, (week) => week.week === 3);
    console.log(`Updating scores for week: ` + currentWeek.week);
    //let currentWeek = await this.dataProvider.currentWeek();

    let scorecards = await this.dataProvider.getScorecardResults(currentWeek.week);

    scorecards.forEach(scorecard => {

      this.scorecardsProvider.insertWeeklyScore(scorecard);
    });

    this.loading.dismiss();
  }

  private async forceUpdateOfScores() {
    this.dataProvider.forceUpdateOfScores();
  }

  private async addNewWeek() {


    let alert = this.alertController.create({
      title: 'Confirm',
      message: 'Are you sure you want to create a new week?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.dataProvider.addWeek();
          }
        }
      ]
    });

    alert.present();
  }

  private async checkForScorecardsWithoutPicks() {

    this.showLoading();

    let users = await this.dataProvider.checkForScorecardsWithoutPicks(this.currentWeek.week);

    this.navCtrl.push('ListPage', {
      title: 'Blank Scorecards',
      list: users
    });

    this.loading.dismiss();
  }

  private async showUnsubmittedPicks() {

    this.showLoading();

    let users = await this.dataProvider.getUnsubmittedUsersForWeek(this.currentWeek.week);

    this.navCtrl.push('ListPage', {
      title: 'Unsubmitted Players',
      list: users
    });

    this.loading.dismiss();
  }

  private async outputWeeklyScores() {

    let currentWeek = await this.dataProvider.currentWeek();

    let scorecards = await this.dataProvider.getScorecardResults(currentWeek.week);

    scorecards.forEach(scorecard => {

      this.weeklyScoresOutput += scorecard.nickname + '\t' + scorecard.score + '\n';
    });

  }

  public async showEmailsInInbox() {
    
    this.showLoading();

    let currentWeek = await this.dataProvider.currentWeek();

    let emails = await this.scorecardsProvider.showEmailsInInbox(currentWeek.week);

    let list = [];

    emails.forEach(email => {

      let item = `${email.User} (${email.FromEmail})`;

      email.Attachments.forEach(attachment => {
        item += '\n';
        item += `${attachment.Name}`;
        if (!attachment.IsValid) {
          item += '\n';
          item += '\n';
          item += `${attachment.InvalidDetails}`;
        }
      });

      list.push(item);
    });

    this.navCtrl.push('ListPage', {
      title: 'Loaded scorecards',
      list: list
    });

    this.loading.dismiss();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
