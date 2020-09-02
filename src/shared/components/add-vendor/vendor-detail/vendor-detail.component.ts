import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { AddVendorService } from '../service/add-vendor-service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ChangeService } from 'src/shared/services/change/change.service';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';
import { Utils } from 'src/shared/utilities/utils';
import { Vendor } from 'src/app/modals/vendor/vendor';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class VendorDetailComponent implements OnInit {
  countries: Country[] = [];
  states: State[] = [];
  statusDropdown: AppDropdown[] = [];

  constructor(
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setRegExps();
    this.setCountryAndState();
    this.setDropdowns()
  }

  _vendor: Vendor = new Vendor();
  @Input() set vendor(vendor) {
    this._vendor = vendor;
  }

  get vendor() {
    return this._vendor;
  }

   // placeholders
   vendorNamePlaceholder: string;
   vendorStatusPlaceholder: string;
   vendorCountryPlaceholder: string;
   vendorStatePlaceholder: string;
   vendorCityPlaceholder: string;
   vendorStreetPlaceholder: string;
   vendorLandmarkPlaceholder: string;
   vendorZipCodePlaceholder: string;

  // regex
  nameRegex: RegExp;
  phoneRegex: RegExp;
  emailRegex: RegExp;
  zipcodeRegex: RegExp;

  setPlaceholders() {
    this.vendorNamePlaceholder = PlaceholderConstant.VENDOR_NAME;
    this.vendorStatusPlaceholder = PlaceholderConstant.STATUS;
    this.vendorCountryPlaceholder = PlaceholderConstant.COUNTRY;
    this.vendorStatePlaceholder = PlaceholderConstant.STATE;
    this.vendorCityPlaceholder = PlaceholderConstant.CITY;
    this.vendorStreetPlaceholder = PlaceholderConstant.STREET;
    this.vendorLandmarkPlaceholder = PlaceholderConstant.LANDMARK;
    this.vendorZipCodePlaceholder = PlaceholderConstant.ZIP_CODE;
  }

  setRegExps() {
    this.nameRegex = Utils.nameRegex;
    this.phoneRegex = Utils.phoneRegex;
    this.emailRegex = Utils.emailRegex;
    this.zipcodeRegex = Utils.zipcodeRegex;
  }

  @Input() changedType: string;

  setCountryAndState() {
    this.countries = Utils.getCountries();
    this.setSelectedCountry();
  }

  setSelectedCountry() {
    if (this.vendor && this.vendor.country) {
      const cntry = this.countries.filter(country => country.name === this.vendor.country)[0];
      if (cntry) {
        this.vendor.country = cntry.name;
        this.onCountrySelect();
      }
    } else {
      this.setIfSingleCountryInList();
    }
  }

  setIfSingleCountryInList() {
    if (this.countries && this.countries.length && this.countries.length === 1) {
      this.vendor.country = this.countries[0].name;
      this.onCountrySelect();
    }
  }

  onCountrySelect() {
    this.setStatesDropdown();
  }

  setStatesDropdown() {
    if (this.vendor.country) {
      const cntry = this.countries.filter(country => country.name === this.vendor.country)[0];
      this.states = cntry.states;
    }
    this.setSelectedState();
  }

  setSelectedState() {
    if (this.vendor && this.vendor.country) {
      const cntry = this.countries.filter(country => country.name === this.vendor.country)[0];
      const cntryState = cntry.states.filter(state => state.name === this.vendor.state)[0];
      if (cntryState) {
        this.vendor.state = cntryState.name;
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
    if (this.vendor) {
      if (!this.vendor.status) {
        if (this.statusDropdown && this.statusDropdown.length > 0) {
          this.vendor.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
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
