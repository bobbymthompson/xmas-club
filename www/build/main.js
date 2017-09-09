webpackJsonp([6],{

/***/ 146:
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
const http_1 = __webpack_require__(99);
__webpack_require__(103);
__webpack_require__(186);
const _ = __webpack_require__(147);
const auth_1 = __webpack_require__(73);
const database_1 = __webpack_require__(76);
let ScorecardsProvider = class ScorecardsProvider {
    constructor(http, firebase, firebaseAuth) {
        this.http = http;
        this.firebase = firebase;
        this.firebaseAuth = firebaseAuth;
    }
    SCORECARD_PATH(week) {
        return `/scorecards/${week}/`;
    }
    /** Returns the collection of scorecards for the specified week. */
    getScorecards(week) {
        return this.firebase.list(this.SCORECARD_PATH(week));
    }
    getScorecard(week, nickname) {
        return this.firebase.list(this.SCORECARD_PATH(week), {
            query: {
                orderByChild: 'nickname',
                equalTo: nickname
            }
        }).map((items) => items.find(item => item.nickname === nickname));
    }
    createScorecard(week, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            let scorecard = yield this.getScorecardTemplate(week);
            scorecard.nickname = nickname;
            return this.firebase.list(this.SCORECARD_PATH(week)).push(scorecard);
        });
    }
    update(scorecard) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(scorecard);
            this.firebase.list(this.SCORECARD_PATH(scorecard.week)).update(scorecard.$key, {
                tieBreakerScore: scorecard.tieBreakerScore,
                picks: scorecard.picks
            });
            this.insertWeeklyScore(scorecard);
        });
    }
    getScorecardTemplate(week) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.http.get(`http://xmasclubscorer.azurewebsites.net/api/scorecardtemplates/${week}`).map((res) => res.json()).toPromise();
        });
    }
    /** Loads all scorecards that have been submitted via email. */
    loadScorecardsFromEmail(week) {
        return __awaiter(this, void 0, void 0, function* () {
            let scorecards = yield this.http.get(`http://xmasclubscorer.azurewebsites.net/api/scorecards/${week}`).map((res) => res.json()).toPromise();
            let scorecardsFb = this.getScorecards(week);
            for (let scorecard of scorecards) {
                scorecardsFb.push(scorecard);
                this.insertWeeklyScore(scorecard);
            }
            return scorecards;
        });
    }
    insertWeeklyScore(scorecard) {
        return __awaiter(this, void 0, void 0, function* () {
            let weeklyScores = yield this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).first().toPromise();
            let foundScore = _.find(weeklyScores, score => score.week === scorecard.week);
            if (!foundScore) {
                /* Insert a record into the scores array for this user. */
                this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).push({
                    week: scorecard.week,
                    score: 0
                });
            }
        });
    }
};
ScorecardsProvider = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        database_1.AngularFireDatabase,
        auth_1.AngularFireAuth])
], ScorecardsProvider);
exports.ScorecardsProvider = ScorecardsProvider;
//# sourceMappingURL=scorecards-provider.js.map

/***/ }),

/***/ 156:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 156;

