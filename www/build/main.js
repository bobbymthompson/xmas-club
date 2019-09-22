webpackJsonp([8],{

/***/ 127:
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
const http_1 = __webpack_require__(103);
__webpack_require__(185);
__webpack_require__(266);
const _ = __webpack_require__(224);
const auth_1 = __webpack_require__(104);
const database_1 = __webpack_require__(106);
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
            this.insertWeeklyScore(scorecard);
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
            let result = yield this.http.get(`http://xmasclubscorer.azurewebsites.net/api/scorecards/${week}`).map((res) => res.json()).toPromise();
            let scorecards = result.Results;
            let scorecardsFb = this.getScorecards(week);
            for (let scorecard of scorecards) {
                /* Standardize on all nicknames being upper case. */
                scorecard.nickname = scorecard.nickname.toUpperCase();
                console.log(`Looking for scorecard for week ${week} and user: ${scorecard.nickname}`);
                /* Determine if the user already submitted a scorecard and this should replace the old one */
                let found = yield this.getScorecard(week, scorecard.nickname).first().toPromise();
                if (found) {
                    console.log('Found existing scorecard - updating');
                    /* Hack - set the key on the new scorecard so it is updated */
                    scorecard.$key = found.$key;
                    this.update(scorecard);
                    /* Hack set an asterisk to denote this scorecard was updated. */
                    scorecard.nickname = scorecard.nickname;
                }
                else {
                    /* Push the scorecard in. */
                    scorecardsFb.push(scorecard);
                    /* Determine if the specified nickname exists as a known user */
                    let scores = yield this.firebase.object(`/scores/${scorecard.nickname}/`).first().toPromise();
                    this.insertWeeklyScore(scorecard);
                }
            }
            return result;
        });
    }
    showEmailsInInbox(week) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.http.get(`http://xmasclubscorer.azurewebsites.net/api/queued-emails/${week}`).map((res) => res.json()).toPromise();
            return result;
        });
    }
    insertWeeklyScore(scorecard) {
        return __awaiter(this, void 0, void 0, function* () {
            let weeklyScores = yield this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).first().toPromise();
            let foundScore = _.find(weeklyScores, score => score.week === scorecard.week);
            if (!foundScore) {
                console.log(`Inserting into scores - Week: ${scorecard.week} Score: ${scorecard.score}`);
                /* Insert a record into the scores array for this user. */
                this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).push({
                    week: scorecard.week,
                    score: scorecard.score ? scorecard.score : 0,
                    total: scorecard.score ? scorecard.score : 0
                });
            }
            else {
                console.log(`Updating scores - Week: ${scorecard.week} Score: ${scorecard.score}`);
                this.firebase.list(`/scores/${scorecard.nickname}/weeklyScores`).update(foundScore.$key, {
                    score: scorecard.score ? scorecard.score : 0,
                    total: scorecard.score ? scorecard.score : 0
                });
            }
        });
    }
};
ScorecardsProvider = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object, typeof (_b = typeof database_1.AngularFireDatabase !== "undefined" && database_1.AngularFireDatabase) === "function" && _b || Object, typeof (_c = typeof auth_1.AngularFireAuth !== "undefined" && auth_1.AngularFireAuth) === "function" && _c || Object])
], ScorecardsProvider);
exports.ScorecardsProvider = ScorecardsProvider;
var _a, _b, _c;
//# sourceMappingURL=scorecards-provider.js.map

/***/ }),

/***/ 217:
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
const auth_provider_1 = __webpack_require__(43);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(55);
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
        selector: 'page-register',
        templateUrl: 'register.html',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ionic_angular_1.NavController !== "undefined" && ionic_angular_1.NavController) === "function" && _a || Object, typeof (_b = typeof ionic_angular_1.NavParams !== "undefined" && ionic_angular_1.NavParams) === "function" && _b || Object, typeof (_c = typeof ionic_angular_1.AlertController !== "undefined" && ionic_angular_1.AlertController) === "function" && _c || Object, typeof (_d = typeof auth_provider_1.AuthProvider !== "undefined" && auth_provider_1.AuthProvider) === "function" && _d || Object])
], RegisterPage);
exports.RegisterPage = RegisterPage;
var _a, _b, _c, _d;
//# sourceMappingURL=register.js.map

/***/ }),

/***/ 218:
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
const ionic_angular_1 = __webpack_require__(55);
const ionic_native_1 = __webpack_require__(779);
const storage_1 = __webpack_require__(72);
const tabs_1 = __webpack_require__(219);
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
    __metadata("design:type", typeof (_a = typeof ionic_angular_1.Nav !== "undefined" && ionic_angular_1.Nav) === "function" && _a || Object)
], XmasClubApp.prototype, "nav", void 0);
XmasClubApp = __decorate([
    core_1.Component({
        templateUrl: 'app.html'
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof ionic_angular_1.Events !== "undefined" && ionic_angular_1.Events) === "function" && _b || Object, typeof (_c = typeof ionic_angular_1.MenuController !== "undefined" && ionic_angular_1.MenuController) === "function" && _c || Object, typeof (_d = typeof ionic_angular_1.Platform !== "undefined" && ionic_angular_1.Platform) === "function" && _d || Object, typeof (_e = typeof storage_1.Storage !== "undefined" && storage_1.Storage) === "function" && _e || Object])
], XmasClubApp);
exports.XmasClubApp = XmasClubApp;
var _a, _b, _c, _d, _e;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 219:
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
const auth_provider_1 = __webpack_require__(43);
const core_1 = __webpack_require__(0);
const ionic_angular_1 = __webpack_require__(55);
let TabsPage = class TabsPage {
    constructor(navParams, authProvider) {
        this.navParams = navParams;
        this.authProvider = authProvider;
        this.tab1Root = 'WeekPage';
        this.tab2Root = 'WeeksPage';
        this.tab3Root = 'LeaderboardPage';
        this.tab4Root = 'ProfilePage';
        this.tab5Root = 'AdminPage';
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
};
TabsPage = __decorate([
    core_1.Component({
        templateUrl: 'tabs.html'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ionic_angular_1.NavParams !== "undefined" && ionic_angular_1.NavParams) === "function" && _a || Object, typeof (_b = typeof auth_provider_1.AuthProvider !== "undefined" && auth_provider_1.AuthProvider) === "function" && _b || Object])
], TabsPage);
exports.TabsPage = TabsPage;
var _a, _b;
//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 220:
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
const http_1 = __webpack_require__(103);
const auth_1 = __webpack_require__(104);
const database_1 = __webpack_require__(106);
const _ = __webpack_require__(224);
__webpack_require__(185);
__webpack_require__(264);
__webpack_require__(265);
const scorecards_provider_1 = __webpack_require__(127);
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
    priorWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWeek = yield this.currentWeek();
            if (currentWeek.week == 1) {
                return currentWeek;
            }
            return yield this.getWeek(currentWeek.week - 1);
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
    /** Returns the score cards for the specified week. */
    getGameResults(week) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.http.get(`http://xmasclubscorer.azurewebsites.net/api/gameresults/${week}`).map((res) => res.json()).toPromise();
        });
    }
    getScorecardResults(week) {
        return __awaiter(this, void 0, void 0, function* () {
            let theWeek = yield this.getWeek(week);
            let gameResults = yield this.getGameResults(week);
            let scorecardResults = yield this.scorecardsProvider.getScorecards(week).first().toPromise();
            /* Ensure the scorecards are an array */
            let scorecards = _.values(scorecardResults);
            for (let scorecard of scorecards) {
                scorecard.score = 0;
                /* Keep track of the previous pick for use in over/unders. */
                let previousPick = null;
                for (let pick of scorecard.picks) {
                    /* Use the previous picks teams when it is an over/under. */
                    // && pick.team1.toLowerCase() == 'over' && pick.team2.toLowerCase() == 'under'
                    if (pick.isOverUnder) {
                        pick.team1 = previousPick.team1;
                        pick.team2 = previousPick.team2;
                    }
                    let result = this.calculatePickResult(theWeek, pick, gameResults);
                    pick.homeTeam = result.homeTeam;
                    if (result.correct) {
                        scorecard.score++;
                    }
                    previousPick = pick;
                }
            }
            let orderedScorecards = _.sortBy(scorecards, 'score').reverse();
            let thisWeek = yield this.getWeek(week);
            let winnerIndex = _.findIndex(orderedScorecards, { nickname: thisWeek.winner });
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
            return orderedScorecards;
        });
    }
    checkForScorecardsWithoutPicks(week) {
        return __awaiter(this, void 0, void 0, function* () {
            let scores = yield this.scores.first().toPromise();
            let users = [];
            for (let score of scores) {
                let scorecard = yield this.scorecardsProvider.getScorecard(week, score.$key).first().toPromise();
                if (scorecard) {
                    let containsAtLeastOnePick = false;
                    scorecard.picks.forEach(pick => {
                        if (pick.selectedPick !== 'None') {
                            containsAtLeastOnePick = true;
                        }
                    });
                    if (!containsAtLeastOnePick) {
                        users.push(score.$key);
                    }
                }
            }
            return users;
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
    calculatePickResult(week, pick, gameResults) {
        let result = {
            complete: false,
            correct: false,
            homeTeam: '',
            homeTeamScore: 0,
            awayTeamScore: 0
        };
        let game = _.find(gameResults, (game) => {
            return (game.team1.name.toLowerCase() == pick.team1.toLowerCase()) && (game.team2.name.toLowerCase() == pick.team2.toLowerCase());
        });
        if (!game) {
            console.log(`Unable to find a game for teams. Team1: '${pick.team1}' - Team2: '${pick.team2}' - Spread: '${pick.spread}' - Type: '${pick.pickType}'`);
        }
        else {
            /* Set the home team on this pick. */
            result.homeTeam = game.homeTeam;
            if (game.homeTeam === game.team1.name) {
                result.homeTeamScore = game.team1.score;
                result.awayTeamScore = game.team2.score;
            }
            else {
                result.homeTeamScore = game.team2.score;
                result.awayTeamScore = game.team1.score;
            }
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
                        }
                        else if (pick.selectedPick == "Team2") {
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
                    }
                    else if (pick.selectedPick == "Team2") {
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
    forceUpdateOfScores() {
        return __awaiter(this, void 0, void 0, function* () {
            var results = yield this.http.get(`https://xmas-club-api.herokuapp.com/calculate-scores`).map((res) => res.json()).toPromise();
            console.log(results);
        });
    }
};
XmasClubDataProvider = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object, typeof (_b = typeof database_1.AngularFireDatabase !== "undefined" && database_1.AngularFireDatabase) === "function" && _b || Object, typeof (_c = typeof auth_1.AngularFireAuth !== "undefined" && auth_1.AngularFireAuth) === "function" && _c || Object, typeof (_d = typeof scorecards_provider_1.ScorecardsProvider !== "undefined" && scorecards_provider_1.ScorecardsProvider) === "function" && _d || Object])
], XmasClubDataProvider);
exports.XmasClubDataProvider = XmasClubDataProvider;
var _a, _b, _c, _d;
//# sourceMappingURL=xmas-club.provider.js.map

/***/ }),

/***/ 226:
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
const ionic_angular_1 = __webpack_require__(55);
const auth_provider_1 = __webpack_require__(43);
const register_1 = __webpack_require__(217);
let LoginPage = class LoginPage {
    constructor(navCtrl, navParams, _app, authProvider, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._app = _app;
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
                    // let popToPage = this.navParams.get('popToPage');
                    // console.log('Pop to page: ', popToPage);
                    // if (popToPage) {
                    //   this.navCtrl.pop(popToPage);
                    // } else {
                    //   this._app.getRootNav().popToRoot();
                    // }
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
    close() {
        this.navCtrl.pop();
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
        selector: 'page-login',
        templateUrl: 'login.html'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ionic_angular_1.NavController !== "undefined" && ionic_angular_1.NavController) === "function" && _a || Object, typeof (_b = typeof ionic_angular_1.NavParams !== "undefined" && ionic_angular_1.NavParams) === "function" && _b || Object, typeof (_c = typeof ionic_angular_1.App !== "undefined" && ionic_angular_1.App) === "function" && _c || Object, typeof (_d = typeof auth_provider_1.AuthProvider !== "undefined" && auth_provider_1.AuthProvider) === "function" && _d || Object, typeof (_e = typeof ionic_angular_1.AlertController !== "undefined" && ionic_angular_1.AlertController) === "function" && _e || Object, typeof (_f = typeof ionic_angular_1.LoadingController !== "undefined" && ionic_angular_1.LoadingController) === "function" && _f || Object])
], LoginPage);
exports.LoginPage = LoginPage;
var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=login.js.map

/***/ }),

/***/ 241:
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
webpackEmptyAsyncContext.id = 241;

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/admin/admin.module.ngfactory": [
		791,
		7
	],
	"../pages/leaderboard/leaderboard.module.ngfactory": [
		792,
		6
	],
	"../pages/list/list.module.ngfactory": [
		793,
		5
	],
	"../pages/profile/profile.module.ngfactory": [
		794,
		4
	],
	"../pages/scorecard/scorecard.module.ngfactory": [
		795,
		0
	],
	"../pages/week/week.module.ngfactory": [
		796,
		3
	],
	"../pages/weekly-leaderboard/weekly-leaderboard.module.ngfactory": [
		797,
		1
	],
	"../pages/weeks/weeks.module.ngfactory": [
		798,
		2
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
webpackAsyncContext.id = 251;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 333:
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
const storage_1 = __webpack_require__(72);
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
    __metadata("design:paramtypes", [typeof (_a = typeof storage_1.Storage !== "undefined" && storage_1.Storage) === "function" && _a || Object, Object])
], Settings);
exports.Settings = Settings;
var _a;
//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 43:
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
const Rx_1 = __webpack_require__(308);
const core_1 = __webpack_require__(0);
const auth_1 = __webpack_require__(104);
const database_1 = __webpack_require__(106);
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
        return this.user != null && (this.user.nickname === "STRIKER" || this.user.nickname === "SUPER TD");
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
                    /* Force upper case for all nicknames. */
                    nickname: nickname.toUpperCase()
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
};
AuthProvider = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_1.AngularFireDatabase !== "undefined" && database_1.AngularFireDatabase) === "function" && _a || Object, typeof (_b = typeof auth_1.AngularFireAuth !== "undefined" && auth_1.AngularFireAuth) === "function" && _b || Object])
], AuthProvider);
exports.AuthProvider = AuthProvider;
var _a, _b;
//# sourceMappingURL=auth.provider.js.map

/***/ }),

/***/ 474:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_1 = __webpack_require__(46);
const app_module_ngfactory_1 = __webpack_require__(477);
const core_1 = __webpack_require__(0);
core_1.enableProdMode();
platform_browser_1.platformBrowser().bootstrapModuleFactory(app_module_ngfactory_1.AppModuleNgFactory);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */

