import { Score } from '../models/score';
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

  public update(scorecard: Scorecard) {

    console.log('Updating scorecard:');
    console.log(scorecard);

    this.firebase.list(this.SCORECARD_PATH(scorecard.week)).update((scorecard as any).$key, {
      tieBreakerScore: scorecard.tieBreakerScore,
      picks: scorecard.picks
    });
  }

  private async getScorecardTemplate(week: number) {

    return await this.http.get(`http://localhost:61670/api/scorecardtemplates/${week}`).map((res: Response) => res.json()).toPromise();
  }

  /** Loads all scorecards that have been submitted via email. */
  public async loadScorecardsFromEmail(week: number): Promise<Scorecard[]> {

    let scorecards: Array<Scorecard> = await this.http.get(`http://localhost:61670/api/scorecards/${week}`).map((res: Response) => res.json()).toPromise();

    let scorecardsFb = this.getScorecards(week);
    for (let scorecard of scorecards) {

      scorecardsFb.push(scorecard);
    }

    return scorecards;
  }
}
