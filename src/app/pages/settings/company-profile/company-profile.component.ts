import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Change } from 'src/app/modals/change/change';
import { Company } from 'src/app/modals/company/company';
import { Country } from 'src/app/modals/country/country';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { State } from 'src/app/modals/state/state';
import { User } from 'src/app/modals/user/user';
import { PhoneFormatPipe } from 'src/shared/pipes/phone-format.pipe';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ChangeService } from 'src/shared/services/change/change.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { CompanyProfileService } from './services/company-profile.service';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyProfileComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  company: Company;
  countries: Country[] = [];
  states: State[] = [];
  description: string;

  cityNameRegex: RegExp;
  phoneRegex: RegExp;
  zipcodeRegex: RegExp;

  isSpinning = false;
  isImageUpdated = false;
  imageLoading = false;

  changes: Change[] = [];
  changedType: string;

  // placeholders
  companyNamePlaceholder: string;
  companyAddressPlaceholder: string;
  companyCountryPlaceholder: string;
  companyStatePlaceholder: string;
  companyCityPlaceholder: string;
  companyZipCodePlaceholder: string;
  companyPhoneNumberPlaceholder: string;

  constructor(
    private companyProfileService: CompanyProfileService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private phoneFormatPipe: PhoneFormatPipe,
    private changeService: ChangeService,
  ) {
  }

  ngOnInit() {
    this.setPlaceholders();
    this.setDescription();
    this.getCurrentUser();
    this.setRegexps();
    this.setDropdowns();
    this.setChangedType();
  }

  setPlaceholders() {
    this.companyNamePlaceholder = PlaceholderConstant.COMPANY_NAME;
    this.companyAddressPlaceholder = PlaceholderConstant.ADDRESS;
    this.companyCountryPlaceholder = PlaceholderConstant.COUNTRY;
    this.companyStatePlaceholder = PlaceholderConstant.STATE;
    this.companyCityPlaceholder = PlaceholderConstant.CITY;
    this.companyZipCodePlaceholder = PlaceholderConstant.ZIP_CODE;
    this.companyPhoneNumberPlaceholder = PlaceholderConstant.PHONE_NUMBER;
  }

  setDescription() {
    this.description = 'Provide all details about your company';
  }

  setDropdowns() {
    this.setCountriesDropdown();
  }

  setRegexps() {
    this.phoneRegex = Utils.phoneRegex;
    this.cityNameRegex = Utils.nameRegex;
    this.zipcodeRegex = Utils.zipcodeRegex;
  }

  setChangedType() {
    this.changedType = this.getChangedType();
  }

  setCountriesDropdown() {
    this.countries = Utils.getCountries();
    this.setSelectedCountry();
  }

  setSelectedCountry() {
    // if (this.company && this.company.country) {
    //   const cntry = this.countries.filter(country => country.name === this.company.country)[0];
    //   if (cntry) {
    //     this.company.country = cntry.name;
    //     this.onCountrySelect();
    //   }
    // }
    if (this.company && this.company.addresses && this.company.addresses.length > 0 && this.company.addresses[0].id && this.company.addresses[0].country) {
      const cntry = this.countries.filter(country => country.name === this.company.addresses[0].country)[0];
      if (cntry) {
        this.company.addresses[0].country = cntry.name;
        this.onCountrySelect();
      } else {
        // do nothing - this case should never occur
      }
    } else {
      if (Utils.hasSingleItem(this.countries)) {
        this.company.addresses[0].country = this.countries[0].name;
        this.onCountrySelect();
      } else {
        // do nothing
      }
    }
  }

  onCountrySelect() {
    this.setStatesDropdown();
  }

  setStatesDropdown() {
    // if (this.company && this.company.country) {
    //   const cntry = this.countries.filter(country => country.name === this.company.country)[0];
    //   this.states = cntry.states;
    // }
    if (this.company && this.company.addresses && this.company.addresses.length > 0 && this.company.addresses[0].id && this.company.addresses[0].country) {
      const cntry = this.countries.filter(country => country.name === this.company.addresses[0].country)[0];
      this.states = cntry.states;
    }
    this.setSelectedState();
  }

  setSelectedState() {
    // if (this.company && this.company.country) {
    //   const cntry = this.countries.filter(country => country.name === this.company.country)[0];
    //   const cntryState = cntry.states.filter(state => state.name === this.company.state)[0];
    //   if (cntryState) {
    //     this.company.state = cntryState.name;
    //   }
    // }

    if (this.company && this.company.addresses && this.company.addresses.length > 0 && this.company.addresses[0].id && this.company.addresses[0].country) {
      const cntry = this.countries.filter(country => country.name === this.company.addresses[0].country)[0];
      const cntryState = cntry.states.filter(state => state.name === this.company.addresses[0].state)[0];
      if (cntryState) {
        this.company.addresses[0].state = cntryState.name;
      } else {
        // do nothing - this case should never occur
      }
    } else {
      if (Utils.hasSingleItem(this.states)) {
        this.company.addresses[0].city = this.states[0].name;
      } else {
        // do nothing
      }
    }
  }

  submit() {
    this.changes = this.changeService.getChanges();

    this.isSpinning = true;
    this.company.contact = Utils.phoneRemoveSpecialChars(this.company.contact);
    this.subscriptions.push(
      this.companyProfileService.updateCompanyProfile(this.company, this.changes)
        .subscribe((response: any) => {
          if (response) {
            this.fetchUserAndSaveInBrowserStorage();
          } else {
            this.isSpinning = false;
          }
        }, (error: any) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        })
    );
  }

  fetchUserAndSaveInBrowserStorage() {
    this.subscriptions.push(
      this.authenticationService.fetchUser().valueChanges
        .subscribe(
          (data: any) => {
            this.isSpinning = false;
            if (data && data.data && data.data.me) {
              this.changeService.setInitialCompanyProfile(Utils.cloneDeep(this.company));
              this.authenticationService.setUserInBrowserStorage(data.data.me);
              this.authenticationService.organizationUpdated$.next(true);
              this.messageService.success(AppMessages.COMPANY_PROFILE_UPDATED);
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  /**
   * @author Aman Purohit
   * @description Get the details of current user from local storage
   *
   * @memberof CompanyProfileComponent
   */
  getCurrentUser() {

    this.isSpinning = true;
    this.subscriptions.push(
      this.authenticationService.currentUser
        .subscribe((user: User) => {
          this.isSpinning = false;
          if (user && user.organization) {
            this.company = user.organization;
            // this.changeService.setInitialJobType(Utils.cloneDeep(this.jobType));
            this.company.contact = this.phoneToDisplayFormat(this.company.contact);

            this.changeService.setInitialCompanyProfile(Utils.cloneDeep(this.company));
          } else {
            // do nothing
          }
        }, (error) => {
          this.isSpinning = false;
          this.messageService.error(AppMessages.SOMETHING_WENT_WRONG);
        })
    );
  }

  imageUrl(image: string) {
    this.updateChangesObject('imageUrl', image, ActionEvent.UPDATE);
    this.isImageUpdated = true;
    this.company.imageUrl = image;
  }

  updateChangesObject(fieldName: string, newUrl: string, action: ActionEvent) {
    let changes = this.changeService.getChanges();
    const index = changes.findIndex(change => change.fieldName === fieldName);
    switch (action) {
      case ActionEvent.UPDATE: {
        if (index < 0) {
          const change = new Change();
          change.fieldName = fieldName;
          change.newValue = newUrl;
          changes.push(change);
        } else {
          changes[index].newValue = newUrl;
        }
        break;
      }
      default: {
        changes = changes;
      }
    }
    this.setChangesObject(changes);
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

  /**
   * @description Loading status to enable/disable form submit
   * buttons
   * @author Aman Purohit
   * @date 2020-06-22
   * @param {boolean} status
   * @memberof CompanyProfileComponent
   */
  handleImageLoading(status: boolean) {
    this.imageLoading = status;
  }

  /**
   * @description Transforms phone number from 9999999999
   * to (999) 999-9999
   * @author Aman Purohit
   * @date 2020-06-22
   * @param {string} contact
   * @returns
   * @memberof CompanyProfileComponent
   */
  phoneToDisplayFormat(contact: string) {
    if (!contact) {
      return contact;
    }
    return this.phoneFormatPipe.transform(contact);
  }

  cancel() {
    // if (window.history && window.history.length > 1) {
    //   window.history.back();
    // } else {
    //   // do nothing
    // }
    // this.getCurrentUser();
    this.isSpinning = true;
    if (this.authenticationService.isRememberMe) {
      this.company = Utils.getItemFromLocalStorage('user').organization;
    } else {
      this.company = Utils.getItemFromSessionStorage('user').organization;
    }
    this.isSpinning = false;
  }

  getChangedType() {
    return ChangeModule.COMPANY_PROFILE;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
