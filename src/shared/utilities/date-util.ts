/**
 * @description a utility class for date
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class DateUtil
 */
export class DateUtil {

  /**
   * @description default date format
   * @static
   * @memberof DateUtil
   */
  static defaultDateFormat = 'MMM d, y';

  /**
   * @description default date format for calendars
   * @static
   * @memberof DateUtil
   */
  static inputDefaultDateFormat = 'MM/dd/yyyy';

  /**
   * @description months in a year
   * @static
   * @memberof DateUtil
   */
  static months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  /**
   * @description to get the current date
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @returns {Date}
   * @memberof DateUtil
   */
  static getCurrentDate(): Date {
    return new Date();
  }

  /**
   * @description to set any date to the beginning of the day
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {Date} date
   * @returns {Date}
   * @memberof DateUtil
   */
  static setToBeginning(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  }

  /**
   * @description to set any date to the end of the day
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {Date} date
   * @returns {Date}
   * @memberof DateUtil
   */
  static setToEnd(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(23);
    newDate.setMinutes(59);
    newDate.setSeconds(59);
    newDate.setMilliseconds(0);
    return newDate;
  }

  /**
   * @description to calculate the no of days between two dates
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {boolean} [includeFirst]
   * @returns {number}
   * @memberof DateUtil
   */
  static calculateDays(startDate: Date, endDate: Date, includeFirst?: boolean): number {
    const date1 = new Date(this.setToBeginning(startDate));
    const date2 = new Date(this.setToBeginning(endDate));
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    let diffDays: number;
    if (includeFirst === false) {
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    }
    return Number(diffDays);
  }

  /**
   * @description to extend a date by {days} days
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {Date} date
   * @param {number} days
   * @returns {Date}
   * @memberof DateUtil
   */
  static extendDate(date: Date, days: number): Date {
    let extendedDate = new Date();
    extendedDate = new Date(new Date(date).getTime() + (days * 86400000));
    return extendedDate;
  }

  /**
   * @description to get millisecs from days
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {number} days
   * @returns {number}
   * @memberof DateUtil
   */
  static getMilSecFromDays(days: number): number {
    return (days * 24 * 60 * 60 * 1000);
  }

  /**
   * @description to get date from millisecs
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {number} milSec
   * @returns {Date}
   * @memberof DateUtil
   */
  static getDateFromMillSec(milSec: number): Date {
    return new Date(milSec);
  }

  /**
   * @description to get millisecs from date
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {Date} date
   * @returns {number}
   * @memberof DateUtil
   */
  static getMillSecFromDate(date: Date): number {
    return new Date(date).getMilliseconds();
  }

  /**
   * @description to format the date
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {Date} date
   * @param {string} format
   * @param {string} [separator]
   * @returns {string}
   * @memberof DateUtil
   */
  static formatDate(date: Date, format: string, separator?: string): string {
    const d: Date = new Date(date);
    const dYear: number = d.getFullYear();
    const dMonth: number = d.getMonth();
    const dDate: number = d.getDate();
    let newDate: string;
    switch (format.toLowerCase()) {
      case 'ddmmmyy': {
        newDate = dDate + (separator ? separator : ' ') + this.months[dMonth] + (separator ? separator : ', ') + dYear;
        break;
      }
      case 'ddmyy': {
        newDate = dDate + (separator ? separator : ' ') +
          this.months[dMonth].substring(0, 3) + (separator ? separator : ', ') + dYear;
        break;
      }
      case 'ddmmyy': {
        newDate = dDate + (separator ? separator : ' ') + this.months[dMonth] + (separator ? separator : ', ') + dYear;
        break;
      }
      default: {
        newDate = dDate + (separator ? separator : ' ') + this.months[dMonth] + (separator ? separator : ', ') + dYear;
      }
    }
    return newDate;
  }

