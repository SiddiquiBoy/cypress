import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatString'
})
export class FormatStringPipe implements PipeTransform {
/**
 * @author Aman Purohit
 * @description Method to replace underscore(_) with
 * empty space
 *
 * @param {string} value
 * @param {...any[]} args
 * @returns {string}
 * @memberof FormatStringPipe
 */
transform(value: string, ...args: any[]): string {
    return value.replace(/_/g, ' ');
  }

}
