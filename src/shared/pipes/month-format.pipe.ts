import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthFormat'
})
export class MonthFormatPipe implements PipeTransform {

  /**
   * @description Formats Month Integer to String
   * USA style formatting
   * @author Manish Rai
   * @date 2020-08-12
   * @param {*} value
   * @param {...any[]} args
   * @returns {*}
   * @memberof MonthFormatPipe
   */
  transform(value: any, ...args: any[]): any {
    if (!value && value > 12) {
      return value;
    }
    const PaymentMonths = [
        'Jan',
        'Feb',
        'Mar',
        'APR',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
    return PaymentMonths[parseInt(value)]
  }

}
