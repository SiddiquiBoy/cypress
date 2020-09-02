import { BaseObject } from '../base-object/base-object';
import { Priority } from '../enums/priority/priority.enum';
import { ActiveInactiveStatus } from '../enums/active-inactive-status/active-inactive-status.enum';
import { Tag } from '../tag/tag';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

export class JobType extends BaseObject {
  name: string;
  priority: Priority;
  tags: Tag[] = [];
  summary: string;
  // status: ActiveInactiveStatus;
  status: GeneralStatus;
}
