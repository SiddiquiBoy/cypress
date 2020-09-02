import { BaseObject } from '../base-object/base-object';
import { JobStatus } from '../enums/job-status/job-status.enum';
import { Job } from './job';
import { User } from '../user/user';

export class JobTechnician extends BaseObject {
  status: JobStatus;
  billableHours: number;
  active: boolean;
  job: Job = new Job();
  user: User = new User();
}

