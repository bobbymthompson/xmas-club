import { Subscription } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Score } from '../models/score'
import { User } from "../models/user";
import * as _ from 'underscore';

@Injectable()
export class ScoresProvider {
  scores: Observable<Score[]>
  private _scores: BehaviorSubject<Score[]>;
  private dataStore: {
    scores: Score[]
  };

  constructor(public http: Http) {
    this.dataStore = { scores: [] };
    this._scores = <BehaviorSubject<Score[]>>new BehaviorSubject([]);
    this.scores = this._scores.asObservable();
  }

  load() : Subscription {
    return this.http.get('assets/data/data.json').map((res: Response) => res.json()).subscribe(data => {
      
      this.dataStore.scores = data.scores;

      this._scores.next(Object.assign({}, this.dataStore).scores);
    
    }, error => console.log('Could not load the scores'));
  }
}