/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/admin/admin.module": [
		768,
		5
	],
	"../pages/leaderboard/leaderboard.module": [
		769,
		0
	],
	"../pages/list/list.module": [
		770,
		4
	],
	"../pages/scorecard/scorecard.module": [
		771,
		3
	],
	"../pages/week/week.module": [
		772,
		2
	],
	"../pages/weeks/weeks.module": [
		773,
		1
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 172;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 317:
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
const auth_provider_1 = __webpack_require__(63);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
let RegisterPage = class RegisterPage {
    constructor(navCtrl, navParams, alertCtrl, authProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.authProvider = authProvider;
        this.createSuccess = false;
        this.credentials = { email: '', password: '', nickname: '' };
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.authProvider.registerUser(this.credentials.email, this.credentials.password, this.credentials.nickname);
            if (response.success) {
                this.createSuccess = true;
                this.showPopup("Success", "Account created.");
            }
            else {
                this.showPopup("Error", response.error + "- Please contact bobby.m.thompson@gmail.com if you need assistance");
            }
        });
    }
    showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        if (this.createSuccess) {
                            this.navCtrl.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    }
};
RegisterPage = __decorate([
    core_1.Component({
        selector: 'page-register',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\register\register.html"*/'<!--\n  Generated template for the RegisterPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Register</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content class="login-content">\n  <ion-row class="logo-row">\n    <ion-col>\n      <img src="../../assets/img/logo-sm.png" style="height:175px"/>\n    </ion-col>\n  </ion-row>\n\n  <div class="login-box">\n    \n    <form (ngSubmit)="register()" #registerForm="ngForm">\n      <ion-row>\n        <ion-col>\n          <ion-list inset>\n            \n            <ion-item>\n              <ion-input type="text" placeholder="Nickname" name="nickname" [(ngModel)]="credentials.nickname" required></ion-input>\n            </ion-item>\n\n            <ion-item>\n              <ion-input type="text" placeholder="Email" name="email" [(ngModel)]="credentials.email" required></ion-input>\n            </ion-item>\n            \n            <ion-item>\n              <ion-input type="password" placeholder="Password" name="password" [(ngModel)]="credentials.password" required></ion-input>\n            </ion-item>\n            \n          </ion-list>\n        </ion-col>\n      </ion-row>\n      \n      <ion-row>\n        <ion-col class="signup-col">\n          <button ion-button class="submit-btn" full type="submit" [disabled]="!registerForm.form.valid">Register</button>\n        </ion-col>\n      </ion-row>\n      \n    </form>\n  </div>\n</ion-content>'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\register\register.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController, ionic_angular_1.NavParams, ionic_angular_1.AlertController, auth_provider_1.AuthProvider])
], RegisterPage);
exports.RegisterPage = RegisterPage;
//# sourceMappingURL=register.js.map

/***/ }),

