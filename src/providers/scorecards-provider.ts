import { Score, WeeklyScore } from '../models/score';
import { Subscription } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Scorecard, DownloadedScorecardResults, QueuedEmailInfo } from '../models/scorecard';
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

    this.insertWeeklyScore(scorecard);
    
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
  public async loadScorecardsFromEmail(week: number): Promise<DownloadedScorecardResults> {

    let result = await this.http.get(`http://xmasclubscorer.azurewebsites.net/api/scorecards/${week}`).map((res: Response) => res.json()).toPromise();

    let scorecards: Array<Scorecard> = result.Results;

    let scorecardsFb = this.getScorecards(week);
    for (let scorecard of scorecards) {

      /* Standardize on all nicknames being upper case. */
      scorecard.nickname = scorecard.nickname.toUpperCase();

      console.log(`Looking for scorecard for week ${week} and user: ${scorecard.nickname}`);

      /* Determine if the user already submitted a scorecard and this should replace the old one */
      let found = await this.getScorecard(week, scorecard.nickname).first().toPromise();
      if (found) {

        console.log('Found existing scorecard - updating');
        
        /* Hack - set the key on the new scorecard so it is updated */
        (scorecard as any).$key = (found as any).$key;
        this.update(scorecard);

        /* Hack set an asterisk to denote this scorecard was updated. */
        scorecard.nickname = scorecard.nickname;

      } else {

        /* Push the scorecard in. */
        scorecardsFb.push(scorecard);

        /* Determine if the specified nickname exists as a known user */
        let scores = await this.firebase.object(`/scores/${scorecard.nickname}/`).first().toPromise();

        this.insertWeeklyScore(scorecard);
      }
    }

    return result;
  }

  public async showEmailsInInbox(week: number): Promise<QueuedEmailInfo[]> {

    let result: QueuedEmailInfo[] = await this.http.get(`http://xmasclubscorer.azurewebsites.net/api/queued-emails/${week}`).map((res: Response) => res.json()).toPromise();

    return result;
  }

  public async insertWeeklyScore(scorecard: Scorecard) {

    let weeklyScores: WeeklyScore[] = await this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).first().toPromise();

    let foundScore = _.find(weeklyScores, score => score.week === scorecard.week);
    if (!foundScore) {

      console.log(`Inserting into scores - Week: ${scorecard.week} Score: ${scorecard.score}`);

      /* Insert a record into the scores array for this user. */
      this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).push({
        week: scorecard.week,
        score: scorecard.score ? scorecard.score : 0,
        total: scorecard.score ? scorecard.score : 0
      });
    } else {

      console.log(`Updating scores - Week: ${scorecard.week} Score: ${scorecard.score}`);

      this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).update(foundScore.$key, {
        score: scorecard.score ? scorecard.score : 0,
        total: scorecard.score ? scorecard.score : 0
      });
    }
  }
}
