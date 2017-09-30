import { Subscription } from 'rxjs/Rx';
import { Score, WeeklyScore } from '../models/score';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable, FirebaseListFactory } from 'angularfire2/database';
import * as _ from 'underscore';
import { User } from "../models/user";
import { Week } from "../models/week";
import { GameResult } from "../models/game-result";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import { ScorecardsProvider } from "./scorecards-provider";
import { Scorecard, Pick } from "../models/scorecard";

@Injectable()
export class XmasClubDataProvider {

  private weeks: Week[];

  constructor(public http: Http,
    private firebase: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    private scorecardsProvider: ScorecardsProvider) { }

  /** Returns the weeks (ordered descendingly) */
  public async getWeeks(): Promise<Week[]> {

    if (!this.weeks) {
      this.weeks = await this.firebase.list(`/weeks`).map(weeks => weeks.reverse()).first().toPromise();
    }

    return this.weeks;
  }

  public async priorWeek(): Promise<Week> {

    let currentWeek = await this.currentWeek();
    if (currentWeek.week == 1) {
      return currentWeek;
    }

    return await this.getWeek(currentWeek.week - 1);
  }
  /** Returns the current week. */
  public async currentWeek(): Promise<Week> {

    return _.first(await this.getWeeks());
  }

  /** Returns the specified week. */
  public async getWeek(week: number): Promise<Week> {

    return _.find(await this.getWeeks(), w => w.week === week);
  }

  public async addWeek() {

    let currentWeek = await this.currentWeek();

    let dueDate = new Date(currentWeek.dueDate);
    dueDate.setDate(dueDate.getDate() + 7);

    let newWeek = currentWeek.week + 1;

    this.firebase.object(`/weeks/${newWeek}`).update({
      week: newWeek,
      totalNumberOfPicks: 24,
      dueDate: dueDate.toISOString()
    })
  }

  /** Returns the collection of scores. */
  public get scores(): FirebaseListObservable<Score[]> {
    return this.firebase.list('/scores', {
      query: {
        orderByChild: 'total',
      }
    });
  }

  public get users(): FirebaseListObservable<User[]> {
    return this.firebase.list('/users');
  }

  /** Returns the score cards for the specified week. */
  public async getGameResults(week: number): Promise<Array<GameResult>> {

    return await this.http.get(`http://xmasclubscorer.azurewebsites.net/api/gameresults/${week}`).map((res: Response) => res.json()).toPromise();
  }

  public async getScorecardResults(week: number): Promise<Scorecard[]> {

    let theWeek = await this.getWeek(week);

    let gameResults = await this.getGameResults(week);

    let scorecardResults = await this.scorecardsProvider.getScorecards(week).first().toPromise();

    /* Ensure the scorecards are an array */
    let scorecards: Scorecard[] = _.values(scorecardResults);

    for (let scorecard of scorecards) {

      scorecard.score = 0;

      for (let pick of scorecard.picks) {

        let result = this.calculatePickResult(theWeek, pick, gameResults);

        pick.homeTeam = result.homeTeam;

        if (result.correct) {
          scorecard.score++;
        }
      }
    }

    let orderedScorecards = _.sortBy(scorecards, 'score').reverse();

    let thisWeek = await this.getWeek(week);

    let winnerIndex = _.findIndex(orderedScorecards, { nickname: thisWeek.winner })
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

    return orderedScorecards;
  }

  public async getUnsubmittedUsersForWeek(week: number): Promise<string[]> {

    let scores: Score[] = await this.scores.first().toPromise();

    let unsubmittedScorecards: string[] = [];
    for (let score of scores) {

      let scorecard = await this.scorecardsProvider.getScorecard(week, score.$key).first().toPromise();
      if (!scorecard) {
        unsubmittedScorecards.push(score.$key);
      }
    }

    return unsubmittedScorecards;
  }

  public calculatePickResult(week: Week, pick: Pick, gameResults: GameResult[]): { complete: boolean, correct: boolean, homeTeam: string } {

    let result = {
      complete: false,
      correct: false,
      homeTeam: ''
    };

    let game = _.find(gameResults, (game) => {
      return (game.team1.name.toLowerCase() == pick.team1.toLowerCase()) && (game.team2.name.toLowerCase() == pick.team2.toLowerCase())
    });

    if (!game) {
      console.log(`Unable to find a game for teams. Team1: '${pick.team1}' - Team2: '${pick.team2}' - Spread: '${pick.spread}' - Type: '${pick.pickType}'`);
    } else {

      /* Set the home team on this pick. */
      result.homeTeam = game.homeTeam;

      if (game.status == "Complete") {

        result.complete = true;

        let spread = parseFloat(pick.spread);
        if (isNaN(spread)) {
          /* The spread is a 'PICK' */
          spread = 0;
        }

        if (pick.isOverUnder) {

          let totalScore = game.team1.score + game.team2.score;

          if (spread) {

            if (pick.selectedPick == "Team1") {
              if (totalScore >= spread) {
                result.correct = true;
              }
            } else if (pick.selectedPick == "Team2") {
              if (totalScore <= spread) {
                result.correct = true;
              }
            }
          }

        }
        else {

          if (pick.selectedPick == "Team1") {

            if (game.winner == "Team1") {

              if (game.team1.score >= (game.team2.score + spread)) {
                result.correct = true;
              }
            }

          } else if (pick.selectedPick == "Team2") {

            if (game.winner == "Team2") {
              /* The underdog was picked and they won. */
              result.correct = true;
            }
            else {

              /* The underdog lost, check the spread. */
              if ((game.team2.score + spread) >= game.team1.score) {
                result.correct = true;
              }
            }
          }
        }
      }
    }

    return result;
  }

  public async forceUpdateOfScores() {

    var results = await this.http.get(`https://xmas-club-api.herokuapp.com/calculate-scores`).map((res: Response) => res.json()).toPromise();
    console.log(results);
  }
}