/***/ 450:
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
Object.defineProperty(exports, "__esModule", { value: true });
const auth_provider_1 = __webpack_require__(63);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
let TabsPage = class TabsPage {
    constructor(navParams, authProvider) {
        this.navParams = navParams;
        this.authProvider = authProvider;
        this.tab1Root = 'WeekPage';
        this.tab2Root = 'WeeksPage';
        this.tab3Root = 'LeaderboardPage';
        this.tab4Root = 'AdminPage';
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
};
TabsPage = __decorate([
    core_1.Component({template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\tabs\tabs.html"*/'<ion-tabs [selectedIndex]="mySelectedIndex" color="footer">\n  <ion-tab [root]="tab1Root" tabTitle="This Week" tabIcon="home"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="Weeks" tabIcon="calendar"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="Leaderboard" tabIcon="list-box"></ion-tab>\n  <ion-tab [root]="tab4Root" tabTitle="Admin" tabIcon="cog" *ngIf="authProvider.isAdministrator"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\tabs\tabs.html"*/
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavParams, auth_provider_1.AuthProvider])
], TabsPage);
exports.TabsPage = TabsPage;
//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 451:
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
const http_1 = __webpack_require__(99);
const auth_1 = __webpack_require__(73);
const database_1 = __webpack_require__(76);
const _ = __webpack_require__(147);
__webpack_require__(103);
__webpack_require__(184);
__webpack_require__(185);
const scorecards_provider_1 = __webpack_require__(146);
let XmasClubDataProvider = class XmasClubDataProvider {
    constructor(http, firebase, firebaseAuth, scorecardsProvider) {
        this.http = http;
        this.firebase = firebase;
        this.firebaseAuth = firebaseAuth;
        this.scorecardsProvider = scorecardsProvider;
    }
    /** Returns the weeks (ordered descendingly) */
    getWeeks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.weeks) {
                this.weeks = yield this.firebase.list(`/weeks`).map(weeks => weeks.reverse()).first().toPromise();
            }
            return this.weeks;
        });
    }
    /** Returns the current week. */
    currentWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            return _.first(yield this.getWeeks());
        });
    }
    /** Returns the specified week. */
    getWeek(week) {
        return __awaiter(this, void 0, void 0, function* () {
            return _.find(yield this.getWeeks(), w => w.week === week);
        });
    }
    addWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWeek = yield this.currentWeek();
            let dueDate = new Date(currentWeek.dueDate);
            dueDate.setDate(dueDate.getDate() + 7);
            let newWeek = currentWeek.week + 1;
            this.firebase.object(`/weeks/${newWeek}`).update({
                week: newWeek,
                totalNumberOfPicks: 24,
                dueDate: dueDate.toISOString()
            });
        });
    }
    /** Returns the collection of scores. */
    get scores() {
        return this.firebase.list('/scores', {
            query: {
                orderByChild: 'total',
            }
        });
    }
    get users() {
        return this.firebase.list('/users');
    }
    addScoreForUser(nickname, week, score) {
        return __awaiter(this, void 0, void 0, function* () {
            let weeklyScores = yield this.firebase.list(`/scores/${nickname}/weeklyScores`).first().toPromise();
            let foundScore = _.find(weeklyScores, score => score.week === week);
            if (foundScore) {
                console.log(`${nickname} already has a score for week ${week} (Current score: ${foundScore.score} - New score: ${score}`);
                console.log('Updating score:', foundScore);
                this.firebase.object(`/scores/${nickname}/weeklyScores/${foundScore.$key}`).update({
                    score: score
                });
            }
            else {
                console.log('Inserting score to the weekly scores');
                this.firebase.list(`/scores/${nickname}/weeklyScores`).push({
                    week: week,
                    score: score
                });
            }
        });
    }
    /** Returns the score cards for the specified week. */
    getGameResults(week) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.http.get(`http://xmasclubscorer.azurewebsites.net/api/gameresults/${week}`).map((res) => res.json()).toPromise();
        });
    }
    getScorecardResults(week) {
        return __awaiter(this, void 0, void 0, function* () {
            let gameResults = yield this.getGameResults(week);
            let scorecardResults = yield this.scorecardsProvider.getScorecards(week).first().toPromise();
            /* Ensure the scorecards are an array */
            let scorecards = _.values(scorecardResults);
            for (let scorecard of scorecards) {
                scorecard.score = 0;
                for (let pick of scorecard.picks) {
                    let game = _.find(gameResults, (game) => {
                        return (game.team1.name.toLowerCase() == pick.team1.toLowerCase()) && (game.team2.name.toLowerCase() == pick.team2.toLowerCase());
                    });
                    if (!game) {
                        console.log(`Unable to find a game for teams. Team1: '${pick.team1}' - Team2: '${pick.team2}' - Spread: '${pick.spread}' - Type: '${pick.pickType}'`);
                    }
                    else {
                        /* Set the home team on this pick. */
                        pick.homeTeam = game.homeTeam;
                        if (game.status == "Complete") {
                            let correct = false;
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
                                    }
                                    else if (pick.selectedPick == "Team2") {
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
                                }
                                else if (pick.selectedPick == "Team2") {
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
            let rank = 1;
            for (let scorecard of orderedScorecards) {
                scorecard.rank = rank++;
            }
            return orderedScorecards;
        });
    }
    getUnsubmittedUsersForWeek(week) {
        return __awaiter(this, void 0, void 0, function* () {
            let scores = yield this.scores.first().toPromise();
            let unsubmittedScorecards = [];
            for (let score of scores) {
                let scorecard = yield this.scorecardsProvider.getScorecard(week, score.$key).first().toPromise();
                if (!scorecard) {
                    unsubmittedScorecards.push(score.$key);
                }
            }
            return unsubmittedScorecards;
        });
    }
};
XmasClubDataProvider = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        database_1.AngularFireDatabase,
        auth_1.AngularFireAuth,
        scorecards_provider_1.ScorecardsProvider])
], XmasClubDataProvider);
exports.XmasClubDataProvider = XmasClubDataProvider;
//# sourceMappingURL=xmas-club.provider.js.map

/***/ }),

