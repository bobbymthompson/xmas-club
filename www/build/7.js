webpackJsonp([7],{

/***/ 768:
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
const admin_1 = __webpack_require__(776);
let AdminPageModule = class AdminPageModule {
};
AdminPageModule = __decorate([
    core_1.NgModule({
        declarations: [
            admin_1.AdminPage,
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(admin_1.AdminPage),
        ],
        exports: [
            admin_1.AdminPage
        ]
    })
], AdminPageModule);
exports.AdminPageModule = AdminPageModule;
//# sourceMappingURL=admin.module.js.map

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
const scorecards_provider_1 = __webpack_require__(147);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const _ = __webpack_require__(146);
let AdminPage = class AdminPage {
    constructor(navCtrl, scorecardsProvider, dataProvider, loadingCtrl, alertController) {
        this.navCtrl = navCtrl;
        this.scorecardsProvider = scorecardsProvider;
        this.dataProvider = dataProvider;
        this.loadingCtrl = loadingCtrl;
        this.alertController = alertController;
        this.dataProvider.currentWeek().then((week) => {
            this.currentWeek = week;
        });
    }
    loadScorecardsFromEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading();
            let currentWeek = yield this.dataProvider.currentWeek();
            this.scorecards = yield this.scorecardsProvider.loadScorecardsFromEmail(currentWeek.week);
            this.navCtrl.push('ListPage', {
                title: 'Loaded scorecards',
                list: this.scorecards.map(sc => sc.nickname)
            });
            this.loading.dismiss();
        });
    }
    populateScoresFromScorecards() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading();
            let weeks = yield this.dataProvider.getWeeks();
            let currentWeek = _.find(weeks, (week) => week.week === 3);
            console.log(`Updating scores for week: ` + currentWeek.week);
            //let currentWeek = await this.dataProvider.currentWeek();
            let scorecards = yield this.dataProvider.getScorecardResults(currentWeek.week);
            scorecards.forEach(scorecard => {
                this.scorecardsProvider.insertWeeklyScore(scorecard);
            });
            this.loading.dismiss();
        });
    }
    forceUpdateOfScores() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataProvider.forceUpdateOfScores();
        });
    }
    addNewWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            let alert = this.alertController.create({
                title: 'Confirm',
                message: 'Are you sure you want to create a new week?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                        }
                    },
                    {
                        text: 'Ok',
                        handler: () => {
                            this.dataProvider.addWeek();
                        }
                    }
                ]
            });
            alert.present();
        });
    }
    showUnsubmittedPicks() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading();
            let users = yield this.dataProvider.getUnsubmittedUsersForWeek(this.currentWeek.week);
            this.navCtrl.push('ListPage', {
                title: 'Unsubmitted Players',
                list: users
            });
            this.loading.dismiss();
        });
    }
    outputWeeklyScores() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWeek = yield this.dataProvider.currentWeek();
            let scorecards = yield this.dataProvider.getScorecardResults(currentWeek.week);
            scorecards.forEach(scorecard => {
                this.weeklyScoresOutput += scorecard.nickname + '\t' + scorecard.score + '\n';
            });
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
AdminPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-admin',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\admin\admin.html"*/'<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Administration</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  \n  <button ion-button full outline (click)="addNewWeek()">Add new week</button>  \n\n  <button ion-button full outline (click)="populateScoresFromScorecards()">Populate scores</button>  \n\n  <button ion-button full outline (click)="loadScorecardsFromEmail()">Load from email</button>  \n\n  <button ion-button full outline (click)="showUnsubmittedPicks()">View unsubmitted pics for week {{currentWeek?.week}}</button>\n\n  <button ion-button full outline (click)="outputWeeklyScores()">Output weekly scores</button> \n\n  <button ion-button full outline (click)="forceUpdateOfScores()">Forece update of scores</button> \n\n  <textarea *ngIf="weeklyScoresOutput" style="width:100%;margin-top:25px">{{weeklyScoresOutput}}</textarea>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\admin\admin.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController,
        scorecards_provider_1.ScorecardsProvider,
        xmas_club_provider_1.XmasClubDataProvider,
        ionic_angular_1.LoadingController,
        ionic_angular_1.AlertController])
], AdminPage);
exports.AdminPage = AdminPage;
//# sourceMappingURL=admin.js.map

/***/ })

});
//# sourceMappingURL=7.js.map