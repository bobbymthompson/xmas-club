import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  list: [any];
  title: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.list = this.navParams.get('list');
    this.title = this.navParams.get('title');
  }

}
