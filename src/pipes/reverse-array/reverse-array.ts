import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
})
export class ReverseArrayPipe implements PipeTransform {

  transform(values, ...args) {
    if (values) {
      return values.reverse();
    }
    return values;
  }
}
