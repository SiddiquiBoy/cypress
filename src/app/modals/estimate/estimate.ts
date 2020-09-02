import { BaseObject } from '../base-object/base-object';
import { BusinessUnit } from '../business-unit/business-unit';
import { EstimateStatus } from '../enums/estimate-status/estimate-status.enum';
import { JobType } from '../job-type/job-type';
import { Job } from '../job/job';
import { Technician } from '../people/technician';
import { Service } from '../service/service';

export class Estimate extends BaseObject {
    businessUnit: BusinessUnit;
    code: string;
    followUpOn: Date;
    jobType: JobType;
    jobs: Job[];
    name: string;
    services: Service[];
    status: EstimateStatus;
    subTotal: number;
    tax: number;
    technicians: Technician[];
    total: number;
}
