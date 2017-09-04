import { SortArrayDescPipe } from '../../pipes/sort-array-desc/sort-array-desc';
import { ReverseArrayPipe } from '../../pipes/reverse-array/reverse-array';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaderboardPage } from './leaderboard';

@NgModule({
  declarations: [
    LeaderboardPage,
    ReverseArrayPipe,
    SortArrayDescPipe
  ],
  imports: [
    IonicPageModule.forChild(LeaderboardPage),
  ],
  exports: [
    LeaderboardPage
  ]
})
export class LeaderboardModule {}
