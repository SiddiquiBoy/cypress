import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {

  /**
   * @description Formats 9999999999 to (999) 999-9999
   * USA style formatting
   * @author Aman Purohit
   * @date 2020-06-09
   * @param {*} value
   * @param {...any[]} args
   * @returns {*}
   * @memberof PhoneFormatPipe
   */
  transform(value: any, ...args: any[]): any {
    if (!value) {
      return value;
    }
    return value
    .replace(/\D/g, '')
    .replace(/(\d{1,3})(\d{1,3})?(\d{1,4})?/g, (txt, f, s, t) => {
      if (t) {
        return `(${f}) ${s}-${t}`;
      } else if (s) {
        return `(${f}) ${s}`;
      } else if (f) {
        return `(${f})`;
      }
    });
  }

}
