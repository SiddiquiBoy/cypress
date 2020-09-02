import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomeValidationService {

  constructor() { }

  /**
   * @description returns false if phone numbers match
   * @author Aman Purohit
   * @date 2020-07-17
   * @param {string} officePhone
   * @param {string} homePhone
   * @returns
   * @memberof CustomeValidationService
   */
  matchPhoneNumber(officePhone: string, homePhone: string, checkForEquality: boolean) {
    return (formGroup: FormGroup) => {
      const officePhoneControl = formGroup.controls[officePhone];
      const homePhoneControl = formGroup.controls[homePhone];

      if (!officePhoneControl || !homePhoneControl) {
        return null;
      }

      if (homePhoneControl.errors && !homePhoneControl.errors.phoneMatch) {
        return null;
      }

      if (officePhoneControl.value === homePhoneControl.value) {
        if (checkForEquality) {
          homePhoneControl.setErrors({ phoneMatch: true });
        } else {
          homePhoneControl.setErrors(null);
        }
      } else {
        if (checkForEquality) {
          homePhoneControl.setErrors(null);
        } else {
          homePhoneControl.setErrors({ phoneMatch: true });
        }
      }
    }
  }
}
