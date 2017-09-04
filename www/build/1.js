webpackJsonp([1],{

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
const weeks_1 = __webpack_require__(778);
let WeeksModule = class WeeksModule {
};
WeeksModule = __decorate([
    core_1.NgModule({
        declarations: [
            weeks_1.WeeksPage,
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(weeks_1.WeeksPage),
        ],
        exports: [
            weeks_1.WeeksPage
        ]
    })
], WeeksModule);
exports.WeeksModule = WeeksModule;
//# sourceMappingURL=weeks.module.js.map

/***/ }),

/***/ 778:
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
const xmas_club_provider_1 = __webpack_require__(450);
let WeeksPage = class WeeksPage {
    constructor(navCtrl, navParams, dataProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
    }
    ionViewDidLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            this.weeks = yield this.dataProvider.getWeeks();
        });
    }
    viewWeek(week) {
        this.navCtrl.push('WeekPage', { week: week.week });
    }
};
WeeksPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-weeks',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\weeks\weeks.html"*/'<!--\n  Generated template for the Weeks page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="header">\n    <ion-title>Weeks</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n  <ion-list>\n    <ion-item no-lines class="bottom-border" *ngFor="let week of weeks" detail-push (click)="viewWeek(week)">\n      <h2>Week {{week.week}}</h2>\n    </ion-item>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\weeks\weeks.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController, ionic_angular_1.NavParams, xmas_club_provider_1.XmasClubDataProvider])
], WeeksPage);
exports.WeeksPage = WeeksPage;
//# sourceMappingURL=weeks.js.map

/***/ })

});
//# sourceMappingURL=1.js.map