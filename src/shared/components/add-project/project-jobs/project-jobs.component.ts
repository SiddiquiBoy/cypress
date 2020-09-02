import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Project } from 'src/app/modals/project/project';
import { Subscription } from 'rxjs';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { AddProjectService } from '../services/add-project.service';
import { ControlContainer, NgForm } from '@angular/forms';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Utils } from 'src/shared/utilities/utils';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { Job } from 'src/app/modals/job/job';
import { JobType } from 'src/app/modals/job-type/job-type';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { Technician } from 'src/app/modals/people/technician';
import { Tag } from 'src/app/modals/tag/tag';
import { Address } from 'src/app/modals/address/address';
import { DateUtil } from 'src/shared/utilities/date-util';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Change } from 'src/app/modals/change/change';
import { Service } from 'src/app/modals/service/service';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-project-jobs',
  templateUrl: './project-jobs.component.html',
  styleUrls: ['./project-jobs.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class ProjectJobsComponent implements OnInit, OnDestroy {

  _project: Project = new Project();
  @Input() set project(project: Project) {
    this._project = project;
    this.setSelectedJobType();
    this.setSelectedBusinessUnit();
    this.setSelectedTechnicians();
    this.setSelectedTags();
    this.setSelectedServices();
    this.setSelectedAddresses();
  }

  get project() {
    return this._project;
  }

  _jobTypes: JobType[] = [];
  @Input() set jobTypes(jobTypes: JobType[]) {
    this._jobTypes = jobTypes;
    this.setSelectedJobType();
  }

  get jobTypes() {
    return this._jobTypes;
  }

  _businessUnits: BusinessUnit[] = [];
  @Input() set businessUnits(businessUnits: BusinessUnit[]) {
    this._businessUnits = businessUnits;
    this.setSelectedBusinessUnit();
  }

  get businessUnits() {
    return this._businessUnits;
  }

  _technicians: Technician[] = [];
  @Input() set technicians(technicians: Technician[]) {
    this._technicians = technicians;
    this.setSelectedTechnicians();
  }

  get technicians() {
    return this._technicians;
  }

  _tags: Tag[] = [];
  @Input() set tags(tags: Tag[]) {
    this._tags = tags;
    this.setSelectedTags();
  }

  get tags() {
    return this._tags;
  }

  _services: Service[] = [];
  @Input() set services(services: Service[]) {
    this._services = services;
    this.setSelectedServices();
  }

  get services() {
    return this._services;
  }

  @Input() changedType: string;

  @Output() eEmitIsJobTabValid = new EventEmitter<any>();

  subscriptions: Subscription[] = [];
  statusDropdown: AppDropdown[] = [];
  addButtonIcon: string;
  removeButtonIcon: string;
  isJobsTabValid = false;
  customerAddresses: Address[] = [];
  disabledDate: any;
  disableTime: any;
  disableHrs: any;
  disableMins: any;
  disableSecs: any;
  showAll = false; // for time picker
  disableMinutes = false; // for time picker
  dateFormat: string;
  maximumSelections: number;

    // placeholders
    projectJobJobTypePlaceholder: string;
    projectJobBusinessUnitPlaceholder: string;
    projectJobLeadSourcePlaceholder: string;
    projectJobSummaryPlaceholder: string;
    projectJobTechniciansPlaceholder: string;
    projectJobTagsPlaceholder: string;
    projectJobStartDatePlaceholder: string;
    projectJobStartTimePlaceholder: string;
    projectJobRescheduleDatePlaceholder: string;
    projectJobRescheduleTimePlaceholder: string;
    projectJobCustomerPlaceholder: string;
    projectJobProjectPlaceholder: string;
    projectJobBillingAddressesPlaceholder: string;
    projectJobServiceAddressesPlaceholder: string;
    projectJobServicesPlaceholder: string;
    projectJobStatusPlaceholder: string;

  constructor(
    private addProjectService: AddProjectService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.addButtonIcon = IconConstants.PLUS_CIRCLE;
    this.removeButtonIcon = IconConstants.DELETE;
    this.dateFormat = DateUtil.inputDefaultDateFormat;
    this.setDropdowns();
    this.setDisableDate();
    // this.setDisableTime();
    this.setDisableHrs();
    this.setDisableMins();
    this.setDisableSecs();
    // if (!this.project.jobs || this.project.jobs.length === 0) {
    //   this.addInitialJob();
    // } else {
    //   // do nothing
    // }

    this.subscriptions.push(
      this.addProjectService.isJobTabValid$.subscribe((val) => {
        this.isJobsTabValid = val;
      })
    );

    this.subscriptions.push(
      this.addProjectService.selectedCustomerAddresses$.subscribe((val) => {
        this.customerAddresses = val;
        this.setSelectedAddresses();
      })
    );

    this.setMaximumSelections();
  }

  setPlaceholders() {
    this.projectJobJobTypePlaceholder = PlaceholderConstant.JOB_TYPE;
    this.projectJobBusinessUnitPlaceholder = PlaceholderConstant.BUSINESS_UNIT;
    this.projectJobLeadSourcePlaceholder = PlaceholderConstant.JOB_LEAD_SOURCE;
    this.projectJobSummaryPlaceholder = PlaceholderConstant.JOB_SUMMARY;
    this.projectJobTechniciansPlaceholder = PlaceholderConstant.TECHNICIANS;
    this.projectJobTagsPlaceholder = PlaceholderConstant.TAGS;
    this.projectJobStartDatePlaceholder = PlaceholderConstant.START_DATE;
    this.projectJobStartTimePlaceholder = PlaceholderConstant.START_TIME;
    this.projectJobRescheduleDatePlaceholder = PlaceholderConstant.RESCHEDULE_DATE;
    this.projectJobRescheduleTimePlaceholder = PlaceholderConstant.RESCHEDULE_TIME;
    this.projectJobCustomerPlaceholder = PlaceholderConstant.CUSTOMER;
    this.projectJobProjectPlaceholder = PlaceholderConstant.PROJECT;
    this.projectJobBillingAddressesPlaceholder = PlaceholderConstant.BILLING_ADDRESSES;
    this.projectJobServiceAddressesPlaceholder = PlaceholderConstant.SERVICE_ADDRESSES;
    this.projectJobServicesPlaceholder = PlaceholderConstant.SERVICES;
    this.projectJobStatusPlaceholder = PlaceholderConstant.STATUS;
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

  setDisableTime() {
    this.disableTime = () => {
      const currentDate = DateUtil.getCurrentDate();
      const hrs = currentDate.getHours();
      const mins = currentDate.getMinutes();
      const secs = currentDate.getSeconds();
      return {
        nzDisabledHours: () => this.getValuesFromRange(0, hrs),
        nzDisabledMinutes: () => this.getValuesFromRange(0, mins),
        nzDisabledSeconds: () => this.getValuesFromRange(0, secs)
      };
    };
  }

  getDisableHrs(index: number) {
    // const hrs = DateUtil.getCurrentDate().getHours();
    // if (this.project && this.project.jobs && this.project.jobs[index]) {
    //   if (this.project.jobs[index].startDate) {
    //     if (new Date(DateUtil.setToBeginning(this.project.jobs[index].startDate)).valueOf() > new Date(DateUtil.getCurrentDate()).valueOf()) {
    //       return [];
    //     } else {
    //       this.getValuesFromRange(0, hrs);
    //     }
    //   } else {
    //     return [];
    //   }
    // } else {
    //   return [];
    // }
    this.setDisableHrs();
  }

  getDisableMins(index: number) {
    const mins = DateUtil.getCurrentDate().getMinutes();
    if (this.project && this.project.jobs && this.project.jobs[index]) {
      if (this.project.jobs[index].startDate) {
        if (new Date(DateUtil.setToBeginning(this.project.jobs[index].startDate)).valueOf() > new Date(DateUtil.getCurrentDate()).valueOf()) {
          return [];
        } else {
          this.getValuesFromRange(0, mins);
        }
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  getDisableSecs(index: number) {
    const secs = DateUtil.getCurrentDate().getSeconds();
    if (this.project && this.project.jobs && this.project.jobs[index]) {
      if (this.project.jobs[index].startDate) {
        if (new Date(DateUtil.setToBeginning(this.project.jobs[index].startDate)).valueOf() > new Date(DateUtil.getCurrentDate()).valueOf()) {
          return [];
        } else {
          this.getValuesFromRange(0, secs);
        }
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  onTimePickerOpen(event, index: number) {
    if (event) {
      if (this.project && this.project.jobs && this.project.jobs[index]) {
        if (this.project.jobs[index].startDate) {
          if (this.project.jobs[index].startTime) {
            const jobStarthr = this.project.jobs[index].startTime.getHours();
            const currentHour = DateUtil.getCurrentDate().getHours();
            if (jobStarthr === currentHour) {
              this.disableMinutes = true;
            } else {
              this.disableMinutes = false;
            }
          } else {
            this.project.jobs[index].startTime = this.project.jobs[index].startDate;
            const jobStarthr = this.project.jobs[index].startTime.getHours();
            const currentHour = DateUtil.getCurrentDate().getHours();
            if (jobStarthr === currentHour) {
              this.disableMinutes = true;
            } else {
              this.disableMinutes = false;
            }
          }
          if (new Date(DateUtil.setToBeginning(this.project.jobs[index].startDate)).valueOf() > new Date(DateUtil.getCurrentDate()).valueOf()) {
            this.showAll = true;
          } else {
            this.showAll = false;
          }
        }
      }
    } else {
      // if (this.project && this.project.jobs && this.project.jobs[index]) {
      //   if (this.project.jobs[index].startDate) {
      //     if (this.project.jobs[index].startTime) {
      //     } else {
      //       this.project.jobs[index].startTime = this.project.jobs[index].startDate;
      //     }
      //     const jobStarthr = this.project.jobs[index].startTime.getHours();
      //     const currentHour = DateUtil.getCurrentDate().getHours();
      //     if (jobStarthr === currentHour) {
      //       this.disableMinutes = true;
      //     } else {
      //       this.disableMinutes = false;
      //     }
      //   } else {
      //     // do nothing
      //   }
      // } else {
      //   // do nothing
      // }
    }
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
          if (this.disableMinutes) {
            return this.getValuesFromRange(0, mins);
          } else {
            return [];
          }
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
          return [];
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

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.MAX_SELECTION;
  }

  setDropdowns() {
    this.setStatusDropdown();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    // this.statusDropdown = Utils.createDropdown(JobStatus, false, true);
    this.statusDropdown = Utils.createDropdownForNewEnum(JobStatus, false, false, false, false);
  }

  addInitialJob() {
    const job: Job = new Job();
    job.jobType = null;
    job.businessUnit = null;
    // job.status = this.statusDropdown.filter(item => item.value === JobStatus.unassigned)[0].label;
    job.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(JobStatus, JobStatus.unassigned))[0].value;
    this.project.jobs.push(job);
    // this.project.jobs = Utils.cloneDeep(this.project.jobs);
  }

  onJobTypeChange(index: number) {
    if (this.project && this.project.jobs && this.project.jobs[index]) {
      // this.project.jobs[index].jobTypeId = this.project.jobs[index].jobType.id;
    }
  }

  onBusinessUnitChange(index: number) {
    if (this.project && this.project.jobs && this.project.jobs[index]) {
      // this.project.jobs[index].businessUnitId = this.project.jobs[index].businessUnit.id;
    }
  }

  onServiceChange(index: number) {
    if (this.project && this.project.jobs && this.project.jobs[index]) {
      // do nothing
    } else {
      // do nothing
    }
  }

  onStartDateChange(event, index: number) {
    if (this.project && this.project.jobs && this.project.jobs[index]) {
      this.project.jobs[index].startTime = null;
    } else {
      // do nothing
    }
  }

  onStartTimeChange(event, index: number) {
    // this.onTimePickerOpen(event, index);
  }

  setSelectedJobType() {
    if (this.project && this.project.jobs) {
      this.project.jobs.forEach((job, index) => {
        if (job.jobType && job.jobType.id) {
          const projectJobType = this.jobTypes.filter(jt => jt.id === job.jobType.id)[0];
          if (projectJobType && projectJobType.id) {
            job.jobType = projectJobType;
            this.onJobTypeChange(index);
          }
        } else {
          // do nothing
        }
      });
    }
  }

  setSelectedBusinessUnit() {
    if (this.project && this.project.jobs) {
      this.project.jobs.forEach((job, index) => {
        if (job.businessUnit && job.businessUnit.id) {
          const bu = this.businessUnits.filter(unit => unit.id === job.businessUnit.id)[0];
          if (bu && bu.id) {
            job.businessUnit = bu;
            this.onBusinessUnitChange(index);
          }
        } else {
          // do nothing
        }
      });
    }
  }

  setSelectedTechnicians() {
    if (this.project && this.project.jobs) {
      this.project.jobs.forEach((job, index) => {
        if (job.technicians && job.technicians.length > 0) {
          const techies = this.technicians.filter(techie => job.technicians.findIndex(tech => tech.id === techie.id) !== -1);
          if (techies && techies.length > 0) {
            job.technicians = techies;
          }
        } else {
          // do nothing
        }
      });
    }
  }

  setSelectedTags() {
    if (this.project && this.project.jobs) {
      this.project.jobs.forEach((job, index) => {
        if (job.tags && job.tags.length > 0) {
          const tags = this.tags.filter(tag => job.tags.findIndex(t => t.id === tag.id) !== -1);
          if (tags && tags.length > 0) {
            job.tags = tags;
          }
        } else {
          // do nothing
        }
      });
    }
  }

  setSelectedServices() {
    if (this.project && this.project.jobs) {
      this.project.jobs.forEach((job, index) => {
        if (job.services && job.services.length > 0) {
          const services = this.services.filter(service => job.services.findIndex(serv => serv.id === service.id) !== -1);
          if (services && services.length > 0) {
            job.services = services;
          } else {
            // do nothing
          }
        }
      })
    } else {
      // do nothing
    }
  }

  setSelectedAddresses() {
    if (this.project && this.project.jobs) {
      this.project.jobs.forEach((job, index) => {
        // if (job.addresses && job.addresses.length > 0) {
        //   const adds = this.customerAddresses.filter(add => job.addresses.findIndex(a => a.id === add.id) !== -1);
        //   if (adds && adds.length > 0) {
        //     job.addresses = adds;
        //   }
        // } else {
        //   // do nothing
        // }
        // setting billing addresses
        if (job.billingAddresses && job.billingAddresses.length > 0) {
          const adds = this.customerAddresses.filter(add => job.billingAddresses.findIndex(a => a.id === add.id) !== -1);
          if (adds && adds.length > 0) {
            job.billingAddresses = adds;
          }
        } else {
          // do nothing
        }

        // setting service addresses
        if (job.serviceAddresses && job.serviceAddresses.length > 0) {
          const adds = this.customerAddresses.filter(add => job.serviceAddresses.findIndex(a => a.id === add.id) !== -1);
          if (adds && adds.length > 0) {
            job.serviceAddresses = adds;
          }
        } else {
          // do nothing
        }
      });
    }
  }

  addJob() {
    this.addInitialJob();
  }

  removeJob(index: number) {
    this.project.jobs.splice(index, 1);
    this.project.jobs = Utils.cloneDeep(this.project.jobs);
    this.updateChangesObject('jobs', index, ActionEvent.DELETE);
  }

  updateChangesObject(partialFieldName: string, index: number, action: string) {
    let changes = this.changeService.getChanges();
    if (index !== undefined && index !== null) {
      switch (action) {
        case ActionEvent.DELETE: {
          changes = changes.filter(change => !change.fieldName.includes(partialFieldName + '/' + index));
          changes = this.updateChangesObjectForOtherIndices(partialFieldName, index, changes);
          break;
        }
        default: {
          changes = changes.filter(change => !change.fieldName.includes(partialFieldName + '/' + index));
          changes = this.updateChangesObjectForOtherIndices(partialFieldName, index, changes);
        }
      }
      this.setChangesObject(changes);
    } else {
      // do nothing
    }
  }

  updateChangesObjectForOtherIndices(partialFieldName: string, index: number, changes: Change[]): Change[] {
    const unIndexedChanges = changes.filter(change => !change.fieldName.includes(partialFieldName + '/'));
    const indexedChanges = changes.filter(change => change.fieldName.includes(partialFieldName + '/'));
    indexedChanges.forEach((change) => {
      const indexToChange = Utils.getIndexFromChange(change);
      if (indexToChange !== -1 && indexToChange > index) {
        change.fieldName = change.fieldName.replace(partialFieldName + '/' + indexToChange, partialFieldName + '/' + (indexToChange - 1));
      } else {
        // do nothing
      }
    });
    return [...unIndexedChanges, ...indexedChanges];
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

  isJobTabValid() {
    this.eEmitIsJobTabValid.emit(true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
