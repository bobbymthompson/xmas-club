import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeeklyLeaderboardPage } from './weekly-leaderboard';

@NgModule({
  declarations: [
    WeeklyLeaderboardPage,
  ],
  imports: [
    IonicPageModule.forChild(WeeklyLeaderboardPage),
  ],
  exports: [
    WeeklyLeaderboardPage
  ]
})
export class WeeklyLeaderboardPageModule {}
