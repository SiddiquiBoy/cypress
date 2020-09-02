import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NZInputValidationType } from 'src/app/modals/enums/nzinput-validation-type.enum';
import { Utils } from 'src/shared/utilities/utils';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { DateUtil } from 'src/shared/utilities/date-util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Tag } from 'src/app/modals/tag/tag';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { NgForm, ControlContainer } from '@angular/forms';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { BusinessunitAddService } from '../services/businessunit-add.service';
import { ChangeService } from 'src/shared/services/change/change.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';
import { Change } from 'src/app/modals/change/change';
import { User } from 'src/app/modals/user/user';

@Component({
  selector: 'app-bu-detail',
  templateUrl: './bu-detail.component.html',
  styleUrls: ['./bu-detail.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class BuDetailComponent implements OnInit {

  @ViewChild('buForm', null) buForm: NgForm;

  @Input() changedType: string;

  _businessUnit: BusinessUnit = new BusinessUnit();
  @Input() set businessUnit(businessUnit) {
    this._businessUnit = businessUnit;
    if (this._businessUnit.id) {
      this.editID = businessUnit.id
      this.businessUnitCopy = Utils.cloneDeep(this._businessUnit);
    }
  }

  get businessUnit() {
    return this._businessUnit;
  }


  _tags: Tag[] = [];
  @Input() set tags(tags: Tag[]) {
    this._tags = tags;
    if (tags && tags.length > 0) {
      if (this.businessUnit && this.businessUnit.id) {
        this.setSelectedTags();
      }
    } else {
      this.messageService.info(AppMessages.CREATE_TAG);
    }
  }

  get tags() {
    return this._tags;
  }

  buName$ = new Subject<string>();
  buEmail$ = new Subject<string>();
  buPhone$ = new Subject<string>();
  buNameValidationStatus: NZInputValidationType;
  buEmailValidationStatus: NZInputValidationType;
  buPhoneValidationStatus: NZInputValidationType;
  subscriptions: Subscription[] = [];
  statusDropdown: AppDropdown[] = [];
  changes: Change[] = [];
  orgId: string;
  dateFormat: string;
  isSpinning: boolean;
  editID: string;
  businessUnitCopy: BusinessUnit = new BusinessUnit();

  // placeholders

  businessUnitInternalNamePlaceholder: string;
  businessUnitOfficialNamePlaceholder: string;
  businessUnitTagsPlaceholder: string;
  businessUnitEmailPlaceholder: string;
  businessUnitPhoneNumberPlaceholder: string;
  businessUnitMinimumPostDatePlaceholder: string;
  businessUnitStatusPlaceholder: string;


  constructor(
    private messageService: MessageService,
    private businessunitAddService: BusinessunitAddService,
    // private changeService: ChangeService,
    private authenticationService: AuthenticationService,

  ) { }

  setPlaceholders() {
    this.businessUnitInternalNamePlaceholder = PlaceholderConstant.BUSINESS_UNIT_INTERNAL_NAME;
    this.businessUnitOfficialNamePlaceholder = PlaceholderConstant.BUSINESS_UNIT_OFFICIAL_NAME;
    this.businessUnitTagsPlaceholder = PlaceholderConstant.TAGS;
    this.businessUnitEmailPlaceholder = PlaceholderConstant.EMAIL;
    this.businessUnitPhoneNumberPlaceholder = PlaceholderConstant.PHONE_NUMBER;
    this.businessUnitMinimumPostDatePlaceholder = PlaceholderConstant.DATE;
    this.businessUnitStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  ngOnInit() {
    this.setPlaceholders();
    this.setOrgId();
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
    this.dateFormat = DateUtil.inputDefaultDateFormat;

    // Subcriptions for Email unique validation
    this.subscriptions.push(
      this.buEmail$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((buEmail: string) => {
          buEmail = (buEmail) ? buEmail.trim() : buEmail;

          if (buEmail) {
            if (this.editID && buEmail === this.businessUnitCopy.email) {
              this.buEmailValidationStatus = NZInputValidationType.success;
            } else {
              this.buEmailValidationStatus = NZInputValidationType.validating;
              this.checkBuEmailValidity(buEmail);
            }
          } else {
            this.buEmailValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );

    // Subcription for phone unique validation
    this.subscriptions.push(
      this.buPhone$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((buPhone: string) => {
          buPhone = (buPhone) ? buPhone.trim() : buPhone;
          if (buPhone) {
            buPhone = Utils.phoneRemoveSpecialChars(buPhone);
            if (this.editID && buPhone === this.businessUnitCopy.phone) {
              this.buPhoneValidationStatus = NZInputValidationType.success;
            } else {
              this.buPhoneValidationStatus = NZInputValidationType.validating;
              this.checkBuPhoneValidity(buPhone);
            }
          } else {
            this.buPhoneValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );

    // Subscription for unique name validation
    this.subscriptions.push(
      this.buName$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((buName: string) => {
          buName = (buName) ? buName.trim() : buName;
          if (buName) {
            if (this.editID && buName === this.businessUnitCopy.name) {
              this.buNameValidationStatus = NZInputValidationType.success;
            } else {
              this.buNameValidationStatus = NZInputValidationType.validating;
              this.checkBuNameValidity(buName);
            }
          } else {
            this.buNameValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );
  }



  setSelectedTags() {
    if (this.tags && this.tags.length > 0 && this.businessUnit.tags && this.businessUnit.tags.length > 0) {
      const tags = this.tags.filter(tag => this.businessUnit.tags.findIndex(t => t.id === tag.id) !== -1);
      if (tags && tags.length > 0) {
        this.businessUnit.tags = tags;
      }
    } else {
      // do nothing
    }
  }

  onBuNameInput(): void {
    this.buName$.next(this.businessUnit.name);
  }

  onBuEmailInput(): void {
    const validateEmail = Utils.validateEmail(this.businessUnit.email);
    if (validateEmail) {
      this.buEmail$.next(this.businessUnit.email);
    } else {
      this.buEmail$.next('');
    }
  }
  onBuPhoneInput(): void {
    const phone = this.businessUnit.phone;
    if (phone.length > 13) {
      this.buPhone$.next(phone.replace(/[^a-zA-Z0-9]/g, ''));
    } else {
      this.buPhone$.next('');
    }
  }

  checkBuNameValidity(name: string) {
    this.subscriptions.push(
      this.businessunitAddService.checkIfEmailPhoneAndNameExist(this.orgId, name, null, null).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfBusinessUnitTaken) {
            this.buNameValidationStatus = NZInputValidationType.error;
          } else {
            this.buNameValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.buNameValidationStatus = NZInputValidationType.error;
        })
    );
  }


  checkBuEmailValidity(email: string) {
    this.subscriptions.push(
      this.businessunitAddService.checkIfEmailPhoneAndNameExist(this.orgId, null, email, null).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfBusinessUnitTaken) {
            this.buEmailValidationStatus = NZInputValidationType.error;
          } else {
            this.buEmailValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.buEmailValidationStatus = NZInputValidationType.error;
        })
    );
  }
  checkBuPhoneValidity(phone: string) {
    this.subscriptions.push(
      this.businessunitAddService.checkIfEmailPhoneAndNameExist(this.orgId, null, null, phone).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfBusinessUnitTaken) {
            this.buPhoneValidationStatus = NZInputValidationType.error;
          } else {
            this.buPhoneValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.buPhoneValidationStatus = NZInputValidationType.error;
        })
    );
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        if (user && user.organization) {
          this.orgId = user.organization.id;
        } else {
          this.orgId = undefined;
        }
      })
    );
  }
}
