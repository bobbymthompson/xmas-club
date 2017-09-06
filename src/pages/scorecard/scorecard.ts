import { ScorecardsProvider } from '../../providers/scorecards-provider';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Scorecard, Pick } from "../../models/scorecard";
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import * as _ from 'underscore';
import * as moment from 'moment';
import { Week } from "../../models/week";
import { FirebaseObjectObservable } from "angularfire2/database";
import { AuthProvider } from "../../providers/auth.provider";
import { Observable } from "rxjs/Rx";

@IonicPage()
@Component({
  selector: 'page-scorecard',
  templateUrl: 'scorecard.html',
})
export class ScorecardPage {
  scorecard: Scorecard;
  _scorecard: Observable<Scorecard>;
  inEditMode: boolean;
  dueDate: Date;
  week: number;
  tieBreakerScore: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private scorecardsProvider: ScorecardsProvider,
    private dataProvider: XmasClubDataProvider,
    private authProvider: AuthProvider,
    private elementRef: ElementRef) {

    this.week = this.navParams.get('week');
    this._scorecard = this.scorecardsProvider.getScorecard(this.week, this.navParams.get('nickname'));
    
    this._scorecard.subscribe(async scorecard => {

      this.scorecard = scorecard;
    
      if (scorecard) {

        this.tieBreakerScore = scorecard.tieBreakerScore;
        this.dueDate = new Date((await this.dataProvider.getWeek(this.week)).dueDate);

        for (let pick of scorecard.picks) {

          (<EditablePick>pick).team1Selected = (pick.selectedPick == 'Team1') ? true : false;
          (<EditablePick>pick).team2Selected = (pick.selectedPick == 'Team2') ? true : false;
        }
      }
    });

    if (this.navParams.get('enableEditMode')) {
      this.inEditMode = true;
    }
  }

  public isScorecardViewable(): boolean {

    if (this.inEditMode) return true;

    /* Only allow the user to view this scorecard if it is after the due date */
    if (new Date() >= this.dueDate) {
      return true;
    }

    if (this.scorecard && this.scorecard.nickname === this.authProvider.user.nickname) {
      return true;
    }
    
    if (this.authProvider.isAdministrator) {
      return true;
    }

    return false;
  }

  public canEditScorecard(): boolean {

    if (this.inEditMode) return false;

    if (!this.scorecard) return false;

    /* Only if the current user is authenticated */
    if (!this.authProvider.isAuthenticated) return false;

    /* Only if this is the current users scorecard */
    if (!this.scorecard || this.authProvider.user.nickname != this.scorecard.nickname) return false;

    /* Only if it is before the due date. */
    //if (!this.dueDate || new Date() >= this.dueDate) return false;

    return true;
  }

  public updateSelectedPick(pick: EditablePick, selectedTeam: string) {

    console.log('update pick');

    if (selectedTeam == 'Team1') {

      if (pick.team1Selected) {
        pick.team2Selected = false;
        pick.selectedPick = 'Team1';
      } else {
        pick.team2Selected = true;
        pick.selectedPick = 'Team2';
      }

    } else if (selectedTeam == 'Team2') {

      if (pick.team2Selected) {
        pick.team1Selected = false;
        pick.selectedPick = 'Team2';
      } else {
        pick.team1Selected = true;
        pick.selectedPick = 'Team1';
      }
    }
  }

  public editScorecard() {
    this.inEditMode = true;
  }

  public saveScorecard() {

    this.scorecard.tieBreakerScore = this.tieBreakerScore;

    this.scorecardsProvider.update(this.scorecard);

    this.inEditMode = false;
  }
}

export interface EditablePick extends Pick {
  team1Selected: boolean;
  team2Selected: boolean;
}