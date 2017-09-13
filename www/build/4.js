webpackJsonp([4],{

/***/ 771:
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
const profile_1 = __webpack_require__(779);
let ProfilePageModule = class ProfilePageModule {
};
ProfilePageModule = __decorate([
    core_1.NgModule({
        declarations: [
            profile_1.ProfilePage,
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(profile_1.ProfilePage),
        ],
        exports: [
            profile_1.ProfilePage
        ]
    })
], ProfilePageModule);
exports.ProfilePageModule = ProfilePageModule;
//# sourceMappingURL=profile.module.js.map

/***/ }),

/***/ 779:
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
const scorecards_provider_1 = __webpack_require__(146);
const xmas_club_provider_1 = __webpack_require__(451);
const auth_provider_1 = __webpack_require__(63);
const login_1 = __webpack_require__(452);
let ProfilePage = class ProfilePage {
    constructor(navCtrl, navParams, scorecardsProvider, dataProvider, authProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.scorecardsProvider = scorecardsProvider;
        this.dataProvider = dataProvider;
        this.authProvider = authProvider;
    }
    ionViewDidLoad() {
        if (!this.authProvider.isAuthenticated) {
            this.navCtrl.push(login_1.LoginPage);
        }
        else {
            console.log('Loading Profile page');
        }
    }
    login() {
        this.navCtrl.push(login_1.LoginPage);
    }
    logout() {
        this.authProvider.logoutUser();
        this.navCtrl.parent.select(0);
    }
};
ProfilePage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-profile',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\profile\profile.html"*/'\n<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Profile</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <button *ngIf="!this.authProvider?.isAuthenticated" ion-button full outline (click)="login()">Please login to access your profile</button>\n\n  <button *ngIf="this.authProvider?.isAuthenticated" ion-button full outline (click)="logout()">Logout</button> \n\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\profile\profile.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController,
        ionic_angular_1.NavParams,
        scorecards_provider_1.ScorecardsProvider,
        xmas_club_provider_1.XmasClubDataProvider,
        auth_provider_1.AuthProvider])
], ProfilePage);
exports.ProfilePage = ProfilePage;
//# sourceMappingURL=profile.js.map

/***/ })

});
//# sourceMappingURL=4.js.map