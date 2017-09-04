import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortdesc',
})
export class SortArrayDescPipe implements PipeTransform {
  
  transform(values: [any], ...args) {
    if (values) {
      return values.sort((a, b) => { return b.total - a.total });
    } else {
      return values;
    }
  }
}
