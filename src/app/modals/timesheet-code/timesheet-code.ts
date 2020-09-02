import { BaseObject } from '../base-object/base-object';
import { BusinessUnit } from '../business-unit/business-unit';
import { ActiveInactiveStatus } from '../enums/active-inactive-status/active-inactive-status.enum';
import { TimesheetCodeType } from '../enums/timesheet-code-type/timesheet-code-type.enum';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class TimesheetCode extends BaseObject {
    code: string;
    description: string;
    type: TimesheetCodeType;
    businessUnit: BusinessUnit;
    status: GeneralStatus;
}
