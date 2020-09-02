import * as _ from 'lodash';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import * as countryList from 'src/shared/constants/countries/countries';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { SortUtil } from './sort-util';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { PaginationConstant } from '../constants/pagination-constants/pagination-constant';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Change } from 'src/app/modals/change/change';
import { Router } from '@angular/router';

/**
 * @description general Utility class
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class Utils
 */
export class Utils {

  constructor() { }

  static nameRegex = /^[A-Za-z\'\s\.\,]+$/;

  static phoneRegex = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/;

  static emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  static zipcodeRegex = /^\d{5}$/;

  static passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  static decimalNumberRegex = /^(\d*\.)?\d+$/;

  static priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Pattern for only upto 2 decimal places

  static urlRegex = /https?:\/\/.+/;

  // Check for null Object
  static isObject(val) {
    if (val === null) {
      return false;
    }
    return ((typeof val === 'function') || (typeof val === 'object'));
  }

  // Parse JSON string
  static parseJSON(data) {
    data = data || '';
    return JSON.parse(data);
  }

  // Check empty object
  static checkEmptyObject(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  // Check if the string is empty or null
  static checkNotNullAndNotEmpty(data) {
    if (data !== null && data !== '') {
      return true;
    }
    return false;
  }

  // Check if the variable is undefined
  static isUndefined(data) {
    if (data === 'undefined') {
      return true;
    }
    return false;
  }

  // String.toLowerCase()
  static lowerCase(str) {
    return str.toLowerCase();
  }

  // String.toUpperCase()
  static upperCase(str) {
    return str.toUpperCase();
  }

  /**
   * @description to deep clone an object
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {*} value
   * @returns
   * @memberof Utils
   */
  static cloneDeep(value: any) {
    return _.cloneDeep(value);
  }

  /**
   * @description to set an item in local storage
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {string} key
   * @param {*} value
   * @memberof Utils
   */
  static setItemInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * @description to get an iten from local storage
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {string} key
   * @returns
   * @memberof Utils
   */
  static getItemFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * @description to remove an item from local storage
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {string} key
   * @memberof Utils
   */
  static removeItemFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  static setItemInSessionStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static getItemFromSessionStorage(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  static removeItemFromSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  /**
   * @description check email validation
   * @author Rajeev Kumar
   * @date 2020-07-23
   * @static
   * @param {*} email
   * @returns
   * @memberof Utils
   */
  static validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  /**
   * @description
   * @author Rajeev Kumar
   * @date 2020-05-05
   * @static
   * @param {*} e
   * @memberof Utils
   */

  static usPhoneFormat(e) {
    const val = e.target.value;
    e.target.value = val
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

  /**
   * @description creates a menu item
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @static
   * @param {string} label
   * @param {string} icon
   * @param {string} route
   * @returns {MenuItem}
   * @memberof Utils
   */
  static createMenuItem(label: string, icon: string, route: string, disabled?: boolean): MenuItem {
    const innerMenuItem: MenuItem = new MenuItem();
    if (label) {
      innerMenuItem.label = label;
    } else {
      // do nothing
    }
    if (icon) {
      innerMenuItem.icon = icon;
    } else {
      // do nothing
    }
    if (route) {
      innerMenuItem.routeTo = route;
    } else {
      // do nothing
    }
    innerMenuItem.disabled = disabled;
    return innerMenuItem;
  }


  static alphaOnlyWithoutSpace(evt) {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  static alphaOnlyWithSpace(e) {
    if (e.which === 32 && !e.target.value.length) {
      e.preventDefault();
    }
    const inputValue = e.charCode;
    if (!(inputValue >= 65 && inputValue <= 122) && (inputValue != 32 && inputValue != 0)) {
      e.preventDefault();
    }
  }

  static ValidateOnlyAlphabets(event) {
    if ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode == 0)) {
      return true;
    } else event.preventDefault();
  }

  static ValidateNumberButNotStartingWithZero(event) {
    if (event.key != "Tab") {
      const pattern = new RegExp("[0-9]");
      if (event.type == 'paste') {
        let data = event.clipboardData.getData('text');
        if (!(/^[1-9]\d+$/.test(data))) {
          event.preventDefault();
        }
      }
      else {
        let inputChar = String.fromCharCode(event.charCode);
        if (event.target.value == "" && inputChar == '0') {
          event.preventDefault();
        }
        else if (event.keyCode != 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
      }
    } else {
      event.preventDefault();
      const inputs =
        Array.prototype.slice.call(document.querySelectorAll("input"));
      const index =
        (inputs.indexOf(document.activeElement) + 1) % inputs.length;
      const input = inputs[index];
      input.focus();
      input.select();
    }

  }

  static ValidateOnlyNumbers(event) {
    if (event.charCode > 47 && event.charCode < 58 || (event.charCode === 0)) {
      return true;
    } else {
      event.preventDefault();
    }
  }
  /**
   * @description to check if a color code is a valid hex code
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @static
   * @param {string} colorCode
   * @returns {boolean}
   * @memberof Utils
   */
  static isValidHexColorCode(colorCode: string): boolean {
    const style = new Option().style;
    style.color = colorCode;
    return (style.color !== '');
  }

  /**
   * @description create a dropdown from an enum
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @static
   * @param {*} enumType
   * @param {boolean} [allRequired=true]
   * @param {boolean} [titleCase=false]
   * @returns
   * @memberof Utils
   */
  static createDropdown(enumType, allRequired = true, titleCase = false, isFilterDropdown = false) {
    const dropdown: any[] = [];
    if (!isFilterDropdown) {
      if (allRequired) {
        dropdown.push({ label: 'ALL', value: 'All' });
      }
      Object.keys(enumType).forEach((key) => {
        // dropdown.push({ label: enumType[key], value: key });
        if (enumType[key] instanceof Object) {
          dropdown.push({ label: Object.keys(enumType[key]), value: enumType[key][Object.keys(enumType[key])[0]] });
        } else {
          dropdown.push({ label: key, value: enumType[key] });
        }
      });
      if (titleCase) {
        for (const item of dropdown.values()) {
          item.value = new TitleCasePipe().transform(item.value);
        }
      }
    } else {
      if (allRequired) {
        dropdown.push({ text: 'ALL', value: 'All' });
      }
      Object.keys(enumType).forEach((key) => {
        // dropdown.push({ text: enumType[key], value: key });
        if (enumType[key] instanceof Object) {
          dropdown.push({ text: Object.keys(enumType[key]), value: enumType[key][Object.keys(enumType[key])[0]] });
        } else {
          dropdown.push({ text: key, value: enumType[key] });
        }
      });
      if (titleCase) {
        for (const item of dropdown.values()) {
          item.value = new TitleCasePipe().transform(item.value);
        }
      }
    }
    return dropdown;
  }

  static showDropdownPropAsTitleCase(dropdown: any[], property: string) {
    dropdown.forEach((item) => {
      if (property && item[property]) {
        item[property] = new TitleCasePipe().transform(item[property].toLowerCase());
      }
    });
    return dropdown;
  }

  static createDropdownForNewEnum(enumType, allRequired = true, titleCase = false, uppercase = false, isFilterDropdown = false) {
    const dropdown: any[] = [];
    if (!isFilterDropdown) {
      if (allRequired) {
        dropdown.push({ label: 'ALL', value: 'All' });
      }
      Object.keys(enumType).forEach((key) => {
        // dropdown.push({ label: enumType[key], value: key });
        if (enumType[key] instanceof Object) {
          // dropdown.push({ label: Object.keys(enumType[key]), value: enumType[key][Object.keys(enumType[key])[0]] });
          dropdown.push({ label: enumType[key][Object.keys(enumType[key])[0]], value: Object.keys(enumType[key]) });
        } else {
          dropdown.push({ label: enumType[key], value: key });
        }
      });
      if (titleCase) {
        for (const item of dropdown.values()) {
          item.key = new TitleCasePipe().transform(item.key);
        }
      }
      if (uppercase) {
        for (const item of dropdown.values()) {
          item.key = new UpperCasePipe().transform(item.key);
        }
      }
    } else {
      if (allRequired) {
        dropdown.push({ text: 'all', value: 'All' });
      }
      Object.keys(enumType).forEach((key) => {
        // dropdown.push({ text: enumType[key], value: key });
        if (enumType[key] instanceof Object) {
          // dropdown.push({ text: Object.keys(enumType[key]), value: enumType[key][Object.keys(enumType[key])[0]] });
          dropdown.push({ text: enumType[key][Object.keys(enumType[key])[0]], value: Object.keys(enumType[key]) });
        } else {
          dropdown.push({ text: enumType[key], value: key });
        }
      });
      if (titleCase) {
        for (const item of dropdown.values()) {
          item.text = new TitleCasePipe().transform(item.text);
        }
      }
      if (uppercase) {
        for (const item of dropdown.values()) {
          item.text = new UpperCasePipe().transform(item.text);
        }
      }
    }
    return dropdown;
  }

  /**
   * @description to get key of an enum whose value mathces value
   * @author Pulkit Bansal
   * @date 2020-06-10
   * @static
   * @param {*} enumType
   * @param {string} value
   * @returns {string}
   * @memberof Utils
   */
  static getEnumKey(enumType: any, value: string): string {
    const keys = Object.keys(enumType);
    let foundKey: string;
    keys.forEach((key) => {
      if (enumType[key].toLowerCase() === value.toLowerCase()) {
        foundKey = key;
      }
    });
    return foundKey;
  }

  /**
   * @description to get a label of a dropdown whose value matches the value
   * @author Pulkit Bansal
   * @date 2020-06-10
   * @static
   * @param {AppDropdown[]} dropdown
   * @param {string} value
   * @returns {string}
   * @memberof Utils
   */
  static getDropdownLabel(dropdown: AppDropdown[], value: string): string {
    let foundLabel: string;
    if (dropdown && dropdown.values()) {
      for (const item of dropdown.values()) {
        if (item.value.toLowerCase() === value.toLowerCase()) {
          foundLabel = item.label;
        }
      }
    } else {
      // do nothing
    }
    return foundLabel;
  }

  static capitalizeInputs(e: any) {
    if (e && e.target && e.target.value) {
      e.target.value = new TitleCasePipe().transform(e.target.value);
    }
  }

  static phoneRemoveSpecialChars(phoneNumber: string) {
    if (!phoneNumber) {
      return phoneNumber;
    }
    return phoneNumber.replace(/[^0-9]/g, '');
  }

  static getCountries() {
    let countries: Country[] = [];
    countryList.countries.forEach((cntry) => {
      const country: Country = new Country();
      country.name = cntry.country;
      country.states = [];
      cntry.states.forEach((st) => {
        const state: State = new State();
        state.name = st;
        country.states.push(state);
      });
      country.states = SortUtil.sortArrayWithCombinedField(country.states, ['name']);
      countries.push(country);
    });
    countries = SortUtil.sortArrayWithCombinedField(countries, ['name']);
    return countries;
  }

  static convertToNumber(value: string | number) {
    if (value) {
      value = Number(value);
      if (isNaN(value)) {
        return 0;
      } else {
        return value;
      }
    } else {
      return 0;
    }
  }

  static createListPaginationObject() {
    const paginationData: PaginationData = {
      page: 1,
      size: PaginationConstant.LIST_SIZE
    };
    return paginationData;
  }

  static createListFilterDataForActiveStatus() {
    const filterData: FilterData[] = [];
    const filter: FilterData = {
      field: 'status',
      op: FilterOp.in,
      value: [this.getEnumKey(GeneralStatus, GeneralStatus.active)]
    };
    filterData.push(filter);
    return filterData;
  }

  static isEqual(obj1: any, obj2: any) {
    return _.isEqual(obj1, obj2);
  }

  static createIndexToChangesMapFromChanges(changes: Change[]): Map<number, Change[]> {
    const indexToChanges: Map<number, Change[]> = new Map();
    changes.forEach((change, index) => {
      const ind = this.getIndexFromChange(change);
      if (ind !== -1) {
        if (indexToChanges.has(ind)) {
          indexToChanges.set(ind, [...indexToChanges.get(ind), change]);
        } else {
          indexToChanges.set(ind, [change]);
        }
      } else {
        // do nothing
      }
    });
    return indexToChanges;
  }

  static getIndexFromChange(change: Change): number {
    let index = -1;
    const splitArray = change.fieldName.split('/');
    if (splitArray && splitArray.length > 1) {
      const resplittedArray = splitArray[1].split('.');
      if (resplittedArray && resplittedArray.length > 0) {
        index = + resplittedArray[0];
      } else {
        // do nothing
      }
    } else {
      // do nothing
    }
    return index;
  }

  static hasSingleItem(array: Array<any>): boolean {
    if (array && array.length === 1) {
      return true;
    } else {
      return false;
    }
  }

}
