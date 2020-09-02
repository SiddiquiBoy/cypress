import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { addHours, startOfDay } from 'date-fns';
import { Subscription, Subject } from 'rxjs';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { Technician } from 'src/app/modals/people/technician';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { DispatchService } from '../services/dispatch.service';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Job } from 'src/app/modals/job/job';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { DateUtil } from 'src/shared/utilities/date-util';
import { TimesheetCode } from 'src/app/modals/timesheet-code/timesheet-code';
import { TitleCasePipe } from '@angular/common';
import { DispatchBoardEvent } from 'src/app/modals/dispatch-board-event/dispatch-board-event';
import { Change } from 'src/app/modals/change/change';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';

@Component({
  selector: 'app-dispatchboard-technician-timeline',
  templateUrl: './dispatchboard-technician-timeline.component.html',
  styleUrls: ['./dispatchboard-technician-timeline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DispatchboardTechnicianTimelineComponent implements OnInit, OnDestroy {

  @Input() orgId: string;

  businessUnits: BusinessUnit[] = [];
  CalendarView = CalendarView;
  dispatchBoardEvent: DispatchBoardEvent;
  dispatchBoardEvents: DispatchBoardEvent[] = [];
  disabledHours: any;
  disabledMinutes: any;
  disabledSeconds: any;
  events: CalendarEvent[] = [];
  eventInfo: any; // same as the meta property of Calendar Event
  jobs: Job[] = [];
  messageObject: any = {};
  refresh: Subject<any> = new Subject();
  subscriptions: Subscription[] = [];
  technicians: Technician[] = [];
  timesheetCodes: TimesheetCode[] = [];
  users: any[] = []; // modification of technicians objects as per timeline library requirement
  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();

  activeDayIsOpen = true;
  initialLoad = true;
  isSpinning = false;
  showInfoDialog = false;
  showAddEventPopup = false;
  showSendSMSPopup = false;

  changes: Change[] = [];
  changedType: string;

  constructor(
    private authenticationService: AuthenticationService,
    private dispatchService: DispatchService,
    private messageService: MessageService,
    private changeService: ChangeService,
  ) { }

  ngOnInit() {
    this.getBusinessUnits();
    this.getTimesheetCodes();
    this.getTechnicians();
    // this.setDisableHrs();
    // this.setDisableMins();
    // this.setDisableSecs();
    this.changedType = this.getChangedType();
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.events = [...this.events];
  }

  userChanged({ event, newUser }) {
    event.color = newUser.color;
    event.meta.user = newUser;
    this.events = [...this.events];
  }

  getBusinessUnits() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.dispatchService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listBusinessUnits &&
              response.data.listBusinessUnits.data && response.data.listBusinessUnits.data.length) {
              this.isSpinning = false;
              this.businessUnits = response['data']['listBusinessUnits']['data'];
            } else {
              this.isSpinning = false;
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  getTechnicians() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.dispatchService.getTechnicians(this.orgId, this.getListPaginationObject(), this.getTechnicianSortObject(), null,
        this.getListFilterDataForActiveStatus()).valueChanges.subscribe(
          (response) => {
            this.isSpinning = false;
            this.technicians = response.data.listUsers.data;
            this.users = this.getTechniciansCompatibleWithCalendar(this.technicians);
            // this.getJobs();
            this.getDispatchBoardEvents();
          }, (error) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  getTechnicianSortObject() {
    const sortData: SortData[] = [];
    const firstNameSort: SortData = {
      sortColumn: 'firstName',
      sortOrder: 'asc'
    };
    const lastNameSort: SortData = {
      sortColumn: 'lastName',
      sortOrder: 'asc'
    };
    sortData.push(firstNameSort, lastNameSort);
    return sortData;
  }

  getJobs() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.dispatchService.listJob(this.orgId, this.getListPaginationObject(), this.getSortObjectByCreatedDate(), null, this.getFilterDataForDispatchedJobs()).valueChanges.subscribe(
        (response) => {
          if (response && response.data && response.data.listJobs) {
            this.jobs = response.data.listJobs.data;
            this.isSpinning = false;
            this.setJobsOnTimeline();
            this.setEventsOnTimeline();
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  getTimesheetCodes() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.dispatchService.listTimesheetCodes(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus()).valueChanges.subscribe(
        (data) => {
          if (data && data.data && data.data.listTimesheetCodes && data.data.listTimesheetCodes.data) {
            this.timesheetCodes = data.data.listTimesheetCodes.data;
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          this.isSpinning = false;
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  getDispatchBoardEvents() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.dispatchService.listDispatchBoardEvents(this.orgId, this.getListPaginationObject(), this.getSortObjectByCreatedDate(), null, this.getFilterDataForDispatchBoardEvents()).valueChanges.subscribe(
        (data) => {
          if (data && data.data && data.data.listDispatchBoardEvents && data.data.listDispatchBoardEvents.data) {
            this.dispatchBoardEvents = data.data.listDispatchBoardEvents.data;
            this.isSpinning = false;
            this.getJobs();
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          this.isSpinning = false;
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  getSortObjectByName() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getSortObjectByCreatedDate() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'createdAt',
      sortOrder: 'desc'
    };
    sortData.push(sort);
    return sortData;
  }

  getFilterDataForDispatchedJobs() {
    const filterData: FilterData[] = [];
    filterData.push(this.getJobStatusFilter());
    filterData.push(this.getSelectedDateFilter());
    return filterData;
  }

  getFilterDataForDispatchBoardEvents() {
    const filterData: FilterData[] = [];
    filterData.push(this.getSelectedDateFilter());
    return filterData;
  }

  /**
   * @description Return filter data with status either
   * dispatched or in progress
   * @author Aman Purohit
   * @date 2020-08-06
   * @returns
   * @memberof DispatchboardTechnicianTimelineComponent
   */
  getJobStatusFilter() {
    const statusFilter: FilterData = {
      field: 'status',
      op: FilterOp.in,
      value: [Utils.getEnumKey(JobStatus, JobStatus.dispatched), Utils.getEnumKey(JobStatus, JobStatus.inProgress)]
    };
    return statusFilter;
  }

  /**
   * @description Return filter data with current selected
   * date as start Date value
   * @author Aman Purohit
   * @date 2020-08-06
   * @returns
   * @memberof DispatchboardTechnicianTimelineComponent
   */
  getSelectedDateFilter() {
    const selectedDateWithCurrentTime: Date = this.combineDateAndTime(this.viewDate, DateUtil.getFormattedTimeFromDate(new Date(), true, false, false));
    const dateFilter: FilterData = {
      field: 'startDate',
      value: selectedDateWithCurrentTime,
      op: FilterOp.equal,
      type: 'date'
    };
    return dateFilter;
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  getTechniciansCompatibleWithCalendar(technicians: Technician[]) {
    return technicians.map(technician => { technician["name"] = new TitleCasePipe().transform(technician.fullName); return technician; });
  }

  combineDateAndTime(date, timeString) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Jan is 0, dec is 11
    const day = date.getDate();
    const dateString = '' + year + '-' + month + '-' + day;
    const combined = new Date(dateString + ' ' + timeString);

    return combined;
  }

  // By default the jobs are of 1 hour
  setJobsOnTimeline() {
    this.isSpinning = true;
    this.events = [];
    this.jobs.forEach(job => {
      job.technicians.forEach(technician => {
        const index = this.users.findIndex(user => user.id === technician.id);
        const eventForTechnician: CalendarEvent = {
          title: job.code,
          color: {
            primary: '#1890ff',
            secondary: '#fff'
          },
          start: this.combineDateAndTime(job.startDate, job.startTime),
          end: addHours(this.combineDateAndTime(job.startDate, job.startTime), 1),
          meta: {
            businessUnit: job.businessUnit.name,
            serviceAddresses: job.serviceAddresses[0],
            officePhone: this.users[index].officePhone,
            jobType: job.jobType.name,
            summary: job.summary,
            jobId: job.id,
            technicianId: technician.id,
          }
        };
        // const index = this.users.findIndex(user => user.id === technician.id);
        eventForTechnician.meta.user = this.users[index];
        eventForTechnician.meta.technician = technician.fullName;
        this.events.push(eventForTechnician);
      });
    });
    this.isSpinning = false;
    // this.initialLoad = false;
  }

  setEventsOnTimeline() {
    this.isSpinning = true;
    this.dispatchBoardEvents.forEach(event => {
      const _eventObject = this.createEventObjectForTimeline(event);
      this.events.push(_eventObject);
    });
    this.isSpinning = false;
    this.initialLoad = false;
  }

  setEventOnTimeline(event: DispatchBoardEvent) {
    const _eventObject = this.createEventObjectForTimeline(event);
    this.events.push(_eventObject);
    this.refresh.next();
  }

  createEventObjectForTimeline(event) {
    const index = this.users.findIndex(user => user.id === event.technician.id);
    const eventObject: CalendarEvent = {
      title: event.name,
      color: {
        primary: 'lightgrey',
        secondary: '#eae8e8'
      },
      start: this.combineDateAndTime(event.startDate, event.startTime),
      end: this.combineDateAndTime(event.endDate, event.endTime),
      meta: {
        eventId: event.id,
      },
    };
    eventObject.meta.user = this.users[index];
    return eventObject;
  }

  openAddEventPopup() {
    this.dispatchBoardEvent = new DispatchBoardEvent();
    this.changeService.setInitialDispatchBoardEvent(Utils.cloneDeep(this.dispatchBoardEvent));
    this.showAddEventPopup = true;
  }

  openSendSMSPopup() {
    this.messageObject = {};
    this.showSendSMSPopup = true;
  }

  sendSMS() {
    this.showSendSMSPopup = false;
    this.messageService.success(AppMessages.DISPATCH_BOARD_SEND_SMS);
  }

  submit() {

    this.changes = this.changeService.getChanges();

    this.dispatchBoardEvent.startDate = this.combineDateAndTime(this.viewDate, DateUtil.getFormattedTimeFromDate(new Date(), true, false, false));
    this.dispatchBoardEvent.endDate = this.combineDateAndTime(this.viewDate, DateUtil.getFormattedTimeFromDate(new Date(), true, false, false));
    if (this.dispatchBoardEvent.id) {
      this.updateEvent();
    } else {
      this.createEvent();
    }
  }

  createEvent() {
    const index = this.events.findIndex(event => event.meta.technicianId === this.dispatchBoardEvent.technician.id);
    if (index > -1) {
      this.dispatchBoardEvent.job = this.jobs.find(job => this.events[index].meta.jobId === job.id);
    }
    this.isSpinning = true;
    this.subscriptions.push(
      this.dispatchService.createDispatchBoardEvent(this.dispatchBoardEvent).subscribe(
        (response) => {
          if (response && response.data && response.data.createDispatchBoardEvent) {
            // Add event in timeline
            this.dispatchBoardEvents.push(response.data.createDispatchBoardEvent);
            this.setEventOnTimeline(response.data.createDispatchBoardEvent);
            this.messageService.success(AppMessages.DISPATCH_BOARD_EVENT_ADDED);
            this.showAddEventPopup = false;
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          this.isSpinning = false;
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  updateEvent() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.dispatchService.updateDispatchBoardEvent(this.dispatchBoardEvent, this.changes).subscribe(
        (response) => {
          if (response && response.data && response.data.updateDispatchBoardEvent) {

            const dispatchBoardEventIndex = this.dispatchBoardEvents.findIndex(event => event.id === response.data.updateDispatchBoardEvent.id);
            if (dispatchBoardEventIndex > -1) { this.dispatchBoardEvents.splice(dispatchBoardEventIndex, 1); }
            this.dispatchBoardEvents.push(response.data.updateDispatchBoardEvent);

            const timelineEventIndex = this.events.findIndex(event => event.meta.eventId === response.data.updateDispatchBoardEvent.id);
            if (timelineEventIndex > -1) { this.events.splice(timelineEventIndex, 1); }

            this.messageService.success(AppMessages.DISPATCH_BOARD_EVENT_UPDATED);
            this.showAddEventPopup = false;
            this.isSpinning = false;

            this.setEventOnTimeline(response.data.updateDispatchBoardEvent);

          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          this.isSpinning = false;
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  handleEvent(action: string, event: Event) {
    const info: any = event;
    this.eventInfo = info.meta;
    if (info.meta.jobId) {
      this.showInfoDialog = true;
    } else if (info.meta.eventId) {
      const dispatchBoardEventObject = this.dispatchBoardEvents.find(dispatchBoardEvent => info.meta.eventId === dispatchBoardEvent.id);

      if (dispatchBoardEventObject) { this.dispatchBoardEvent = Utils.cloneDeep(dispatchBoardEventObject); }

      this.setSelectedDropDownsForDispatchBoardEvents();

      if (!(this.dispatchBoardEvent.startTime instanceof Date)) {
        this.dispatchBoardEvent.startTime = this.getFormattedTime(this.dispatchBoardEvent.startDate, this.dispatchBoardEvent.startTime);
      }

      if (!(this.dispatchBoardEvent.endTime instanceof Date)) {
        this.dispatchBoardEvent.endTime = this.getFormattedTime(this.dispatchBoardEvent.endDate, this.dispatchBoardEvent.endTime);
      }

      this.changeService.setInitialDispatchBoardEvent(Utils.cloneDeep(this.dispatchBoardEvent));

      this.showAddEventPopup = true;
    }
  }

  setSelectedDropDownsForDispatchBoardEvents() {
    this.dispatchBoardEvent.timesheetCode = this.timesheetCodes.find(code => code.id === this.dispatchBoardEvent.timesheetCode.id);
    this.dispatchBoardEvent.technician = this.technicians.find(technician => technician.id === this.dispatchBoardEvent.technician.id);
  }

  getFormattedTime(_date, _time): Date {
    const date = new Date(_date);
    const splittedTime = _time.toString().split(':');
    if (splittedTime) {
      const hrs = splittedTime[0] ? splittedTime[0] : '00';
      const mins = splittedTime[1] ? splittedTime[1] : '00';
      const secs = splittedTime[2] ? splittedTime[2] : '00';
      date.setHours(Number(hrs));
      date.setMinutes(Number(mins));
      date.setSeconds(Number(secs));
    } else {
      // do nothing
    }
    return date;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onCancelClick() {
    this.showInfoDialog = false;
    this.showAddEventPopup = false;
    this.showSendSMSPopup = false;
  }

  setDate() {
    // Calendar event return 00:00:00 in time
    const selectedDateWithCurrentTime: Date = this.combineDateAndTime(this.viewDate, DateUtil.getFormattedTimeFromDate(new Date(), true, false, false));
    this.dispatchService.selectedstartDate$.next(selectedDateWithCurrentTime);
    // this.getJobs();
    this.getDispatchBoardEvents();
  }

  setDisableHrs(date: Date) {
    const hrs = date.getHours();
    this.disabledHours = () => {
      return this.getValuesFromRange(0, hrs);
    };
    return this.disabledHours;
  }

  setDisableMins(date: Date) {
    const mins = date.getMinutes();
    this.disabledMinutes = () => {
      return this.getValuesFromRange(0, mins);
    };
    return this.disabledMinutes;
  }

  setDisableSecs() {
    // do nothing
  }

  onChangeStartTime(event) {
    if (this.dispatchBoardEvent && this.dispatchBoardEvent.endTime) {
      this.dispatchBoardEvent.endTime = null;
    }
    this.setDisableHrs(event);
    this.setDisableMins(event);
  }

  getValuesFromRange(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  getChangedType() {
    return ChangeModule.DISPATCH_BOARD_EVENT;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
