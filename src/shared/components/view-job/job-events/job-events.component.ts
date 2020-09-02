import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { EventSegment } from 'src/app/modals/enums/event-segment/event-segment.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { EventEntity } from 'src/app/modals/enums/event-entity/event-entity.enum';

@Component({
  selector: 'app-job-events',
  templateUrl: './job-events.component.html',
  styleUrls: ['./job-events.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobEventsComponent implements OnInit, OnDestroy {

  @Input() entityId: string;

  jobSegments: string[] = [];
  // entity: EventEntity;
  activeIndex: number;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.setActiveIndex();
    // this.setEntity();
    this.setJobSegments();
  }

  setActiveIndex(index?: number) {
    if (index === null || index === undefined) {
      this.activeIndex = 0;
    } else {
      this.activeIndex = index;
    }
  }

  onTabChange(index: number) {
    this.setActiveIndex(index);
  }

  // setEntity() {
    // this.entity = EventEntity.job;
  // }

  setJobSegments() {
    this.jobSegments = [];
    if (this.authenticationService.checkPermission(Permission.VIEW_JOB_EVENTS_EVENTS)) {
      this.jobSegments.push(EventSegment.events);
    }
    if (this.authenticationService.checkPermission(Permission.VIEW_JOB_EVENTS_EMAILS)) {
      this.jobSegments.push(EventSegment.emails);
    }
    if (this.authenticationService.checkPermission(Permission.VIEW_JOB_EVENTS_NOTES)) {
      this.jobSegments.push(EventSegment.notes);
    }
  }

  ngOnDestroy() { }

}