/***/ 452:
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
const auth_provider_1 = __webpack_require__(63);
const register_1 = __webpack_require__(317);
let LoginPage = class LoginPage {
    constructor(navCtrl, authProvider, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.authProvider = authProvider;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.credentials = { email: '', password: '' };
    }
    createAccount() {
        this.navCtrl.push(register_1.RegisterPage);
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.credentials.email && this.credentials.password) {
                this.showLoading();
                this.authProvider.loginUser(this.credentials.email, this.credentials.password).then(() => {
                    this.navCtrl.pop();
                }).catch((error) => {
                    this.showError('Invalid email or password.');
                });
            }
        });
    }
    forgotPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.credentials.email) {
                this.showPopup('Email required', 'Please enter your email address to reset your password');
            }
            else {
                this.authProvider.forgotPassword(this.credentials.email);
                this.showPopup('Forgot password email sent', 'Please check your email inbox to complete your password reset');
            }
        });
    }
    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }
    showError(text) {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    }
    showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }
};
LoginPage = __decorate([
    core_1.Component({
        selector: 'page-login',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\login\login.html"*/'<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Login</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content class="login-content">\n  <ion-row class="logo-row">\n    <ion-col>\n      <img src="../../assets/img/logo-sm.png" style="height:175px" />\n    </ion-col>\n  </ion-row>\n  <div class="login-box">\n    <form (ngSubmit)="login()" #registerForm="ngForm">\n      <ion-row>\n        <ion-col>\n          <ion-list>\n\n            <ion-item>\n              <ion-input type="text" placeholder="Email" name="email" [(ngModel)]="credentials.email" required></ion-input>\n            </ion-item>\n\n            <ion-item>\n              <ion-input type="password" placeholder="Password" name="password" [(ngModel)]="credentials.password" required></ion-input>\n            </ion-item>\n\n          </ion-list>\n        </ion-col>\n      </ion-row>\n\n      <ion-row>\n        <ion-col class="signup-col">\n          <button ion-button class="submit-btn" full type="submit" [disabled]="!registerForm.form.valid">Login</button>\n        </ion-col>\n      </ion-row>\n\n    </form>\n\n    <ion-row>\n        <ion-col class="signup-col">\n          <button ion-button class="forgot-password-btn" block clear (click)="forgotPassword()">Forgot Password</button>\n          <button ion-button class="register-btn" block clear (click)="createAccount()">Create New Account</button>\n        </ion-col>\n      </ion-row>\n\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\login\login.html"*/
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController,
        auth_provider_1.AuthProvider,
        ionic_angular_1.AlertController,
        ionic_angular_1.LoadingController])
], LoginPage);
exports.LoginPage = LoginPage;
//# sourceMappingURL=login.js.map

/***/ }),

/***/ 453:
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
let ReverseArrayPipe = class ReverseArrayPipe {
    transform(values, ...args) {
        if (values) {
            return values.reverse();
        }
        return values;
    }
};
ReverseArrayPipe = __decorate([
    core_1.Pipe({
        name: 'reverse',
    })
], ReverseArrayPipe);
exports.ReverseArrayPipe = ReverseArrayPipe;
//# sourceMappingURL=reverse-array.js.map