  /**
   * @description to append 0's before a value
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {(number | string)} value
   * @param {number} totalDigits --> total no of digits req in the value
   * @returns {string}
   * @memberof DateUtil
   */
  static appendZerosBeforeValue(value: number | string, totalDigits: number): string {
    let newValue: string = String(value);
    while (newValue.length < totalDigits) {
      newValue = '0' + newValue;
    }
    return newValue;
  }

  /**
   * @description to get the formatted time from date
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {Date} date
   * @param {boolean} [showSecs=false]
   * @param {boolean} [showMilliSecs=false]
   * @param {boolean} showAmPm
   * @param {boolean} [lowerCase=true]
   * @returns {string}
   * @memberof DateUtil
   */
  static getFormattedTimeFromDate(date: Date, showSecs = false, showMilliSecs = false, showAmPm: boolean, lowerCase = true): string {
    const d = new Date(date);
    let hrs = this.appendZerosBeforeValue(d.getHours(), 2);
    const mins = this.appendZerosBeforeValue(d.getMinutes(), 2);
    const secs = this.appendZerosBeforeValue(d.getSeconds(), 2);
    const millisecs = this.appendZerosBeforeValue(d.getMilliseconds(), 4);
    if (showAmPm) {
      const ampm = Number(hrs) >= 12 ? (!lowerCase) ? 'PM' : 'pm' : (!lowerCase) ? 'AM' : 'am';
      hrs = (Number(hrs) <= 12) ? hrs : String(Number(hrs) % 12);
      return hrs + ':' + mins + (showSecs ? (':' + secs + (showMilliSecs ? (':' + millisecs) : '')) : '') + ' ' + ampm;
    } else {
      return hrs + ':' + mins + (showSecs ? (':' + secs + (showMilliSecs ? (':' + millisecs) : '')) : '');
    }
  }

  /**
   * @description to get the formatted time from time string
   * @author Pulkit Bansal
   * @date 2020-07-01
   * @static
   * @param {string} time
   * @param {boolean} [showSecs=false]
   * @param {boolean} [showAmPm=true]
   * @param {boolean} [lowerCase=true]
   * @returns {string}
   * @memberof DateUtil
   */
  static getFormattedTimeFromTimeString(time: string, showSecs = false, showAmPm = true, lowerCase = true): string {
    const splittedTime = time ? time.split(':') : null;
    if (splittedTime && splittedTime.length > 0) {
      let hrs = (splittedTime[0] !== undefined && splittedTime[0] !== null) ? this.appendZerosBeforeValue(splittedTime[0], 2) : '00';
      const mins = (splittedTime[1] !== undefined && splittedTime[1] !== null) ? this.appendZerosBeforeValue(splittedTime[1], 2) : '00';
      const secs = (splittedTime[2] !== undefined && splittedTime[2] !== null) ? this.appendZerosBeforeValue(splittedTime[2], 2) : '00';
      if (showAmPm) {
        const ampm = Number(hrs) >= 12 ? (!lowerCase) ? 'PM' : 'pm' : (!lowerCase) ? 'AM' : 'am';
        hrs = (Number(hrs) <= 12) ? hrs : String(Number(hrs) % 12);
        return hrs + ':' + mins + (showSecs ? (':' + secs) : '') + ' ' + ampm;
      } else {
        return hrs + ':' + mins + (showSecs ? (':' + secs) : '');
      }
    } else {
      return time;
    }
  }

  /**
   * @description when value can be either date or formatted time
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @static
   * @param {*} value
   * @param {boolean} [showSecs=false]
   * @param {boolean} [showMilliSecs=false]
   * @param {boolean} showAmPm
   * @param {boolean} [lowerCase=true]
   * @returns {string}
   * @memberof DateUtil
   */
  static getFormattedTime(value: any, showSecs = false, showMilliSecs = false, showAmPm: boolean, lowerCase = true): string {
    if (value instanceof Date && !isNaN(value.getTime())) {
      return this.getFormattedTimeFromDate(value, showSecs, showMilliSecs, showAmPm, lowerCase);
    } else {
      return this.getFormattedTimeFromTimeString(value, showSecs, showAmPm, lowerCase);
    }
  }

}