Object.defineProperty(exports, "__esModule", { value: true });
const import0 = __webpack_require__(0);
const import1 = __webpack_require__(478);
const import2 = __webpack_require__(11);
const import3 = __webpack_require__(332);
const import4 = __webpack_require__(14);
const import5 = __webpack_require__(40);
const import6 = __webpack_require__(12);
const import7 = __webpack_require__(13);
const import8 = __webpack_require__(179);
const import9 = __webpack_require__(46);
const import10 = __webpack_require__(103);
const import11 = __webpack_require__(17);
const import12 = __webpack_require__(33);
const import13 = __webpack_require__(37);
const import14 = __webpack_require__(34);
const import15 = __webpack_require__(128);
const import16 = __webpack_require__(129);
const import17 = __webpack_require__(81);
const import18 = __webpack_require__(130);
const import19 = __webpack_require__(131);
const import20 = __webpack_require__(82);
const import21 = __webpack_require__(132);
const import22 = __webpack_require__(133);
const import23 = __webpack_require__(134);
const import24 = __webpack_require__(135);
const import25 = __webpack_require__(136);
const import26 = __webpack_require__(137);
const import27 = __webpack_require__(138);
const import28 = __webpack_require__(139);
const import29 = __webpack_require__(140);
const import30 = __webpack_require__(57);
const import31 = __webpack_require__(141);
const import32 = __webpack_require__(142);
const import33 = __webpack_require__(83);
const import34 = __webpack_require__(143);
const import35 = __webpack_require__(144);
const import36 = __webpack_require__(145);
const import37 = __webpack_require__(146);
const import38 = __webpack_require__(147);
const import39 = __webpack_require__(148);
const import40 = __webpack_require__(149);
const import41 = __webpack_require__(150);
const import42 = __webpack_require__(151);
const import43 = __webpack_require__(152);
const import44 = __webpack_require__(153);
const import45 = __webpack_require__(154);
const import46 = __webpack_require__(155);
const import47 = __webpack_require__(156);
const import48 = __webpack_require__(157);
const import49 = __webpack_require__(158);
const import50 = __webpack_require__(159);
const import51 = __webpack_require__(160);
const import52 = __webpack_require__(161);
const import53 = __webpack_require__(162);
const import54 = __webpack_require__(163);
const import55 = __webpack_require__(164);
const import56 = __webpack_require__(165);
const import57 = __webpack_require__(166);
const import58 = __webpack_require__(167);
const import59 = __webpack_require__(168);
const import60 = __webpack_require__(169);
const import61 = __webpack_require__(55);
const import62 = __webpack_require__(72);
const import63 = __webpack_require__(78);
const import64 = __webpack_require__(263);
const import65 = __webpack_require__(254);
const import66 = __webpack_require__(174);
const import67 = __webpack_require__(69);
const import68 = __webpack_require__(100);
const import69 = __webpack_require__(23);
const import70 = __webpack_require__(44);
const import71 = __webpack_require__(22);
const import72 = __webpack_require__(85);
const import73 = __webpack_require__(178);
const import74 = __webpack_require__(109);
const import75 = __webpack_require__(212);
const import76 = __webpack_require__(213);
const import77 = __webpack_require__(214);
const import78 = __webpack_require__(36);
const import79 = __webpack_require__(127);
const import80 = __webpack_require__(220);
const import81 = __webpack_require__(43);
const import82 = __webpack_require__(466);
const import83 = __webpack_require__(467);
const import84 = __webpack_require__(468);
const import85 = __webpack_require__(469);
const import86 = __webpack_require__(470);
const import87 = __webpack_require__(471);
const import88 = __webpack_require__(472);
const import89 = __webpack_require__(473);
const import90 = __webpack_require__(783);
const import91 = __webpack_require__(785);
const import92 = __webpack_require__(789);
const import93 = __webpack_require__(790);
const import94 = __webpack_require__(253);
const import95 = __webpack_require__(216);
const import96 = __webpack_require__(21);
const import97 = __webpack_require__(173);
const import98 = __webpack_require__(211);
const import99 = __webpack_require__(5);
const import100 = __webpack_require__(3);
const import101 = __webpack_require__(56);
const import102 = __webpack_require__(215);
const import103 = __webpack_require__(218);
const import104 = __webpack_require__(184);
const import105 = __webpack_require__(180);
const import106 = __webpack_require__(74);
const import107 = __webpack_require__(333);
class AppModuleInjector extends import0.ɵNgModuleInjector {
    constructor(parent) {
        super(parent, [
            import82.ActionSheetCmpNgFactory,
            import83.AlertCmpNgFactory,
            import84.IonicAppNgFactory,
            import85.LoadingCmpNgFactory,
            import86.ModalCmpNgFactory,
            import87.PickerCmpNgFactory,
            import88.PopoverCmpNgFactory,
            import89.ToastCmpNgFactory,
            import90.XmasClubAppNgFactory,
            import91.TabsPageNgFactory,
            import92.LoginPageNgFactory,
            import93.RegisterPageNgFactory
        ], [import84.IonicAppNgFactory]);
    }
    get _LOCALE_ID_79() {
        if ((this.__LOCALE_ID_79 == null)) {
            (this.__LOCALE_ID_79 = import0.ɵn(this.parent.get(import0.LOCALE_ID, null)));
        }
        return this.__LOCALE_ID_79;
    }
    get _NgLocalization_80() {
        if ((this.__NgLocalization_80 == null)) {
            (this.__NgLocalization_80 = new import2.NgLocaleLocalization(this._LOCALE_ID_79));
        }
        return this.__NgLocalization_80;
    }
    get _APP_ID_81() {
        if ((this.__APP_ID_81 == null)) {
            (this.__APP_ID_81 = import0.ɵg());
        }
        return this.__APP_ID_81;
    }
    get _IterableDiffers_82() {
        if ((this.__IterableDiffers_82 == null)) {
            (this.__IterableDiffers_82 = import0.ɵl());
        }
        return this.__IterableDiffers_82;
    }
    get _KeyValueDiffers_83() {
        if ((this.__KeyValueDiffers_83 == null)) {
            (this.__KeyValueDiffers_83 = import0.ɵm());
        }
        return this.__KeyValueDiffers_83;
    }
    get _DomSanitizer_84() {
        if ((this.__DomSanitizer_84 == null)) {
            (this.__DomSanitizer_84 = new import9.ɵe(this.parent.get(import9.DOCUMENT)));
        }
        return this.__DomSanitizer_84;
    }
    get _Sanitizer_85() {
        if ((this.__Sanitizer_85 == null)) {
            (this.__Sanitizer_85 = this._DomSanitizer_84);
        }
        return this.__Sanitizer_85;
    }
    get _HAMMER_GESTURE_CONFIG_86() {
        if ((this.__HAMMER_GESTURE_CONFIG_86 == null)) {
            (this.__HAMMER_GESTURE_CONFIG_86 = new import9.HammerGestureConfig());
        }
        return this.__HAMMER_GESTURE_CONFIG_86;
    }
    get _EVENT_MANAGER_PLUGINS_87() {
        if ((this.__EVENT_MANAGER_PLUGINS_87 == null)) {
            (this.__EVENT_MANAGER_PLUGINS_87 = [
                new import9.ɵDomEventsPlugin(this.parent.get(import9.DOCUMENT)),
                new import9.ɵKeyEventsPlugin(this.parent.get(import9.DOCUMENT)),
                new import9.ɵHammerGesturesPlugin(this.parent.get(import9.DOCUMENT), this._HAMMER_GESTURE_CONFIG_86)
            ]);
        }
        return this.__EVENT_MANAGER_PLUGINS_87;
    }
    get _EventManager_88() {
        if ((this.__EventManager_88 == null)) {
            (this.__EventManager_88 = new import9.EventManager(this._EVENT_MANAGER_PLUGINS_87, this.parent.get(import0.NgZone)));
        }
        return this.__EventManager_88;
    }
    get _ɵDomSharedStylesHost_89() {
        if ((this.__ɵDomSharedStylesHost_89 == null)) {
            (this.__ɵDomSharedStylesHost_89 = new import9.ɵDomSharedStylesHost(this.parent.get(import9.DOCUMENT)));
        }
        return this.__ɵDomSharedStylesHost_89;
    }
    get _ɵDomRendererFactory2_90() {
        if ((this.__ɵDomRendererFactory2_90 == null)) {
            (this.__ɵDomRendererFactory2_90 = new import9.ɵDomRendererFactory2(this._EventManager_88, this._ɵDomSharedStylesHost_89));
        }
        return this.__ɵDomRendererFactory2_90;
    }
    get _RendererFactory2_91() {
        if ((this.__RendererFactory2_91 == null)) {
            (this.__RendererFactory2_91 = this._ɵDomRendererFactory2_90);
        }
        return this.__RendererFactory2_91;
    }
    get _ɵSharedStylesHost_92() {
        if ((this.__ɵSharedStylesHost_92 == null)) {
            (this.__ɵSharedStylesHost_92 = this._ɵDomSharedStylesHost_89);
        }
        return this.__ɵSharedStylesHost_92;
    }
    get _Testability_93() {
        if ((this.__Testability_93 == null)) {
            (this.__Testability_93 = new import0.Testability(this.parent.get(import0.NgZone)));
        }
        return this.__Testability_93;
    }
    get _Meta_94() {
        if ((this.__Meta_94 == null)) {
            (this.__Meta_94 = new import9.Meta(this.parent.get(import9.DOCUMENT)));
        }
        return this.__Meta_94;
    }
    get _Title_95() {
        if ((this.__Title_95 == null)) {
            (this.__Title_95 = new import9.Title(this.parent.get(import9.DOCUMENT)));
        }
        return this.__Title_95;
    }
    get _BrowserXhr_96() {
        if ((this.__BrowserXhr_96 == null)) {
            (this.__BrowserXhr_96 = new import10.BrowserXhr());
        }
        return this.__BrowserXhr_96;
    }
    get _ResponseOptions_97() {
        if ((this.__ResponseOptions_97 == null)) {
            (this.__ResponseOptions_97 = new import10.BaseResponseOptions());
        }
        return this.__ResponseOptions_97;
    }
    get _XSRFStrategy_98() {
        if ((this.__XSRFStrategy_98 == null)) {
            (this.__XSRFStrategy_98 = import10.ɵb());
        }
        return this.__XSRFStrategy_98;
    }
    get _XHRBackend_99() {
        if ((this.__XHRBackend_99 == null)) {
            (this.__XHRBackend_99 = new import10.XHRBackend(this._BrowserXhr_96, this._ResponseOptions_97, this._XSRFStrategy_98));
        }
        return this.__XHRBackend_99;
    }
    get _RequestOptions_100() {
        if ((this.__RequestOptions_100 == null)) {
            (this.__RequestOptions_100 = new import10.BaseRequestOptions());
        }
        return this.__RequestOptions_100;
    }
    get _Http_101() {
        if ((this.__Http_101 == null)) {
            (this.__Http_101 = import10.ɵc(this._XHRBackend_99, this._RequestOptions_100));
        }
        return this.__Http_101;
    }
    get _ɵi_102() {
        if ((this.__ɵi_102 == null)) {
            (this.__ɵi_102 = new import11.ɵi());
        }
        return this.__ɵi_102;
    }
    get _FormBuilder_103() {
        if ((this.__FormBuilder_103 == null)) {
            (this.__FormBuilder_103 = new import11.FormBuilder());
        }
        return this.__FormBuilder_103;
    }
    get _FirebaseApp_106() {
        if ((this.__FirebaseApp_106 == null)) {
            (this.__FirebaseApp_106 = import94._firebaseAppFactory(this._FirebaseAppConfigToken_104, this._FirebaseAppName_105));
        }
        return this.__FirebaseApp_106;
    }
    get _AngularFireDatabase_107() {
        if ((this.__AngularFireDatabase_107 == null)) {
            (this.__AngularFireDatabase_107 = import64._getAngularFireDatabase(this._FirebaseApp_106));
        }
        return this.__AngularFireDatabase_107;
    }
    get _AngularFireAuth_108() {
        if ((this.__AngularFireAuth_108 == null)) {
            (this.__AngularFireAuth_108 = import65._getAngularFireAuth(this._FirebaseApp_106));
        }
        return this.__AngularFireAuth_108;
    }
    get _ActionSheetController_111() {
        if ((this.__ActionSheetController_111 == null)) {
            (this.__ActionSheetController_111 = new import66.ActionSheetController(this._App_8, this._Config_5));
        }
        return this.__ActionSheetController_111;
    }
    get _AlertController_112() {
        if ((this.__AlertController_112 == null)) {
            (this.__AlertController_112 = new import67.AlertController(this._App_8, this._Config_5));
        }
        return this.__AlertController_112;
    }
    get _Events_113() {
        if ((this.__Events_113 == null)) {
            (this.__Events_113 = new import68.Events());
        }
        return this.__Events_113;
    }
    get _Form_114() {
        if ((this.__Form_114 == null)) {
            (this.__Form_114 = new import69.Form());
        }
        return this.__Form_114;
    }
    get _Haptic_115() {
        if ((this.__Haptic_115 == null)) {
            (this.__Haptic_115 = new import70.Haptic(this._Platform_4));
        }
        return this.__Haptic_115;
    }
    get _Keyboard_116() {
        if ((this.__Keyboard_116 == null)) {
            (this.__Keyboard_116 = new import71.Keyboard(this._Config_5, this._Platform_4, this.parent.get(import0.NgZone), this._DomController_6));
        }
        return this.__Keyboard_116;
    }
    get _LoadingController_117() {
        if ((this.__LoadingController_117 == null)) {
            (this.__LoadingController_117 = new import72.LoadingController(this._App_8, this._Config_5));
        }
        return this.__LoadingController_117;
    }
    get _LocationStrategy_118() {
        if ((this.__LocationStrategy_118 == null)) {
            (this.__LocationStrategy_118 = import61.provideLocationStrategy(this.parent.get(import2.PlatformLocation), this._APP_BASE_HREF_110, this._Config_5));
        }
        return this.__LocationStrategy_118;
    }
    get _Location_119() {
        if ((this.__Location_119 == null)) {
            (this.__Location_119 = new import2.Location(this._LocationStrategy_118));
        }
        return this.__Location_119;
    }
    get _UrlSerializer_120() {
        if ((this.__UrlSerializer_120 == null)) {
            (this.__UrlSerializer_120 = import95.setupUrlSerializer(this._DeepLinkConfigToken_10));
        }
        return this.__UrlSerializer_120;
    }
    get _DeepLinker_121() {
        if ((this.__DeepLinker_121 == null)) {
            (this.__DeepLinker_121 = import96.setupDeepLinker(this._App_8, this._UrlSerializer_120, this._Location_119, this._ModuleLoader_13, this.componentFactoryResolver));
        }
        return this.__DeepLinker_121;
    }
    get _ModalController_122() {
        if ((this.__ModalController_122 == null)) {
            (this.__ModalController_122 = new import73.ModalController(this._App_8, this._Config_5, this._DeepLinker_121));
        }
        return this.__ModalController_122;
    }
    get _PickerController_123() {
        if ((this.__PickerController_123 == null)) {
            (this.__PickerController_123 = new import74.PickerController(this._App_8, this._Config_5));
        }
        return this.__PickerController_123;
    }
    get _PopoverController_124() {
        if ((this.__PopoverController_124 == null)) {
            (this.__PopoverController_124 = new import75.PopoverController(this._App_8, this._Config_5, this._DeepLinker_121));
        }
        return this.__PopoverController_124;
    }
    get _TapClick_125() {
        if ((this.__TapClick_125 == null)) {
            (this.__TapClick_125 = new import76.TapClick(this._Config_5, this._Platform_4, this._DomController_6, this._App_8, this.parent.get(import0.NgZone), this._GestureController_9));
        }
        return this.__TapClick_125;
    }
    get _ToastController_126() {
        if ((this.__ToastController_126 == null)) {
            (this.__ToastController_126 = new import77.ToastController(this._App_8, this._Config_5));
        }
        return this.__ToastController_126;
    }
    get _TransitionController_127() {
        if ((this.__TransitionController_127 == null)) {
            (this.__TransitionController_127 = new import78.TransitionController(this._Platform_4, this._Config_5));
        }
        return this.__TransitionController_127;
    }
    get _Storage_129() {
        if ((this.__Storage_129 == null)) {
            (this.__Storage_129 = import97.provideStorage(this._StorageConfigToken_128));
        }
        return this.__Storage_129;
    }
    get _ScorecardsProvider_130() {
        if ((this.__ScorecardsProvider_130 == null)) {
            (this.__ScorecardsProvider_130 = new import79.ScorecardsProvider(this._Http_101, this._AngularFireDatabase_107, this._AngularFireAuth_108));
        }
        return this.__ScorecardsProvider_130;
    }
    get _XmasClubDataProvider_131() {
        if ((this.__XmasClubDataProvider_131 == null)) {
            (this.__XmasClubDataProvider_131 = new import80.XmasClubDataProvider(this._Http_101, this._AngularFireDatabase_107, this._AngularFireAuth_108, this._ScorecardsProvider_130));
        }
        return this.__XmasClubDataProvider_131;
    }
    get _AuthProvider_132() {
        if ((this.__AuthProvider_132 == null)) {
            (this.__AuthProvider_132 = new import81.AuthProvider(this._AngularFireDatabase_107, this._AngularFireAuth_108));
        }
        return this.__AuthProvider_132;
    }
    get _Settings_133() {
        if ((this.__Settings_133 == null)) {
            (this.__Settings_133 = import1.provideSettings(this._Storage_129));
        }
        return this.__Settings_133;
    }
    createInternal() {
        this._CommonModule_0 = new import2.CommonModule();
        this._ErrorHandler_1 = new import3.IonicErrorHandler();
        this._ConfigToken_2 = null;
        this._PlatformConfigToken_3 = import98.providePlatformConfigs();
        this._Platform_4 = import99.setupPlatform(this.parent.get(import9.DOCUMENT), this._PlatformConfigToken_3, this.parent.get(import0.NgZone));
        this._Config_5 = import100.setupConfig(this._ConfigToken_2, this._Platform_4);
        this._DomController_6 = new import4.DomController(this._Platform_4);
        this._MenuController_7 = new import5.MenuController();
        this._App_8 = new import6.App(this._Config_5, this._Platform_4, this._MenuController_7);
        this._GestureController_9 = new import7.GestureController(this._App_8);
        this._DeepLinkConfigToken_10 =
            {
                links: [
                    { loadChildren: '../pages/admin/admin.module.ngfactory#AdminPageModuleNgFactory', name: 'AdminPage', segment: 'admin', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/leaderboard/leaderboard.module.ngfactory#LeaderboardModuleNgFactory', name: 'LeaderboardPage', segment: 'leaderboard', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/list/list.module.ngfactory#ListPageModuleNgFactory', name: 'ListPage', segment: 'list', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/profile/profile.module.ngfactory#ProfilePageModuleNgFactory', name: 'ProfilePage', segment: 'profile', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/scorecard/scorecard.module.ngfactory#ScorecardPageModuleNgFactory', name: 'ScorecardPage', segment: 'scorecard', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/week/week.module.ngfactory#WeekModuleNgFactory', name: 'WeekPage', segment: 'week/:week', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/weekly-leaderboard/weekly-leaderboard.module.ngfactory#WeeklyLeaderboardPageModuleNgFactory', name: 'WeeklyLeaderboardPage', segment: 'weekly-leaderboard', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/weeks/weeks.module.ngfactory#WeeksModuleNgFactory', name: 'WeeksPage', segment: 'weeks', priority: 'low', defaultHistory: [] }
                ]
            };
        this._Compiler_11 = new import0.Compiler();
        this._NgModuleLoader_12 = new import8.NgModuleLoader(this._Compiler_11);
        this._ModuleLoader_13 = import101.provideModuleLoader(this._NgModuleLoader_12, this);
        this._APP_INITIALIZER_14 = [
            import0.ɵo,
            import9.ɵc(this.parent.get(import9.NgProbeToken, null), this.parent.get(import0.NgProbeToken, null)),
            import102.registerModeConfigs(this._Config_5),
            import68.setupProvideEvents(this._Platform_4, this._DomController_6),
            import76.setupTapClick(this._Config_5, this._Platform_4, this._DomController_6, this._App_8, this.parent.get(import0.NgZone), this._GestureController_9),
            import101.setupPreloading(this._Config_5, this._DeepLinkConfigToken_10, this._ModuleLoader_13, this.parent.get(import0.NgZone))
        ];
        this._ApplicationInitStatus_15 = new import0.ApplicationInitStatus(this._APP_INITIALIZER_14);
        this._ɵf_16 = new import0.ɵf(this.parent.get(import0.NgZone), this.parent.get(import0.ɵConsole), this, this._ErrorHandler_1, this.componentFactoryResolver, this._ApplicationInitStatus_15);
        this._ApplicationRef_17 = this._ɵf_16;
        this._ApplicationModule_18 = new import0.ApplicationModule(this._ApplicationRef_17);
        this._BrowserModule_19 = new import9.BrowserModule(this.parent.get(import9.BrowserModule, null));
        this._HttpModule_20 = new import10.HttpModule();
        this._ɵba_21 = new import11.ɵba();
        this._FormsModule_22 = new import11.FormsModule();
        this._ReactiveFormsModule_23 = new import11.ReactiveFormsModule();
        this._BackdropModule_24 = new import12.BackdropModule();
        this._ButtonModule_25 = new import13.ButtonModule();
        this._IconModule_26 = new import14.IconModule();
        this._ActionSheetModule_27 = new import15.ActionSheetModule();
        this._AlertModule_28 = new import16.AlertModule();
        this._NavModule_29 = new import17.NavModule();
        this._AppModule_30 = new import18.AppModule();
        this._AvatarModule_31 = new import19.AvatarModule();
        this._BadgeModule_32 = new import20.BadgeModule();
        this._CardModule_33 = new import21.CardModule();
        this._CheckboxModule_34 = new import22.CheckboxModule();
        this._ChipModule_35 = new import23.ChipModule();
        this._ClickBlockModule_36 = new import24.ClickBlockModule();
        this._ContentModule_37 = new import25.ContentModule();
        this._DateTimeModule_38 = new import26.DateTimeModule();
        this._FabModule_39 = new import27.FabModule();
        this._GridModule_40 = new import28.GridModule();
        this._ImgModule_41 = new import29.ImgModule();
        this._SpinnerModule_42 = new import30.SpinnerModule();
        this._InfiniteScrollModule_43 = new import31.InfiniteScrollModule();
        this._InputModule_44 = new import32.InputModule();
        this._LabelModule_45 = new import33.LabelModule();
        this._ItemModule_46 = new import34.ItemModule();
        this._ListModule_47 = new import35.ListModule();
        this._LoadingModule_48 = new import36.LoadingModule();
        this._MenuModule_49 = new import37.MenuModule();
        this._ModalModule_50 = new import38.ModalModule();
        this._NavbarModule_51 = new import39.NavbarModule();
        this._NoteModule_52 = new import40.NoteModule();
        this._OptionModule_53 = new import41.OptionModule();
        this._PickerModule_54 = new import42.PickerModule();
        this._PopoverModule_55 = new import43.PopoverModule();
        this._RadioModule_56 = new import44.RadioModule();
        this._RangeModule_57 = new import45.RangeModule();
        this._RefresherModule_58 = new import46.RefresherModule();
        this._ScrollModule_59 = new import47.ScrollModule();
        this._SearchbarModule_60 = new import48.SearchbarModule();
        this._SegmentModule_61 = new import49.SegmentModule();
        this._SelectModule_62 = new import50.SelectModule();
        this._ShowHideWhenModule_63 = new import51.ShowHideWhenModule();
        this._SlidesModule_64 = new import52.SlidesModule();
        this._SplitPaneModule_65 = new import53.SplitPaneModule();
        this._TabsModule_66 = new import54.TabsModule();
        this._ThumbnailModule_67 = new import55.ThumbnailModule();
        this._ToastModule_68 = new import56.ToastModule();
        this._ToggleModule_69 = new import57.ToggleModule();
        this._ToolbarModule_70 = new import58.ToolbarModule();
        this._TypographyModule_71 = new import59.TypographyModule();
        this._VirtualScrollModule_72 = new import60.VirtualScrollModule();
        this._IonicModule_73 = new import61.IonicModule();
        this._IonicStorageModule_74 = new import62.IonicStorageModule();
        this._AngularFireModule_75 = new import63.AngularFireModule();
        this._AngularFireDatabaseModule_76 = new import64.AngularFireDatabaseModule();
        this._AngularFireAuthModule_77 = new import65.AngularFireAuthModule();
        this._AppModule_78 = new import1.AppModule();
        this._FirebaseAppConfigToken_104 = {
            apiKey: 'AIzaSyDgh6wIiKbNUFhqgtmRuPHw6bGJ8KrIqg0',
            authDomain: 'xmas-club.firebaseapp.com',
            databaseURL: 'https://xmas-club.firebaseio.com',
            projectId: 'xmas-club',
            storageBucket: '',
            messagingSenderId: '260309513061'
        };
        this._FirebaseAppName_105 = undefined;
        this._AppRootToken_109 = import103.XmasClubApp;
        this._APP_BASE_HREF_110 = '/';
        this._StorageConfigToken_128 = null;
        return this._AppModule_78;
    }
    getInternal(token, notFoundResult) {
        if ((token === import2.CommonModule)) {
            return this._CommonModule_0;
        }
        if ((token === import0.ErrorHandler)) {
            return this._ErrorHandler_1;
        }
        if ((token === import100.ConfigToken)) {
            return this._ConfigToken_2;
        }
        if ((token === import98.PlatformConfigToken)) {
            return this._PlatformConfigToken_3;
        }
        if ((token === import99.Platform)) {
            return this._Platform_4;
        }
        if ((token === import100.Config)) {
            return this._Config_5;
        }
        if ((token === import4.DomController)) {
            return this._DomController_6;
        }
        if ((token === import5.MenuController)) {
            return this._MenuController_7;
        }
        if ((token === import6.App)) {
            return this._App_8;
        }
        if ((token === import7.GestureController)) {
            return this._GestureController_9;
        }
        if ((token === import95.DeepLinkConfigToken)) {
            return this._DeepLinkConfigToken_10;
        }
        if ((token === import0.Compiler)) {
            return this._Compiler_11;
        }
        if ((token === import8.NgModuleLoader)) {
            return this._NgModuleLoader_12;
        }
        if ((token === import101.ModuleLoader)) {
            return this._ModuleLoader_13;
        }
        if ((token === import0.APP_INITIALIZER)) {
            return this._APP_INITIALIZER_14;
        }
        if ((token === import0.ApplicationInitStatus)) {
            return this._ApplicationInitStatus_15;
        }
        if ((token === import0.ɵf)) {
            return this._ɵf_16;
        }
        if ((token === import0.ApplicationRef)) {
            return this._ApplicationRef_17;
        }
        if ((token === import0.ApplicationModule)) {
            return this._ApplicationModule_18;
        }
        if ((token === import9.BrowserModule)) {
            return this._BrowserModule_19;
        }
        if ((token === import10.HttpModule)) {
            return this._HttpModule_20;
        }
        if ((token === import11.ɵba)) {
            return this._ɵba_21;
        }
        if ((token === import11.FormsModule)) {
            return this._FormsModule_22;
        }
        if ((token === import11.ReactiveFormsModule)) {
            return this._ReactiveFormsModule_23;
        }
        if ((token === import12.BackdropModule)) {
            return this._BackdropModule_24;
        }
        if ((token === import13.ButtonModule)) {
            return this._ButtonModule_25;
        }
        if ((token === import14.IconModule)) {
            return this._IconModule_26;
        }
        if ((token === import15.ActionSheetModule)) {
            return this._ActionSheetModule_27;
        }
        if ((token === import16.AlertModule)) {
            return this._AlertModule_28;
        }
        if ((token === import17.NavModule)) {
            return this._NavModule_29;
        }
        if ((token === import18.AppModule)) {
            return this._AppModule_30;
        }
        if ((token === import19.AvatarModule)) {
            return this._AvatarModule_31;
        }
        if ((token === import20.BadgeModule)) {
            return this._BadgeModule_32;
        }
        if ((token === import21.CardModule)) {
            return this._CardModule_33;
        }
        if ((token === import22.CheckboxModule)) {
            return this._CheckboxModule_34;
        }
        if ((token === import23.ChipModule)) {
            return this._ChipModule_35;
        }
        if ((token === import24.ClickBlockModule)) {
            return this._ClickBlockModule_36;
        }
        if ((token === import25.ContentModule)) {
            return this._ContentModule_37;
        }
        if ((token === import26.DateTimeModule)) {
            return this._DateTimeModule_38;
        }
        if ((token === import27.FabModule)) {
            return this._FabModule_39;
        }
        if ((token === import28.GridModule)) {
            return this._GridModule_40;
        }
        if ((token === import29.ImgModule)) {
            return this._ImgModule_41;
        }
        if ((token === import30.SpinnerModule)) {
            return this._SpinnerModule_42;
        }
        if ((token === import31.InfiniteScrollModule)) {
            return this._InfiniteScrollModule_43;
        }
        if ((token === import32.InputModule)) {
            return this._InputModule_44;
        }
        if ((token === import33.LabelModule)) {
            return this._LabelModule_45;
        }
        if ((token === import34.ItemModule)) {
            return this._ItemModule_46;
        }
        if ((token === import35.ListModule)) {
            return this._ListModule_47;
        }
        if ((token === import36.LoadingModule)) {
            return this._LoadingModule_48;
        }
        if ((token === import37.MenuModule)) {
            return this._MenuModule_49;
        }
        if ((token === import38.ModalModule)) {
            return this._ModalModule_50;
        }
        if ((token === import39.NavbarModule)) {
            return this._NavbarModule_51;
        }
        if ((token === import40.NoteModule)) {
            return this._NoteModule_52;
        }
        if ((token === import41.OptionModule)) {
            return this._OptionModule_53;
        }
        if ((token === import42.PickerModule)) {
            return this._PickerModule_54;
        }
        if ((token === import43.PopoverModule)) {
            return this._PopoverModule_55;
        }
        if ((token === import44.RadioModule)) {
            return this._RadioModule_56;
        }
        if ((token === import45.RangeModule)) {
            return this._RangeModule_57;
        }
        if ((token === import46.RefresherModule)) {
            return this._RefresherModule_58;
        }
        if ((token === import47.ScrollModule)) {
            return this._ScrollModule_59;
        }
        if ((token === import48.SearchbarModule)) {
            return this._SearchbarModule_60;
        }
        if ((token === import49.SegmentModule)) {
            return this._SegmentModule_61;
        }
        if ((token === import50.SelectModule)) {
            return this._SelectModule_62;
        }
        if ((token === import51.ShowHideWhenModule)) {
            return this._ShowHideWhenModule_63;
        }
        if ((token === import52.SlidesModule)) {
            return this._SlidesModule_64;
        }
        if ((token === import53.SplitPaneModule)) {
            return this._SplitPaneModule_65;
        }
        if ((token === import54.TabsModule)) {
            return this._TabsModule_66;
        }
        if ((token === import55.ThumbnailModule)) {
            return this._ThumbnailModule_67;
        }
        if ((token === import56.ToastModule)) {
            return this._ToastModule_68;
        }
        if ((token === import57.ToggleModule)) {
            return this._ToggleModule_69;
        }
        if ((token === import58.ToolbarModule)) {
            return this._ToolbarModule_70;
        }
        if ((token === import59.TypographyModule)) {
            return this._TypographyModule_71;
        }
        if ((token === import60.VirtualScrollModule)) {
            return this._VirtualScrollModule_72;
        }
        if ((token === import61.IonicModule)) {
            return this._IonicModule_73;
        }
        if ((token === import62.IonicStorageModule)) {
            return this._IonicStorageModule_74;
        }
        if ((token === import63.AngularFireModule)) {
            return this._AngularFireModule_75;
        }
        if ((token === import64.AngularFireDatabaseModule)) {
            return this._AngularFireDatabaseModule_76;
        }
        if ((token === import65.AngularFireAuthModule)) {
            return this._AngularFireAuthModule_77;
        }
        if ((token === import1.AppModule)) {
            return this._AppModule_78;
        }
        if ((token === import0.LOCALE_ID)) {
            return this._LOCALE_ID_79;
        }
        if ((token === import2.NgLocalization)) {
            return this._NgLocalization_80;
        }
        if ((token === import0.APP_ID)) {
            return this._APP_ID_81;
        }
        if ((token === import0.IterableDiffers)) {
            return this._IterableDiffers_82;
        }
        if ((token === import0.KeyValueDiffers)) {
            return this._KeyValueDiffers_83;
        }
        if ((token === import9.DomSanitizer)) {
            return this._DomSanitizer_84;
        }
        if ((token === import0.Sanitizer)) {
            return this._Sanitizer_85;
        }
        if ((token === import9.HAMMER_GESTURE_CONFIG)) {
            return this._HAMMER_GESTURE_CONFIG_86;
        }
        if ((token === import9.EVENT_MANAGER_PLUGINS)) {
            return this._EVENT_MANAGER_PLUGINS_87;
        }
        if ((token === import9.EventManager)) {
            return this._EventManager_88;
        }
        if ((token === import9.ɵDomSharedStylesHost)) {
            return this._ɵDomSharedStylesHost_89;
        }
        if ((token === import9.ɵDomRendererFactory2)) {
            return this._ɵDomRendererFactory2_90;
        }
        if ((token === import0.RendererFactory2)) {
            return this._RendererFactory2_91;
        }
        if ((token === import9.ɵSharedStylesHost)) {
            return this._ɵSharedStylesHost_92;
        }
        if ((token === import0.Testability)) {
            return this._Testability_93;
        }
        if ((token === import9.Meta)) {
            return this._Meta_94;
        }
        if ((token === import9.Title)) {
            return this._Title_95;
        }
        if ((token === import10.BrowserXhr)) {
            return this._BrowserXhr_96;
        }
        if ((token === import10.ResponseOptions)) {
            return this._ResponseOptions_97;
        }
        if ((token === import10.XSRFStrategy)) {
            return this._XSRFStrategy_98;
        }
        if ((token === import10.XHRBackend)) {
            return this._XHRBackend_99;
        }
        if ((token === import10.RequestOptions)) {
            return this._RequestOptions_100;
        }
        if ((token === import10.Http)) {
            return this._Http_101;
        }
        if ((token === import11.ɵi)) {
            return this._ɵi_102;
        }
        if ((token === import11.FormBuilder)) {
            return this._FormBuilder_103;
        }
        if ((token === import94.FirebaseAppConfigToken)) {
            return this._FirebaseAppConfigToken_104;
        }
        if ((token === import63.FirebaseAppName)) {
            return this._FirebaseAppName_105;
        }
        if ((token === import94.FirebaseApp)) {
            return this._FirebaseApp_106;
        }
        if ((token === import104.AngularFireDatabase)) {
            return this._AngularFireDatabase_107;
        }
        if ((token === import105.AngularFireAuth)) {
            return this._AngularFireAuth_108;
        }
        if ((token === import106.AppRootToken)) {
            return this._AppRootToken_109;
        }
        if ((token === import2.APP_BASE_HREF)) {
            return this._APP_BASE_HREF_110;
        }
        if ((token === import66.ActionSheetController)) {
            return this._ActionSheetController_111;
        }
        if ((token === import67.AlertController)) {
            return this._AlertController_112;
        }
        if ((token === import68.Events)) {
            return this._Events_113;
        }
        if ((token === import69.Form)) {
            return this._Form_114;
        }
        if ((token === import70.Haptic)) {
            return this._Haptic_115;
        }
        if ((token === import71.Keyboard)) {
            return this._Keyboard_116;
        }
        if ((token === import72.LoadingController)) {
            return this._LoadingController_117;
        }
        if ((token === import2.LocationStrategy)) {
            return this._LocationStrategy_118;
        }
        if ((token === import2.Location)) {
            return this._Location_119;
        }
        if ((token === import95.UrlSerializer)) {
            return this._UrlSerializer_120;
        }
        if ((token === import96.DeepLinker)) {
            return this._DeepLinker_121;
        }
        if ((token === import73.ModalController)) {
            return this._ModalController_122;
        }
        if ((token === import74.PickerController)) {
            return this._PickerController_123;
        }
        if ((token === import75.PopoverController)) {
            return this._PopoverController_124;
        }
        if ((token === import76.TapClick)) {
            return this._TapClick_125;
        }
        if ((token === import77.ToastController)) {
            return this._ToastController_126;
        }
        if ((token === import78.TransitionController)) {
            return this._TransitionController_127;
        }
        if ((token === import97.StorageConfigToken)) {
            return this._StorageConfigToken_128;
        }
        if ((token === import97.Storage)) {
            return this._Storage_129;
        }
        if ((token === import79.ScorecardsProvider)) {
            return this._ScorecardsProvider_130;
        }
        if ((token === import80.XmasClubDataProvider)) {
            return this._XmasClubDataProvider_131;
        }
        if ((token === import81.AuthProvider)) {
            return this._AuthProvider_132;
        }
        if ((token === import107.Settings)) {
            return this._Settings_133;
        }
        return notFoundResult;
    }
    destroyInternal() {
        this._ɵf_16.ngOnDestroy();
        (this.__ɵDomSharedStylesHost_89 && this._ɵDomSharedStylesHost_89.ngOnDestroy());
    }
}
exports.AppModuleNgFactory = new import0.NgModuleFactory(AppModuleInjector, import1.AppModule);
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL2FwcC9hcHAubW9kdWxlLm5nZmFjdG9yeS50cyIsInZlcnNpb24iOjMsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nOi8vL0M6L1VzZXJzL2JvYmJ5L1NvdXJjZS94bWFzLWNsdWIveG1hcy1jbHViL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIgIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
//# sourceMappingURL=app.module.ngfactory.js.map

/***/ }),

