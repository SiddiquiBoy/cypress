import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { Company } from 'src/app/modals/company/company';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Utils } from 'src/shared/utilities/utils';
import { OrgStatus } from 'src/app/modals/enums/org-status/org-status.enum';
import { Address } from 'src/app/modals/address/address';
import { ControlContainer, NgForm } from '@angular/forms';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { AddCompanyService } from '../services/add-company.service';
import { NZInputValidationType } from 'src/app/modals/enums/nzinput-validation-type.enum';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class CompanyDetailComponent implements OnInit, OnDestroy {

  _company: Company = new Company();
  companyCopy: Company = new Company();
  @Input() set company(company: Company) {
    this._company = company;
    this.companyCopy = Utils.cloneDeep(company);
    this.setSelectedStatus();
  }

  get company(): Company {
    return this._company;
  }

  @Input() changedType: string;

  cityNameRegex: RegExp;
  phoneRegex: RegExp;
  zipcodeRegex: RegExp;
  countries: Country[] = [];
  states: State[] = [];
  imageUploadText: string;
  statusDropdown: AppDropdown[] = [];
  companyContactValidationStatus: NZInputValidationType;
  companyContact$ = new Subject<string>();
  subscriptions: Subscription[] = [];
  validContact = true;
  hasFeedback = true;

  // placeholders
  companyNamePlaceholder: string;
  companyPhonePlaceholder: string;
  companyCountryPlaceholder: string;
  companyStatePlaceholder: string;
  companyCityPlaceholder: string;
  companyStreetPlaceholder: string;
  companyPostalCodePlaceholder: string;
  companyStatusPlaceholder: string;

  constructor(
    private changeService: ChangeService,
    private addCompanyService: AddCompanyService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setImageUploadText();
    this.setRegexps();
    this.setDropdowns();

    this.subscriptions.push(
      this.companyContact$.pipe(
        debounceTime(750),
        distinctUntilChanged()
      ).subscribe(
        (contact: string) => {
          if (contact) {
            contact = contact.trim();
            if (contact === Utils.phoneRemoveSpecialChars(this.companyCopy.contact)) {
              this.companyContactValidationStatus =
                NZInputValidationType.success;
            } else {
              this.checkCompanyContactValidity(contact);
            }
          } else {
            this.companyContactValidationStatus = NZInputValidationType.error;
          }
        },
        (error) => {
          // will not occur
        }
      )
    );
  }

  setPlaceholders() {
    this.companyNamePlaceholder = PlaceholderConstant.COMPANY_NAME;
    this.companyPhonePlaceholder = PlaceholderConstant.PHONE_NUMBER;
    this.companyCountryPlaceholder = PlaceholderConstant.COUNTRY;
    this.companyStatePlaceholder = PlaceholderConstant.STATE;
    this.companyCityPlaceholder = PlaceholderConstant.CITY;
    this.companyStreetPlaceholder = PlaceholderConstant.STREET;
    this.companyPostalCodePlaceholder = PlaceholderConstant.POSTAL_CODE;
    this.companyStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  setImageUploadText() {
    this.imageUploadText = 'Upload Company Logo';
  }

  setRegexps() {
    this.phoneRegex = Utils.phoneRegex;
    this.cityNameRegex = Utils.nameRegex;
    this.zipcodeRegex = Utils.zipcodeRegex;
  }

  setDropdowns() {
    this.setCountriesDropdown();
    this.setStatusDropdown();
  }

  setCountriesDropdown() {
    this.countries = Utils.getCountries();
    this.setSelectedCountry();
  }

  setSelectedCountry() {
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
        if (this.company.addresses.length === 0) {
          this.company.addresses.push(new Address());
          this.company.addresses[0].country = this.countries[0].name;
        } else {
          // do nothing
        }
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
    if (this.company && this.company.addresses && this.company.addresses.length > 0) {
      const cntry = this.countries.filter(country => country.name === this.company.addresses[0].country)[0];
      this.states = cntry.states;
    } else {
      // do nothing
    }
    this.setSelectedState();
  }

  setSelectedState() {
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

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(OrgStatus, false, false, false, false);
    this.setSelectedStatus();
  }

  setSelectedStatus() {
    if (this.statusDropdown && this.statusDropdown.length > 0) {
      if (this.company && this.company.id) {
        if (this.company.status) {
          this.company.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(OrgStatus, OrgStatus[this.company.status]))[0].value;
        } else {
          // this case should not occur
          this.setDefaultStatus();
        }
      } else {
        this.setDefaultStatus();
      }
    } else {
      // do nothing
    }
  }

  setDefaultStatus() {
    if (this.company) {
      // do nothing
    } else {
      // this case should not occur
      this.company = new Company();
    }
    this.company.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(OrgStatus, OrgStatus.active))[0].value;
  }

  handleImageLoading(status: boolean) {
    this.addCompanyService.isCompanyImageUploading$.next(status);
  }

  setImageUrl(url: string) {
    this.updateChangesObject('imageUrl', 'Image Url', url, this.company.imageUrl, ActionEvent.UPDATE);
    this.company.imageUrl = url;
  }

  updateChangesObject(fieldName: string, fieldDisplayName: string, newValue: any, oldValue: any, action: string) {
    const changes = this.changeService.getChanges();
    switch (action) {
      case ActionEvent.UPDATE: {
        this.setImageUrlInChanges(fieldName, fieldDisplayName, newValue, oldValue, changes);
        break;
      }
      default: {
        this.setImageUrlInChanges(fieldName, fieldDisplayName, newValue, oldValue, changes);
      }
    }
    this.setChangesObject(changes);
  }

  setImageUrlInChanges(fieldName: string, fieldDisplayName: string, newValue: any, oldValue: any, changes: Change[]) {
    const index = changes.findIndex(change => change.fieldName === fieldName);
    if (index < 0) {
      const change = new Change();
      change.fieldName = fieldName;
      change.fieldDisplayName = fieldDisplayName;
      change.newValue = newValue;
      change.oldValue = oldValue;
      changes.push(change);
    } else {
      changes[index].newValue = newValue;
    }
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

  onCompanyContactInput() {
    if (this.phoneRegex.test(this.company.contact)) {
      this.validContact = true;
      this.hasFeedback = true;
      this.companyContact$.next(Utils.phoneRemoveSpecialChars(this.company.contact));
    } else {
      this.validContact = false;
      this.hasFeedback = false;
      this.companyContactValidationStatus = NZInputValidationType.error;
    }
  }

  checkCompanyContactValidity(contact: string) {
    this.companyContactValidationStatus = NZInputValidationType.validating;
    this.subscriptions.push(
      this.addCompanyService.checkIfCompanyContactAlreadyExists(contact).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfOrganizationTaken) {
            this.companyContactValidationStatus = NZInputValidationType.error;
          } else {
            this.companyContactValidationStatus = NZInputValidationType.success;
          }
        },
        (error) => {
          this.companyContactValidationStatus = NZInputValidationType.error;
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
