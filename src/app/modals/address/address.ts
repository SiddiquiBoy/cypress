import { AddressType } from '../enums/address-type/address-type.enum';
import { State } from '../state/state';
import { Country } from '../country/country';
import { BaseObject } from '../base-object/base-object';

export class Address extends BaseObject {
  street: string;
  // state: State = new State();
  state: string;
  city: string;
  // country: Country = new Country();
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  type: AddressType;
  landmark: string;
}