/***/ 478:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const es2015_1 = __webpack_require__(72);
const login_1 = __webpack_require__(226);
const core_1 = __webpack_require__(0);
const http_1 = __webpack_require__(103);
const platform_browser_1 = __webpack_require__(46);
const ionic_angular_1 = __webpack_require__(55);
const storage_1 = __webpack_require__(72);
const settings_1 = __webpack_require__(333);
const app_component_1 = __webpack_require__(218);
const tabs_1 = __webpack_require__(219);
const xmas_club_provider_1 = __webpack_require__(220);
const scorecards_provider_1 = __webpack_require__(127);
const angularfire2_1 = __webpack_require__(782);
const database_1 = __webpack_require__(106);
const auth_1 = __webpack_require__(104);
const auth_provider_1 = __webpack_require__(43);
const register_1 = __webpack_require__(217);
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
function declarations() {
    return pages;
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 783:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */

Object.defineProperty(exports, "__esModule", { value: true });
const import0 = __webpack_require__(0);
const import1 = __webpack_require__(784);
const import2 = __webpack_require__(79);
const import3 = __webpack_require__(7);
const import4 = __webpack_require__(16);
const import5 = __webpack_require__(12);
const import6 = __webpack_require__(3);
const import7 = __webpack_require__(5);
const import8 = __webpack_require__(22);
const import9 = __webpack_require__(13);
const import10 = __webpack_require__(36);
const import11 = __webpack_require__(21);
const import12 = __webpack_require__(14);
const import13 = __webpack_require__(42);
const import14 = __webpack_require__(218);
const import15 = __webpack_require__(100);
const import16 = __webpack_require__(40);
const import17 = __webpack_require__(173);
const styles_XmasClubApp = [];
exports.RenderType_XmasClubApp = import0.ɵcrt({
    encapsulation: 2,
    styles: styles_XmasClubApp,
    data: {}
});
function View_XmasClubApp_0(l) {
    return import0.ɵvid(0, [
        import0.ɵqud(201326592, 1, { nav: 0 }),
        (l()(), import0.ɵted(null, ['\n'])),
        (l()(), import0.ɵted(null, ['\n'])),
        (l()(), import0.ɵted(null, ['\n\n'])),
        (l()(), import0.ɵted(null, ['\n'])),
        (l()(), import0.ɵeld(0, null, null, 2, 'ion-nav', [[
                'swipeBackEnabled',
                'false'
            ]
        ], null, null, null, import1.View_Nav_0, import1.RenderType_Nav)),
        import0.ɵdid(2187264, [
            [
                1,
                4
            ],
            [
                'content',
                4
            ]
        ], 0, import2.Nav, [
            [
                2,
                import3.ViewController
            ],
            [
                2,
                import4.NavController
            ],
            import5.App,
            import6.Config,
            import7.Platform,
            import8.Keyboard,
            import0.ElementRef,
            import0.NgZone,
            import0.Renderer,
            import0.ComponentFactoryResolver,
            import9.GestureController,
            import10.TransitionController,
            [
                2,
                import11.DeepLinker
            ],
            import12.DomController
        ], {
            root: [
                0,
                'root'
            ],
            swipeBackEnabled: [
                1,
                'swipeBackEnabled'
            ]
        }, null),
        import0.ɵprd(3072, null, import13.RootNode, null, [import2.Nav]),
        (l()(), import0.ɵted(null, ['\n']))
    ], (ck, v) => {
        var co = v.component;
        const currVal_0 = co.rootPage;
        const currVal_1 = 'false';
        ck(v, 6, 0, currVal_0, currVal_1);
    }, null);
}
exports.View_XmasClubApp_0 = View_XmasClubApp_0;
function View_XmasClubApp_Host_0(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵeld(0, null, null, 1, 'ng-component', [], null, null, null, View_XmasClubApp_0, exports.RenderType_XmasClubApp)),
        import0.ɵdid(24576, null, 0, import14.XmasClubApp, [
            import15.Events,
            import16.MenuController,
            import7.Platform,
            import17.Storage
        ], null, null)
    ], null, null);
}
exports.XmasClubAppNgFactory = import0.ɵccf('ng-component', import14.XmasClubApp, View_XmasClubApp_Host_0, {}, {}, []);
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL2FwcC9hcHAuY29tcG9uZW50Lm5nZmFjdG9yeS50cyIsInZlcnNpb24iOjMsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nOi8vL0M6L1VzZXJzL2JvYmJ5L1NvdXJjZS94bWFzLWNsdWIveG1hcy1jbHViL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyIsIm5nOi8vL0M6L1VzZXJzL2JvYmJ5L1NvdXJjZS94bWFzLWNsdWIveG1hcy1jbHViL3NyYy9hcHAvYXBwLmh0bWwiLCJuZzovLy9DOi9Vc2Vycy9ib2JieS9Tb3VyY2UveG1hcy1jbHViL3htYXMtY2x1Yi9zcmMvYXBwL2FwcC5jb21wb25lbnQudHMuWG1hc0NsdWJBcHBfSG9zdC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIiAiLCJcbjwhLS0gbG9nZ2VkIG91dCBtZW51IC0tPlxuPCEtLSA8aW9uLW1lbnUgW2NvbnRlbnRdPVwiY29udGVudFwiPlxuXG4gIDxpb24taGVhZGVyPlxuICAgIDxpb24tdG9vbGJhcj5cbiAgICAgIDxpb24tdGl0bGU+TWVudTwvaW9uLXRpdGxlPlxuICAgIDwvaW9uLXRvb2xiYXI+XG4gIDwvaW9uLWhlYWRlcj5cblxuICA8aW9uLWNvbnRlbnQgY2xhc3M9XCJvdXRlci1jb250ZW50XCI+XG5cbiAgICA8aW9uLWxpc3Q+XG4gICAgICA8aW9uLWxpc3QtaGVhZGVyPlxuICAgICAgICBOYXZpZ2F0ZVxuICAgICAgPC9pb24tbGlzdC1oZWFkZXI+XG4gICAgICA8YnV0dG9uIGlvbi1pdGVtIG1lbnVDbG9zZSAqbmdGb3I9XCJsZXQgcCBvZiBhcHBQYWdlc1wiIChjbGljayk9XCJvcGVuUGFnZShwKVwiPlxuICAgICAgICA8aW9uLWljb24gaXRlbS1sZWZ0IFtuYW1lXT1cInAuaWNvblwiPjwvaW9uLWljb24+XG4gICAgICAgIHt7cC50aXRsZX19XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2lvbi1saXN0PlxuXG4gIDwvaW9uLWNvbnRlbnQ+XG5cbjwvaW9uLW1lbnU+IC0tPlxuXG48IS0tIG1haW4gbmF2aWdhdGlvbiAtLT5cbjxpb24tbmF2IFtyb290XT1cInJvb3RQYWdlXCIgI2NvbnRlbnQgc3dpcGVCYWNrRW5hYmxlZD1cImZhbHNlXCI+PC9pb24tbmF2PlxuIiwiPG5nLWNvbXBvbmVudD48L25nLWNvbXBvbmVudD4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNBQTtJQUN3QjtJQXVCVDtJQUVTO01BQ3hCO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOzs7Ozs7Ozs7Ozs7TUFBQTtRQUFBOztNQUFBOzs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtnQkFBQTtJQUF1RTs7OztJQUE5RDtJQUEyQjtJQUFwQyxTQUFTLFVBQTJCLFNBQXBDOzs7OztJQzNCQTtnQkFBQTs7Ozs7SUFBQTtLQUFBOzs7OyJ9
//# sourceMappingURL=app.component.ngfactory.js.map

