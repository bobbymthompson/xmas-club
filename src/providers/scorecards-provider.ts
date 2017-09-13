import { Score, WeeklyScore } from '../models/score';
import { Subscription } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Scorecard } from '../models/scorecard';
import * as _ from 'underscore';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ScorecardsProvider {

  private SCORECARD_PATH(week: number) {
    return `/scorecards/${week}/`;
  }

  constructor(public http: Http,
    private firebase: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth) {

  }

  /** Returns the collection of scorecards for the specified week. */
  public getScorecards(week: number): FirebaseListObservable<Scorecard[]> {
    return this.firebase.list(this.SCORECARD_PATH(week));
  }

  public getScorecard(week: number, nickname: string): Observable<Scorecard> {

    return this.firebase.list(this.SCORECARD_PATH(week), {
      query: {
        orderByChild: 'nickname',
        equalTo: nickname
      }
    }).map((items: Array<any>) => items.find(item => item.nickname === nickname));
  }

  public async createScorecard(week: number, nickname: string): Promise<any> {

    let scorecard = await this.getScorecardTemplate(week);

    scorecard.nickname = nickname;

    return this.firebase.list(this.SCORECARD_PATH(week)).push(scorecard);
  }

  public async update(scorecard: Scorecard) {

    console.log(scorecard);

    this.firebase.list(this.SCORECARD_PATH(scorecard.week)).update((scorecard as any).$key, {
      tieBreakerScore: scorecard.tieBreakerScore,
      picks: scorecard.picks
    });

    this.insertWeeklyScore(scorecard);
  }

  private async getScorecardTemplate(week: number) {

    return await this.http.get(`http://xmasclubscorer.azurewebsites.net/api/scorecardtemplates/${week}`).map((res: Response) => res.json()).toPromise();
  }

  /** Loads all scorecards that have been submitted via email. */
  public async loadScorecardsFromEmail(week: number): Promise<Scorecard[]> {

    let scorecards: Array<Scorecard> = await this.http.get(`http://xmasclubscorer.azurewebsites.net/api/scorecards/${week}`).map((res: Response) => res.json()).toPromise();

    let scorecardsFb = this.getScorecards(week);
    for (let scorecard of scorecards) {

      console.log(`Looking for scorecard for week ${week} and user: ${scorecard.nickname}`);

      /* Determine if the user already submitted a scorecard and this should replace the old one */
      let found = await this.getScorecard(week, scorecard.nickname).first().toPromise();
      if (found) {

        console.log('Found existing scorecard - updating');
        
        /* Hack - set the key on the new scorecard so it is updated */
        (scorecard as any).$key = (found as any).$key;
        this.update(scorecard);

        /* Hack set an asterisk to denote this scorecard was updated. */
        scorecard.nickname = '***' + scorecard.nickname;

      } else {

        console.log('No scorecard found - inserting new.');
        scorecardsFb.push(scorecard);

        this.insertWeeklyScore(scorecard);
      }
    }

    return scorecards;
  }

  public async insertWeeklyScore(scorecard: Scorecard) {

    let weeklyScores: WeeklyScore[] = await this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).first().toPromise();

    let foundScore = _.find(weeklyScores, score => score.week === scorecard.week);
    if (!foundScore) {

      /* Insert a record into the scores array for this user. */
      this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).push({
        week: scorecard.week,
        score: 0
      });
    } else {

      this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).update(foundScore.$key, {
        score: scorecard.score
      });
    }
  }
}
