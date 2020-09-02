import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterCapital'
})
export class FirstLetterCapitalPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value && value.length > 0) {
      return (String(value).charAt(0).toUpperCase() + String(value).substring(1));
    } else {
      return value;
    }
    // return value.split(' ').map(word => {
    //   return word.length > 0 ? word[0].toUpperCase() + word.substr(1) : word;
    // }).join(' ');
  }
}

