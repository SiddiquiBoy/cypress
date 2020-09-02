import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/modals/address/address';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { AddAddressService } from './services/add-address.service';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Utils } from 'src/shared/utilities/utils';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { Change } from 'src/app/modals/change/change';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAddressComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  countries: Country[] = [];
  states: State[] = [];
  zipcodeRegex: RegExp;
  latLongRegex: RegExp;
  isSpinning = false;

  changes: Change[] = [];
  changedType: string;

  @Input() address: Address;
  @Input() customerId: string;

  @Output() emitResponse: EventEmitter<boolean> = new EventEmitter();
  @Output() emitOnAddressCreate: EventEmitter<boolean> = new EventEmitter();
  @Output() emitOnAddressUpdate: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private addAddressService: AddAddressService,
    private changeService: ChangeService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.setRegExps();
    this.setDropdowns();
    this.changeService.setInitialAddress(Utils.cloneDeep(this.address));
    this.changedType = this.getChangedType();
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

  onCountrySelect() {
    this.setStatesDropdown();
  }

  setStatesDropdown() {
    if (this.address.country) {
      const cntry = this.countries.filter(country => country.name === this.address.country)[0];
      this.states = cntry.states;
    }
    this.setSelectedState();
  }

  setSelectedCountry() {
    if (this.address && this.address.country) {
      const cntry = this.countries.filter(country => country.name === this.address.country)[0];
      if (cntry) {
        this.address.country = cntry.name;
        this.onCountrySelect();
      }
    } else {
      this.setIfSingleCountryInList();
    }
  }

  setIfSingleCountryInList() {
    if (this.countries && this.countries.length && this.countries.length === 1) {
      this.address.country = this.countries[0].name;
      this.onCountrySelect();
    }
  }

  setSelectedState() {
    if (this.address && this.address.country) {
      const cntry = this.countries.filter(country => country.name === this.address.country)[0];
      const cntryState = cntry.states.filter(state => state.name === this.address.state)[0];
      if (cntryState) {
        this.address.state = cntryState.name;
      }
    }
  }

  onSubmit() {
    this.changes = this.changeService.getChanges();

    this.createAddressObjectForBackend();
    if (!this.address.id) {
      this.add();
    } else {
      this.update();
    }
  }

  add() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addAddressService.createAddress(this.customerId, this.address)
        .subscribe(
          (response) => {
            this.isSpinning = false;
            // this.emitResponse.emit(true);
            this.emitOnAddressCreate.emit(true);
          }, (error) => {
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

  update() {
    this.createAddressObjectForBackend();
    this.isSpinning = true;
    this.subscriptions.push(
      this.addAddressService.updateAddress(this.address, this.changes)
        .subscribe(
          (response) => {
            this.isSpinning = false;
            // this.emitResponse.emit(true);
            this.emitOnAddressUpdate.emit(true);
          }, (error) => {
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

  createAddressObjectForBackend() {
    if (this.address.latitude) {
      this.address.latitude = +this.address.latitude;
    } else {
      // do nothing
    }
    if (this.address.longitude) {
      this.address.longitude = +this.address.longitude;
    } else {
      // do nothing
    }
  }

  cancel() {
    this.emitResponse.emit(false);
  }

  getChangedType() {
    return ChangeModule.ADDRESS;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