/***/ }),

/***/ 785:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */

Object.defineProperty(exports, "__esModule", { value: true });
const import0 = __webpack_require__(0);
const import1 = __webpack_require__(786);
const import2 = __webpack_require__(120);
const import3 = __webpack_require__(66);
const import4 = __webpack_require__(12);
const import5 = __webpack_require__(3);
const import6 = __webpack_require__(5);
const import7 = __webpack_require__(22);
const import8 = __webpack_require__(13);
const import9 = __webpack_require__(36);
const import10 = __webpack_require__(21);
const import11 = __webpack_require__(14);
const import12 = __webpack_require__(787);
const import13 = __webpack_require__(16);
const import14 = __webpack_require__(7);
const import15 = __webpack_require__(42);
const import16 = __webpack_require__(11);
const import17 = __webpack_require__(219);
const import18 = __webpack_require__(15);
const import19 = __webpack_require__(43);
const styles_TabsPage = [];
exports.RenderType_TabsPage = import0.ɵcrt({
    encapsulation: 2,
    styles: styles_TabsPage,
    data: {}
});
function View_TabsPage_1(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵeld(0, null, null, 1, 'ion-tab', [
            [
                'role',
                'tabpanel'
            ],
            [
                'tabIcon',
                'cog'
            ],
            [
                'tabTitle',
                'Admin'
            ]
        ], [
            [
                1,
                'id',
                0
            ],
            [
                1,
                'aria-labelledby',
                0
            ]
        ], null, null, import1.View_Tab_0, import1.RenderType_Tab)),
        import0.ɵdid(122880, null, 0, import2.Tab, [
            import3.Tabs,
            import4.App,
            import5.Config,
            import6.Platform,
            import7.Keyboard,
            import0.ElementRef,
            import0.NgZone,
            import0.Renderer,
            import0.ComponentFactoryResolver,
            import0.ChangeDetectorRef,
            import8.GestureController,
            import9.TransitionController,
            [
                2,
                import10.DeepLinker
            ],
            import11.DomController
        ], {
            root: [
                0,
                'root'
            ],
            tabTitle: [
                1,
                'tabTitle'
            ],
            tabIcon: [
                2,
                'tabIcon'
            ]
        }, null)
    ], (ck, v) => {
        var co = v.component;
        const currVal_2 = co.tab5Root;
        const currVal_3 = 'Admin';
        const currVal_4 = 'cog';
        ck(v, 1, 0, currVal_2, currVal_3, currVal_4);
    }, (ck, v) => {
        const currVal_0 = import0.ɵnov(v, 1)._tabId;
        const currVal_1 = import0.ɵnov(v, 1)._btnId;
        ck(v, 0, 0, currVal_0, currVal_1);
    });
}
function View_TabsPage_0(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵeld(0, null, null, 18, 'ion-tabs', [[
                'color',
                'footer'
            ]
        ], null, null, null, import12.View_Tabs_0, import12.RenderType_Tabs)),
        import0.ɵdid(2187264, null, 0, import3.Tabs, [
            [
                2,
                import13.NavController
            ],
            [
                2,
                import14.ViewController
            ],
            import4.App,
            import5.Config,
            import0.ElementRef,
            import6.Platform,
            import0.Renderer,
            import10.DeepLinker
        ], {
            color: [
                0,
                'color'
            ],
            selectedIndex: [
                1,
                'selectedIndex'
            ]
        }, null),
        import0.ɵprd(3072, null, import15.RootNode, null, [import3.Tabs]),
        (l()(), import0.ɵted(0, ['\n  '])),
        (l()(), import0.ɵeld(0, null, 0, 1, 'ion-tab', [
            [
                'role',
                'tabpanel'
            ],
            [
                'tabIcon',
                'home'
            ],
            [
                'tabTitle',
                'This Week'
            ]
        ], [
            [
                1,
                'id',
                0
            ],
            [
                1,
                'aria-labelledby',
                0
            ]
        ], null, null, import1.View_Tab_0, import1.RenderType_Tab)),
        import0.ɵdid(122880, null, 0, import2.Tab, [
            import3.Tabs,
            import4.App,
            import5.Config,
            import6.Platform,
            import7.Keyboard,
            import0.ElementRef,
            import0.NgZone,
            import0.Renderer,
            import0.ComponentFactoryResolver,
            import0.ChangeDetectorRef,
            import8.GestureController,
            import9.TransitionController,
            [
                2,
                import10.DeepLinker
            ],
            import11.DomController
        ], {
            root: [
                0,
                'root'
            ],
            tabTitle: [
                1,
                'tabTitle'
            ],
            tabIcon: [
                2,
                'tabIcon'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['\n  '])),
        (l()(), import0.ɵeld(0, null, 0, 1, 'ion-tab', [
            [
                'role',
                'tabpanel'
            ],
            [
                'tabIcon',
                'calendar'
            ],
            [
                'tabTitle',
                'Weeks'
            ]
        ], [
            [
                1,
                'id',
                0
            ],
            [
                1,
                'aria-labelledby',
                0
            ]
        ], null, null, import1.View_Tab_0, import1.RenderType_Tab)),
        import0.ɵdid(122880, null, 0, import2.Tab, [
            import3.Tabs,
            import4.App,
            import5.Config,
            import6.Platform,
            import7.Keyboard,
            import0.ElementRef,
            import0.NgZone,
            import0.Renderer,
            import0.ComponentFactoryResolver,
            import0.ChangeDetectorRef,
            import8.GestureController,
            import9.TransitionController,
            [
                2,
                import10.DeepLinker
            ],
            import11.DomController
        ], {
            root: [
                0,
                'root'
            ],
            tabTitle: [
                1,
                'tabTitle'
            ],
            tabIcon: [
                2,
                'tabIcon'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['\n  '])),
        (l()(), import0.ɵeld(0, null, 0, 1, 'ion-tab', [
            [
                'role',
                'tabpanel'
            ],
            [
                'tabIcon',
                'list-box'
            ],
            [
                'tabTitle',
                'Leaderboard'
            ]
        ], [
            [
                1,
                'id',
                0
            ],
            [
                1,
                'aria-labelledby',
                0
            ]
        ], null, null, import1.View_Tab_0, import1.RenderType_Tab)),
        import0.ɵdid(122880, null, 0, import2.Tab, [
            import3.Tabs,
            import4.App,
            import5.Config,
            import6.Platform,
            import7.Keyboard,
            import0.ElementRef,
            import0.NgZone,
            import0.Renderer,
            import0.ComponentFactoryResolver,
            import0.ChangeDetectorRef,
            import8.GestureController,
            import9.TransitionController,
            [
                2,
                import10.DeepLinker
            ],
            import11.DomController
        ], {
            root: [
                0,
                'root'
            ],
            tabTitle: [
                1,
                'tabTitle'
            ],
            tabIcon: [
                2,
                'tabIcon'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['\n  '])),
        (l()(), import0.ɵeld(0, null, 0, 1, 'ion-tab', [
            [
                'role',
                'tabpanel'
            ],
            [
                'tabIcon',
                'person'
            ],
            [
                'tabTitle',
                'Profile'
            ]
        ], [
            [
                1,
                'id',
                0
            ],
            [
                1,
                'aria-labelledby',
                0
            ]
        ], null, null, import1.View_Tab_0, import1.RenderType_Tab)),
        import0.ɵdid(122880, null, 0, import2.Tab, [
            import3.Tabs,
            import4.App,
            import5.Config,
            import6.Platform,
            import7.Keyboard,
            import0.ElementRef,
            import0.NgZone,
            import0.Renderer,
            import0.ComponentFactoryResolver,
            import0.ChangeDetectorRef,
            import8.GestureController,
            import9.TransitionController,
            [
                2,
                import10.DeepLinker
            ],
            import11.DomController
        ], {
            root: [
                0,
                'root'
            ],
            tabTitle: [
                1,
                'tabTitle'
            ],
            tabIcon: [
                2,
                'tabIcon'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['\n  '])),
        (l()(), import0.ɵand(8388608, null, 0, 1, null, View_TabsPage_1)),
        import0.ɵdid(8192, null, 0, import16.NgIf, [
            import0.ViewContainerRef,
            import0.TemplateRef
        ], { ngIf: [
                0,
                'ngIf'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['\n'])),
        (l()(), import0.ɵted(null, ['\n']))
    ], (ck, v) => {
        var co = v.component;
        const currVal_0 = 'footer';
        const currVal_1 = co.mySelectedIndex;
        ck(v, 1, 0, currVal_0, currVal_1);
        const currVal_4 = co.tab1Root;
        const currVal_5 = 'This Week';
        const currVal_6 = 'home';
        ck(v, 5, 0, currVal_4, currVal_5, currVal_6);
        const currVal_9 = co.tab2Root;
        const currVal_10 = 'Weeks';
        const currVal_11 = 'calendar';
        ck(v, 8, 0, currVal_9, currVal_10, currVal_11);
        const currVal_14 = co.tab3Root;
        const currVal_15 = 'Leaderboard';
        const currVal_16 = 'list-box';
        ck(v, 11, 0, currVal_14, currVal_15, currVal_16);
        const currVal_19 = co.tab4Root;
        const currVal_20 = 'Profile';
        const currVal_21 = 'person';
        ck(v, 14, 0, currVal_19, currVal_20, currVal_21);
        const currVal_22 = co.authProvider.isAdministrator;
        ck(v, 17, 0, currVal_22);
    }, (ck, v) => {
        const currVal_2 = import0.ɵnov(v, 5)._tabId;
        const currVal_3 = import0.ɵnov(v, 5)._btnId;
        ck(v, 4, 0, currVal_2, currVal_3);
        const currVal_7 = import0.ɵnov(v, 8)._tabId;
        const currVal_8 = import0.ɵnov(v, 8)._btnId;
        ck(v, 7, 0, currVal_7, currVal_8);
        const currVal_12 = import0.ɵnov(v, 11)._tabId;
        const currVal_13 = import0.ɵnov(v, 11)._btnId;
        ck(v, 10, 0, currVal_12, currVal_13);
        const currVal_17 = import0.ɵnov(v, 14)._tabId;
        const currVal_18 = import0.ɵnov(v, 14)._btnId;
        ck(v, 13, 0, currVal_17, currVal_18);
    });
}
exports.View_TabsPage_0 = View_TabsPage_0;
function View_TabsPage_Host_0(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵeld(0, null, null, 1, 'ng-component', [], null, null, null, View_TabsPage_0, exports.RenderType_TabsPage)),
        import0.ɵdid(24576, null, 0, import17.TabsPage, [
            import18.NavParams,
            import19.AuthProvider
        ], null, null)
    ], null, null);
}
exports.TabsPageNgFactory = import0.ɵccf('ng-component', import17.TabsPage, View_TabsPage_Host_0, {}, {}, []);
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL3BhZ2VzL3RhYnMvdGFicy5uZ2ZhY3RvcnkudHMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9DOi9Vc2Vycy9ib2JieS9Tb3VyY2UveG1hcy1jbHViL3htYXMtY2x1Yi9zcmMvcGFnZXMvdGFicy90YWJzLnRzIiwibmc6Ly8vQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL3BhZ2VzL3RhYnMvdGFicy5odG1sIiwibmc6Ly8vQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL3BhZ2VzL3RhYnMvdGFicy50cy5UYWJzUGFnZV9Ib3N0Lmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiICIsIjxpb24tdGFicyBbc2VsZWN0ZWRJbmRleF09XCJteVNlbGVjdGVkSW5kZXhcIiBjb2xvcj1cImZvb3RlclwiPlxuICA8aW9uLXRhYiBbcm9vdF09XCJ0YWIxUm9vdFwiIHRhYlRpdGxlPVwiVGhpcyBXZWVrXCIgdGFiSWNvbj1cImhvbWVcIj48L2lvbi10YWI+XG4gIDxpb24tdGFiIFtyb290XT1cInRhYjJSb290XCIgdGFiVGl0bGU9XCJXZWVrc1wiIHRhYkljb249XCJjYWxlbmRhclwiPjwvaW9uLXRhYj5cbiAgPGlvbi10YWIgW3Jvb3RdPVwidGFiM1Jvb3RcIiB0YWJUaXRsZT1cIkxlYWRlcmJvYXJkXCIgdGFiSWNvbj1cImxpc3QtYm94XCI+PC9pb24tdGFiPlxuICA8aW9uLXRhYiBbcm9vdF09XCJ0YWI0Um9vdFwiIHRhYlRpdGxlPVwiUHJvZmlsZVwiIHRhYkljb249XCJwZXJzb25cIj48L2lvbi10YWI+XG4gIDxpb24tdGFiIFtyb290XT1cInRhYjVSb290XCIgdGFiVGl0bGU9XCJBZG1pblwiIHRhYkljb249XCJjb2dcIiAqbmdJZj1cImF1dGhQcm92aWRlci5pc0FkbWluaXN0cmF0b3JcIj48L2lvbi10YWI+XG48L2lvbi10YWJzPlxuIiwiPG5nLWNvbXBvbmVudD48L25nLWNvbXBvbmVudD4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDS0U7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7Z0JBQUE7Ozs7Ozs7Ozs7Ozs7TUFBQTtRQUFBOztNQUFBOzs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTs7OztJQUFTO0lBQWtCO0lBQWlCO0lBQTVDLFNBQVMsVUFBa0IsVUFBaUIsU0FBNUM7O0lBQUE7SUFBQTtJQUFBLFNBQUEsbUJBQUE7Ozs7O01BTEY7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTtNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7Ozs7Ozs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtnQkFBQTtJQUEyRDtJQUN6RDtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtnQkFBQTs7Ozs7Ozs7Ozs7OztNQUFBO1FBQUE7O01BQUE7OztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO0lBQXlFO0lBQ3pFO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2dCQUFBOzs7Ozs7Ozs7Ozs7O01BQUE7UUFBQTs7TUFBQTs7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7SUFBeUU7SUFDekU7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7Z0JBQUE7Ozs7Ozs7Ozs7Ozs7TUFBQTtRQUFBOztNQUFBOzs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtJQUErRTtJQUMvRTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtnQkFBQTs7Ozs7Ozs7Ozs7OztNQUFBO1FBQUE7O01BQUE7OztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO0lBQXlFO0lBQ3pFO2dCQUFBOzs7SUFBQTtPQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBeUc7SUFDaEc7Ozs7SUFOaUM7SUFBbEM7SUFBVixTQUE0QyxVQUFsQyxTQUFWO0lBQ1c7SUFBa0I7SUFBcUI7SUFBaEQsU0FBUyxVQUFrQixVQUFxQixTQUFoRDtJQUNTO0lBQWtCO0lBQWlCO0lBQTVDLFNBQVMsVUFBa0IsV0FBaUIsVUFBNUM7SUFDUztJQUFrQjtJQUF1QjtJQUFsRCxVQUFTLFdBQWtCLFdBQXVCLFVBQWxEO0lBQ1M7SUFBa0I7SUFBbUI7SUFBOUMsVUFBUyxXQUFrQixXQUFtQixVQUE5QztJQUMwRDtJQUExRCxVQUEwRCxVQUExRDs7SUFKQTtJQUFBO0lBQUEsU0FBQSxtQkFBQTtJQUNBO0lBQUE7SUFBQSxTQUFBLG1CQUFBO0lBQ0E7SUFBQTtJQUFBLFVBQUEscUJBQUE7SUFDQTtJQUFBO0lBQUEsVUFBQSxxQkFBQTs7Ozs7SUNKRjtnQkFBQTs7O0lBQUE7S0FBQTs7OzsifQ==
//# sourceMappingURL=tabs.ngfactory.js.map