/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_dynamic_1 = __webpack_require__(455);
const app_module_1 = __webpack_require__(459);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.XmasClubModule);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const es2015_1 = __webpack_require__(69);
const login_1 = __webpack_require__(452);
const core_1 = __webpack_require__(0);
const http_1 = __webpack_require__(99);
const platform_browser_1 = __webpack_require__(41);
const ionic_angular_1 = __webpack_require__(52);
const storage_1 = __webpack_require__(69);
const settings_1 = __webpack_require__(762);
const app_component_1 = __webpack_require__(763);
const tabs_1 = __webpack_require__(450);
const xmas_club_provider_1 = __webpack_require__(451);
const scorecards_provider_1 = __webpack_require__(146);
const angularfire2_1 = __webpack_require__(767);
const database_1 = __webpack_require__(76);
const auth_1 = __webpack_require__(73);
const auth_provider_1 = __webpack_require__(63);
const reverse_array_1 = __webpack_require__(453);
const register_1 = __webpack_require__(317);
exports.firebaseConfig = {
    apiKey: "AIzaSyDgh6wIiKbNUFhqgtmRuPHw6bGJ8KrIqg0",
    authDomain: "xmas-club.firebaseapp.com",
    databaseURL: "https://xmas-club.firebaseio.com",
    projectId: "xmas-club",
    storageBucket: "",
    messagingSenderId: "260309513061"
};
function provideSettings(storage) {
    /**
     * The Settings provider takes a set of default settings for your app.
     *
     * You can add new settings options at any time. Once the settings are saved,
     * these values will not overwrite the saved values (this can be done manually if desired).
     */
    return new settings_1.Settings(storage, {
        option1: true
    });
}
exports.provideSettings = provideSettings;
/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
    app_component_1.XmasClubApp,
    tabs_1.TabsPage,
    login_1.LoginPage,
    register_1.RegisterPage
];
let pipes = [
    reverse_array_1.ReverseArrayPipe
];
function declarations() {
    return pages;
    //return [].concat(pipes).concat(pages);
}
exports.declarations = declarations;
function entryComponents() {
    return pages;
}
exports.entryComponents = entryComponents;
function providers() {
    return [
        scorecards_provider_1.ScorecardsProvider,
        xmas_club_provider_1.XmasClubDataProvider,
        auth_provider_1.AuthProvider,
        { provide: settings_1.Settings, useFactory: provideSettings, deps: [storage_1.Storage] },
        // Keep this to enable Ionic's runtime error handling during development
        { provide: core_1.ErrorHandler, useClass: ionic_angular_1.IonicErrorHandler }
    ];
}
exports.providers = providers;
let XmasClubModule = class XmasClubModule {
};
XmasClubModule = __decorate([
    core_1.NgModule({
        declarations: declarations(),
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            ionic_angular_1.IonicModule.forRoot(app_component_1.XmasClubApp, {}, {
                links: [
                    { loadChildren: '../pages/admin/admin.module#AdminPageModule', name: 'AdminPage', segment: 'admin', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/leaderboard/leaderboard.module#LeaderboardModule', name: 'LeaderboardPage', segment: 'leaderboard', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/list/list.module#ListPageModule', name: 'ListPage', segment: 'list', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/scorecard/scorecard.module#ScorecardPageModule', name: 'ScorecardPage', segment: 'scorecard', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/week/week.module#WeekModule', name: 'WeekPage', segment: 'week/:week', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/weeks/weeks.module#WeeksModule', name: 'WeeksPage', segment: 'weeks', priority: 'low', defaultHistory: [] }
                ]
            }),
            es2015_1.IonicStorageModule.forRoot(),
            angularfire2_1.AngularFireModule.initializeApp(exports.firebaseConfig),
            database_1.AngularFireDatabaseModule,
            auth_1.AngularFireAuthModule
        ],
        bootstrap: [ionic_angular_1.IonicApp],
        entryComponents: entryComponents(),
        providers: providers()
    })
], XmasClubModule);
exports.XmasClubModule = XmasClubModule;
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 63:
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
const Rx_1 = __webpack_require__(187);
const core_1 = __webpack_require__(0);
const auth_1 = __webpack_require__(73);
const database_1 = __webpack_require__(76);
let AuthProvider = class AuthProvider {
    constructor(firebase, firebaseAuth) {
        this.firebase = firebase;
        this.firebaseAuth = firebaseAuth;
        this.onAuthStateChanged().subscribe(user => {
            this.user = user;
        });
    }
    get isAuthenticated() {
        return this.user != null;
    }
    get isAdministrator() {
        return this.user != null && this.user.nickname == "Striker";
    }
    onAuthStateChanged() {
        let that = this;
        return Rx_1.Observable.create(function (observer) {
            that.firebaseAuth.auth.onAuthStateChanged(user => {
                if (user) {
                    that.firebase.object(`/users/${user.uid}`).subscribe(profile => {
                        user.nickname = profile.nickname;
                        user.favorites = profile.favorites;
                        observer.next(user);
                    });
                }
                else {
                    observer.next(null);
                }
            });
        });
    }
    registerUser(email, password, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newUser = yield this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
                this.firebase.object(`/users/${newUser.uid}/`).set({
                    favorites: [],
                    nickname: nickname
                });
                let user = yield this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
                return new Promise((resolve, reject) => {
                    resolve({
                        success: true,
                        error: ''
                    });
                });
            }
            catch (ex) {
                console.log('Error registering user.');
                console.log(ex);
                return new Promise((resolve, reject) => {
                    resolve({
                        success: false,
                        error: ex.message
                    });
                });
            }
        });
    }
    loginUser(email, password) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }
    logoutUser() {
        this.firebaseAuth.auth.signOut();
    }
    forgotPassword(email) {
        this.firebaseAuth.auth.sendPasswordResetEmail(email);
    }
    loginUserUsingGoogle() {
        return __awaiter(this, void 0, void 0, function* () {
            // var provider = new firebase.auth.GoogleAuthProvider();
            // provider.addScope('https://www.googleapis.com/auth/plus.login');
            // var that = this;
            // return firebase.auth().signInWithPopup(provider).then(function (result) {
            //   if (result.user) {
            //     var user = result.user;
            //     var res = result.user.displayName.split(" ");
            //     // that.userProfile.child(user.uid).set({
            //     //   email: user.email,
            //     //   photo: user.photoURL,
            //     //   username: user.displayName,
            //     //   name: {
            //     //     first: res[0],
            //     //     middle: res[1],
            //     //     last: res[2],
            //     //   },
            //     // });
            //   }
            // }).catch(function (error) {
            //   console.log(error);
            // });
        });
    }
};
AuthProvider = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [database_1.AngularFireDatabase, auth_1.AngularFireAuth])
], AuthProvider);
exports.AuthProvider = AuthProvider;
//# sourceMappingURL=auth.provider.js.map

