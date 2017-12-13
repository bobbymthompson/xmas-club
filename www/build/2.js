webpackJsonp([2],{

/***/ 774:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const weekly_leaderboard_1 = __webpack_require__(783);
let WeeklyLeaderboardPageModule = class WeeklyLeaderboardPageModule {
};
WeeklyLeaderboardPageModule = __decorate([
    core_1.NgModule({
        declarations: [
            weekly_leaderboard_1.WeeklyLeaderboardPage,
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(weekly_leaderboard_1.WeeklyLeaderboardPage),
        ],
        exports: [
            weekly_leaderboard_1.WeeklyLeaderboardPage
        ]
    })
], WeeklyLeaderboardPageModule);
exports.WeeklyLeaderboardPageModule = WeeklyLeaderboardPageModule;
//# sourceMappingURL=weekly-leaderboard.module.js.map

/***/ }),

/***/ 783:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const scorecards_provider_1 = __webpack_require__(147);
const xmas_club_provider_1 = __webpack_require__(451);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const auth_provider_1 = __webpack_require__(63);
const _ = __webpack_require__(146);
let WeeklyLeaderboardPage = class WeeklyLeaderboardPage {
    constructor(navCtrl, navParams, authProvider, scorecardsProvider, dataProvider, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authProvider = authProvider;
        this.scorecardsProvider = scorecardsProvider;
        this.dataProvider = dataProvider;
        this.loadingCtrl = loadingCtrl;
    }
    ionViewDidLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading();
            if (this.navParams.get('week')) {
                this.week = yield this.dataProvider.getWeek(parseInt(this.navParams.get('week')));
            }
            else {
                this.week = yield this.dataProvider.currentWeek();
            }
            yield this.loadWeeklyScorecards(this.navParams.get('favoritesOnly'));
        });
    }
    loadWeeklyScorecards(favoritesOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            this.games = yield this.dataProvider.getGameResults(this.week.week);
            let scorecards = yield this.scorecardsProvider.getScorecards(this.week.week).first().toPromise();
            console.log('Scorecards: ', scorecards);
            let scorecardsWithPicks = [];
            let scores = yield this.dataProvider.scores.first().toPromise();
            scores.forEach((score) => __awaiter(this, void 0, void 0, function* () {
                let processScorecard = true;
                if (favoritesOnly) {
                    if (this.authProvider.isAuthenticated && this.authProvider.user.favorites) {
                        if (this.authProvider.user.nickname === score.$key) {
                        }
                        else if (!_.some(this.authProvider.user.favorites, nickname => nickname == score.$key)) {
                            processScorecard = false;
                        }
                    }
                    else {
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
                            }
                            else {
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
                    }
                    else {
                        this.games.forEach((game) => {
                            scorecardWithPicks.picks.push({ team: '', complete: false, correct: false });
                        });
                    }
                    scorecardsWithPicks.push(scorecardWithPicks);
                }
            }));
            let orderedScorecardWithPicks = _.sortBy(scorecardsWithPicks, 'score').reverse();
            let winnerIndex = _.findIndex(orderedScorecardWithPicks, { nickname: this.week.winner });
            if (winnerIndex > 0) {
                let winner = orderedScorecardWithPicks[winnerIndex];
                orderedScorecardWithPicks.splice(winnerIndex, 1);
                orderedScorecardWithPicks.splice(0, 0, winner);
            }
            let rank = 0;
            let previousScore = 0;
            for (let scorecard of orderedScorecardWithPicks) {
                if (rank === 0 && winnerIndex > 0) {
                    /* The week is complete and we have a winner, set it so there is only one person who won */
                    /* I am ignoring ties at the moment */
                    rank = 1;
                }
                else {
                    if (scorecard.score !== previousScore) {
                        rank++;
                    }
                    previousScore = scorecard.score;
                }
                scorecard.rank = rank;
            }
            this.scorecards = orderedScorecardWithPicks;
        });
    }
    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }
};
WeeklyLeaderboardPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-weekly-leaderboard',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\weekly-leaderboard\weekly-leaderboard.html"*/'<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Week #{{week?.week}} Leaderboard</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <ion-scroll scrollX="true" scrollY="true" style="height: 100%;">\n    <ion-row nowrap style="text-align:center">\n      <ion-col col-6 style=""></ion-col>\n      <ion-col *ngFor="let game of games" style="min-width:150px;"><span>{{game.team1.name}} vs. {{game.team2.name}}</span></ion-col>\n    </ion-row>\n    <ion-row *ngFor="let scorecard of scorecards; odd as isOdd" nowrap style="text-align:center;min-height:50px">\n      <ion-col col-6 style="text-align:left;padding-top:20px;padding-bottom:20px;border-top:black 1px solid;" >{{scorecard.score}} - {{scorecard.nickname}} ({{scorecard.tieBreakerScore}})</ion-col>\n      <ng-container *ngIf="isOdd">\n        <ion-col *ngFor="let pick of scorecard.picks" class="altRow" [class.isCorrect]="pick.complete && pick.correct" [class.inCorrect]="pick.complete && !pick.correct" style="min-width:150px;padding-top:20px;padding-bottom:20px;border-left:black 1px solid;">\n          <ng-container>\n            {{pick.team}}\n          </ng-container>\n        </ion-col>\n      </ng-container>\n      <ng-container *ngIf="!isOdd">\n        <ion-col *ngFor="let pick of scorecard.picks" class="altRow" [class.isCorrect]="pick.complete && pick.correct" [class.inCorrect]="pick.complete && !pick.correct" style="min-width:150px;padding-top:20px;padding-bottom:20px;border-left:black 1px solid;">{{pick.team}}</ion-col>\n      </ng-container>\n    </ion-row>\n  </ion-scroll>\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\weekly-leaderboard\weekly-leaderboard.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController,
        ionic_angular_1.NavParams,
        auth_provider_1.AuthProvider,
        scorecards_provider_1.ScorecardsProvider,
        xmas_club_provider_1.XmasClubDataProvider,
        ionic_angular_1.LoadingController])
], WeeklyLeaderboardPage);
exports.WeeklyLeaderboardPage = WeeklyLeaderboardPage;
//# sourceMappingURL=weekly-leaderboard.js.map

/***/ })

});
//# sourceMappingURL=2.js.map