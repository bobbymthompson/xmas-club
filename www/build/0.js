webpackJsonp([0],{

/***/ 769:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sort_array_desc_1 = __webpack_require__(776);
const reverse_array_1 = __webpack_require__(453);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const leaderboard_1 = __webpack_require__(777);
let LeaderboardModule = class LeaderboardModule {
};
LeaderboardModule = __decorate([
    core_1.NgModule({
        declarations: [
            leaderboard_1.LeaderboardPage,
            reverse_array_1.ReverseArrayPipe,
            sort_array_desc_1.SortArrayDescPipe
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(leaderboard_1.LeaderboardPage),
        ],
        exports: [
            leaderboard_1.LeaderboardPage
        ]
    })
], LeaderboardModule);
exports.LeaderboardModule = LeaderboardModule;
//# sourceMappingURL=leaderboard.module.js.map

/***/ }),

/***/ 776:
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
let SortArrayDescPipe = class SortArrayDescPipe {
    transform(values, ...args) {
        if (values) {
            return values.sort((a, b) => { return b.total - a.total; });
        }
        else {
            return values;
        }
    }
};
SortArrayDescPipe = __decorate([
    core_1.Pipe({
        name: 'sortdesc',
    })
], SortArrayDescPipe);
exports.SortArrayDescPipe = SortArrayDescPipe;
//# sourceMappingURL=sort-array-desc.js.map

/***/ }),

/***/ 777:
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
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const _ = __webpack_require__(147);
const xmas_club_provider_1 = __webpack_require__(451);
let LeaderboardPage = class LeaderboardPage {
    constructor(navCtrl, navParams, dataProvider, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.loadingCtrl = loadingCtrl;
    }
    ionViewDidEnter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading();
            this.weeks = yield this.dataProvider.getWeeks();
            this.currentWeek = yield this.dataProvider.currentWeek();
            let results = yield this.dataProvider.getScorecardResults(this.currentWeek.week);
            let scores = yield this.dataProvider.scores.first().toPromise();
            scores.forEach((score, index) => {
                score.sortedScores = [];
                _.values(score.weeklyScores).forEach((ws) => {
                    score.sortedScores.splice(0, 0, ws.score);
                });
                /* If scores for this week haven't been pushed in, use the current weeks scores */
                if (score.sortedScores.length != this.currentWeek.week) {
                    score.sortedScores.splice(0, 0, this.getCurrentWeekScore(results, score.$key));
                }
                /* Calculate the total score. */
                let total = 0;
                score.sortedScores.forEach((value) => {
                    total += value;
                });
                score.total = total;
            });
            this.scores = scores.sort((a, b) => {
                return b.total - a.total;
            });
            this.loading.dismiss();
        });
    }
    getCurrentWeekScore(scorecards, nickname) {
        let scorecard = _.find(scorecards, s => s.nickname === nickname);
        if (scorecard) {
            return scorecard.score;
        }
        return 0;
    }
    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }
};
LeaderboardPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-leaderboard',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\leaderboard\leaderboard.html"*/'<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Leaderboard</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n  <h1>Scores through week {{currentWeek?.week}}</h1>\n\n  <!-- <ion-scroll class="leaderboard-scroll" scrollX="true" style="height:100%"> -->\n    <ion-row nowrap style="text-align:center">\n      <ion-col col-6></ion-col>\n      <ion-col style="min-width:50px">Total</ion-col>\n      <ion-col *ngFor="let week of weeks" style="min-width:28px"><span>{{week.week}}</span></ion-col>\n    </ion-row>\n    <ion-row *ngFor="let score of scores; let i = index; odd as isOdd; even as isEven" nowrap style="text-align:center;"\n      [class.altRowColor]="isOdd">\n      <ion-col col-6 style="text-align:left">{{i + 1}}) {{score.$key}}</ion-col>\n      <ion-col style="min-width:50px">{{score.total}}</ion-col>\n      <ion-col *ngFor="let ws of score.sortedScores" style="min-width:28px"><span>{{ws}}</span></ion-col>\n    </ion-row>\n  <!-- </ion-scroll> -->\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\leaderboard\leaderboard.html"*/
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController,
        ionic_angular_1.NavParams,
        xmas_club_provider_1.XmasClubDataProvider,
        ionic_angular_1.LoadingController])
], LeaderboardPage);
exports.LeaderboardPage = LeaderboardPage;
//# sourceMappingURL=leaderboard.js.map

/***/ })

});
//# sourceMappingURL=0.js.map