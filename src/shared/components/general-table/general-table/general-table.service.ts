import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralTableService {

  constructor() { }

  /**
   * @author Aman Purohit
   * @description Pick all keys which are true and insert them
   * into an array
   * @param {{}} rowsObj
   * @returns {string[]}
   * @memberof GeneralTableService
   */
  returnSelectedRows(rowsObj: {}): string[] {
    const selectedRows: any[] = [];
    for (const key in rowsObj) {
      if (rowsObj[key] === true) {
        selectedRows.push(key);
      }
    }
    return selectedRows;
  }
}
