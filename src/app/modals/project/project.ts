import { BaseObject } from '../base-object/base-object';
import { Job } from '../job/job';
import { Customer } from '../customer/customer';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class Project extends BaseObject {
  name: string;
  code: string;
  jobs: Job[] = [];
  customer: Customer = new Customer();
  // customerId: string;
  // status: string;
  status: GeneralStatus;
}
