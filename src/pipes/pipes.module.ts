import { NgModule } from '@angular/core';
import { ReverseArrayPipe } from './reverse-array/reverse-array';
import { SortArrayDescPipe } from './sort-array-desc/sort-array-desc';
@NgModule({
	declarations: [ReverseArrayPipe, SortArrayDescPipe],
	imports: [],
	exports: [ReverseArrayPipe, SortArrayDescPipe]
})
export class PipesModule {}
