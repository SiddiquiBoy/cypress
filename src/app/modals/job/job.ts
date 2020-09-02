import { BaseObject } from '../base-object/base-object';
import { JobType } from '../job-type/job-type';
import { BusinessUnit } from '../business-unit/business-unit';
import { Priority } from '../enums/priority/priority.enum';
import { Technician } from '../people/technician';
import { Tag } from '../tag/tag';
import { Address } from '../address/address';
import { Project } from '../project/project';
import { JobStatus } from '../enums/job-status/job-status.enum';
import { Invoice } from '../invoice/invoice';
import { JobNote } from '../job-note/job-note';
import { Service } from '../service/service';
import { Attachment } from '../attachment/attachment';
import { JobTechnician } from './job-technician';

export class Job extends BaseObject {
  code: string;
  jobType: JobType = new JobType();
  businessUnit: BusinessUnit = new BusinessUnit();
  startDate: Date;
  startTime: Date;
  rescheduleDate: Date;
  rescheduleTime: Date;
  wasJobInProgress = false;
  leadSource: string;
  summary: string;
  technicians?: Technician[] = [];
  jobTechnicians?: JobTechnician[] = [];
  tags?: Tag[] = [];
  services: Service[] = [];
  remark: string;
  completedDate: Date;
  status: JobStatus;
  billingAddresses: Address[] = [];
  serviceAddresses: Address[] = [];
  project?: Project = new Project();
  invoice?: Invoice = new Invoice();
  jobNotes?: JobNote[] = [];
  attachments: Attachment[] = [];
}