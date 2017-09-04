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
import { Scorecard } from "../models/scorecard";

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

  public async addScoreForUser(nickname: string, week: number, score: number) {

    let weeklyScores: WeeklyScore[] = await this.firebase.list(`/scores/${nickname}/weeklyScores`).first().toPromise();

    let foundScore = _.find(weeklyScores, score => score.week === week);
    if (foundScore) {
      
      console.log(`${nickname} already has a score for week ${week} (Current score: ${foundScore.score} - New score: ${score}`);
      console.log('Updating score:', foundScore);

      this.firebase.object(`/scores/${nickname}/weeklyScores/${foundScore.$key}`).update({
        score: score
      });
    } else {

      this.firebase.list(`/scores/${nickname}/weeklyScores`).push({
        week: week,
        score: score
      });
    }
  }

  /** Returns the score cards for the specified week. */
  public async getGameResults(week: number): Promise<Array<GameResult>> {

    return await this.http.get(`http://xmasclubscorer.azurewebsites.net/api/gameresults/${week}`).map((res: Response) => res.json()).toPromise();
  }

  public async getScorecardResults(week: number): Promise<Scorecard[]> {

    let gameResults = await this.getGameResults(week);

    let scorecardResults = await this.scorecardsProvider.getScorecards(week).first().toPromise();

    /* Ensure the scorecards are an array */
    let scorecards = _.values(scorecardResults);

    for (let scorecard of scorecards) {

      scorecard.score = 0;

      for (let pick of scorecard.picks) {

        let game = _.find(gameResults, (game) => {
          return (game.team1.name.toLowerCase() == pick.team1.toLowerCase()) && (game.team2.name.toLowerCase() == pick.team2.toLowerCase())
        });

        if (!game) {
          console.log(`Unable to find a game for teams. Team1: '${pick.team1}' - Team2: '${pick.team2}' - Spread: '${pick.spread}' - Type: '${pick.pickType}'`);
        } else {

          /* Set the home team on this pick. */
          pick.homeTeam = game.homeTeam;

          if (game.status == "Complete") {

            let correct: boolean = false;

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
                    correct = true;
                  }
                } else if (pick.selectedPick == "Team2") {
                  if (totalScore <= spread) {
                    correct = true;
                  }
                }
              }

            }
            else {

              if (pick.selectedPick == "Team1") {

                if (game.winner == "Team1") {

                  if (game.team1.score >= (game.team2.score + spread)) {
                    correct = true;
                  }
                }

              } else if (pick.selectedPick == "Team2") {

                if (game.winner == "Team2") {
                  /* The underdog was picked and they won. */
                  correct = true;
                }
                else {

                  /* The underdog lost, check the spread. */
                  if ((game.team2.score + spread) >= game.team1.score) {
                    correct = true;
                  }
                }
              }

              if (correct) {
                scorecard.score++;
              }
            }
          }
        }
      }
    }

    let orderedScorecards = _.sortBy(scorecards, 'score').reverse();

    let rank: number = 1;
    for (let scorecard of orderedScorecards) {
      scorecard.rank = rank++;
    }

    return orderedScorecards;
  }
}
