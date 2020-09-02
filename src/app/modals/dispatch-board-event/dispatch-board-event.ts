import { BaseObject } from '../base-object/base-object';
import { TimesheetCode } from '../timesheet-code/timesheet-code';
import { Technician } from '../people/technician';
import { Job } from '../job/job';

export class DispatchBoardEvent extends BaseObject {
    name: string;
    timesheetCode: TimesheetCode;
    technician: Technician;
    job: Job;
    startDate: Date;
    startTime: Date;
    endDate: Date;
    endTime: Date;
}
