import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeeksPage } from './weeks';

@NgModule({
  declarations: [
    WeeksPage,
  ],
  imports: [
    IonicPageModule.forChild(WeeksPage),
  ],
  exports: [
    WeeksPage
  ]
})
export class WeeksModule {}
