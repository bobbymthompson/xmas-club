webpackJsonp([4],{

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
const admin_1 = __webpack_require__(773);
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

/***/ 773:
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
    constructor(navCtrl, scorecardsProvider, dataProvider) {
        this.navCtrl = navCtrl;
        this.scorecardsProvider = scorecardsProvider;
        this.dataProvider = dataProvider;
    }
    loadScorecardsFromEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWeek = yield this.dataProvider.currentWeek();
            this.scorecards = yield this.scorecardsProvider.loadScorecardsFromEmail(currentWeek.week);
        });
    }
    populateScoresFromScorecards() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWeek = yield this.dataProvider.currentWeek();
            let scores = yield this.dataProvider.scores.first().toPromise();
            let results = yield this.dataProvider.getScorecardResults(currentWeek.week);
            scores.forEach(score => {
                let weeklyScore = 0;
                let scorecard = _.find(results, scorecard => scorecard.nickname === score.$key);
                if (scorecard) {
                    weeklyScore = scorecard.score;
                }
                this.dataProvider.addScoreForUser(score.$key, currentWeek.week, weeklyScore);
            });
        });
    }
    addNewWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataProvider.addWeek();
        });
    }
};
AdminPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-admin',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\admin\admin.html"*/'<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Administration</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n  \n  <button ion-button outline (click)="addNewWeek()">Add new week</button>  \n\n  <button ion-button outline (click)="populateScoresFromScorecards()">Populate scores</button>  \n\n  <button ion-button outline (click)="loadScorecardsFromEmail()">Load from email</button>  \n  \n  <h1 *ngIf="scorecards">Loaded scorecards for:</h1>\n  <ion-list *ngIf="scorecards">\n    <ion-item *ngFor="let scorecard of scorecards">\n      <h3>{{scorecard.nickname}}</h3>\n    </ion-item>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\admin\admin.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController, scorecards_provider_1.ScorecardsProvider, xmas_club_provider_1.XmasClubDataProvider])
], AdminPage);
exports.AdminPage = AdminPage;
//# sourceMappingURL=admin.js.map

/***/ })

});
//# sourceMappingURL=4.js.map