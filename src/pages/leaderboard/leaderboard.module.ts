import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaderboardPage } from './leaderboard';

@NgModule({
  declarations: [
    LeaderboardPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaderboardPage),
  ],
  exports: [
    LeaderboardPage
  ]
})
export class LeaderboardModule {}
