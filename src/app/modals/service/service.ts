import { BaseObject } from '../base-object/base-object';
import { ActiveInactiveStatus } from '../enums/active-inactive-status/active-inactive-status.enum';
import { Category } from '../category/category';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class Service extends BaseObject {
  code: string;
  name: string;
  itemDescription: string;
  price?: number;
  addOnPrice?: number;
  memberPrice?: number;
  categories: Category[]; // name of the category
  imageUrl?: string;
  videoLink?: string;
  bonus?: number;
  generalLedgerAccount?: string;
  status: GeneralStatus;

  constructor() {
    super();
    this.price = 0.00;
    this.addOnPrice = 0.00;
    this.memberPrice = 0.00;
    this.bonus = 0.00;
  }

}
