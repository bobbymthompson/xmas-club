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
import { GameResult } from "../../models/game-result";

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
  tieBreakerGame: Pick;
  initializing: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private scorecardsProvider: ScorecardsProvider,
    private dataProvider: XmasClubDataProvider,
    private authProvider: AuthProvider,
    private elementRef: ElementRef) {

    this.initializing = true;

    this.week = this.navParams.get('week');
    this.scorecardsProvider.getScorecard(this.week, this.navParams.get('nickname')).first().toPromise().then(async (scorecard) => {

      this.scorecard = scorecard;

      if (scorecard) {

        let theWeek = await this.dataProvider.getWeek(this.week);

        this.tieBreakerScore = scorecard.tieBreakerScore;
        this.dueDate = new Date(theWeek.dueDate);

        let gameResults = await this.dataProvider.getGameResults(this.week);

        console.log(`Due Date: ${this.dueDate.toISOString()} - Current Date: ${new Date().toISOString()}`);

        /* Keep track of the previous pick for use in over/unders. */
        let previousPick = null;
        for (let pick of scorecard.picks) {

          (<EditablePick>pick).team1Selected = (pick.selectedPick == 'Team1') ? true : false;
          (<EditablePick>pick).team2Selected = (pick.selectedPick == 'Team2') ? true : false;

          /* Use the previous picks teams when it is an over/under. */
          // && pick.team1.toLowerCase() == 'over' && pick.team2.toLowerCase() == 'under'
          if (pick.isOverUnder) {
            pick.team1 = previousPick.team1;
            pick.team2 = previousPick.team2;
          }

          let result = this.dataProvider.calculatePickResult(theWeek, pick, gameResults);

          if (pick.isOverUnder) {

            pick.team1 = 'Over';
            pick.team2 = 'Under';
          }

          pick.homeTeam = result.homeTeam;
          pick.complete = result.complete;

          if (pick.complete) {
            pick.correct = result.correct;
            pick.incorrect = !result.correct;
          }

          previousPick = pick;
        }

        this.tieBreakerGame = _.last(scorecard.picks);
      }

      this.initializing = false;
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
    if (!this.dueDate || new Date() >= this.dueDate) return false;	

    return true;
  }

  public updateSelectedPick(pick: EditablePick, selectedTeam: string) {

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

    if (this.authProvider.isAuthenticated &&
      this.authProvider.user.nickname === this.scorecard.nickname &&
      new Date() < this.dueDate) {

      if (!this.initializing) {
        console.log('Saving scorecard');
        this.saveScorecard(true);
      }
    } else {
      console.log('Unable to save scorecard as it is past its due date');
    }
  }

  public editScorecard() {
    this.inEditMode = true;
  }

  public saveScorecard(inEditMode = false) {

    this.scorecard.tieBreakerScore = this.tieBreakerScore;

    this.scorecardsProvider.update(this.scorecard);

    this.inEditMode = inEditMode;
  }
}

export interface EditablePick extends Pick {
  team1Selected: boolean;
  team2Selected: boolean;
}
