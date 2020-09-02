import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Customer } from 'src/app/modals/customer/customer';
import { Utils } from 'src/shared/utilities/utils';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { AddressType } from 'src/app/modals/enums/address-type/address-type.enum';
import { Address } from 'src/app/modals/address/address';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { Subscription } from 'rxjs';
import { AddCustomerService } from '../services/add-customer.service';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Change } from 'src/app/modals/change/change';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-customer-addresses',
  templateUrl: './customer-addresses.component.html',
  styleUrls: ['./customer-addresses.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class CustomerAddressesComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() redirectUpdate: boolean = true;

  _customer: Customer = new Customer();
  @Input() set customer(customer) {
    this._customer = customer;
  }

  get customer() {
    return this._customer;
  }

  @Input() changedType: string;

  @Output() eEmitIsAddressTabValid = new EventEmitter<any>();

  subscriptions: Subscription[] = [];
  countries: Country[] = [];
  states: State[] = [];
  zipcodeRegex: RegExp;
  latLongRegex: RegExp;
  addressTypeDropdown: AppDropdown[] = [];
  addButtonIcon: string;
  removeButtonIcon: string;
  isAddTabValid = false;

  // placeholders
  customerAddressCountryPlaceholder: string;
  customerAddressStatePlaceholder: string;
  customerAddressCityPlaceholder: string;
  customerAddressStreetPlaceholder: string;
  customerAddressLandmarkPlaceholder: string;
  customerAddressZipCodePlaceholder: string;
  customerAddressLatitudePlaceholder: string;
  customerAddressLongitudePlaceholder: string;

  constructor(
    private addCustomerService: AddCustomerService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.addButtonIcon = IconConstants.PLUS_CIRCLE;
    this.removeButtonIcon = IconConstants.DELETE;
    this.setRegExps();

    if (!this.customer.addresses || this.customer.addresses.length === 0) {
      this.addInitialAddress();
    } else {
      // do nothing
    }

    this.subscriptions.push(
      this.addCustomerService.isAddressTabValid$.subscribe((val) => {
        this.isAddTabValid = val;
      })
    );
  }

  ngAfterViewInit() {
    this.setDropdowns();
  }

  setPlaceholders() {
    this.customerAddressCountryPlaceholder = PlaceholderConstant.COUNTRY;
    this.customerAddressStatePlaceholder = PlaceholderConstant.STATE;
    this.customerAddressCityPlaceholder = PlaceholderConstant.CITY;
    this.customerAddressStreetPlaceholder = PlaceholderConstant.STREET;
    this.customerAddressLandmarkPlaceholder = PlaceholderConstant.LANDMARK;
    this.customerAddressZipCodePlaceholder = PlaceholderConstant.ZIP_CODE;
    this.customerAddressLatitudePlaceholder = PlaceholderConstant.LATITUDE;
    this.customerAddressLongitudePlaceholder = PlaceholderConstant.LONGITUDE;
  }

  setRegExps() {
    this.zipcodeRegex = Utils.zipcodeRegex;
    this.latLongRegex = Utils.decimalNumberRegex;
  }

  setDropdowns() {
    this.setCountriesDropdown();
    // this.setAddressTypeDropdown();
  }

  setCountriesDropdown() {
    this.countries = Utils.getCountries();
    this.setSelectedCountry();
  }

  // setAddressTypeDropdown() {
  //   this.addressTypeDropdown = [];
  //   this.addressTypeDropdown = Utils.createDropdown(AddressType, false, true);
  // }

  addInitialAddress() {
    this.customer.addresses.push(new Address());
    // this.customer.addresses = Utils.cloneDeep(this.customer.addresses);
  }

  onCountrySelect(index: number) {
    this.setStatesDropdown(index);
  }

  setStatesDropdown(index: number) {
    if (this.customer.addresses[index] && this.customer.addresses[index].country) {
      const cntry = this.countries.filter(country => country.name === this.customer.addresses[index].country)[0];
      this.states = cntry.states;
    }
    this.setSelectedState(index);
  }

  setSelectedCountry() {
    this.customer.addresses.forEach((address, index) => {
      if (address && address.country) {
        const cntry = this.countries.filter(country => country.name === address.country)[0];
        if (cntry) {
          this.customer.addresses[index].country = cntry.name;
          this.onCountrySelect(index);
        }
      } else {
        this.setIfSingleCountryInList(index);
      }
    });
  }

  setIfSingleCountryInList(index: number) {
    if (this.countries && this.countries.length && this.countries.length === 1) {
      this.customer.addresses[index].country = this.countries[0].name;
      this.onCountrySelect(index);
    }
  }

  setSelectedState(index: number) {
    if (this.customer && this.customer.addresses && this.customer.addresses[index] && this.customer.addresses[index].country) {
      const cntry = this.countries.filter(country => country.name === this.customer.addresses[index].country)[0];
      const cntryState = cntry.states.filter(state => state.name === this.customer.addresses[index].state)[0];
      if (cntryState) {
        this.customer.addresses[index].state = cntryState.name;
      }
    }
  }

  addAddress() {
    this.addInitialAddress();
  }

  isAddressTabValid() {
    this.eEmitIsAddressTabValid.emit(true);
  }

  removeAddress(index: number) {
    this.customer.addresses.splice(index, 1);
    this.customer.addresses = Utils.cloneDeep(this.customer.addresses);
    this.updateChangesObject('addresses', index, ActionEvent.DELETE);
  }

  updateChangesObject(partialFieldName: string, index: number, action: string) {
    let changes = this.changeService.getChanges();
    if (index !== undefined && index !== null) {
      switch (action) {
        case ActionEvent.DELETE: {
          changes = changes.filter(change => !change.fieldName.includes(partialFieldName + '/' + index));
          changes = this.updateChangesObjectForOtherIndices(partialFieldName, index, changes);
          break;
        }
        default: {
          changes = changes.filter(change => !change.fieldName.includes(partialFieldName + '/' + index));
          changes = this.updateChangesObjectForOtherIndices(partialFieldName, index, changes);
        }
      }
      this.setChangesObject(changes);
    } else {
      // do nothing
    }
  }

  updateChangesObjectForOtherIndices(partialFieldName: string, index: number, changes: Change[]): Change[] {
    const unIndexedChanges = changes.filter(change => !change.fieldName.includes(partialFieldName + '/'));
    const indexedChanges = changes.filter(change => change.fieldName.includes(partialFieldName + '/'));
    indexedChanges.forEach((change) => {
      const indexToChange = Utils.getIndexFromChange(change);
      if (indexToChange !== -1 && indexToChange > index) {
        change.fieldName = change.fieldName.replace(partialFieldName + '/' + indexToChange, partialFieldName + '/' + (indexToChange - 1));
      } else {
        // do nothing
      }
    });
    return [...unIndexedChanges, ...indexedChanges];
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
