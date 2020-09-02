import { Component, OnInit, Input, ViewEncapsulation, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Job } from 'src/app/modals/job/job';
import { Utils } from 'src/shared/utilities/utils';
import { DateUtil } from 'src/shared/utilities/date-util';
import { ViewJobService } from '../services/view-job.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Subscription } from 'rxjs';
import { Technician } from 'src/app/modals/people/technician';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Router } from '@angular/router';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { JobType } from 'src/app/modals/job-type/job-type';
import { JobNote } from 'src/app/modals/job-note/job-note';
import { DatePipe } from '@angular/common';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { User } from 'src/app/modals/user/user';

@Component({
  selector: 'app-job-summary',
  templateUrl: './job-summary.component.html',
  styleUrls: ['./job-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobSummaryComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  listTechnicians: Technician[] = [];
  selectedTechnicians: Technician[] = [];
  statusDropdown: AppDropdown[] = [];

  @Input() job: Job;

  @Output() emitRefreshData = new EventEmitter<any>();

  remarks: string;
  note: JobNote = new JobNote();
  editTechnicianPermission: string;
  updateJobStatusPermission: string;
  viewJobEventsPermission: string;
  editJobPermission: string;
  addJobNotePermission: string;
  editJobNotePermission: string;
  viewJobNotePermission: string;
  startDate: Date;
  startTime: Date;
  updateToJobStatus: JobStatus;
  surveyLink: string;
  urlRegex: RegExp;

  disabledDate: any;
  disableTime: any;
  disableHrs: any;
  disableMins: any;
  disableSecs: any;
  showAll = false; // for time picker

  statusTagColor: string = 'blue';
  showEditTechnicianDialog: boolean = false;
  showRemarkDialog: boolean = false;
  showRescheduleDialog: boolean = false;
  isSpinning: boolean = false;
  isEditButtonDisabled: boolean = false;
  isEditTechnicianDisabled: boolean = false;
  showJobNoteDialog: boolean = false;
  isNotePinned: boolean = false;
  showEditJobDialog: boolean = false;
  showConfirmDialog: boolean = false;
  showSendSurveyLinkDialog: boolean = false;

  maxTagsToDisplay = DisplayConstant.MAX_TAGS;
  maxAddressesToDisplay = DisplayConstant.MAX_ADDRESSES;

  surveyLinkFormDescription: string;
  orgId: string;

  constructor(
    private viewJobService: ViewJobService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.setOrgId();
    this.setEditButtonPermissions();
    this.setEditTechnicianPermissions();
    this.setStatusDropdown();
    this.setPermissions();
    this.setStatusTagColor();

    this.setDisableDate();
    this.setDisableHrs();
    this.setDisableMins();
    this.setDisableSecs();
    this.setRegexp();
    // this.showRemarkDialog = true;
    this.setSurveyLinkFormDescription();
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        if (user && user.organization) {
          this.orgId = user.organization.id;
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  setEditButtonPermissions() {
    if (JobStatus[this.job.status] !== JobStatus.scheduled &&
      JobStatus[this.job.status] !== JobStatus.unassigned &&
      JobStatus[this.job.status] !== JobStatus.hold) {
        this.isEditButtonDisabled = true;
    } else {
      this.isEditButtonDisabled = false;
    }
  }

  setEditTechnicianPermissions() {
    if (JobStatus[this.job.status] !== JobStatus.scheduled &&
      JobStatus[this.job.status] !== JobStatus.unassigned &&
      JobStatus[this.job.status] !== JobStatus.hold) {
        this.isEditTechnicianDisabled = true;
    } else {
      this.isEditTechnicianDisabled = false;
    }
  }

  setPermissions() {
    this.editTechnicianPermission = Permission.UPDATE_JOB_TECHNICIAN;
    this.updateJobStatusPermission = Permission.UPDATE_JOB_STATUS;
    this.editJobPermission = Permission.EDIT_JOB;
    this.viewJobEventsPermission = Permission.VIEW_JOB_EVENTS;
    this.addJobNotePermission = Permission.ADD_JOB_NOTE;
    this.editJobNotePermission = Permission.EDIT_JOB_NOTE;
    this.viewJobNotePermission = Permission.VIEW_JOB_NOTE;

  }

  setDisableDate() {
    this.disabledDate = (current: Date): boolean => {
      // Can not select days before today and today
      // return differenceInCalendarDays(current, this.today) > 0;
      const currentDate = DateUtil.getCurrentDate();
      return new Date(DateUtil.setToBeginning(new Date(current))).valueOf() < new Date(DateUtil.setToBeginning(new Date(currentDate))).valueOf();
      // current < currentDate;
    };
  }

  setDisableHrs() {
    if (this.showAll) {
      return [];
    } else {
      const hrs = DateUtil.getCurrentDate().getHours();
      this.disableHrs = () => {
        if (this.showAll) {
          return [];
        } else {
          return this.getValuesFromRange(0, hrs);
        }
      };
      return this.disableHrs;
    }
  }

  setDisableMins() {
    if (this.showAll) {
      return [];
    } else {
      const mins = DateUtil.getCurrentDate().getMinutes();
      this.disableMins = () => {
        if (this.showAll) {
          return [];
        } else {
          if (this.startTime) {
            const jobStarthr = this.startTime.getHours();
            const currentHour = DateUtil.getCurrentDate().getHours();
            if (jobStarthr === currentHour) {
              return this.getValuesFromRange(0, mins);
            } else {
              return [];
            }
          } else {
            // this case should never occur
            return this.getValuesFromRange(0, mins);
          }
          // return this.getValuesFromRange(0, mins);
        }
      };
    }
  }

  setDisableSecs() {
    if (this.showAll) {
      return [];
    } else {
      const secs = DateUtil.getCurrentDate().getSeconds();
      this.disableSecs = () => {
        if (this.showAll) {
          return [];
        } else {
          // return this.getValuesFromRange(0, secs);
          // return [];
          if (this.startTime) {
            const jobStarthr = this.startTime.getHours();
            const currentHour = DateUtil.getCurrentDate().getHours();
            if (jobStarthr === currentHour) {
              return this.getValuesFromRange(0, secs);
            } else {
              return [];
            }
          } else {
            // this case should never occur
            return this.getValuesFromRange(0, secs);
          }
        }
      };
    }
  }

  getValuesFromRange(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  onStartDateChange(event) {
    this.startTime = null;
  }

  onStartTimeChange(event) {
    console.log('time event', event);
  }

  onTimePickerOpen(event) {
    if (event) {
      if (this.startDate) {
        if (new Date(DateUtil.setToBeginning(this.startDate)).valueOf() > new Date(DateUtil.getCurrentDate()).valueOf()) {
          this.showAll = true;
        } else {
          this.showAll = false;
        }
      }
    }
  }

  setRegexp() {
    this.urlRegex = Utils.urlRegex;
  }

  setSurveyLinkFormDescription() {
    this.surveyLinkFormDescription = `Email a survey link to this customer for receiving feedback on services provided, performance of technician(s), quality of work etc.`;
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    // this.statusDropdown = Utils.createDropdownForNewEnum(JobStatus, false, false, false, false);
    const statusDropdown = Utils.createDropdownForNewEnum(JobStatus, false, false, false, false);
    this.filterStatusDropdown(this.job.status, statusDropdown);
  }

  setStatusTagColor() {
    if (this.job && this.job.status) {
      const jobStatus = this.job.status;
      if (JobStatus[jobStatus] === JobStatus.complete) {
        this.statusTagColor = 'green';
      } else if (JobStatus[jobStatus] === JobStatus.cancelled) {
        this.statusTagColor = 'red';
      } else if (JobStatus[jobStatus] === JobStatus.dispatched || JobStatus[jobStatus] === JobStatus.inProgress || JobStatus[jobStatus] === JobStatus.scheduled) {
        this.statusTagColor = 'blue';
      } else if (JobStatus[jobStatus] === JobStatus.unassigned || JobStatus[jobStatus] === JobStatus.hold) {
        this.statusTagColor = 'grey';
      }
    }
  }

  // Add new status (disabled and view)
  filterStatusDropdown(status: JobStatus, statusDropdown: AppDropdown[]) {
    // switch (JobStatus[status]) {
    //   case JobStatus.unassigned: {
    //     this.statusDropdown = statusDropdown.filter(dropdown => (dropdown.label === JobStatus.scheduled || dropdown.label === JobStatus.cancelled));
    //     break;
    //   }
    //   case JobStatus.scheduled: {
    //     this.statusDropdown = statusDropdown.filter(dropdown =>
    //       (dropdown.label === JobStatus.scheduled || dropdown.label === JobStatus.cancelled || dropdown.label === JobStatus.dispatched || dropdown.label === JobStatus.unassigned));
    //     break;
    //   }
    //   case JobStatus.dispatched: {
    //     this.statusDropdown = statusDropdown.filter(dropdown => (dropdown.label === JobStatus.scheduled || dropdown.label === JobStatus.cancelled || dropdown.label === JobStatus.inProgress));
    //     break;
    //   }
    //   case JobStatus.inProgress: {
    //     this.statusDropdown = statusDropdown.filter(dropdown => (dropdown.label === JobStatus.scheduled || dropdown.label === JobStatus.complete || dropdown.label === JobStatus.hold));
    //     break;
    //   }
    //   case JobStatus.hold: {
    //     this.statusDropdown = statusDropdown.filter(dropdown =>
    //       (dropdown.label === JobStatus.scheduled || dropdown.label === JobStatus.cancelled || dropdown.label === JobStatus.dispatched || dropdown.label === JobStatus.complete));
    //     break;
    //   }
    //   default: {
    //     this.statusDropdown = [];
    //   }
    // }
    if (JobStatus[status] === JobStatus.unassigned) {
      // Available status with permission check
      statusDropdown.forEach(dropdown => {
        dropdown.show = false;
        if (dropdown.label === JobStatus.scheduled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_SCHEDULE)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.cancelled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_CANCEL)) {
            dropdown.show = true;
          }
        }
      });
    } else if (JobStatus[status] === JobStatus.scheduled) {
      statusDropdown.forEach(dropdown => {
        dropdown.show = false;
        if (dropdown.label === JobStatus.scheduled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_SCHEDULE)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.cancelled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_CANCEL)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.dispatched) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_DISPATCH)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.unassigned) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_UNASSIGN)) {
            dropdown.show = true;
          }
        }
      });
    } else if (JobStatus[status] === JobStatus.dispatched) {
      statusDropdown.forEach(dropdown => {
        dropdown.show = false;
        if (dropdown.label === JobStatus.scheduled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_SCHEDULE)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.cancelled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_CANCEL)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.inProgress) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_IN_PROGRESS)) {
            dropdown.show = true;
          }
        }
      });
    } else if (JobStatus[status] === JobStatus.inProgress) {
      statusDropdown.forEach(dropdown => {
        dropdown.show = false;
        if (dropdown.label === JobStatus.scheduled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_SCHEDULE)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.complete) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_COMPLETE)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.hold) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_ON_HOLD)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.cancelled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_CANCEL)) {
            dropdown.show = true;
          }
        }
      });
    } else if (JobStatus[status] === JobStatus.hold) {
      statusDropdown.forEach(dropdown => {
        dropdown.show = false;
        if (dropdown.label === JobStatus.scheduled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_SCHEDULE)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.cancelled) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_CANCEL)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.dispatched) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_DISPATCH)) {
            dropdown.show = true;
          }
        } else if (dropdown.label === JobStatus.complete) {
          if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_STATUS_COMPLETE)) {
            dropdown.show = true;
          }
        }
      });
    } else {
      statusDropdown.forEach(dropdown => {
        dropdown.show = false;
      });
    }
    this.statusDropdown = statusDropdown;
  }

  getFormattedTimeFromTimeString(time: string) {
    if (time) {
      if (typeof time === 'object') {
        return DateUtil.getFormattedTimeFromDate(time, false, false, true);
      } else {
        return DateUtil.getFormattedTimeFromTimeString(time);
      }
    }
  }

  getFormattedTimeFromDateString(date: Date) {
    return DateUtil.getFormattedTimeFromDate(date, false, false, true);
  }

  editTechnician() {
    this.showEditTechnicianDialog = true;
    this.getTechnicians();
  }

  getTechnicians() {
    this.selectedTechnicians = [];
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewJobService.getTechnicians(this.orgId, this.getListPaginationObject(), this.getTechnicianSortObject(), null,
      this.getListFilterDataForActiveStatus()).valueChanges.subscribe(
        (response) => {
          this.isSpinning = false;
          this.listTechnicians = response.data.listUsers.data;
          this.selectedTechnicians = [... this.job.technicians];
          this.selectedTechnicians = this.listTechnicians.filter(technician => this.selectedTechnicians.findIndex(tech => tech.id === technician.id) !== -1);
          // this.showEditTechnicianDialog = true;
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

  getListPaginationObject() {
    return Utils.createListPaginationObject();
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

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  updateSelectedTechnicians(technicians: Technician[]) {
    this.selectedTechnicians = technicians;
  }

  /**
   * @description Handle Ok Click of Edit Technicians
   * modal.
   * @author Aman Purohit
   * @date 2020-07-07
   * @memberof JobSummaryComponent
   */
  onOkClick() {
    this.isSpinning = true;
    let selectedTechnicianIds: string[] = [];
    selectedTechnicianIds = this.selectedTechnicians.map(technician => technician.id);
    this.subscriptions.push(
      this.viewJobService.editTechnicians(this.job.id, selectedTechnicianIds).subscribe(
        (response: any) => {
          this.job = response.data.assignTechnicians;
          this.setStatusDropdown();
          this.setStatusTagColor();
          this.setEditButtonPermissions();
          this.setEditTechnicianPermissions();
          this.isSpinning = false;
          this.showEditTechnicianDialog = false;
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

  setRemarkAsEmpty() {
    this.remarks = '';
  }

  setStartDateAndTimeAsEmpty() {
    this.startDate = null;
    this.startTime = null;
  }

  onCancelClick(popupType: string) {
    if (popupType === 'editTechnician') {
      this.showEditTechnicianDialog = false;
    } else if (popupType === 'remarks') {
      this.setRemarkAsEmpty();
      this.showRemarkDialog = false;
    } else if (popupType === 'reschedule') {
      this.setStartDateAndTimeAsEmpty();
      this.showRescheduleDialog = false;
    } else if (popupType === 'jobNote') {
      this.showJobNoteDialog = false;
    } else if (popupType === 'editJob') {
      this.showEditJobDialog = false;
    } else if (popupType === 'confirmDialog') {
      this.showConfirmDialog = false;
    } else if (popupType === 'surveyLink') {
      this.showSendSurveyLinkDialog = false;
    }
  }

  openConfirmationDialog() {
    this.showConfirmDialog = true;
  }

  onConfirmClick(status: string) {
    if (status === 'completeJob') {
      this.changeStatus(this.updateToJobStatus, null, null, null, new Date());
    }
  }

  openRemarksPopup() {
    this.setRemarkAsEmpty();
    this.showRemarkDialog = true;
  }

  onOkRemarkClick() {
    if (this.remarks) {
      this.changeStatus(this.updateToJobStatus, null, null, this.remarks);
      this.showRemarkDialog = false;
    } else {
      this.messageService.error('Enter a remark');
    }
  }

  openRescheduleStatusPopup() {
    this.setStartDateAndTimeAsEmpty();
    this.showRescheduleDialog = true;
  }

  onOkRescheduleClick() {
    // Need to add new params for reschedule
    if (this.startDate && this.startTime) {
      const startTimeString = DateUtil.getFormattedTimeFromDate(this.startTime, true, false, false);
      if (this.job.wasJobInProgress) {
        this.changeStatus(this.updateToJobStatus, null, null, null, null, this.startDate, startTimeString);
      } else {
        this.changeStatus(this.updateToJobStatus, this.startDate, startTimeString);
      }
      this.showRescheduleDialog = false;
    } else {
      this.messageService.error('Enter start date and start time');
    }
  }

  openEditJobPopup() {
    this.showEditJobDialog = true;
  }

  onOkEditJobClick() {

  }

  checkJobFormSubmitResponse(response: boolean) {
    if (response) {
      this.showEditJobDialog = false;
      this.emitRefreshData.emit(true);
    } else {
      // do nothing
    }
  }

  handleCancelEdit(jobUpdateCancelStatus: boolean) {
    if (jobUpdateCancelStatus) {
      this.showEditJobDialog = false;
    }
  }

  openJobNotePopup() {
    this.note = new JobNote();
    // TODO: Clean code
    this.note.note = '';
    this.note.pinnedAt = null;
    this.isNotePinned = false;
    this.showJobNoteDialog = true;
  }

  onOkJobNoteClick() {
    if (this.note.note) {
      this.isSpinning = true;
      if (this.note.id) {
        this.subscriptions.push(
          this.viewJobService.updateJobNote(this.job.id, this.note)
          .subscribe(
            (response: any) => {
              this.job = response.data.updateJobNote;
              this.messageService.success(AppMessages.JOB_NOTE_UPDATED);
              this.isSpinning = false;
              this.showJobNoteDialog = false;
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
      } else {
        this.subscriptions.push(
          this.viewJobService.createJobNote(this.job.id, this.note)
          .subscribe(
            (response: any) => {
              this.job = response.data.createJobNote;
              this.messageService.success(AppMessages.JOB_NOTE_ADDED);
              this.isSpinning = false;
              this.showJobNoteDialog = false;
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
    } else {
      this.messageService.error('Enter job note');
    }
  }

  handleJobNoteSwitch(status: boolean) {
    if (status) {
      this.note.pinnedAt = new Date();
    } else {
      this.note.pinnedAt = null;
    }
  }

  editJobNote(note: JobNote) {
    this.note = Utils.cloneDeep(note);
    if (this.note.pinnedAt) {
      this.isNotePinned = true;
    } else {
      this.isNotePinned = false;
    }
    this.showJobNoteDialog = true;
  }

  formatJobNoteUpdatedAtDate(date: string) {
    if (!date) {
      return '-';
    } else {
      const _date: Date = new Date(parseInt(date));
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(date);
      const formattedTime = DateUtil.getFormattedTimeFromDate(_date, false, false, true);
      return `${formattedDate} ${formattedTime}`;
    }
  }

  sendSurveyLink() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewJobService.sendSurveyLink(this.job.id, this.surveyLink).subscribe(
        (response: any) => {
          if (response && response.data && response.data.sendSurvey) {
            this.messageService.success(AppMessages.SURVEY_LINK_SENT);
            this.isSpinning = false;
            this.showSendSurveyLinkDialog = false;
          } else {
            this.isSpinning = false;
          }
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

  onBack() {
    this.router.navigate(
      [AppUrlConstants.JOBS]
    );
  }

  handleChangeStatus(status: JobStatus) {
    this.updateToJobStatus = status;
    if (JobStatus[status] === JobStatus.scheduled) {
      // open popup with start date and start time
      this.openRescheduleStatusPopup();
    }
    if (JobStatus[status] === JobStatus.cancelled) {
      // open popup with remarks
      this.openRemarksPopup();
    }
    if (JobStatus[status] === JobStatus.hold) {
      // open popup with remarks
      this.openRemarksPopup();
    }
    if (JobStatus[status] === JobStatus.unassigned) {
      // open popup with technician
      this.editTechnician();
    }
    if (JobStatus[status] === JobStatus.inProgress) {
      // do nothing
      this.changeStatus(this.updateToJobStatus);
    }
    if (JobStatus[status] === JobStatus.dispatched) {
      // do nothing
      this.changeStatus(this.updateToJobStatus);
    }
    if (JobStatus[status] === JobStatus.complete) {
      // do nothing
      // this.changeStatus(this.updateToJobStatus, null, null, null, new Date());
      this.openConfirmationDialog();
    }
  }

  changeStatus(status: JobStatus, startDate?: Date, startTime?: string, remark?: string, completedDate?: Date, rescheduleDate?: Date, rescheduleTime?: string) {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewJobService.updateJobStatus(this.job.id, status, startDate, startTime, completedDate, rescheduleDate, rescheduleTime, remark).subscribe(
        (response: any) => {
          // Emit job to parent
          this.job = response.data.changeJobStatus;
          this.setStatusDropdown();
          this.setStatusTagColor();
          this.setEditButtonPermissions();
          this.setEditTechnicianPermissions();
          this.isSpinning = false;
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

  pinToTop(pinToTop: boolean, note: JobNote) {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewJobService.togglePinJobNote(note.id)
        .subscribe(
          (response: any) => {
            // Emit job to parent
            this.job = response.data.pinJobNote;
            this.isSpinning = false;
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

  getActiveStatusDropdown() {
    this.statusDropdown.forEach(status => {
      if (status.show) {
        return false;
      }
    });
    return true;
  }

  openSendSurveyLinkPopup() {
    this.surveyLink = '';
    this.showSendSurveyLinkDialog = true;
  }

  redirectToProject(id: string) {
    this.router.navigate(
      [AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  redirectToCustomer(id: string) {
    this.router.navigate(
      [AppUrlConstants.CUSTOMERS + AppUrlConstants.SLASH + id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
