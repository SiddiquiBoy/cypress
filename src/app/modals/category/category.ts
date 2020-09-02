import { BaseObject } from '../base-object/base-object';
import { Image } from '../image/image';
import { Service } from '../service/service';
import { BusinessUnit } from '../business-unit/business-unit';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class Category extends BaseObject {
  name: string;
  imageUrl: string;
  businessUnit: BusinessUnit = new BusinessUnit(); // name of the business unit
  code: string;
  status: GeneralStatus;
  services?: Service[] = [];
}
