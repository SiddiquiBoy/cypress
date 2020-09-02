import { BaseObject } from '../base-object/base-object';
import { Image } from '../image/image';
import { ActiveInactiveStatus } from '../enums/active-inactive-status/active-inactive-status.enum';
import { Tag } from '../tag/tag';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class BusinessUnit extends BaseObject {
  logo?: Image = new Image();
  name: string;
  officialName: string;
  email: string;
  phone: string;
  tags: Tag[] = [];
  minPostDate: any;
  // status: string;
  status: GeneralStatus;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