/***/ }),

/***/ 762:
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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(0);
const storage_1 = __webpack_require__(69);
/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
let Settings = class Settings {
    constructor(storage, defaults) {
        this.storage = storage;
        this.SETTINGS_KEY = '_settings';
        this._defaults = defaults;
    }
    load() {
        return this.storage.get(this.SETTINGS_KEY).then((value) => {
            if (value) {
                this.settings = value;
                this._mergeDefaults(this._defaults);
            }
            else {
                return this.setAll(this._defaults).then((val) => {
                    this.settings = val;
                });
            }
        });
    }
    _mergeDefaults(defaults) {
        for (let k in defaults) {
            if (!(k in this.settings)) {
                this.settings[k] = defaults[k];
            }
        }
        return this.setAll(this.settings);
    }
    merge(settings) {
        for (let k in settings) {
            this.settings[k] = settings[k];
        }
        return this.save();
    }
    setValue(key, value) {
        this.settings[key] = value;
        return this.storage.set(this.SETTINGS_KEY, this.settings);
    }
    setAll(value) {
        return this.storage.set(this.SETTINGS_KEY, value);
    }
    getValue(key) {
        return this.storage.get(this.SETTINGS_KEY)
            .then(settings => {
            return settings[key];
        });
    }
    save() {
        return this.setAll(this.settings);
    }
    get allSettings() {
        return this.settings;
    }
};
Settings = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [storage_1.Storage, Object])
], Settings);
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 763:
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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(52);
const ionic_native_1 = __webpack_require__(764);
const storage_1 = __webpack_require__(69);
const tabs_1 = __webpack_require__(450);
let XmasClubApp = class XmasClubApp {
    constructor(events, menu, platform, storage) {
        this.events = events;
        this.menu = menu;
        this.platform = platform;
        this.storage = storage;
        // List of pages that can be navigated to from the left menu
        // the left menu only works after login
        // the login page disables the left menu
        this.appPages = [
            { title: 'Home', component: tabs_1.TabsPage, icon: 'home' }
        ];
        this.rootPage = tabs_1.TabsPage;
        // Call any initial plugins when ready
        this.platform.ready().then(() => {
            ionic_native_1.Splashscreen.hide();
            ionic_native_1.StatusBar.backgroundColorByHexString('#3EB29A');
        });
        /* Load any initial configuration that is needed */
    }
    openPage(page) {
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, { tabIndex: page.index });
        }
        else {
            this.nav.setRoot(page.component).catch(() => {
                console.log("Didn't set nav root");
            });
        }
        if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            // setTimeout(() => {
            //   this.userData.logout();
            // }, 1000);
        }
    }
};
__decorate([
    core_1.ViewChild(ionic_angular_1.Nav),
    __metadata("design:type", ionic_angular_1.Nav)
], XmasClubApp.prototype, "nav", void 0);
XmasClubApp = __decorate([
    core_1.Component({template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\app\app.html"*/'\n<!-- logged out menu -->\n<!-- <ion-menu [content]="content">\n\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content class="outer-content">\n\n    <ion-list>\n      <ion-list-header>\n        Navigate\n      </ion-list-header>\n      <button ion-item menuClose *ngFor="let p of appPages" (click)="openPage(p)">\n        <ion-icon item-left [name]="p.icon"></ion-icon>\n        {{p.title}}\n      </button>\n    </ion-list>\n\n  </ion-content>\n\n</ion-menu> -->\n\n<!-- main navigation -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [ionic_angular_1.Events,
        ionic_angular_1.MenuController,
        ionic_angular_1.Platform,
        storage_1.Storage])
], XmasClubApp);
exports.XmasClubApp = XmasClubApp;
//# sourceMappingURL=app.component.js.map

/***/ })

},[454]);
//# sourceMappingURL=main.js.map