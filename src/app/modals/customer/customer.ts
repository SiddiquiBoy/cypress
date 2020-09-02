import { User } from '../user/user';
import { BusinessUnit } from '../business-unit/business-unit';
import { Image } from '../image/image';
import { Project } from '../project/project';
import { Address } from '../address/address';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class Customer extends User {
  businessUnit: BusinessUnit = new BusinessUnit();
  imageUrl: string;
  jobNotification = false;
  projects: Project[] = [];
  addresses: Address[] = [];
}
