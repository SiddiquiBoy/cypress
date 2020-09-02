import { BaseObject } from '../base-object/base-object';
import { Tag } from '../tag/tag';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class Vendor extends BaseObject {
  vendorName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  fax: string;
  phone: string;
  memo: string;
  street: string;
  landmark: string;
  city: string;
  country: string;
  postalCode: string;
  status: GeneralStatus;
  state: string;
  tags: Tag[] = [];
}

