import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/modals/project/project';
import { Customer } from 'src/app/modals/customer/customer';
import { Tag } from 'src/app/modals/tag/tag';
import { JobType } from 'src/app/modals/job-type/job-type';
import { Technician } from 'src/app/modals/people/technician';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { Subscription, Subject } from 'rxjs';
import { Job } from 'src/app/modals/job/job';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Utils } from 'src/shared/utilities/utils';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { AddJobService } from './services/add-job.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { User } from 'src/app/modals/user/user';
import { DateUtil } from 'src/shared/utilities/date-util';
import { Address } from 'src/app/modals/address/address';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { takeUntil } from 'rxjs/operators';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { Service } from 'src/app/modals/service/service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';
import { JobTechnician } from 'src/app/modals/job/job-technician';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddJobComponent implements OnInit, OnDestroy {

  @Input() redirectUpdate: boolean = true;
  @Input() projectObj: Project = new Project();
  @Input() customerId: string;
  @Input() redirectFrom: string;
  @Output() emitOnUpdate = new EventEmitter<any>();
  @Output() emitOnCancel = new EventEmitter<any>();
  isSpinning = false;
  job: Job = new Job();
  projects: Project[] = [];
  selectedProject: Project = new Project();
  customers: Customer[] = [];
  selectedCustomer: Customer = new Customer();
  jobTypes: JobType[] = [];
  tags: Tag[] = [];
  services: Service[] = [];
  technicians: Technician[] = [];
  jobTechnicians: JobTechnician[] = [];
  businessUnits: BusinessUnit[] = [];
  subscriptions: Subscription[] = [];
  customerAddresses: Address[] = [];
  selectedBillingAddresses: Address[] = [];
  selectedServiceAddresses: Address[] = [];
  statusDropdown: AppDropdown[] = [];
  orgId: string;
  isJobTimeCorrected = false;
  isJobFetched$: Subject<boolean> = new Subject<boolean>();
  showAll = false;
  disabledDate: any;
  disableTime: any;
  disableHrs: any;
  disableMins: any;
  disableSecs: any;
  // jobId: string;
  allEditableStatus: string[] = [];
  allNonEditableStatus: string[] = [];
  someEditableStatus: string[] = [];
  allFieldsEditable = true;
  allFieldsNonEditable = false;
  someFieldsEditable = false;
  changes: Change[] = [];
  changedType: string;
  dateFormat: string;
  multiple = true;

  _jobId: string;

  maximumSelections: number;
  fileUploadText: string;
  imageUrl: string;
  isImageLoading = false;

  // placeholders
  jobJobTypePlaceholder: string;
  jobBusinessUnitPlaceholder: string;
  jobLeadSourcePlaceholder: string;
  jobSummaryPlaceholder: string;
  jobTechniciansPlaceholder: string;
  jobTagsPlaceholder: string;
  jobStartDatePlaceholder: string;
  jobStartTimePlaceholder: string;
  jobRescheduleDatePlaceholder: string;
  jobRescheduleTimePlaceholder: string;
  jobCustomerPlaceholder: string;
  jobProjectPlaceholder: string;
  jobBillingAddressesPlaceholder: string;
  jobServiceAddressesPlaceholder: string;
  jobServicesPlaceholder: string;
  jobStatusPlaceholder: string;

  @Input() isProjectDetails: boolean;
  @Input() set jobId(jobId: string) {
    this._jobId = jobId;
    if (jobId) {
      this.getJob();
    }
  }
  get jobId() {
    return this._jobId;
  }

  constructor(
    private router: Router,
    private messageService: MessageService,
    private activateRoute: ActivatedRoute,
    private addJobService: AddJobService,
    private authenticationService: AuthenticationService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setFileUploadText();
    this.setStatusDropdown();
    this.setStatusValidationArrays();
    this.setDisableDate();
    this.setDisableHrs();
    this.setDisableMins();
    this.setDisableSecs();
    this.setOrgId();
    this.getRouteParams();
    // this.getCustomers();
    // this.getJobTypes();
    // this.getBusinessUnits();
    // this.getTechnicians();
    // this.getServices();
    // this.getTags();
    this.setMaximumSelections();
    this.changedType = this.getChangedType();
    this.dateFormat = DateUtil.inputDefaultDateFormat;
  }

  setPlaceholders() {
    this.jobJobTypePlaceholder = PlaceholderConstant.JOB_TYPE;
    this.jobBusinessUnitPlaceholder = PlaceholderConstant.BUSINESS_UNIT;
    this.jobLeadSourcePlaceholder = PlaceholderConstant.JOB_LEAD_SOURCE;
    this.jobSummaryPlaceholder = PlaceholderConstant.JOB_SUMMARY;
    this.jobTechniciansPlaceholder = PlaceholderConstant.TECHNICIANS;
    this.jobTagsPlaceholder = PlaceholderConstant.TAGS;
    this.jobStartDatePlaceholder = PlaceholderConstant.START_DATE;
    this.jobStartTimePlaceholder = PlaceholderConstant.START_TIME;
    this.jobRescheduleDatePlaceholder = PlaceholderConstant.RESCHEDULE_DATE;
    this.jobRescheduleTimePlaceholder = PlaceholderConstant.RESCHEDULE_TIME;
    this.jobCustomerPlaceholder = PlaceholderConstant.CUSTOMER;
    this.jobProjectPlaceholder = PlaceholderConstant.PROJECT;
    this.jobBillingAddressesPlaceholder = PlaceholderConstant.BILLING_ADDRESSES;
    this.jobServiceAddressesPlaceholder = PlaceholderConstant.SERVICE_ADDRESSES;
    this.jobServicesPlaceholder = PlaceholderConstant.SERVICES;
    this.jobStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  setFileUploadText() {
    this.fileUploadText = 'Upload Attachments';
  }

  disabledDateTime() {
    this.setDisableDate();
    this.setDisableHrs();
    this.setDisableMins();
    this.setDisableSecs();
  }


  getRouteParams() {
    this.subscriptions.push(
      this.activateRoute.params.subscribe((params: Params) => {
        if (params.id) {
          this.jobId = params.id;
          this.getJob();
        } else {
          if (!this.jobId) {
            this.jobId = undefined;
            this.getCustomers();
            this.getJobTypes();
            this.getBusinessUnits();
            this.getTechnicians();
            this.getServices();
            this.getTags();
            this.changeService.setInitialJob(Utils.cloneDeep(this.job));
            this.isJobTimeCorrected = true;
            this.job.jobType = null;
            this.job.businessUnit = null;
            this.selectedCustomer = null;
            // this.selectedProject = null;
            this.job.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(JobStatus, JobStatus.unassigned))[0].value;
            this.setFieldEditableValues();
          }
        }
      })
    );
  }

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.MAX_SELECTION;
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(JobStatus, false, false, false, false);
  }

  setStatusValidationArrays() {
    this.allEditableStatus = [Utils.getEnumKey(JobStatus, JobStatus.unassigned), Utils.getEnumKey(JobStatus, JobStatus.scheduled)];
    this.allNonEditableStatus = [Utils.getEnumKey(JobStatus, JobStatus.dispatched), Utils.getEnumKey(JobStatus, JobStatus.inProgress),
    Utils.getEnumKey(JobStatus, JobStatus.cancelled), Utils.getEnumKey(JobStatus, JobStatus.complete)];
    this.someEditableStatus = [Utils.getEnumKey(JobStatus, JobStatus.hold)];
  }

  onSubmitForm() {
    this.isSpinning = true;
    this.setAddressesForBackend();
    this.changes = this.changeService.getChanges();
    if (this.jobId) {
      this.updateJob();
    } else {
      this.createJob();
    }
  }

  setAddressesForBackend() {
    this.job.billingAddresses = this.selectedBillingAddresses;
    this.job.serviceAddresses = this.selectedServiceAddresses;
  }

  createJob() {
    this.subscriptions.push(
      this.addJobService.createJob(this.job).subscribe(
        (response) => {
          if (response && response.data && response.data.createJob) {
            this.isSpinning = false;
            this.messageService.success(AppMessages.JOB_ADDED);
            if (this.redirectUpdate) {
              const id = response.data.createJob.id;
              this.navigateToJobView(id);
            } else {
              this.emitOnUpdate.emit(true);
            }
          } else {
            this.isSpinning = false;
            this.emitOnUpdate.emit(false);
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          this.emitOnUpdate.emit(false);
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

  updateJob() {
    this.subscriptions.push(
      this.addJobService.updateJob(this.job, this.changes).subscribe(
        (response) => {
          if (response) {
            this.isSpinning = false;
            this.messageService.success(AppMessages.JOB_UPDATED);
            if (this.redirectUpdate) {
              this.navigateToJobView(this.job.id);
            } else {
              this.emitOnUpdate.emit(true);
            }
          } else {
            this.isSpinning = false;
            this.emitOnUpdate.emit(false);
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          this.emitOnUpdate.emit(false);
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

  navigateToJobView(id: string) {
    this.router.navigate([
      AppUrlConstants.JOBS + AppUrlConstants.SLASH + id + AppUrlConstants.SLASH + AppUrlConstants.VIEW
    ]);
  }

  getJob() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getJob(this.jobId).valueChanges.pipe(takeUntil(this.isJobFetched$)).subscribe((response: any) => {
        if (response) {
          this.job = response['data']['getJob'];
          this.getCustomers();
          this.getJobTypes();
          this.getBusinessUnits();
          this.getTechnicians();
          this.getServices();
          this.getTags();
          this.changeService.setInitialJob(Utils.cloneDeep(this.job));
          this.isJobFetched$.next(true);
          // this.selectedProject = this.job.project;
          // this.selectedCustomer = this.job.project.customer;
          // && this.job.startTime
          if (this.job.startDate) {
            if (this.job.startTime !== null && this.job.startTime !== undefined) {
              let date: Date;
              if (this.job.startTime instanceof Date) {
                date = this.job.startTime;
              } else {
                date = this.getFormattedStartTime();
              }
              this.job.startTime = date;
            } else {
              this.job.startTime = null;
            }
          } else {
            // do nothing
          }
          this.isJobTimeCorrected = true;
          this.setFieldEditableValues();
          this.setAllDropdowns();
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
        (error: any) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isJobTimeCorrected = true;
          this.isSpinning = false;
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        })
    );
  }

  setFieldEditableValues() {
    if (this.allEditableStatus.includes(this.job.status)) {
      this.allFieldsEditable = true;
      this.allFieldsNonEditable = false;
      this.someFieldsEditable = false;
    } else if (this.allNonEditableStatus.includes(this.job.status)) {
      this.allFieldsEditable = false;
      this.allFieldsNonEditable = true;
      this.someFieldsEditable = false;
    } else if (this.someEditableStatus.includes(this.job.status)) {
      this.allFieldsEditable = false;
      this.allFieldsNonEditable = false;
      this.someFieldsEditable = true;
    } else {
      // do nothing
    }
  }

  getFormattedStartTime(): Date {
    const date = new Date(this.job.startDate);
    const splittedTime = this.job.startTime.toString().split(':');
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

  setAllDropdowns() {
    this.setSelectedBusinessUnit();
    this.setSelectedJobType();
    this.setSelectedTechnicians();
    this.setSelectedTags();
    this.setSelectedCustomer();
    // this.setSelectedProject();
    this.setSelectedServices();
  }

  setSelectedBusinessUnit() {
    if (this.businessUnits && this.businessUnits.length > 0 && this.job.businessUnit && this.job.businessUnit.id) {
      this.job.businessUnit = this.businessUnits.filter(unit => unit.id === this.job.businessUnit.id)[0];
    } else {
      // do nothing
    }
  }

  setSelectedServices() {
    if (this.job.services && this.job.services.length > 0) {
      const services = this.services.filter(service => this.job.services.findIndex(serv => serv.id === service.id) !== -1);
      if (services && services.length > 0) {
        this.job.services = services;
      } else {
        // do nothing
      }
    }
  }

  setSelectedJobType() {
    if (this.jobTypes && this.jobTypes.length > 0 && this.job.jobType && this.job.jobType.id) {
      this.job.jobType = this.jobTypes.filter(jType => jType.id === this.job.jobType.id)[0];
    } else {
      // do nothing
    }
  }

  setSelectedTechnicians() {

    /*=============================================
    =            need to remove            =
    =============================================*/

    if (this.technicians && this.technicians.length > 0 && this.job.technicians && this.job.technicians.length > 0) {
      const techies = this.technicians.filter(techie => this.job.technicians.findIndex(tech => tech.id === techie.id) !== -1);
      if (techies && techies.length > 0) {
        this.job.technicians = techies;
      }
    } else {
      // do nothing
    }

    /*=====  End of need to remove  ======*/


    if (this.jobTechnicians && this.jobTechnicians.length > 0 && this.job.jobTechnicians && this.job.jobTechnicians.length > 0) {
      const techies = this.jobTechnicians.filter(techie => this.job.jobTechnicians.findIndex(tech => tech.id === techie.id) !== -1);
      if (techies && techies.length > 0) {
        this.job.jobTechnicians = techies;
      }
    } else {
      // do nothing
    }
  }

  setSelectedTags() {
    if (this.tags && this.tags.length > 0 && this.job.tags && this.job.tags.length > 0) {
      const tags = this.tags.filter(tag => this.job.tags.findIndex(t => t.id === tag.id) !== -1);
      if (tags && tags.length > 0) {
        this.job.tags = tags;
      }
    } else {
      // do nothing
    }
  }

  setSelectedCustomer() {
    if (this.projectObj && !this.redirectUpdate && this.redirectFrom === 'project') {
      const customer = this.customers.filter(cus => cus.id === this.projectObj.customer.id)[0];
      if (customer && customer.id) {
        this.customers = [];
        this.customers = [customer];
        this.job.project.customer = customer;
        this.selectedCustomer = customer;
        this.onCustomerSelect();
        this.setSelectedAddresses();
      } else {
        // do nothing
      }
    } else if (this.customerId && !this.redirectUpdate && this.redirectFrom === 'customer') {
      const customer: Customer = this.customers.filter(cus => cus.id === this.customerId)[0];
      if (customer && customer.id) {
        this.job.project.customer = customer;
        this.selectedCustomer = customer;
        this.onCustomerSelect();
        this.setSelectedAddresses();
      } else {
        // do nothing
      }
    } else {
      if (this.job && this.job.project && this.job.project.customer && this.job.project.customer.id && this.customers && this.customers.length > 0) {
        const customer: Customer = this.customers.filter(cus => cus.id === this.job.project.customer.id)[0];
        if (customer && customer.id) {
          this.job.project.customer = customer;
          this.selectedCustomer = customer;
          this.onCustomerSelect();
          this.setSelectedAddresses();
        } else {
          // do nothing
        }
      }
    }
  }

  setSelectedAddresses() {
    // && this.job.project && this.job.project.customer && this.job.project.customer.id
    if (this.job && this.customerAddresses && this.customerAddresses.length > 0) {
      if (this.job.billingAddresses && this.job.billingAddresses.length > 0) {
        const adds = this.customerAddresses.filter(add => this.job.billingAddresses.findIndex(a => a.id === add.id) !== -1);
        if (adds && adds.length > 0) {
          this.job.billingAddresses = adds;
          this.selectedBillingAddresses = adds;
        } else {
          // do nothing
        }
      }
      if (this.job.serviceAddresses && this.job.serviceAddresses.length > 0) {
        const adds = this.customerAddresses.filter(add => this.job.serviceAddresses.findIndex(a => a.id === add.id) !== -1);
        if (adds && adds.length > 0) {
          this.job.serviceAddresses = adds;
          this.selectedServiceAddresses = adds;
        } else {
          // do nothing
        }
      }
    }
  }

  getJobTypes() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getJobTypes(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus(), this.getSelectedJobTypeIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listJobTypes) {
              this.jobTypes = response['data']['listJobTypes']['data'];
              this.setSelectedJobType();
              this.isSpinning = false;
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

  getSelectedJobTypeIds() {
    return this.getIncludeIds(MenuConstants.JOB_TYPE);
  }

  getBusinessUnits() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus(), this.getSelectedBusinessUnitIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response) {
              this.businessUnits = response['data']['listBusinessUnits']['data'];
              this.setSelectedBusinessUnit();
              this.isSpinning = false;
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

  getSelectedBusinessUnitIds() {
    return this.getIncludeIds(MenuConstants.BUSINESS_UNITS);
  }

  getCustomers() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getCustomers(this.orgId, this.getListPaginationObject(), this.getSortObjectByFirstAndLastName(), null, this.getListFilterDataForActiveStatus(), this.getSelectedCustomerIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response) {
              this.customers = response['data']['listCustomers']['data'];
              this.setSelectedCustomer();
              this.isSpinning = false;
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

  getSelectedCustomerIds() {
    return this.getIncludeIds(MenuConstants.CUSTOMERS);
  }

  getIncludeIds(type: string) {
    let ids: string[] = [];
    switch (type) {
      case MenuConstants.JOB_TYPE: {
        if (this.job && this.job.jobType && this.job.jobType.id) {
          ids = [this.job.jobType.id];
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.BUSINESS_UNITS: {
        if (this.job && this.job.businessUnit && this.job.businessUnit.id) {
          ids = [this.job.businessUnit.id];
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.TECHNICIANS: {
        if (this.job && this.job.technicians && this.job.technicians.length > 0) {
          ids = this.job.technicians.map(tech => tech.id);
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.TAGS: {
        if (this.job && this.job.tags && this.job.tags.length > 0) {
          ids = this.job.tags.map(tag => tag.id);
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.CUSTOMERS: {
        if (this.job && this.job.project && this.job.project.customer && this.job.project.customer.id) {
          ids = [this.job.project.customer.id];
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.PROJECTS: {
        if (this.job && this.job.project && this.job.project.id) {
          ids = [this.job.project.id];
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.SERVICES: {
        if (this.job && this.job.services && this.job.services.length > 0) {
          ids = this.job.services.map(service => service.id);
        } else {
          // do nothing
        }
        break;
      }
    }
    return ids;
  }

  getTags() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getTags(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus(), this.getSelectedTagIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listTags) {
              this.tags = response['data']['listTags']['data'];
              this.setSelectedTags();
              this.isSpinning = false;
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

  getSelectedTagIds() {
    return this.getIncludeIds(MenuConstants.TAGS);
  }

  getTechnicians() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getTechnicians(this.orgId, this.getListPaginationObject(), this.getSortObjectByFirstAndLastName(), null, this.getListFilterDataForActiveStatus(), this.getSelectedTechnicianIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listUsers) {
              this.technicians = response['data']['listUsers']['data'];
              this.setSelectedTechnicians();
              this.isSpinning = false;
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

  getSelectedTechnicianIds() {
    return this.getIncludeIds(MenuConstants.TECHNICIANS);
  }

  getServices() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getServices(this.orgId, this.getListPaginationObject(), this.getServicesSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedServiceIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listServices) {
              this.services = response['data']['listServices']['data'];
              this.setSelectedServices();
              this.isSpinning = false;
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

  getSelectedServiceIds() {
    return this.getIncludeIds(MenuConstants.SERVICES);
  }

  getServicesSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getProjects() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addJobService.getProjects(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getFilterDataForProjects(), this.getSelectedProjectIds()).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.projects = response['data']['listProjects']['data'];
            if (this.projectObj && !this.redirectUpdate && this.redirectFrom === 'project') {
              const project = this.projects.filter(cus => cus.id === this.projectObj.id)[0];
              this.projects = [project];
              this.selectedProject = project;
              this.onProjectSelect()
            }
            this.setSelectedProject();
            this.isSpinning = false;
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

  getSelectedProjectIds() {
    return this.getIncludeIds(MenuConstants.PROJECTS);
  }

  setSelectedProject() {
    if (this.job.project && this.job.project.id && this.projects && this.projects.length > 0) {
      const project: Project = this.projects.filter(proj => proj.id === this.job.project.id)[0];
      if (project && project.id) {
        this.projects = [];
        this.job.project = project;
        this.selectedProject = project;
        this.projects = [project]
      } else {
        this.job.project = null;
        this.selectedProject = null;
      }
    }
    this.setSelectedAddresses();
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  getFilterDataForProjects() {
    const filterObj: FilterData = {
      field: 'customerId',
      // value: this.job.project.customer.id,
      value: this.selectedCustomer.id,
      op: FilterOp.equal
    };
    return [filterObj];
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

  getSortObjectByFirstAndLastName() {
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

  setDisableDate() {
    this.disabledDate = (current: Date): boolean => {
      const currentDate = DateUtil.getCurrentDate();
      return new Date(DateUtil.setToBeginning(new Date(current))).valueOf() < new Date(DateUtil.setToBeginning(new Date(currentDate))).valueOf();
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
          if (this.job && this.job.startTime) {
            const jobStarthr = this.job.startTime.getHours();
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
          if (this.job && this.job.startTime) {
            const jobStarthr = this.job.startTime.getHours();
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

  onCustomerSelect() {
    // this.customerAddresses = this.job.project.customer.addresses;
    this.customerAddresses = this.selectedCustomer.addresses;
    // this.job.billingAddresses = null;
    // this.job.serviceAddresses = null;
    this.selectedBillingAddresses = null;
    this.selectedServiceAddresses = null;
    this.selectedProject = null;
    // this.selectedCustomer = this.job.project.customer;
    // this.job.project = new Project();
    // this.job.project.customer = this.selectedCustomer;
    this.setSelectedAddresses();
    this.getProjects();
  }

  onProjectSelect() {
    this.job.project = this.selectedProject;
    this.job.project.customer = this.selectedCustomer;
  }

  onStartDateChange() {
    if (this.job) {
      this.job.startTime = null;
    } else {
      // do nothing
    }
  }

  onRescheduleDateChange() {
    if (this.job) {
      this.job.rescheduleTime = null;
    } else {
      // do nothing
    }
  }

  onRescheduleTimeChange(event) {
    console.log('reschedule time', event);
  }

  onRescheduleTimePickerOpen(event) {
    if (event) {
      if (this.job.rescheduleDate) {
        if (new Date(DateUtil.setToBeginning(this.job.rescheduleDate)).valueOf() > new Date(DateUtil.getCurrentDate()).valueOf()) {
          this.showAll = true;
        } else {
          this.showAll = false;
        }
      }
    }
  }

  onStartTimeChange(event) {
    console.log(event);
  }

  onTimePickerOpen(event) {
    if (event) {
      if (this.job.startDate) {
        if (new Date(DateUtil.setToBeginning(this.job.startDate)).valueOf() > new Date(DateUtil.getCurrentDate()).valueOf()) {
          this.showAll = true;
        } else {
          this.showAll = false;
        }
      }
    }
  }

  onCancel() {
    if (this.redirectUpdate) {
      this.navigateToJobsList();
    } else {
      this.emitOnCancel.emit(true);
    }
  }

  handleImageLoading(value: boolean) {
    this.isImageLoading = value;
  }

  setImageUrl(url: string) {
    this.imageUrl = url;
    console.log('image url', this.imageUrl);
  }

  navigateToJobsList() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.JOBS]);
  }

  getChangedType() {
    return ChangeModule.JOB;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.isJobFetched$.unsubscribe();
  }

}
