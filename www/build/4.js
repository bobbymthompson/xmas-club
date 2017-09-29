webpackJsonp([4],{

/***/ 772:
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
const scorecard_1 = __webpack_require__(781);
let ScorecardPageModule = class ScorecardPageModule {
};
ScorecardPageModule = __decorate([
    core_1.NgModule({
        declarations: [
            scorecard_1.ScorecardPage,
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(scorecard_1.ScorecardPage),
        ],
        exports: [
            scorecard_1.ScorecardPage
        ]
    })
], ScorecardPageModule);
exports.ScorecardPageModule = ScorecardPageModule;
//# sourceMappingURL=scorecard.module.js.map

/***/ }),

/***/ 781:
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
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const xmas_club_provider_1 = __webpack_require__(451);
const _ = __webpack_require__(146);
const auth_provider_1 = __webpack_require__(63);
let ScorecardPage = class ScorecardPage {
    constructor(navCtrl, navParams, scorecardsProvider, dataProvider, authProvider, elementRef) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.scorecardsProvider = scorecardsProvider;
        this.dataProvider = dataProvider;
        this.authProvider = authProvider;
        this.elementRef = elementRef;
        this.week = this.navParams.get('week');
        this.scorecardsProvider.getScorecard(this.week, this.navParams.get('nickname')).first().toPromise().then((scorecard) => __awaiter(this, void 0, void 0, function* () {
            this.scorecard = scorecard;
            if (scorecard) {
                let theWeek = yield this.dataProvider.getWeek(this.week);
                this.tieBreakerScore = scorecard.tieBreakerScore;
                this.dueDate = new Date(theWeek.dueDate);
                let gameResults;
                if (new Date() >= this.dueDate) {
                    gameResults = yield this.dataProvider.getGameResults(this.week);
                }
                else {
                    gameResults = [];
                }
                console.log(`Due Date: ${this.dueDate.toISOString()} - Current Date: ${new Date().toISOString()}`);
                for (let pick of scorecard.picks) {
                    pick.team1Selected = (pick.selectedPick == 'Team1') ? true : false;
                    pick.team2Selected = (pick.selectedPick == 'Team2') ? true : false;
                    let result = this.dataProvider.calculatePickResult(theWeek, pick, gameResults);
                    pick.homeTeam = result.homeTeam;
                    pick.complete = result.complete;
                    if (pick.complete) {
                        pick.correct = result.correct;
                        pick.incorrect = !result.correct;
                    }
                }
                this.tieBreakerGame = _.last(scorecard.picks);
            }
        }));
        if (this.navParams.get('enableEditMode')) {
            this.inEditMode = true;
        }
    }
    isScorecardViewable() {
        if (this.inEditMode)
            return true;
        /* Only allow the user to view this scorecard if it is after the due date */
        if (new Date() >= this.dueDate) {
            return true;
        }
        if (this.scorecard && this.scorecard.nickname === this.authProvider.user.nickname) {
            return true;
        }
        if (this.authProvider.isAdministrator) {
            return true;
        }
        return false;
    }
    canEditScorecard() {
        if (this.inEditMode)
            return false;
        if (!this.scorecard)
            return false;
        /* Only if the current user is authenticated */
        if (!this.authProvider.isAuthenticated)
            return false;
        /* Only if this is the current users scorecard */
        if (!this.scorecard || this.authProvider.user.nickname != this.scorecard.nickname)
            return false;
        /* Only if it is before the due date. */
        if (!this.dueDate || new Date() >= this.dueDate)
            return false;
        return true;
    }
    updateSelectedPick(pick, selectedTeam) {
        if (selectedTeam == 'Team1') {
            if (pick.team1Selected) {
                pick.team2Selected = false;
                pick.selectedPick = 'Team1';
            }
            else {
                pick.team2Selected = true;
                pick.selectedPick = 'Team2';
            }
        }
        else if (selectedTeam == 'Team2') {
            if (pick.team2Selected) {
                pick.team1Selected = false;
                pick.selectedPick = 'Team2';
            }
            else {
                pick.team1Selected = true;
                pick.selectedPick = 'Team1';
            }
        }
    }
    editScorecard() {
        this.inEditMode = true;
    }
    saveScorecard() {
        this.scorecard.tieBreakerScore = this.tieBreakerScore;
        this.scorecardsProvider.update(this.scorecard);
        this.inEditMode = false;
    }
};
ScorecardPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-scorecard',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\scorecard\scorecard.html"*/'<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Week {{week}} - {{scorecard?.nickname}}</ion-title>\n\n    <ion-buttons end>\n      <button ion-button icon-only (click)="editScorecard()" *ngIf="canEditScorecard()">\n        <ion-icon name="md-create"></ion-icon>\n      </button>\n      <button ion-button icon-only (click)="saveScorecard()" *ngIf="inEditMode">\n        <ion-icon name="md-checkmark"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-grid *ngIf="isScorecardViewable()" no-padding>\n    <ion-row *ngFor="let pick of (scorecard)?.picks">\n      <ion-col col-1>\n        <ion-toggle *ngIf="!pick.complete" [disabled]="!inEditMode" [(ngModel)]="pick.team1Selected" (ionChange)="updateSelectedPick(pick, \'Team1\')"></ion-toggle>\n        <ion-toggle *ngIf="pick.complete && pick.correct" [class.correctPick]="pick.correct" [disabled]="!inEditMode" [(ngModel)]="pick.team1Selected" (ionChange)="updateSelectedPick(pick, \'Team1\')"></ion-toggle>\n        <ion-toggle *ngIf="pick.complete && pick.incorrect" [class.incorrectPick]="pick.incorrect" [disabled]="!inEditMode" [(ngModel)]="pick.team1Selected" (ionChange)="updateSelectedPick(pick, \'Team1\')"></ion-toggle>\n      </ion-col>\n      <ion-col col-10 style="padding:0px 18px 0px 18px;line-height:2.7;font-size:9px;">\n        <ion-row style="text-align: center; padding-bottom: 16px" [class.incorrectPick]="pick.incorrect" [class.correctPick]="pick.correct">\n          <ion-col col-4><span [style.font-weight]="pick.homeTeam == pick.team1 ? \'bold\' : \'\'">{{pick.team1}}</span></ion-col>\n          <ion-col col-2><span>vs.</span></ion-col>\n          <ion-col col-4><span [style.font-weight]="pick.homeTeam == pick.team2 ? \'bold\' : \'\'">{{pick.team2}}</span></ion-col>\n          <ion-col col-2><span>{{pick.spread}}</span></ion-col>\n        </ion-row>\n      </ion-col>\n      <ion-col col-1>\n        <ion-toggle *ngIf="!pick.complete" [disabled]="!inEditMode" [(ngModel)]="pick.team2Selected" (ionChange)="updateSelectedPick(pick, \'Team2\')" style="float:right"></ion-toggle>\n        <ion-toggle *ngIf="pick.complete && pick.correct" [class.correctPick]="pick.correct" [disabled]="!inEditMode" [(ngModel)]="pick.team2Selected" (ionChange)="updateSelectedPick(pick, \'Team2\')" style="float:right"></ion-toggle>\n        <ion-toggle *ngIf="pick.complete && pick.incorrect" [class.incorrectPick]="pick.incorrect" [disabled]="!inEditMode" [(ngModel)]="pick.team2Selected" (ionChange)="updateSelectedPick(pick, \'Team2\')" style="float:right"></ion-toggle>\n      </ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-item>\n        <ion-label stacked>Total Score ({{tieBreakerGame?.team1}} vs. {{tieBreakerGame?.team2}}):</ion-label>\n        <ion-input type="number" style="border: black 1px solid;" [(ngModel)]="tieBreakerScore" [disabled]="!inEditMode"></ion-input>\n      </ion-item>\n    </ion-row>\n  </ion-grid>\n  <h4 *ngIf="!isScorecardViewable()">Viewing a scorecard is disabled until after noon on Saturday</h4>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\scorecard\scorecard.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController,
        ionic_angular_1.NavParams,
        scorecards_provider_1.ScorecardsProvider,
        xmas_club_provider_1.XmasClubDataProvider,
        auth_provider_1.AuthProvider,
        core_1.ElementRef])
], ScorecardPage);
exports.ScorecardPage = ScorecardPage;
//# sourceMappingURL=scorecard.js.map

/***/ })

});
//# sourceMappingURL=4.js.map