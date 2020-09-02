import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Vendor } from 'src/app/modals/vendor/vendor';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';
import { Utils } from 'src/shared/utilities/utils';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-bu-address',
  templateUrl: './bu-address.component.html',
  styleUrls: ['./bu-address.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class BuAddressComponent implements OnInit {

  _businessUnit: BusinessUnit = new BusinessUnit();
  @Input() set businessUnit(businessUnit) {
    this._businessUnit = businessUnit;
  }

  get businessUnit() {
    return this._businessUnit;
  }

  @Input() changedType: string;

  countries: Country[] = [];
  states: State[] = [];
  statusDropdown: AppDropdown[] = [];

  // placeholders
  businessUnitAddressStreetPlaceholder: string;
  businessUnitAddressCountryPlaceholder: string;
  businessUnitAddressStatePlaceholder: string;
  businessUnitAddressCityPlaceholder: string;
  businessUnitAddressZipCodePlaceholder: string;


  // regex
  nameRegex: RegExp;
  phoneRegex: RegExp;
  emailRegex: RegExp;
  zipcodeRegex: RegExp;

  constructor() { }

  ngOnInit() {
    this.setPlaceholders();
    this.setRegExps();
    this.setCountryAndState();
    this.setDropdowns();
  }

  setPlaceholders() {
    this.businessUnitAddressStreetPlaceholder = PlaceholderConstant.STREET;
    this.businessUnitAddressCountryPlaceholder = PlaceholderConstant.COUNTRY;
    this.businessUnitAddressStatePlaceholder = PlaceholderConstant.STATE;
    this.businessUnitAddressCityPlaceholder = PlaceholderConstant.CITY;
    this.businessUnitAddressZipCodePlaceholder = PlaceholderConstant.ZIP_CODE;
  }

  setRegExps() {
    this.nameRegex = Utils.nameRegex;
    this.phoneRegex = Utils.phoneRegex;
    this.emailRegex = Utils.emailRegex;
    this.zipcodeRegex = Utils.zipcodeRegex;
  }

  setCountryAndState() {
    this.countries = Utils.getCountries();
    this.setSelectedCountry();
  }

  setSelectedCountry() {
    if (this.businessUnit && this.businessUnit.country) {
      const cntry = this.countries.filter(country => country.name === this.businessUnit.country)[0];
      if (cntry) {
        this.businessUnit.country = cntry.name;
        this.onCountrySelect();
      }
    } else {
      this.setIfSingleCountryInList();
    }
  }

  setIfSingleCountryInList() {
    if (this.countries && this.countries.length && this.countries.length === 1) {
      this.businessUnit.country = this.countries[0].name;
      this.onCountrySelect();
    }
  }

  onCountrySelect() {
    this.setStatesDropdown();
  }

  setStatesDropdown() {
    if (this.businessUnit.country) {
      const cntry = this.countries.filter(country => country.name === this.businessUnit.country)[0];
      this.states = cntry.states;
    }
    this.setSelectedState();
  }

  setSelectedState() {
    if (this.businessUnit && this.businessUnit.country) {
      const cntry = this.countries.filter(country => country.name === this.businessUnit.country)[0];
      const cntryState = cntry.states.filter(state => state.name === this.businessUnit.state)[0];
      if (cntryState) {
        this.businessUnit.state = cntryState.name;
      }
    }
  }

  setDropdowns() {
    this.setStatusDropdown();
    this.setCustomerInitialStatus();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    // this.statusDropdown = Utils.createDropdown(ActiveInactiveStatus, false, true);
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  setCustomerInitialStatus() {
    if (this.businessUnit) {
      if (!this.businessUnit.status) {
        if (this.statusDropdown && this.statusDropdown.length > 0) {
          this.businessUnit.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
        } else {
          // do nothing
        }
      } else {
        // do nothing
      }
    } else {
      // do nothing
    }
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

}
