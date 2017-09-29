webpackJsonp([6],{

/***/ 770:
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
const list_1 = __webpack_require__(779);
let ListPageModule = class ListPageModule {
};
ListPageModule = __decorate([
    core_1.NgModule({
        declarations: [
            list_1.ListPage,
        ],
        imports: [
            ionic_angular_1.IonicPageModule.forChild(list_1.ListPage),
        ],
        exports: [
            list_1.ListPage
        ]
    })
], ListPageModule);
exports.ListPageModule = ListPageModule;
//# sourceMappingURL=list.module.js.map

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
let ListPage = class ListPage {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.list = this.navParams.get('list');
        this.title = this.navParams.get('title');
    }
};
ListPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-list',template:/*ion-inline-start:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\list\list.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>{{title}}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n  <ion-list>\n    <ion-item no-lines class="bottom-border" *ngFor="let item of list">\n      <h2>{{item}}</h2>\n    </ion-item>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\bobby\Source\xmas-club\xmas-club\src\pages\list\list.html"*/,
    }),
    __metadata("design:paramtypes", [ionic_angular_1.NavController, ionic_angular_1.NavParams])
], ListPage);
exports.ListPage = ListPage;
//# sourceMappingURL=list.js.map

/***/ })

});
//# sourceMappingURL=6.js.map