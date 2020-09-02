import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';
import { CustomeValidationService } from 'src/shared/services/custom-validation/custome-validation.service';

@Directive({
  selector: '[appMatchFields]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MatchFieldsDirective, multi: true }]
})
export class MatchFieldsDirective implements Validator {

  @Input('appMatchFields') MatchFields: string[] = [];
  @Input() checkForEquality = true;

  constructor(
    private customeValidator: CustomeValidationService,
  ) { }

  validate(formGroup: FormGroup): ValidationErrors {
    return this.customeValidator.matchPhoneNumber(this.MatchFields[0], this.MatchFields[1], this.checkForEquality)(formGroup);
  }

}
