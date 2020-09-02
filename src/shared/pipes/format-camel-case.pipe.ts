import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCamelCase'
})
export class FormatCamelCasePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return value;
    }
    return value.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  }

}
