webpackJsonp([3],{

/***/ 773:
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
const week_1 = __webpack_require__(782);
let WeekModule = class WeekModule {
};
WeekModule = __decorate([
    core_1.NgModule({
        declarations: [
            week_1.WeekPage,
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(week_1.WeekPage),
        ],
        exports: [
            week_1.WeekPage
        ]
    })
], WeekModule);
exports.WeekModule = WeekModule;
//# sourceMappingURL=week.module.js.map

/***/ }),

/***/ 782:
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
const xmas_club_provider_1 = __webpack_require__(451);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const scorecards_provider_1 = __webpack_require__(147);
const _ = __webpack_require__(146);
const login_1 = __webpack_require__(452);
const auth_provider_1 = __webpack_require__(63);
let WeekPage = class WeekPage {
    constructor(navCtrl, navParams, authProvider, scorecardsProvider, dataProvider, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authProvider = authProvider;
        this.scorecardsProvider = scorecardsProvider;
        this.dataProvider = dataProvider;
        this.loadingCtrl = loadingCtrl;
        this.favorites = [];
    }
    ionViewDidEnter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading();
            if (this.navParams.get('week')) {
                this.week = yield this.dataProvider.getWeek(parseInt(this.navParams.get('week')));
            }
            else {
                this.week = yield this.dataProvider.currentWeek();
            }
            this.loadWeeklyScores();
            this.loading.dismiss();
        });
    }
    login() {
        this.navCtrl.push(login_1.LoginPage);
    }
    viewScorecard(scorecard) {
        this.navCtrl.push('ScorecardPage', { week: this.week.week, nickname: scorecard.nickname });
    }
    canCreateScorecard() {
        if (!this.week)
            return false;
        /* Only if the current user is authenticated */
        if (!this.authProvider.isAuthenticated)
            return false;
        /* Only if this is the current users doesn't already have a scorecard for this week */
        if (this.doesCurrentUserHaveScorecardAlready())
            return false;
        /* Only if it is before the due date. */
        if (new Date() >= new Date(this.week.dueDate))
            return false;
        return true;
    }
    doesCurrentUserHaveScorecardAlready() {
        if (!this.currentUserScorecard) {
            if (this.authProvider.isAuthenticated) {
                if (!this.queriedForScorecard) {
                    this.queriedForScorecard = true;
                    this.scorecardsProvider.getScorecard(this.week.week, this.authProvider.user.nickname).first().toPromise().then(scorecard => {
                        if (scorecard) {
                            this.currentUserScorecard = scorecard;
                        }
                        else {
                            console.log('No scorecard exists for user');
                        }
                    });
                }
            }
        }
        else {
            return true;
        }
        return false;
    }
    createScorecard() {
        return __awaiter(this, void 0, void 0, function* () {
            /* Create a new scorecard. */
            if (this.authProvider.isAuthenticated && this.authProvider.user != null) {
                this.showLoading();
                if (!this.currentUserScorecard) {
                    this.currentUserScorecard = yield this.scorecardsProvider.createScorecard(this.week.week, this.authProvider.user.nickname);
                }
                this.navCtrl.push('ScorecardPage', { enableEditMode: true, week: this.week.week, nickname: this.authProvider.user.nickname });
            }
        });
    }
    viewFavoriteScorecards() {
        this.navCtrl.push('WeeklyLeaderboardPage', { week: this.week.week, favoritesOnly: true });
    }
    viewAllScorecards() {
        this.navCtrl.push('WeeklyLeaderboardPage', { week: this.week.week });
    }
    loadWeeklyScores() {
        return __awaiter(this, void 0, void 0, function* () {
            let favorites = new Array();
            let scorecards = new Array();
            let scores = yield this.dataProvider.scores.first().toPromise();
            scores.forEach((score) => {
                let total = 0;
                let submitted = false;
                let weeklyScore = _.find(score.weeklyScores, (ws) => ws.week === this.week.week);
                if (weeklyScore) {
                    submitted = (weeklyScore.total != null) || (this.week.winner && this.week.winner.length > 0);
                    total = weeklyScore.total ? weeklyScore.total : (weeklyScore.score ? weeklyScore.score : 0);
                }
                let scorecard = {
                    nickname: score.$key,
                    score: total,
                    rank: 0
                };
                if (submitted) {
                    if (this.authProvider.isAuthenticated) {
                        /* Populate the current user into the favorites list. */
                        if (scorecard.nickname == this.authProvider.user.nickname) {
                            favorites.push(scorecard);
                        }
                        /* Populate any favorites for this user. */
                        if (this.authProvider.user.favorites) {
                            if (_.some(this.authProvider.user.favorites, nickname => nickname == scorecard.nickname)) {
                                favorites.push(scorecard);
                            }
                        }
                    }
                    scorecards.push(scorecard);
                }
            });
            let orderedScorecards = _.sortBy(scorecards, 'score').reverse();
            let winnerIndex = _.findIndex(orderedScorecards, { nickname: this.week.winner });
            if (winnerIndex > 0) {
                let winner = orderedScorecards[winnerIndex];
                orderedScorecards.splice(winnerIndex, 1);
                orderedScorecards.splice(0, 0, winner);
            }
            let rank = 0;
            let previousScore = 0;
            for (let scorecard of orderedScorecards) {
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
            this.favorites = _.sortBy(favorites, 'rank');
            this.scorecards = orderedScorecards;
        });
    }
    canViewDetailedScorecardView() {
        if (this.authProvider.isAdministrator) {
            return true;
        }
        if (this.week && new Date() >= new Date(this.week.dueDate)) {
            return true;
        }
        return false;
    }
    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }
};
WeekPage = __decorate([
    ionic_angular_1.IonicPage({
        segment: 'week/:week'
    }),
    core_1.Component({
        selector: 'page-week',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\week\week.html"*/'<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Week {{week?.week}}</ion-title>\n\n    <ion-buttons end>\n      <button ion-button icon-only (click)="createScorecard()" *ngIf="canCreateScorecard()">\n        <ion-icon name="md-create"></ion-icon>\n      </button>\n      <button ion-button icon-only (click)="login()" *ngIf="!authProvider.isAuthenticated">\n        <ion-icon name="person"></ion-icon>\n      </button>\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-card *ngIf="favorites.length > 0">\n    <ion-card-header>\n      <ion-item>\n        Favorites\n         <button *ngIf="canViewDetailedScorecardView()" ion-button icon-only item-right (click)="viewFavoriteScorecards()">\n          <ion-icon name="grid"></ion-icon>\n        </button> \n      </ion-item>\n    </ion-card-header>\n\n    <ion-list>\n      <ion-item *ngFor="let scorecard of favorites" (click)="viewScorecard(scorecard)" detail-push>\n        <ion-grid>\n          <ion-row style="text-align:center">\n            <ion-col col-6 style="text-align:left">{{scorecard.rank}}) {{scorecard.nickname}}</ion-col>\n            <ion-col style="text-align:right;min-width:50px">{{scorecard.score}} of {{week.totalNumberOfPicks}}</ion-col>\n          </ion-row>\n        </ion-grid>\n      </ion-item>\n    </ion-list>\n  </ion-card>\n\n  <ion-card>\n   <ion-card-header>\n      <ion-item>\n        Leaderboard\n         <button *ngIf="canViewDetailedScorecardView()" ion-button icon-only item-right (click)="viewAllScorecards()">\n          <ion-icon name="grid"></ion-icon>\n        </button> \n      </ion-item>\n    </ion-card-header>\n\n    <ion-list>\n      <ion-item *ngFor="let scorecard of scorecards" (click)="viewScorecard(scorecard)" detail-push>\n        <ion-grid>\n          <ion-row style="text-align:center">\n            <ion-col col-6 style="text-align:left">{{scorecard.rank}}) {{scorecard.nickname}}</ion-col>\n            <ion-col style="text-align:right;min-width:50px">{{scorecard.score}} of {{week?.totalNumberOfPicks}}</ion-col>\n          </ion-row>\n        </ion-grid>\n      </ion-item>\n    </ion-list>\n\n  </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\week\week.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController,
        ionic_angular_1.NavParams,
        auth_provider_1.AuthProvider,
        scorecards_provider_1.ScorecardsProvider,
        xmas_club_provider_1.XmasClubDataProvider,
        ionic_angular_1.LoadingController])
], WeekPage);
exports.WeekPage = WeekPage;
//# sourceMappingURL=week.js.map

/***/ })

});
//# sourceMappingURL=3.js.map