/***/ }),

/***/ 789:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */

Object.defineProperty(exports, "__esModule", { value: true });
const import0 = __webpack_require__(0);
const import1 = __webpack_require__(84);
const import2 = __webpack_require__(3);
const import3 = __webpack_require__(7);
const import4 = __webpack_require__(221);
const import5 = __webpack_require__(38);
const import6 = __webpack_require__(12);
const import7 = __webpack_require__(16);
const import8 = __webpack_require__(222);
const import9 = __webpack_require__(67);
const import10 = __webpack_require__(52);
const import11 = __webpack_require__(170);
const import12 = __webpack_require__(226);
const import13 = __webpack_require__(53);
const import14 = __webpack_require__(31);
const import15 = __webpack_require__(45);
const import16 = __webpack_require__(223);
const import17 = __webpack_require__(30);
const import18 = __webpack_require__(5);
const import19 = __webpack_require__(14);
const import20 = __webpack_require__(22);
const import21 = __webpack_require__(86);
const import22 = __webpack_require__(87);
const import23 = __webpack_require__(17);
const import24 = __webpack_require__(68);
const import25 = __webpack_require__(13);
const import26 = __webpack_require__(225);
const import27 = __webpack_require__(27);
const import28 = __webpack_require__(23);
const import29 = __webpack_require__(58);
const import30 = __webpack_require__(88);
const import31 = __webpack_require__(232);
const import32 = __webpack_require__(70);
const import33 = __webpack_require__(15);
const import34 = __webpack_require__(43);
const import35 = __webpack_require__(69);
const import36 = __webpack_require__(85);
const styles_LoginPage = [];
exports.RenderType_LoginPage = import0.ɵcrt({
    encapsulation: 2,
    styles: styles_LoginPage,
    data: {}
});
function View_LoginPage_0(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵeld(0, null, null, 22, 'ion-header', [], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import1.Header, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import3.ViewController
            ]
        ], null, null),
        (l()(), import0.ɵted(null, ['\n\n  '])),
        (l()(), import0.ɵeld(0, null, null, 18, 'ion-navbar', [
            [
                'class',
                'toolbar'
            ],
            [
                'color',
                'header'
            ],
            [
                'hideBackButton',
                'true'
            ]
        ], [
            [
                8,
                'hidden',
                0
            ],
            [
                2,
                'statusbar-padding',
                null
            ]
        ], null, null, import4.View_Navbar_0, import4.RenderType_Navbar)),
        import0.ɵdid(24576, null, 0, import5.Navbar, [
            import6.App,
            [
                2,
                import3.ViewController
            ],
            [
                2,
                import7.NavController
            ],
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], {
            color: [
                0,
                'color'
            ],
            hideBackButton: [
                1,
                'hideBackButton'
            ]
        }, null),
        (l()(), import0.ɵted(3, ['\n    '])),
        (l()(), import0.ɵeld(0, null, 3, 2, 'ion-title', [], null, null, null, import8.View_ToolbarTitle_0, import8.RenderType_ToolbarTitle)),
        import0.ɵdid(24576, null, 0, import9.ToolbarTitle, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import10.Toolbar
            ],
            [
                2,
                import5.Navbar
            ]
        ], null, null),
        (l()(), import0.ɵted(0, ['Login'])),
        (l()(), import0.ɵted(3, ['\n\n    '])),
        (l()(), import0.ɵeld(0, null, 2, 10, 'ion-buttons', [[
                'end',
                ''
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 1, import11.ToolbarItem, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import10.Toolbar
            ],
            [
                2,
                import5.Navbar
            ]
        ], null, null),
        import0.ɵqud(301989888, 1, { _buttons: 1 }),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵeld(0, null, null, 5, 'button', [
            [
                'icon-only',
                ''
            ],
            [
                'ion-button',
                ''
            ]
        ], null, [[
                null,
                'click'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('click' === en)) {
                const pd_0 = (co.close() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import13.View_Button_0, import13.RenderType_Button)),
        import0.ɵdid(548864, [[
                1,
                4
            ]
        ], 0, import14.Button, [
            [
                8,
                ''
            ],
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], null, null),
        (l()(), import0.ɵted(0, ['\n        '])),
        (l()(), import0.ɵeld(0, null, 0, 1, 'ion-icon', [
            [
                'name',
                'close'
            ],
            [
                'role',
                'img'
            ]
        ], [[
                2,
                'hide',
                null
            ]
        ], null, null, null, null)),
        import0.ɵdid(73728, null, 0, import15.Icon, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], { name: [
                0,
                'name'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['\n      '])),
        (l()(), import0.ɵted(null, ['\n    '])),
        (l()(), import0.ɵted(3, ['\n  '])),
        (l()(), import0.ɵted(null, ['\n\n'])),
        (l()(), import0.ɵted(null, ['\n\n'])),
        (l()(), import0.ɵeld(0, null, null, 94, 'ion-content', [[
                'class',
                'login-content'
            ]
        ], [[
                2,
                'statusbar-padding',
                null
            ]
        ], null, null, import16.View_Content_0, import16.RenderType_Content)),
        import0.ɵdid(2187264, null, 0, import17.Content, [
            import2.Config,
            import18.Platform,
            import19.DomController,
            import0.ElementRef,
            import0.Renderer,
            import6.App,
            import20.Keyboard,
            import0.NgZone,
            [
                2,
                import3.ViewController
            ],
            [
                2,
                import7.NavController
            ]
        ], null, null),
        (l()(), import0.ɵted(1, ['\n  '])),
        (l()(), import0.ɵeld(0, null, 1, 8, 'ion-row', [[
                'class',
                'logo-row row'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import21.Row, [], null, null),
        (l()(), import0.ɵted(null, ['\n    '])),
        (l()(), import0.ɵeld(0, null, null, 4, 'ion-col', [[
                'class',
                'col'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import22.Col, [], null, null),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵeld(0, null, null, 0, 'img', [
            [
                'src',
                '../../assets/img/logo-sm.png'
            ],
            [
                'style',
                'height:175px'
            ]
        ], null, null, null, null, null)),
        (l()(), import0.ɵted(null, ['\n    '])),
        (l()(), import0.ɵted(null, ['\n  '])),
        (l()(), import0.ɵted(1, ['\n  '])),
        (l()(), import0.ɵeld(0, null, 1, 80, 'div', [[
                'class',
                'login-box'
            ]
        ], null, null, null, null, null)),
        (l()(), import0.ɵted(null, ['\n    '])),
        (l()(), import0.ɵeld(0, null, null, 61, 'form', [[
                'novalidate',
                ''
            ]
        ], [
            [
                2,
                'ng-untouched',
                null
            ],
            [
                2,
                'ng-touched',
                null
            ],
            [
                2,
                'ng-pristine',
                null
            ],
            [
                2,
                'ng-dirty',
                null
            ],
            [
                2,
                'ng-valid',
                null
            ],
            [
                2,
                'ng-invalid',
                null
            ],
            [
                2,
                'ng-pending',
                null
            ]
        ], [
            [
                null,
                'ngSubmit'
            ],
            [
                null,
                'submit'
            ],
            [
                null,
                'reset'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('submit' === en)) {
                const pd_0 = (import0.ɵnov(v, 41).onSubmit($event) !== false);
                ad = (pd_0 && ad);
            }
            if (('reset' === en)) {
                const pd_1 = (import0.ɵnov(v, 41).onReset() !== false);
                ad = (pd_1 && ad);
            }
            if (('ngSubmit' === en)) {
                const pd_2 = (co.login() !== false);
                ad = (pd_2 && ad);
            }
            return ad;
        }, null, null)),
        import0.ɵdid(8192, null, 0, import23.ɵbf, [], null, null),
        import0.ɵdid(8192, [[
                'registerForm',
                4
            ]
        ], 0, import23.NgForm, [
            [
                8,
                null
            ],
            [
                8,
                null
            ]
        ], null, { ngSubmit: 'ngSubmit' }),
        import0.ɵprd(1024, null, import23.ControlContainer, null, [import23.NgForm]),
        import0.ɵdid(8192, null, 0, import23.NgControlStatusGroup, [import23.ControlContainer], null, null),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵeld(0, null, null, 42, 'ion-row', [[
                'class',
                'row'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import21.Row, [], null, null),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵeld(0, null, null, 38, 'ion-col', [[
                'class',
                'col'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import22.Col, [], null, null),
        (l()(), import0.ɵted(null, ['\n          '])),
        (l()(), import0.ɵeld(0, null, null, 34, 'ion-list', [], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import24.List, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            import18.Platform,
            import25.GestureController,
            import19.DomController
        ], null, null),
        (l()(), import0.ɵted(null, ['\n\n            '])),
        (l()(), import0.ɵeld(0, null, null, 14, 'ion-item', [[
                'class',
                'item item-block'
            ]
        ], null, null, null, import26.View_Item_0, import26.RenderType_Item)),
        import0.ɵdid(548864, null, 3, import27.Item, [
            import28.Form,
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import29.ItemReorder
            ]
        ], null, null),
        import0.ɵqud(167772160, 2, { contentLabel: 0 }),
        import0.ɵqud(301989888, 3, { _buttons: 1 }),
        import0.ɵqud(301989888, 4, { _icons: 1 }),
        import0.ɵdid(8192, null, 0, import30.ItemContent, [], null, null),
        (l()(), import0.ɵted(2, ['\n              '])),
        (l()(), import0.ɵeld(0, null, 3, 6, 'ion-input', [
            [
                'name',
                'email'
            ],
            [
                'placeholder',
                'Email'
            ],
            [
                'required',
                ''
            ],
            [
                'type',
                'text'
            ]
        ], [
            [
                1,
                'required',
                0
            ],
            [
                2,
                'ng-untouched',
                null
            ],
            [
                2,
                'ng-touched',
                null
            ],
            [
                2,
                'ng-pristine',
                null
            ],
            [
                2,
                'ng-dirty',
                null
            ],
            [
                2,
                'ng-valid',
                null
            ],
            [
                2,
                'ng-invalid',
                null
            ],
            [
                2,
                'ng-pending',
                null
            ]
        ], [[
                null,
                'ngModelChange'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('ngModelChange' === en)) {
                const pd_0 = ((co.credentials.email = $event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import31.View_TextInput_0, import31.RenderType_TextInput)),
        import0.ɵdid(8192, null, 0, import23.RequiredValidator, [], { required: [
                0,
                'required'
            ]
        }, null),
        import0.ɵprd(512, null, import23.NG_VALIDATORS, (p0_0) => {
            return [p0_0];
        }, [import23.RequiredValidator]),
        import0.ɵdid(335872, null, 0, import23.NgModel, [
            [
                2,
                import23.ControlContainer
            ],
            [
                2,
                import23.NG_VALIDATORS
            ],
            [
                8,
                null
            ],
            [
                8,
                null
            ]
        ], {
            name: [
                0,
                'name'
            ],
            model: [
                1,
                'model'
            ]
        }, { update: 'ngModelChange' }),
        import0.ɵprd(1024, null, import23.NgControl, null, [import23.NgModel]),
        import0.ɵdid(8192, null, 0, import23.NgControlStatus, [import23.NgControl], null, null),
        import0.ɵdid(1171456, null, 0, import32.TextInput, [
            import2.Config,
            import18.Platform,
            import28.Form,
            import6.App,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import17.Content
            ],
            [
                2,
                import27.Item
            ],
            [
                2,
                import7.NavController
            ],
            [
                2,
                import23.NgControl
            ],
            import19.DomController
        ], {
            placeholder: [
                0,
                'placeholder'
            ],
            type: [
                1,
                'type'
            ]
        }, null),
        (l()(), import0.ɵted(2, ['\n            '])),
        (l()(), import0.ɵted(null, ['\n\n            '])),
        (l()(), import0.ɵeld(0, null, null, 14, 'ion-item', [[
                'class',
                'item item-block'
            ]
        ], null, null, null, import26.View_Item_0, import26.RenderType_Item)),
        import0.ɵdid(548864, null, 3, import27.Item, [
            import28.Form,
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import29.ItemReorder
            ]
        ], null, null),
        import0.ɵqud(167772160, 5, { contentLabel: 0 }),
        import0.ɵqud(301989888, 6, { _buttons: 1 }),
        import0.ɵqud(301989888, 7, { _icons: 1 }),
        import0.ɵdid(8192, null, 0, import30.ItemContent, [], null, null),
        (l()(), import0.ɵted(2, ['\n              '])),
        (l()(), import0.ɵeld(0, null, 3, 6, 'ion-input', [
            [
                'name',
                'password'
            ],
            [
                'placeholder',
                'Password'
            ],
            [
                'required',
                ''
            ],
            [
                'type',
                'password'
            ]
        ], [
            [
                1,
                'required',
                0
            ],
            [
                2,
                'ng-untouched',
                null
            ],
            [
                2,
                'ng-touched',
                null
            ],
            [
                2,
                'ng-pristine',
                null
            ],
            [
                2,
                'ng-dirty',
                null
            ],
            [
                2,
                'ng-valid',
                null
            ],
            [
                2,
                'ng-invalid',
                null
            ],
            [
                2,
                'ng-pending',
                null
            ]
        ], [[
                null,
                'ngModelChange'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('ngModelChange' === en)) {
                const pd_0 = ((co.credentials.password = $event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import31.View_TextInput_0, import31.RenderType_TextInput)),
        import0.ɵdid(8192, null, 0, import23.RequiredValidator, [], { required: [
                0,
                'required'
            ]
        }, null),
        import0.ɵprd(512, null, import23.NG_VALIDATORS, (p0_0) => {
            return [p0_0];
        }, [import23.RequiredValidator]),
        import0.ɵdid(335872, null, 0, import23.NgModel, [
            [
                2,
                import23.ControlContainer
            ],
            [
                2,
                import23.NG_VALIDATORS
            ],
            [
                8,
                null
            ],
            [
                8,
                null
            ]
        ], {
            name: [
                0,
                'name'
            ],
            model: [
                1,
                'model'
            ]
        }, { update: 'ngModelChange' }),
        import0.ɵprd(1024, null, import23.NgControl, null, [import23.NgModel]),
        import0.ɵdid(8192, null, 0, import23.NgControlStatus, [import23.NgControl], null, null),
        import0.ɵdid(1171456, null, 0, import32.TextInput, [
            import2.Config,
            import18.Platform,
            import28.Form,
            import6.App,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import17.Content
            ],
            [
                2,
                import27.Item
            ],
            [
                2,
                import7.NavController
            ],
            [
                2,
                import23.NgControl
            ],
            import19.DomController
        ], {
            placeholder: [
                0,
                'placeholder'
            ],
            type: [
                1,
                'type'
            ]
        }, null),
        (l()(), import0.ɵted(2, ['\n            '])),
        (l()(), import0.ɵted(null, ['\n\n          '])),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵted(null, ['\n\n      '])),
        (l()(), import0.ɵeld(0, null, null, 10, 'ion-row', [[
                'class',
                'row'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import21.Row, [], null, null),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵeld(0, null, null, 6, 'ion-col', [[
                'class',
                'signup-col col'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import22.Col, [], null, null),
        (l()(), import0.ɵted(null, ['\n          '])),
        (l()(), import0.ɵeld(0, null, null, 2, 'button', [
            [
                'class',
                'submit-btn'
            ],
            [
                'full',
                ''
            ],
            [
                'ion-button',
                ''
            ],
            [
                'type',
                'submit'
            ]
        ], [[
                8,
                'disabled',
                0
            ]
        ], null, null, import13.View_Button_0, import13.RenderType_Button)),
        import0.ɵdid(548864, null, 0, import14.Button, [
            [
                8,
                ''
            ],
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], { full: [
                0,
                'full'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['Login'])),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵted(null, ['\n\n    '])),
        (l()(), import0.ɵted(null, ['\n\n    '])),
        (l()(), import0.ɵeld(0, null, null, 14, 'ion-row', [[
                'class',
                'row'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import21.Row, [], null, null),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵeld(0, null, null, 10, 'ion-col', [[
                'class',
                'signup-col col'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import22.Col, [], null, null),
        (l()(), import0.ɵted(null, ['\n          '])),
        (l()(), import0.ɵeld(0, null, null, 2, 'button', [
            [
                'block',
                ''
            ],
            [
                'class',
                'forgot-password-btn'
            ],
            [
                'clear',
                ''
            ],
            [
                'ion-button',
                ''
            ]
        ], null, [[
                null,
                'click'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('click' === en)) {
                const pd_0 = (co.forgotPassword() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import13.View_Button_0, import13.RenderType_Button)),
        import0.ɵdid(548864, null, 0, import14.Button, [
            [
                8,
                ''
            ],
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], {
            clear: [
                0,
                'clear'
            ],
            block: [
                1,
                'block'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['Forgot Password'])),
        (l()(), import0.ɵted(null, ['\n          '])),
        (l()(), import0.ɵeld(0, null, null, 2, 'button', [
            [
                'block',
                ''
            ],
            [
                'class',
                'register-btn'
            ],
            [
                'clear',
                ''
            ],
            [
                'ion-button',
                ''
            ]
        ], null, [[
                null,
                'click'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('click' === en)) {
                const pd_0 = (co.createAccount() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import13.View_Button_0, import13.RenderType_Button)),
        import0.ɵdid(548864, null, 0, import14.Button, [
            [
                8,
                ''
            ],
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], {
            clear: [
                0,
                'clear'
            ],
            block: [
                1,
                'block'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['Create New Account'])),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵted(null, ['\n\n  '])),
        (l()(), import0.ɵted(1, ['\n'])),
        (l()(), import0.ɵted(null, ['\n']))
    ], (ck, v) => {
        var co = v.component;
        const currVal_2 = 'header';
        const currVal_3 = 'true';
        ck(v, 4, 0, currVal_2, currVal_3);
        const currVal_5 = 'close';
        ck(v, 18, 0, currVal_5);
        const currVal_22 = '';
        ck(v, 62, 0, currVal_22);
        const currVal_23 = 'email';
        const currVal_24 = co.credentials.email;
        ck(v, 64, 0, currVal_23, currVal_24);
        const currVal_25 = 'Email';
        const currVal_26 = 'text';
        ck(v, 67, 0, currVal_25, currVal_26);
        const currVal_35 = '';
        ck(v, 78, 0, currVal_35);
        const currVal_36 = 'password';
        const currVal_37 = co.credentials.password;
        ck(v, 80, 0, currVal_36, currVal_37);
        const currVal_38 = 'Password';
        const currVal_39 = 'password';
        ck(v, 83, 0, currVal_38, currVal_39);
        const currVal_41 = '';
        ck(v, 96, 0, currVal_41);
        const currVal_42 = '';
        const currVal_43 = '';
        ck(v, 109, 0, currVal_42, currVal_43);
        const currVal_44 = '';
        const currVal_45 = '';
        ck(v, 113, 0, currVal_44, currVal_45);
    }, (ck, v) => {
        const currVal_0 = import0.ɵnov(v, 4)._hidden;
        const currVal_1 = import0.ɵnov(v, 4)._sbPadding;
        ck(v, 3, 0, currVal_0, currVal_1);
        const currVal_4 = import0.ɵnov(v, 18)._hidden;
        ck(v, 17, 0, currVal_4);
        const currVal_6 = import0.ɵnov(v, 25).statusbarPadding;
        ck(v, 24, 0, currVal_6);
        const currVal_7 = import0.ɵnov(v, 43).ngClassUntouched;
        const currVal_8 = import0.ɵnov(v, 43).ngClassTouched;
        const currVal_9 = import0.ɵnov(v, 43).ngClassPristine;
        const currVal_10 = import0.ɵnov(v, 43).ngClassDirty;
        const currVal_11 = import0.ɵnov(v, 43).ngClassValid;
        const currVal_12 = import0.ɵnov(v, 43).ngClassInvalid;
        const currVal_13 = import0.ɵnov(v, 43).ngClassPending;
        ck(v, 39, 0, currVal_7, currVal_8, currVal_9, currVal_10, currVal_11, currVal_12, currVal_13);
        const currVal_14 = (import0.ɵnov(v, 62).required ? '' : null);
        const currVal_15 = import0.ɵnov(v, 66).ngClassUntouched;
        const currVal_16 = import0.ɵnov(v, 66).ngClassTouched;
        const currVal_17 = import0.ɵnov(v, 66).ngClassPristine;
        const currVal_18 = import0.ɵnov(v, 66).ngClassDirty;
        const currVal_19 = import0.ɵnov(v, 66).ngClassValid;
        const currVal_20 = import0.ɵnov(v, 66).ngClassInvalid;
        const currVal_21 = import0.ɵnov(v, 66).ngClassPending;
        ck(v, 61, 0, currVal_14, currVal_15, currVal_16, currVal_17, currVal_18, currVal_19, currVal_20, currVal_21);
        const currVal_27 = (import0.ɵnov(v, 78).required ? '' : null);
        const currVal_28 = import0.ɵnov(v, 82).ngClassUntouched;
        const currVal_29 = import0.ɵnov(v, 82).ngClassTouched;
        const currVal_30 = import0.ɵnov(v, 82).ngClassPristine;
        const currVal_31 = import0.ɵnov(v, 82).ngClassDirty;
        const currVal_32 = import0.ɵnov(v, 82).ngClassValid;
        const currVal_33 = import0.ɵnov(v, 82).ngClassInvalid;
        const currVal_34 = import0.ɵnov(v, 82).ngClassPending;
        ck(v, 77, 0, currVal_27, currVal_28, currVal_29, currVal_30, currVal_31, currVal_32, currVal_33, currVal_34);
        const currVal_40 = !import0.ɵnov(v, 41).form.valid;
        ck(v, 95, 0, currVal_40);
    });
}
exports.View_LoginPage_0 = View_LoginPage_0;
function View_LoginPage_Host_0(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵeld(0, null, null, 1, 'page-login', [], null, null, null, View_LoginPage_0, exports.RenderType_LoginPage)),
        import0.ɵdid(24576, null, 0, import12.LoginPage, [
            import7.NavController,
            import33.NavParams,
            import6.App,
            import34.AuthProvider,
            import35.AlertController,
            import36.LoadingController
        ], null, null)
    ], null, null);
}
exports.LoginPageNgFactory = import0.ɵccf('page-login', import12.LoginPage, View_LoginPage_Host_0, {}, {}, []);
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL3BhZ2VzL2xvZ2luL2xvZ2luLm5nZmFjdG9yeS50cyIsInZlcnNpb24iOjMsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nOi8vL0M6L1VzZXJzL2JvYmJ5L1NvdXJjZS94bWFzLWNsdWIveG1hcy1jbHViL3NyYy9wYWdlcy9sb2dpbi9sb2dpbi50cyIsIm5nOi8vL0M6L1VzZXJzL2JvYmJ5L1NvdXJjZS94bWFzLWNsdWIveG1hcy1jbHViL3NyYy9wYWdlcy9sb2dpbi9sb2dpbi5odG1sIiwibmc6Ly8vQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL3BhZ2VzL2xvZ2luL2xvZ2luLnRzLkxvZ2luUGFnZV9Ib3N0Lmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiICIsIjxpb24taGVhZGVyPlxuXG4gIDxpb24tbmF2YmFyIGNvbG9yPVwiaGVhZGVyXCIgaGlkZUJhY2tCdXR0b249XCJ0cnVlXCI+XG4gICAgPGlvbi10aXRsZT5Mb2dpbjwvaW9uLXRpdGxlPlxuXG4gICAgPGlvbi1idXR0b25zIGVuZD5cbiAgICAgIDxidXR0b24gaW9uLWJ1dHRvbiBpY29uLW9ubHkgKGNsaWNrKT1cImNsb3NlKClcIj5cbiAgICAgICAgPGlvbi1pY29uIG5hbWU9XCJjbG9zZVwiPjwvaW9uLWljb24+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2lvbi1idXR0b25zPlxuICA8L2lvbi1uYXZiYXI+XG5cbjwvaW9uLWhlYWRlcj5cblxuPGlvbi1jb250ZW50IGNsYXNzPVwibG9naW4tY29udGVudFwiPlxuICA8aW9uLXJvdyBjbGFzcz1cImxvZ28tcm93XCI+XG4gICAgPGlvbi1jb2w+XG4gICAgICA8aW1nIHNyYz1cIi4uLy4uL2Fzc2V0cy9pbWcvbG9nby1zbS5wbmdcIiBzdHlsZT1cImhlaWdodDoxNzVweFwiIC8+XG4gICAgPC9pb24tY29sPlxuICA8L2lvbi1yb3c+XG4gIDxkaXYgY2xhc3M9XCJsb2dpbi1ib3hcIj5cbiAgICA8Zm9ybSAobmdTdWJtaXQpPVwibG9naW4oKVwiICNyZWdpc3RlckZvcm09XCJuZ0Zvcm1cIj5cbiAgICAgIDxpb24tcm93PlxuICAgICAgICA8aW9uLWNvbD5cbiAgICAgICAgICA8aW9uLWxpc3Q+XG5cbiAgICAgICAgICAgIDxpb24taXRlbT5cbiAgICAgICAgICAgICAgPGlvbi1pbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW1haWxcIiBuYW1lPVwiZW1haWxcIiBbKG5nTW9kZWwpXT1cImNyZWRlbnRpYWxzLmVtYWlsXCIgcmVxdWlyZWQ+PC9pb24taW5wdXQ+XG4gICAgICAgICAgICA8L2lvbi1pdGVtPlxuXG4gICAgICAgICAgICA8aW9uLWl0ZW0+XG4gICAgICAgICAgICAgIDxpb24taW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIFsobmdNb2RlbCldPVwiY3JlZGVudGlhbHMucGFzc3dvcmRcIiByZXF1aXJlZD48L2lvbi1pbnB1dD5cbiAgICAgICAgICAgIDwvaW9uLWl0ZW0+XG5cbiAgICAgICAgICA8L2lvbi1saXN0PlxuICAgICAgICA8L2lvbi1jb2w+XG4gICAgICA8L2lvbi1yb3c+XG5cbiAgICAgIDxpb24tcm93PlxuICAgICAgICA8aW9uLWNvbCBjbGFzcz1cInNpZ251cC1jb2xcIj5cbiAgICAgICAgICA8YnV0dG9uIGlvbi1idXR0b24gY2xhc3M9XCJzdWJtaXQtYnRuXCIgZnVsbCB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cIiFyZWdpc3RlckZvcm0uZm9ybS52YWxpZFwiPkxvZ2luPC9idXR0b24+XG4gICAgICAgIDwvaW9uLWNvbD5cbiAgICAgIDwvaW9uLXJvdz5cblxuICAgIDwvZm9ybT5cblxuICAgIDxpb24tcm93PlxuICAgICAgICA8aW9uLWNvbCBjbGFzcz1cInNpZ251cC1jb2xcIj5cbiAgICAgICAgICA8YnV0dG9uIGlvbi1idXR0b24gY2xhc3M9XCJmb3Jnb3QtcGFzc3dvcmQtYnRuXCIgYmxvY2sgY2xlYXIgKGNsaWNrKT1cImZvcmdvdFBhc3N3b3JkKClcIj5Gb3Jnb3QgUGFzc3dvcmQ8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGlvbi1idXR0b24gY2xhc3M9XCJyZWdpc3Rlci1idG5cIiBibG9jayBjbGVhciAoY2xpY2spPVwiY3JlYXRlQWNjb3VudCgpXCI+Q3JlYXRlIE5ldyBBY2NvdW50PC9idXR0b24+XG4gICAgICAgIDwvaW9uLWNvbD5cbiAgICAgIDwvaW9uLXJvdz5cblxuICA8L2Rpdj5cbjwvaW9uLWNvbnRlbnQ+XG4iLCI8cGFnZS1sb2dpbj48L3BhZ2UtbG9naW4+Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQUE7Z0JBQUE7Ozs7TUFBQTtRQUFBOztNQUFBOztJQUFBO0tBQUE7SUFBWTtJQUVWO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2dCQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7Ozs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtJQUFpRDtJQUMvQztnQkFBQTs7OztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7SUFBQTtLQUFBO0lBQVc7SUFBaUI7TUFFNUI7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTs7OztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7SUFBQTtLQUFBO2dCQUFBO0lBQWlCO0lBQ2Y7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtPQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7TUFBQTtNQUFBO01BQTZCO1FBQUE7UUFBQTtNQUFBO01BQTdCO0lBQUE7a0JBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOzs7OztJQUFBO0tBQUE7SUFBK0M7SUFDN0M7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtPQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTs7OztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUFrQztJQUMzQjtJQUNHO0lBQ0g7SUFFRjtNQUViO1FBQUE7UUFBQTtNQUFBO01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBOzs7Ozs7Ozs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O0lBQUE7S0FBQTtJQUFtQztNQUNqQztRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQTBCO01BQ3hCO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7SUFBUztJQUNQO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtJQUErRDtJQUN2RDtJQUNGO01BQ1Y7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUF1QjtNQUNyQjtRQUFBO1FBQUE7TUFBQTtJQUFBO01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO01BQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTtNQUFBO1FBQUE7UUFBQTtNQUFBO01BQU07UUFBQTtRQUFBO01BQUE7TUFBTjtJQUFBO2dCQUFBO2tCQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2dCQUFBO2dCQUFBO0lBQWtEO01BQ2hEO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7SUFBUztNQUNQO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7SUFBUztJQUNQO2dCQUFBOzs7Ozs7O0lBQUE7S0FBQTtJQUFVO01BRVI7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTs7Ozs7TUFBQTtRQUFBOztNQUFBOztJQUFBO0tBQUE7Z0JBQUE7Z0JBQUE7Z0JBQUE7Z0JBQUE7SUFBVTtJQUNSO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtPQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7TUFBQTtNQUFBO01BQXdEO1FBQUE7UUFBQTtNQUFBO01BQXhEO0lBQUE7a0JBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTtNQUFBO0lBQUE7Z0JBQUE7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7Z0JBQUE7Z0JBQUE7Z0JBQUE7Ozs7Ozs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOzs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtJQUE2RztJQUNwRztNQUVYO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7Ozs7O01BQUE7UUFBQTs7TUFBQTs7SUFBQTtLQUFBO2dCQUFBO2dCQUFBO2dCQUFBO2dCQUFBO0lBQVU7SUFDUjtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7T0FBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO01BQUE7TUFBQTtNQUFrRTtRQUFBO1FBQUE7TUFBQTtNQUFsRTtJQUFBO2tCQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7TUFBQTtJQUFBO2dCQUFBO01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2dCQUFBO2dCQUFBO2dCQUFBOzs7Ozs7O01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7SUFBMEg7SUFDakg7SUFFRjtJQUNIO0lBQ0Y7TUFFVjtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQVM7TUFDUDtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQTRCO0lBQzFCO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7T0FBQTtRQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7Ozs7SUFBQTtPQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBK0Y7SUFBYztJQUNyRztJQUNGO0lBRUw7TUFFUDtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQVM7TUFDTDtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQTRCO0lBQzFCO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7T0FBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO01BQUE7TUFBQTtNQUEyRDtRQUFBO1FBQUE7TUFBQTtNQUEzRDtJQUFBO2dCQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7Ozs7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7SUFBc0Y7SUFBd0I7SUFDOUc7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtPQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7TUFBQTtNQUFBO01BQW9EO1FBQUE7UUFBQTtNQUFBO01BQXBEO0lBQUE7Z0JBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7Ozs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtJQUE4RTtJQUEyQjtJQUNqRztJQUNGO0lBRVI7SUFDTTs7OztJQXBEQTtJQUFlO0lBQTNCLFNBQVksVUFBZSxTQUEzQjtJQUtnQjtJQUFWLFVBQVUsU0FBVjtJQW9COEY7SUFBeEYsVUFBd0YsVUFBeEY7SUFBMkM7SUFBYTtJQUF4RCxVQUEyQyxXQUFhLFVBQXhEO0lBQXVCO0lBQVo7SUFBWCxVQUF1QixXQUFaLFVBQVg7SUFJcUc7SUFBckcsVUFBcUcsVUFBckc7SUFBa0Q7SUFBZ0I7SUFBbEUsVUFBa0QsV0FBZ0IsVUFBbEU7SUFBMkI7SUFBaEI7SUFBWCxVQUEyQixXQUFoQixVQUFYO0lBU2tDO0lBQXRDLFVBQXNDLFVBQXRDO0lBUXFEO0lBQU47SUFBL0MsV0FBcUQsV0FBTixVQUEvQztJQUM4QztJQUFOO0lBQXhDLFdBQThDLFdBQU4sVUFBeEM7O0lBL0NSO0lBQUE7SUFBQSxTQUFBLG1CQUFBO0lBS007SUFBQSxVQUFBLFNBQUE7SUFPUjtJQUFBLFVBQUEsU0FBQTtJQU9JO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUEsVUFBQSx5RUFBQTtJQU1VO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQSxVQUFBLFdBQUEsNEVBQUE7SUFJQTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUEsVUFBQSxXQUFBLDRFQUFBO0lBU3FEO0lBQXpELFVBQXlELFVBQXpEOzs7OztJQ3hDVjtnQkFBQTs7Ozs7OztJQUFBO0tBQUE7Ozs7In0=
//# sourceMappingURL=login.ngfactory.js.map

/***/ }),

/***/ 790:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */

Object.defineProperty(exports, "__esModule", { value: true });
const import0 = __webpack_require__(0);
const import1 = __webpack_require__(84);
const import2 = __webpack_require__(3);
const import3 = __webpack_require__(7);
const import4 = __webpack_require__(221);
const import5 = __webpack_require__(38);
const import6 = __webpack_require__(12);
const import7 = __webpack_require__(16);
const import8 = __webpack_require__(222);
const import9 = __webpack_require__(67);
const import10 = __webpack_require__(52);
const import11 = __webpack_require__(223);
const import12 = __webpack_require__(30);
const import13 = __webpack_require__(5);
const import14 = __webpack_require__(14);
const import15 = __webpack_require__(22);
const import16 = __webpack_require__(86);
const import17 = __webpack_require__(87);
const import18 = __webpack_require__(217);
const import19 = __webpack_require__(17);
const import20 = __webpack_require__(68);
const import21 = __webpack_require__(13);
const import22 = __webpack_require__(225);
const import23 = __webpack_require__(27);
const import24 = __webpack_require__(23);
const import25 = __webpack_require__(58);
const import26 = __webpack_require__(88);
const import27 = __webpack_require__(232);
const import28 = __webpack_require__(70);
const import29 = __webpack_require__(53);
const import30 = __webpack_require__(31);
const import31 = __webpack_require__(15);
const import32 = __webpack_require__(69);
const import33 = __webpack_require__(43);
const styles_RegisterPage = [];
exports.RenderType_RegisterPage = import0.ɵcrt({
    encapsulation: 2,
    styles: styles_RegisterPage,
    data: {}
});
function View_RegisterPage_0(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵted(null, ['\n'])),
        (l()(), import0.ɵeld(0, null, null, 10, 'ion-header', [], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import1.Header, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import3.ViewController
            ]
        ], null, null),
        (l()(), import0.ɵted(null, ['\n\n  '])),
        (l()(), import0.ɵeld(0, null, null, 6, 'ion-navbar', [
            [
                'class',
                'toolbar'
            ],
            [
                'color',
                'header'
            ]
        ], [
            [
                8,
                'hidden',
                0
            ],
            [
                2,
                'statusbar-padding',
                null
            ]
        ], null, null, import4.View_Navbar_0, import4.RenderType_Navbar)),
        import0.ɵdid(24576, null, 0, import5.Navbar, [
            import6.App,
            [
                2,
                import3.ViewController
            ],
            [
                2,
                import7.NavController
            ],
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], { color: [
                0,
                'color'
            ]
        }, null),
        (l()(), import0.ɵted(3, ['\n    '])),
        (l()(), import0.ɵeld(0, null, 3, 2, 'ion-title', [], null, null, null, import8.View_ToolbarTitle_0, import8.RenderType_ToolbarTitle)),
        import0.ɵdid(24576, null, 0, import9.ToolbarTitle, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import10.Toolbar
            ],
            [
                2,
                import5.Navbar
            ]
        ], null, null),
        (l()(), import0.ɵted(0, ['Register'])),
        (l()(), import0.ɵted(3, ['\n  '])),
        (l()(), import0.ɵted(null, ['\n\n'])),
        (l()(), import0.ɵted(null, ['\n\n'])),
        (l()(), import0.ɵeld(0, null, null, 94, 'ion-content', [[
                'class',
                'login-content'
            ]
        ], [[
                2,
                'statusbar-padding',
                null
            ]
        ], null, null, import11.View_Content_0, import11.RenderType_Content)),
        import0.ɵdid(2187264, null, 0, import12.Content, [
            import2.Config,
            import13.Platform,
            import14.DomController,
            import0.ElementRef,
            import0.Renderer,
            import6.App,
            import15.Keyboard,
            import0.NgZone,
            [
                2,
                import3.ViewController
            ],
            [
                2,
                import7.NavController
            ]
        ], null, null),
        (l()(), import0.ɵted(1, ['\n  '])),
        (l()(), import0.ɵeld(0, null, 1, 8, 'ion-row', [[
                'class',
                'logo-row row'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import16.Row, [], null, null),
        (l()(), import0.ɵted(null, ['\n    '])),
        (l()(), import0.ɵeld(0, null, null, 4, 'ion-col', [[
                'class',
                'col'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import17.Col, [], null, null),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵeld(0, null, null, 0, 'img', [
            [
                'src',
                '../../assets/img/logo-sm.png'
            ],
            [
                'style',
                'height:175px'
            ]
        ], null, null, null, null, null)),
        (l()(), import0.ɵted(null, ['\n    '])),
        (l()(), import0.ɵted(null, ['\n  '])),
        (l()(), import0.ɵted(1, ['\n\n  '])),
        (l()(), import0.ɵeld(0, null, 1, 80, 'div', [[
                'class',
                'login-box'
            ]
        ], null, null, null, null, null)),
        (l()(), import0.ɵted(null, ['\n    \n    '])),
        (l()(), import0.ɵeld(0, null, null, 77, 'form', [[
                'novalidate',
                ''
            ]
        ], [
            [
                2,
                'ng-untouched',
                null
            ],
            [
                2,
                'ng-touched',
                null
            ],
            [
                2,
                'ng-pristine',
                null
            ],
            [
                2,
                'ng-dirty',
                null
            ],
            [
                2,
                'ng-valid',
                null
            ],
            [
                2,
                'ng-invalid',
                null
            ],
            [
                2,
                'ng-pending',
                null
            ]
        ], [
            [
                null,
                'ngSubmit'
            ],
            [
                null,
                'submit'
            ],
            [
                null,
                'reset'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('submit' === en)) {
                const pd_0 = (import0.ɵnov(v, 30).onSubmit($event) !== false);
                ad = (pd_0 && ad);
            }
            if (('reset' === en)) {
                const pd_1 = (import0.ɵnov(v, 30).onReset() !== false);
                ad = (pd_1 && ad);
            }
            if (('ngSubmit' === en)) {
                const pd_2 = (co.register() !== false);
                ad = (pd_2 && ad);
            }
            return ad;
        }, null, null)),
        import0.ɵdid(8192, null, 0, import19.ɵbf, [], null, null),
        import0.ɵdid(8192, [[
                'registerForm',
                4
            ]
        ], 0, import19.NgForm, [
            [
                8,
                null
            ],
            [
                8,
                null
            ]
        ], null, { ngSubmit: 'ngSubmit' }),
        import0.ɵprd(1024, null, import19.ControlContainer, null, [import19.NgForm]),
        import0.ɵdid(8192, null, 0, import19.NgControlStatusGroup, [import19.ControlContainer], null, null),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵeld(0, null, null, 58, 'ion-row', [[
                'class',
                'row'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import16.Row, [], null, null),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵeld(0, null, null, 54, 'ion-col', [[
                'class',
                'col'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import17.Col, [], null, null),
        (l()(), import0.ɵted(null, ['\n          '])),
        (l()(), import0.ɵeld(0, null, null, 50, 'ion-list', [[
                'inset',
                ''
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import20.List, [
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            import13.Platform,
            import21.GestureController,
            import14.DomController
        ], null, null),
        (l()(), import0.ɵted(null, ['\n            \n            '])),
        (l()(), import0.ɵeld(0, null, null, 14, 'ion-item', [[
                'class',
                'item item-block'
            ]
        ], null, null, null, import22.View_Item_0, import22.RenderType_Item)),
        import0.ɵdid(548864, null, 3, import23.Item, [
            import24.Form,
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import25.ItemReorder
            ]
        ], null, null),
        import0.ɵqud(167772160, 1, { contentLabel: 0 }),
        import0.ɵqud(301989888, 2, { _buttons: 1 }),
        import0.ɵqud(301989888, 3, { _icons: 1 }),
        import0.ɵdid(8192, null, 0, import26.ItemContent, [], null, null),
        (l()(), import0.ɵted(2, ['\n              '])),
        (l()(), import0.ɵeld(0, null, 3, 6, 'ion-input', [
            [
                'name',
                'nickname'
            ],
            [
                'placeholder',
                'Nickname'
            ],
            [
                'required',
                ''
            ],
            [
                'type',
                'text'
            ]
        ], [
            [
                1,
                'required',
                0
            ],
            [
                2,
                'ng-untouched',
                null
            ],
            [
                2,
                'ng-touched',
                null
            ],
            [
                2,
                'ng-pristine',
                null
            ],
            [
                2,
                'ng-dirty',
                null
            ],
            [
                2,
                'ng-valid',
                null
            ],
            [
                2,
                'ng-invalid',
                null
            ],
            [
                2,
                'ng-pending',
                null
            ]
        ], [[
                null,
                'ngModelChange'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('ngModelChange' === en)) {
                const pd_0 = ((co.credentials.nickname = $event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import27.View_TextInput_0, import27.RenderType_TextInput)),
        import0.ɵdid(8192, null, 0, import19.RequiredValidator, [], { required: [
                0,
                'required'
            ]
        }, null),
        import0.ɵprd(512, null, import19.NG_VALIDATORS, (p0_0) => {
            return [p0_0];
        }, [import19.RequiredValidator]),
        import0.ɵdid(335872, null, 0, import19.NgModel, [
            [
                2,
                import19.ControlContainer
            ],
            [
                2,
                import19.NG_VALIDATORS
            ],
            [
                8,
                null
            ],
            [
                8,
                null
            ]
        ], {
            name: [
                0,
                'name'
            ],
            model: [
                1,
                'model'
            ]
        }, { update: 'ngModelChange' }),
        import0.ɵprd(1024, null, import19.NgControl, null, [import19.NgModel]),
        import0.ɵdid(8192, null, 0, import19.NgControlStatus, [import19.NgControl], null, null),
        import0.ɵdid(1171456, null, 0, import28.TextInput, [
            import2.Config,
            import13.Platform,
            import24.Form,
            import6.App,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import12.Content
            ],
            [
                2,
                import23.Item
            ],
            [
                2,
                import7.NavController
            ],
            [
                2,
                import19.NgControl
            ],
            import14.DomController
        ], {
            placeholder: [
                0,
                'placeholder'
            ],
            type: [
                1,
                'type'
            ]
        }, null),
        (l()(), import0.ɵted(2, ['\n            '])),
        (l()(), import0.ɵted(null, ['\n\n            '])),
        (l()(), import0.ɵeld(0, null, null, 14, 'ion-item', [[
                'class',
                'item item-block'
            ]
        ], null, null, null, import22.View_Item_0, import22.RenderType_Item)),
        import0.ɵdid(548864, null, 3, import23.Item, [
            import24.Form,
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import25.ItemReorder
            ]
        ], null, null),
        import0.ɵqud(167772160, 4, { contentLabel: 0 }),
        import0.ɵqud(301989888, 5, { _buttons: 1 }),
        import0.ɵqud(301989888, 6, { _icons: 1 }),
        import0.ɵdid(8192, null, 0, import26.ItemContent, [], null, null),
        (l()(), import0.ɵted(2, ['\n              '])),
        (l()(), import0.ɵeld(0, null, 3, 6, 'ion-input', [
            [
                'name',
                'email'
            ],
            [
                'placeholder',
                'Email'
            ],
            [
                'required',
                ''
            ],
            [
                'type',
                'text'
            ]
        ], [
            [
                1,
                'required',
                0
            ],
            [
                2,
                'ng-untouched',
                null
            ],
            [
                2,
                'ng-touched',
                null
            ],
            [
                2,
                'ng-pristine',
                null
            ],
            [
                2,
                'ng-dirty',
                null
            ],
            [
                2,
                'ng-valid',
                null
            ],
            [
                2,
                'ng-invalid',
                null
            ],
            [
                2,
                'ng-pending',
                null
            ]
        ], [[
                null,
                'ngModelChange'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('ngModelChange' === en)) {
                const pd_0 = ((co.credentials.email = $event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import27.View_TextInput_0, import27.RenderType_TextInput)),
        import0.ɵdid(8192, null, 0, import19.RequiredValidator, [], { required: [
                0,
                'required'
            ]
        }, null),
        import0.ɵprd(512, null, import19.NG_VALIDATORS, (p0_0) => {
            return [p0_0];
        }, [import19.RequiredValidator]),
        import0.ɵdid(335872, null, 0, import19.NgModel, [
            [
                2,
                import19.ControlContainer
            ],
            [
                2,
                import19.NG_VALIDATORS
            ],
            [
                8,
                null
            ],
            [
                8,
                null
            ]
        ], {
            name: [
                0,
                'name'
            ],
            model: [
                1,
                'model'
            ]
        }, { update: 'ngModelChange' }),
        import0.ɵprd(1024, null, import19.NgControl, null, [import19.NgModel]),
        import0.ɵdid(8192, null, 0, import19.NgControlStatus, [import19.NgControl], null, null),
        import0.ɵdid(1171456, null, 0, import28.TextInput, [
            import2.Config,
            import13.Platform,
            import24.Form,
            import6.App,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import12.Content
            ],
            [
                2,
                import23.Item
            ],
            [
                2,
                import7.NavController
            ],
            [
                2,
                import19.NgControl
            ],
            import14.DomController
        ], {
            placeholder: [
                0,
                'placeholder'
            ],
            type: [
                1,
                'type'
            ]
        }, null),
        (l()(), import0.ɵted(2, ['\n            '])),
        (l()(), import0.ɵted(null, ['\n            \n            '])),
        (l()(), import0.ɵeld(0, null, null, 14, 'ion-item', [[
                'class',
                'item item-block'
            ]
        ], null, null, null, import22.View_Item_0, import22.RenderType_Item)),
        import0.ɵdid(548864, null, 3, import23.Item, [
            import24.Form,
            import2.Config,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import25.ItemReorder
            ]
        ], null, null),
        import0.ɵqud(167772160, 7, { contentLabel: 0 }),
        import0.ɵqud(301989888, 8, { _buttons: 1 }),
        import0.ɵqud(301989888, 9, { _icons: 1 }),
        import0.ɵdid(8192, null, 0, import26.ItemContent, [], null, null),
        (l()(), import0.ɵted(2, ['\n              '])),
        (l()(), import0.ɵeld(0, null, 3, 6, 'ion-input', [
            [
                'name',
                'password'
            ],
            [
                'placeholder',
                'Password'
            ],
            [
                'required',
                ''
            ],
            [
                'type',
                'password'
            ]
        ], [
            [
                1,
                'required',
                0
            ],
            [
                2,
                'ng-untouched',
                null
            ],
            [
                2,
                'ng-touched',
                null
            ],
            [
                2,
                'ng-pristine',
                null
            ],
            [
                2,
                'ng-dirty',
                null
            ],
            [
                2,
                'ng-valid',
                null
            ],
            [
                2,
                'ng-invalid',
                null
            ],
            [
                2,
                'ng-pending',
                null
            ]
        ], [[
                null,
                'ngModelChange'
            ]
        ], (v, en, $event) => {
            var ad = true;
            var co = v.component;
            if (('ngModelChange' === en)) {
                const pd_0 = ((co.credentials.password = $event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, import27.View_TextInput_0, import27.RenderType_TextInput)),
        import0.ɵdid(8192, null, 0, import19.RequiredValidator, [], { required: [
                0,
                'required'
            ]
        }, null),
        import0.ɵprd(512, null, import19.NG_VALIDATORS, (p0_0) => {
            return [p0_0];
        }, [import19.RequiredValidator]),
        import0.ɵdid(335872, null, 0, import19.NgModel, [
            [
                2,
                import19.ControlContainer
            ],
            [
                2,
                import19.NG_VALIDATORS
            ],
            [
                8,
                null
            ],
            [
                8,
                null
            ]
        ], {
            name: [
                0,
                'name'
            ],
            model: [
                1,
                'model'
            ]
        }, { update: 'ngModelChange' }),
        import0.ɵprd(1024, null, import19.NgControl, null, [import19.NgModel]),
        import0.ɵdid(8192, null, 0, import19.NgControlStatus, [import19.NgControl], null, null),
        import0.ɵdid(1171456, null, 0, import28.TextInput, [
            import2.Config,
            import13.Platform,
            import24.Form,
            import6.App,
            import0.ElementRef,
            import0.Renderer,
            [
                2,
                import12.Content
            ],
            [
                2,
                import23.Item
            ],
            [
                2,
                import7.NavController
            ],
            [
                2,
                import19.NgControl
            ],
            import14.DomController
        ], {
            placeholder: [
                0,
                'placeholder'
            ],
            type: [
                1,
                'type'
            ]
        }, null),
        (l()(), import0.ɵted(2, ['\n            '])),
        (l()(), import0.ɵted(null, ['\n            \n          '])),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵted(null, ['\n      \n      '])),
        (l()(), import0.ɵeld(0, null, null, 10, 'ion-row', [[
                'class',
                'row'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import16.Row, [], null, null),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵeld(0, null, null, 6, 'ion-col', [[
                'class',
                'signup-col col'
            ]
        ], null, null, null, null, null)),
        import0.ɵdid(8192, null, 0, import17.Col, [], null, null),
        (l()(), import0.ɵted(null, ['\n          '])),
        (l()(), import0.ɵeld(0, null, null, 2, 'button', [
            [
                'class',
                'submit-btn'
            ],
            [
                'full',
                ''
            ],
            [
                'ion-button',
                ''
            ],
            [
                'type',
                'submit'
            ]
        ], [[
                8,
                'disabled',
                0
            ]
        ], null, null, import29.View_Button_0, import29.RenderType_Button)),
        import0.ɵdid(548864, null, 0, import30.Button, [
            [
                8,
                ''
            ],
            import2.Config,
            import0.ElementRef,
            import0.Renderer
        ], { full: [
                0,
                'full'
            ]
        }, null),
        (l()(), import0.ɵted(0, ['Register'])),
        (l()(), import0.ɵted(null, ['\n        '])),
        (l()(), import0.ɵted(null, ['\n      '])),
        (l()(), import0.ɵted(null, ['\n      \n    '])),
        (l()(), import0.ɵted(null, ['\n  '])),
        (l()(), import0.ɵted(1, ['\n']))
    ], (ck, v) => {
        var co = v.component;
        const currVal_2 = 'header';
        ck(v, 5, 0, currVal_2);
        const currVal_19 = '';
        ck(v, 51, 0, currVal_19);
        const currVal_20 = 'nickname';
        const currVal_21 = co.credentials.nickname;
        ck(v, 53, 0, currVal_20, currVal_21);
        const currVal_22 = 'Nickname';
        const currVal_23 = 'text';
        ck(v, 56, 0, currVal_22, currVal_23);
        const currVal_32 = '';
        ck(v, 67, 0, currVal_32);
        const currVal_33 = 'email';
        const currVal_34 = co.credentials.email;
        ck(v, 69, 0, currVal_33, currVal_34);
        const currVal_35 = 'Email';
        const currVal_36 = 'text';
        ck(v, 72, 0, currVal_35, currVal_36);
        const currVal_45 = '';
        ck(v, 83, 0, currVal_45);
        const currVal_46 = 'password';
        const currVal_47 = co.credentials.password;
        ck(v, 85, 0, currVal_46, currVal_47);
        const currVal_48 = 'Password';
        const currVal_49 = 'password';
        ck(v, 88, 0, currVal_48, currVal_49);
        const currVal_51 = '';
        ck(v, 101, 0, currVal_51);
    }, (ck, v) => {
        const currVal_0 = import0.ɵnov(v, 5)._hidden;
        const currVal_1 = import0.ɵnov(v, 5)._sbPadding;
        ck(v, 4, 0, currVal_0, currVal_1);
        const currVal_3 = import0.ɵnov(v, 14).statusbarPadding;
        ck(v, 13, 0, currVal_3);
        const currVal_4 = import0.ɵnov(v, 32).ngClassUntouched;
        const currVal_5 = import0.ɵnov(v, 32).ngClassTouched;
        const currVal_6 = import0.ɵnov(v, 32).ngClassPristine;
        const currVal_7 = import0.ɵnov(v, 32).ngClassDirty;
        const currVal_8 = import0.ɵnov(v, 32).ngClassValid;
        const currVal_9 = import0.ɵnov(v, 32).ngClassInvalid;
        const currVal_10 = import0.ɵnov(v, 32).ngClassPending;
        ck(v, 28, 0, currVal_4, currVal_5, currVal_6, currVal_7, currVal_8, currVal_9, currVal_10);
        const currVal_11 = (import0.ɵnov(v, 51).required ? '' : null);
        const currVal_12 = import0.ɵnov(v, 55).ngClassUntouched;
        const currVal_13 = import0.ɵnov(v, 55).ngClassTouched;
        const currVal_14 = import0.ɵnov(v, 55).ngClassPristine;
        const currVal_15 = import0.ɵnov(v, 55).ngClassDirty;
        const currVal_16 = import0.ɵnov(v, 55).ngClassValid;
        const currVal_17 = import0.ɵnov(v, 55).ngClassInvalid;
        const currVal_18 = import0.ɵnov(v, 55).ngClassPending;
        ck(v, 50, 0, currVal_11, currVal_12, currVal_13, currVal_14, currVal_15, currVal_16, currVal_17, currVal_18);
        const currVal_24 = (import0.ɵnov(v, 67).required ? '' : null);
        const currVal_25 = import0.ɵnov(v, 71).ngClassUntouched;
        const currVal_26 = import0.ɵnov(v, 71).ngClassTouched;
        const currVal_27 = import0.ɵnov(v, 71).ngClassPristine;
        const currVal_28 = import0.ɵnov(v, 71).ngClassDirty;
        const currVal_29 = import0.ɵnov(v, 71).ngClassValid;
        const currVal_30 = import0.ɵnov(v, 71).ngClassInvalid;
        const currVal_31 = import0.ɵnov(v, 71).ngClassPending;
        ck(v, 66, 0, currVal_24, currVal_25, currVal_26, currVal_27, currVal_28, currVal_29, currVal_30, currVal_31);
        const currVal_37 = (import0.ɵnov(v, 83).required ? '' : null);
        const currVal_38 = import0.ɵnov(v, 87).ngClassUntouched;
        const currVal_39 = import0.ɵnov(v, 87).ngClassTouched;
        const currVal_40 = import0.ɵnov(v, 87).ngClassPristine;
        const currVal_41 = import0.ɵnov(v, 87).ngClassDirty;
        const currVal_42 = import0.ɵnov(v, 87).ngClassValid;
        const currVal_43 = import0.ɵnov(v, 87).ngClassInvalid;
        const currVal_44 = import0.ɵnov(v, 87).ngClassPending;
        ck(v, 82, 0, currVal_37, currVal_38, currVal_39, currVal_40, currVal_41, currVal_42, currVal_43, currVal_44);
        const currVal_50 = !import0.ɵnov(v, 30).form.valid;
        ck(v, 100, 0, currVal_50);
    });
}
exports.View_RegisterPage_0 = View_RegisterPage_0;
function View_RegisterPage_Host_0(l) {
    return import0.ɵvid(0, [
        (l()(), import0.ɵeld(0, null, null, 1, 'page-register', [], null, null, null, View_RegisterPage_0, exports.RenderType_RegisterPage)),
        import0.ɵdid(24576, null, 0, import18.RegisterPage, [
            import7.NavController,
            import31.NavParams,
            import32.AlertController,
            import33.AuthProvider
        ], null, null)
    ], null, null);
}
exports.RegisterPageNgFactory = import0.ɵccf('page-register', import18.RegisterPage, View_RegisterPage_Host_0, {}, {}, []);
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyLm5nZmFjdG9yeS50cyIsInZlcnNpb24iOjMsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nOi8vL0M6L1VzZXJzL2JvYmJ5L1NvdXJjZS94bWFzLWNsdWIveG1hcy1jbHViL3NyYy9wYWdlcy9yZWdpc3Rlci9yZWdpc3Rlci50cyIsIm5nOi8vL0M6L1VzZXJzL2JvYmJ5L1NvdXJjZS94bWFzLWNsdWIveG1hcy1jbHViL3NyYy9wYWdlcy9yZWdpc3Rlci9yZWdpc3Rlci5odG1sIiwibmc6Ly8vQzovVXNlcnMvYm9iYnkvU291cmNlL3htYXMtY2x1Yi94bWFzLWNsdWIvc3JjL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyLnRzLlJlZ2lzdGVyUGFnZV9Ib3N0Lmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiICIsIjwhLS1cbiAgR2VuZXJhdGVkIHRlbXBsYXRlIGZvciB0aGUgUmVnaXN0ZXJQYWdlIHBhZ2UuXG5cbiAgU2VlIGh0dHA6Ly9pb25pY2ZyYW1ld29yay5jb20vZG9jcy9jb21wb25lbnRzLyNuYXZpZ2F0aW9uIGZvciBtb3JlIGluZm8gb25cbiAgSW9uaWMgcGFnZXMgYW5kIG5hdmlnYXRpb24uXG4tLT5cbjxpb24taGVhZGVyPlxuXG4gIDxpb24tbmF2YmFyIGNvbG9yPVwiaGVhZGVyXCI+XG4gICAgPGlvbi10aXRsZT5SZWdpc3RlcjwvaW9uLXRpdGxlPlxuICA8L2lvbi1uYXZiYXI+XG5cbjwvaW9uLWhlYWRlcj5cblxuPGlvbi1jb250ZW50IGNsYXNzPVwibG9naW4tY29udGVudFwiPlxuICA8aW9uLXJvdyBjbGFzcz1cImxvZ28tcm93XCI+XG4gICAgPGlvbi1jb2w+XG4gICAgICA8aW1nIHNyYz1cIi4uLy4uL2Fzc2V0cy9pbWcvbG9nby1zbS5wbmdcIiBzdHlsZT1cImhlaWdodDoxNzVweFwiLz5cbiAgICA8L2lvbi1jb2w+XG4gIDwvaW9uLXJvdz5cblxuICA8ZGl2IGNsYXNzPVwibG9naW4tYm94XCI+XG4gICAgXG4gICAgPGZvcm0gKG5nU3VibWl0KT1cInJlZ2lzdGVyKClcIiAjcmVnaXN0ZXJGb3JtPVwibmdGb3JtXCI+XG4gICAgICA8aW9uLXJvdz5cbiAgICAgICAgPGlvbi1jb2w+XG4gICAgICAgICAgPGlvbi1saXN0IGluc2V0PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8aW9uLWl0ZW0+XG4gICAgICAgICAgICAgIDxpb24taW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIk5pY2tuYW1lXCIgbmFtZT1cIm5pY2tuYW1lXCIgWyhuZ01vZGVsKV09XCJjcmVkZW50aWFscy5uaWNrbmFtZVwiIHJlcXVpcmVkPjwvaW9uLWlucHV0PlxuICAgICAgICAgICAgPC9pb24taXRlbT5cblxuICAgICAgICAgICAgPGlvbi1pdGVtPlxuICAgICAgICAgICAgICA8aW9uLWlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIG5hbWU9XCJlbWFpbFwiIFsobmdNb2RlbCldPVwiY3JlZGVudGlhbHMuZW1haWxcIiByZXF1aXJlZD48L2lvbi1pbnB1dD5cbiAgICAgICAgICAgIDwvaW9uLWl0ZW0+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxpb24taXRlbT5cbiAgICAgICAgICAgICAgPGlvbi1pbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCIgbmFtZT1cInBhc3N3b3JkXCIgWyhuZ01vZGVsKV09XCJjcmVkZW50aWFscy5wYXNzd29yZFwiIHJlcXVpcmVkPjwvaW9uLWlucHV0PlxuICAgICAgICAgICAgPC9pb24taXRlbT5cbiAgICAgICAgICAgIFxuICAgICAgICAgIDwvaW9uLWxpc3Q+XG4gICAgICAgIDwvaW9uLWNvbD5cbiAgICAgIDwvaW9uLXJvdz5cbiAgICAgIFxuICAgICAgPGlvbi1yb3c+XG4gICAgICAgIDxpb24tY29sIGNsYXNzPVwic2lnbnVwLWNvbFwiPlxuICAgICAgICAgIDxidXR0b24gaW9uLWJ1dHRvbiBjbGFzcz1cInN1Ym1pdC1idG5cIiBmdWxsIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIXJlZ2lzdGVyRm9ybS5mb3JtLnZhbGlkXCI+UmVnaXN0ZXI8L2J1dHRvbj5cbiAgICAgICAgPC9pb24tY29sPlxuICAgICAgPC9pb24tcm93PlxuICAgICAgXG4gICAgPC9mb3JtPlxuICA8L2Rpdj5cbjwvaW9uLWNvbnRlbnQ+IiwiPHBhZ2UtcmVnaXN0ZXI+PC9wYWdlLXJlZ2lzdGVyPiJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0tHO0lBQ0g7Z0JBQUE7Ozs7TUFBQTtRQUFBOztNQUFBOztJQUFBO0tBQUE7SUFBWTtJQUVWO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2dCQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7Ozs7SUFBQTtPQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBMkI7SUFDekI7Z0JBQUE7Ozs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O0lBQUE7S0FBQTtJQUFXO0lBQW9CO0lBQ3BCO0lBRUY7TUFFYjtRQUFBO1FBQUE7TUFBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTs7Ozs7Ozs7O01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOztJQUFBO0tBQUE7SUFBbUM7TUFDakM7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTtJQUEwQjtNQUN4QjtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQVM7SUFDUDtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7SUFBOEQ7SUFDdEQ7SUFDRjtNQUVWO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBdUI7TUFFckI7UUFBQTtRQUFBO01BQUE7SUFBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7TUFBQTtNQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTtNQUFNO1FBQUE7UUFBQTtNQUFBO01BQU47SUFBQTtnQkFBQTtrQkFBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtnQkFBQTtnQkFBQTtJQUFxRDtNQUNuRDtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQVM7TUFDUDtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO0lBQVM7TUFDUDtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBOzs7Ozs7O0lBQUE7S0FBQTtJQUFnQjtNQUVkO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7Ozs7O01BQUE7UUFBQTs7TUFBQTs7SUFBQTtLQUFBO2dCQUFBO2dCQUFBO2dCQUFBO2dCQUFBO0lBQVU7SUFDUjtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7T0FBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO01BQUE7TUFBQTtNQUE4RDtRQUFBO1FBQUE7TUFBQTtNQUE5RDtJQUFBO2tCQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7TUFBQTtJQUFBO2dCQUFBO01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2dCQUFBO2dCQUFBO2dCQUFBOzs7Ozs7O01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7SUFBc0g7SUFDN0c7TUFFWDtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBOzs7OztNQUFBO1FBQUE7O01BQUE7O0lBQUE7S0FBQTtnQkFBQTtnQkFBQTtnQkFBQTtnQkFBQTtJQUFVO0lBQ1I7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtNQUFBO01BQUE7TUFBd0Q7UUFBQTtRQUFBO01BQUE7TUFBeEQ7SUFBQTtrQkFBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO2dCQUFBO01BQUE7SUFBQTtnQkFBQTtNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtnQkFBQTtnQkFBQTtnQkFBQTs7Ozs7OztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7OztJQUFBO0tBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO0lBQTZHO0lBQ3BHO01BRVg7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTs7Ozs7TUFBQTtRQUFBOztNQUFBOztJQUFBO0tBQUE7Z0JBQUE7Z0JBQUE7Z0JBQUE7Z0JBQUE7SUFBVTtJQUNSO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtPQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7TUFBQTtNQUFBO01BQWtFO1FBQUE7UUFBQTtNQUFBO01BQWxFO0lBQUE7a0JBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTtNQUFBO0lBQUE7Z0JBQUE7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7Z0JBQUE7Z0JBQUE7Z0JBQUE7Ozs7Ozs7TUFBQTtRQUFBOztNQUFBOztNQUFBO1FBQUE7O01BQUE7O01BQUE7UUFBQTs7TUFBQTs7TUFBQTtRQUFBOztNQUFBOzs7SUFBQTtLQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7O01BQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtJQUEwSDtJQUNqSDtJQUVGO0lBQ0g7SUFDRjtNQUVWO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7SUFBUztNQUNQO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7SUFBNEI7SUFDMUI7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtPQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtnQkFBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOzs7OztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUErRjtJQUFpQjtJQUN4RztJQUNGO0lBRUw7SUFDSDs7OztJQTNDTTtJQUFaLFNBQVksU0FBWjtJQXFCNkc7SUFBakcsVUFBaUcsVUFBakc7SUFBOEM7SUFBZ0I7SUFBOUQsVUFBOEMsV0FBZ0IsVUFBOUQ7SUFBdUI7SUFBWjtJQUFYLFVBQXVCLFdBQVosVUFBWDtJQUl3RjtJQUF4RixVQUF3RixVQUF4RjtJQUEyQztJQUFhO0lBQXhELFVBQTJDLFdBQWEsVUFBeEQ7SUFBdUI7SUFBWjtJQUFYLFVBQXVCLFdBQVosVUFBWDtJQUlxRztJQUFyRyxVQUFxRyxVQUFyRztJQUFrRDtJQUFnQjtJQUFsRSxVQUFrRCxXQUFnQixVQUFsRTtJQUEyQjtJQUFoQjtJQUFYLFVBQTJCLFdBQWhCLFVBQVg7SUFTa0M7SUFBdEMsV0FBc0MsVUFBdEM7O0lBdENSO0lBQUE7SUFBQSxTQUFBLG1CQUFBO0lBTUY7SUFBQSxVQUFBLFNBQUE7SUFTSTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBLFVBQUEsc0VBQUE7SUFNVTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUEsVUFBQSxXQUFBLDRFQUFBO0lBSUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBLFVBQUEsV0FBQSw0RUFBQTtJQUlBO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtJQUFBO0lBQUE7SUFBQSxVQUFBLFdBQUEsNEVBQUE7SUFTcUQ7SUFBekQsV0FBeUQsVUFBekQ7Ozs7O0lDOUNWO2dCQUFBOzs7OztJQUFBO0tBQUE7Ozs7In0=
//# sourceMappingURL=register.ngfactory.js.map

/***/ })

},[474]);
//# sourceMappingURL=main.js.map