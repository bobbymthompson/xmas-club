import { ScorecardsProvider } from '../../providers/scorecards-provider';
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth.provider";
import { Week } from "../../models/week";
import { Scorecard } from "../../models/scorecard";
import { GameResult } from "../../models/game-result";
import { Score } from "../../models/score";
import * as _ from "underscore";

@IonicPage()
@Component({
  selector: 'page-weekly-leaderboard',
  templateUrl: 'weekly-leaderboard.html',
})
export class WeeklyLeaderboardPage {

  week: Week;
  loading: Loading;
  scorecards: any;
  games: GameResult[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private scorecardsProvider: ScorecardsProvider,
    private dataProvider: XmasClubDataProvider,
    private loadingCtrl: LoadingController) {

  }

  async ionViewDidLoad() {

    this.showLoading();

    if (this.navParams.get('week')) {
      this.week = await this.dataProvider.getWeek(parseInt(this.navParams.get('week')));
    } else {
      this.week = await this.dataProvider.currentWeek();
    }

    await this.loadWeeklyScorecards(this.navParams.get('favoritesOnly'));
  }

  private async loadWeeklyScorecards(favoritesOnly: boolean) {

    this.games = await this.dataProvider.getGameResults(this.week.week);

    let scorecards: Scorecard[] = await this.scorecardsProvider.getScorecards(this.week.week).first().toPromise();
    console.log('Scorecards: ', scorecards);
    let scorecardsWithPicks = [];

    let scores = await this.dataProvider.scores.first().toPromise();
    scores.forEach(async (score: Score) => {

      let processScorecard = true;

      if (favoritesOnly) {

        if (this.authProvider.isAuthenticated && this.authProvider.user.favorites) {

          if (this.authProvider.user.nickname === score.$key) {

          }
          else if (!_.some<string>(this.authProvider.user.favorites, nickname => nickname == score.$key)) {
            processScorecard = false;
          }
        } else {
          processScorecard = false;
        }
      }

      if (processScorecard) {

        let total = 0;
        let submitted = false;
        let weeklyScore = _.find(score.weeklyScores, (ws) => ws.week === this.week.week);
        if (weeklyScore) {

          total = weeklyScore.total ? weeklyScore.total : (weeklyScore.score ? weeklyScore.score : 0);
        }

        let scorecardWithPicks = {
          nickname: score.$key,
          score: total,
          rank: 0,
          tieBreakerScore: 0,
          picks: []
        };

        let scorecard = _.find(scorecards, (sc) => sc.nickname === score.$key);
        if (scorecard) {

          scorecardWithPicks.tieBreakerScore = scorecard.tieBreakerScore;

          /* Keep track of the previous pick for use in over/unders. */
          let previousPick = null;

          scorecard.picks.forEach((pick) => {

            let team;
            if (pick.selectedPick === 'None') {
              team = '';
            } else {
              team = (pick.selectedPick === "Team1") ? pick.team1 : pick.team2;
            }

            /* Use the previous picks teams when it is an over/under. */
            if (pick.isOverUnder && pick.team1.toLowerCase() == 'over' && pick.team2.toLowerCase() == 'under') {
              pick.team1 = previousPick.team1;
              pick.team2 = previousPick.team2;
            }

            let result = this.dataProvider.calculatePickResult(this.week, pick, this.games);

            scorecardWithPicks.picks.push({ team: team, complete: result.complete, correct: result.correct });

            previousPick = pick;
          });
        } else {
          this.games.forEach((game) => {
            scorecardWithPicks.picks.push({ team: '', complete: false, correct: false });
          });
        }

        scorecardsWithPicks.push(scorecardWithPicks);
      }
    });

    let orderedScorecardWithPicks = _.sortBy(scorecardsWithPicks, 'score').reverse();

    let winnerIndex = _.findIndex(orderedScorecardWithPicks, { nickname: this.week.winner })
    if (winnerIndex > 0) {
      let winner = orderedScorecardWithPicks[winnerIndex];
      orderedScorecardWithPicks.splice(winnerIndex, 1);
      orderedScorecardWithPicks.splice(0, 0, winner);
    }

    let rank: number = 0;
    let previousScore: number = 0;
    for (let scorecard of orderedScorecardWithPicks) {

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

    this.scorecards = orderedScorecardWithPicks;
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
