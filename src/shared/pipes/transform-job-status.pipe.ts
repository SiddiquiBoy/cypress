import { Pipe, PipeTransform } from '@angular/core';
import { JobType } from 'src/app/modals/job-type/job-type';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';

@Pipe({
  name: 'transformJobStatus'
})
export class TransformJobStatusPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return value;
    }
    switch (value) {
      case JobStatus.cancelled: {
        return 'Cancel';
        break;
      }
      case JobStatus.complete: {
        return 'Complete';
        break;
      }
      case JobStatus.dispatched: {
        return 'Dispatch';
        break;
      }
      case JobStatus.hold: {
        return 'Hold';
        break;
      }
      case JobStatus.inProgress: {
        return 'In Progress';
        break;
      }
      case JobStatus.scheduled: {
        return 'Schedule/Reschedule';
        break;
      }
      case JobStatus.unassigned: {
        return 'Assign/Unassign';
        break;
      }
      default: {
        return value;
      }
    }
  }

}
