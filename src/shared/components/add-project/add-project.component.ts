import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Project } from 'src/app/modals/project/project';
import { Subscription, Subject } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { User } from 'src/app/modals/user/user';
import { NgForm } from '@angular/forms';
import { AddProjectService } from './services/add-project.service';
import { Customer } from 'src/app/modals/customer/customer';
import { JobType } from 'src/app/modals/job-type/job-type';
import { Tag } from 'src/app/modals/tag/tag';
import { Technician } from 'src/app/modals/people/technician';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { ProjectService } from 'src/app/pages/project/services/project.service';
import { takeUntil } from 'rxjs/operators';
import { CustomerService } from 'src/app/pages/customer/services/customer.service';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { Service } from 'src/app/modals/service/service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProjectComponent implements OnInit, OnDestroy {

  @ViewChild('projectForm', null) projectForm: NgForm;

  projectId: string;
  description: string;
  project: Project = new Project();
  customers: Customer[] = [];
  jobTypes: JobType[] = [];
  tags: Tag[] = [];
  technicians: Technician[] = [];
  businessUnits: BusinessUnit[] = [];
  services: Service[] = [];
  isSpinning = false;
  subscriptions: Subscription[] = [];
  // statusDropdown: AppDropdown[] = [];
  orgId: string;
  activeIndex: number;
  stepToFormValidity: Map<number, boolean> = new Map();
  stepToFormPristine: Map<number, boolean> = new Map();
  isFormValid$: Subject<boolean> = new Subject<boolean>();
  isFormValid = false;
  isFormPristine = true;
  showConfirmDialog = false;
  confirmDialogMessage = 'Changes will not be saved. Do you wish to proceed?';
  isCustomersFetched = false;
  isJobsTimeCorrected = false;
  isProjectFetched$: Subject<boolean> = new Subject<boolean>();
  changes: Change[] = [];
  changedType: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private addProjectService: AddProjectService,
    private customerService: CustomerService,
    private cd: ChangeDetectorRef,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setOrgId();
    this.getRouteParams();
    // this.getCustomers();
    // this.getJobTypes();
    // this.getTechnicians();
    // this.getTags();
    // this.getBusinessUnits();
    // this.getServices();
    this.setDescription();
    this.setActiveIndex();
    this.setInitialValueForStepMap();
    this.setInitialValueForPristineMap();
    this.changedType = this.getChangedType();
    // this.setDropdowns();

    this.subscriptions.push(
      this.isFormValid$.subscribe((val) => {
        this.isFormValid = val;
        this.detectChanges();
      })
    );
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

  setDescription() {
    if (this.projectId) {
      this.description = 'Edit the project';
    } else {
      this.description = 'Add a new project';
    }
  }

  setActiveIndex(index?: number) {
    if (index !== null && index !== undefined) {
      this.activeIndex = index;
    } else {
      this.activeIndex = 0;
    }
  }

  setInitialValueForStepMap() {
    this.stepToFormValidity.set(0, this.projectId ? true : false);
    this.stepToFormValidity.set(1, this.projectId ? true : false);
  }

  setInitialValueForPristineMap() {
    this.stepToFormPristine.set(0, true);
    this.stepToFormPristine.set(1, true);
  }

  getCustomers() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addProjectService.getCustomers(this.orgId, this.getListPaginationObject(), this.getCustomerSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedCustomerIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listCustomers) {
              this.customers = response['data']['listCustomers']['data'];
              // if (this.customers.length < 1) {
              //   this.messageService.info('Please create a customer first');
              // }
              this.isCustomersFetched = true;
              this.isSpinning = false;
            } else {
              this.isCustomersFetched = true;
              this.isSpinning = false;
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isCustomersFetched = true;
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
        if (this.project && this.project.jobs && this.project.jobs.length > 0) {
          // ids = this.project.jobs.map(job => (job && job.jobType && job.jobType.id) ? job.jobType.id);
          this.project.jobs.forEach((job) => {
            if (job && job.jobType && job.jobType.id) {
              ids.push(job.jobType.id);
            } else {
              // do nothing
            }
          });
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.BUSINESS_UNITS: {
        if (this.project && this.project.jobs && this.project.jobs.length > 0) {
          // ids = [this.job.businessUnit.id];
          this.project.jobs.forEach((job) => {
            if (job && job.businessUnit && job.businessUnit.id) {
              ids.push(job.businessUnit.id);
            } else {
              // do nothing
            }
          });
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.TECHNICIANS: {
        if (this.project && this.project.jobs && this.project.jobs.length > 0) {
          this.project.jobs.forEach((job) => {
            if (job && job.technicians && job.technicians.length > 0) {
              ids.push(...job.technicians.map(tech => tech.id));
            } else {
              // do nothing
            }
          });
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.TAGS: {
        if (this.project && this.project.jobs && this.project.jobs.length > 0) {
          this.project.jobs.forEach((job) => {
            if (job && job.tags && job.tags.length > 0) {
              ids.push(...job.tags.map(tag => tag.id));
            } else {
              // do nothing
            }
          });
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.CUSTOMERS: {
        if (this.project && this.project.customer && this.project.customer.id) {
          ids = [this.project.customer.id];
        } else {
          // do nothing
        }
        break;
      }
      case MenuConstants.SERVICES: {
        if (this.project && this.project.jobs && this.project.jobs.length > 0) {
          this.project.jobs.forEach((job) => {
            if (job && job.services && job.services.length > 0) {
              ids.push(...job.services.map(service => service.id));
            } else {
              // do nothing
            }
          });
        } else {
          // do nothing
        }
        break;
      }
    }
    return ids;
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getCustomerSortObject() {
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

  getJobTypes() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addProjectService.getJobTypes(this.orgId, this.getListPaginationObject(), this.getJobTypeSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedJobTypeIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listJobTypes) {
              this.jobTypes = response['data']['listJobTypes']['data'];
              // if (this.jobTypes.length < 1) {
              //   this.messageService.info('Please create a job type first');
              // }
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            } else {
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            // this.isCustomersFetched = true;
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

  getJobTypeSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getTechnicians() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addProjectService.getTechnicians(this.orgId, this.getListPaginationObject(), this.getTechniciansSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedTechnicianIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listUsers) {
              this.technicians = response['data']['listUsers']['data'];
              // if (this.technicians.length < 1) {
              //   this.messageService.info('Please create a technician first');
              // }
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            } else {
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            // this.isCustomersFetched = true;
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

  getTechniciansSortObject() {
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

  getTags() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addProjectService.getTags(this.orgId, this.getListPaginationObject(), this.getTagsSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedTagIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listTags) {
              this.tags = response['data']['listTags']['data'];
              // if (this.technicians.length < 1) {
              //   this.messageService.info('Please create a technician first');
              // }
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            } else {
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            // this.isCustomersFetched = true;
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

  getTagsSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getBusinessUnits() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addProjectService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getBusinessUnitsSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedBusinessUnitIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listBusinessUnits) {
              this.businessUnits = response['data']['listBusinessUnits']['data'];
              // if (this.technicians.length < 1) {
              //   this.messageService.info('Please create a technician first');
              // }
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            } else {
              // this.isCustomersFetched = true;
              this.isSpinning = false;
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            // this.isCustomersFetched = true;
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

  getBusinessUnitsSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getServices() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addProjectService.getServices(this.orgId, this.getListPaginationObject(), this.getServicesSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedServiceIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listServices) {
              this.services = response['data']['listServices']['data'];
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

  // setDropdowns() {
  //   this.setStatusDropdown();
  // }

  // setStatusDropdown() {
  //   this.statusDropdown = [];
  //   this.statusDropdown = Utils.createDropdown(ActiveInactiveStatus, false, true);
  // }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.projectId = params.id;
            this.setDescription();
            this.getProject();
          } else {
            this.projectId = undefined;
            this.getCustomers();
            this.getJobTypes();
            this.getTechnicians();
            this.getTags();
            this.getBusinessUnits();
            this.getServices();
            this.changeService.setInitialProject(Utils.cloneDeep(this.project));
            // this.project.status = ActiveInactiveStatus.ACTIVE;
            // this.project.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
            this.isJobsTimeCorrected = true;
            // this.setProjectStatusForDropdown();
          }
        })
    );
  }

  getProject() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.projectService.getProject(this.projectId).valueChanges.pipe(takeUntil(this.isProjectFetched$)).subscribe(
        (response) => {
          if (response) {
            this.project = response['data']['getProject'];
            this.getCustomers();
            this.getJobTypes();
            this.getTechnicians();
            this.getTags();
            this.getBusinessUnits();
            this.getServices();
            this.changeService.setInitialProject(Utils.cloneDeep(this.project));
            this.isProjectFetched$.next(true);
            if (this.project && this.project.jobs) {
              this.project.jobs.forEach((job) => {
                if (job.startDate && job.startTime) {
                  const date = new Date(job.startDate);
                  const splittedTime = job.startTime.toString().split(':');
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
                  job.startTime = date;
                }
              });
            }
            this.isJobsTimeCorrected = true;
            this.project = Utils.cloneDeep(this.project);
            this.setInitialValueForStepMap();
            // this.setProjectStatusForDropdown();
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
            this.isJobsTimeCorrected = true;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          this.isJobsTimeCorrected = true;
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

  // setProjectStatusForDropdown() {
  //   const key = Utils.getEnumKey(ActiveInactiveStatus, this.project.status);
  //   if (key) {
  //     this.project.status = this.statusDropdown.find(item => item.label === key).value;
  //   } else {
  //     // do nothing --> this case should never occur
  //   }
  // }

  // setProjectStatusForBackend() {
  //   const label = Utils.getDropdownLabel(this.statusDropdown, this.project.status);
  //   if (label) {
  //     this.project.status = ActiveInactiveStatus[label];
  //   } else {
  //     // do nothing --> this case should never occur
  //   }
  // }

  onIndexChange(index) {
    this.setValueForStepMap(this.activeIndex, (this.projectForm.form.disabled || this.projectForm.form.valid));
    this.setValueForPristineMap(this.activeIndex, this.projectForm.form.pristine);
    this.activeIndex = index;
    this.setFormValidity();
    this.setFormPristinity();
  }

  setValueForStepMap(key: number, value: boolean) {
    this.stepToFormValidity.set(key, value);
  }

  setValueForPristineMap(key: number, value: boolean) {
    this.stepToFormPristine.set(key, value);
  }

  setFormValidity() {
    let result = true;
    this.stepToFormValidity.forEach((value, key) => {
      if (!value) {
        result = false;
      } else {
        // do nothing
      }
    });
    // this.isFormValid = result;
    if (result !== this.isFormValid) {
      this.isFormValid$.next(result);
    }
  }

  setFormPristinity() {
    let result = true;
    this.stepToFormPristine.forEach((value, key) => {
      if (!value) {
        result = false;
      } else {
        // do nothing
      }
    });
    this.isFormPristine = result;
  }

  isCurrentTabValid() {
    this.setValueForStepMap(this.activeIndex, (this.projectForm.form.disabled || this.projectForm.form.valid));
    this.setFormValidity();
    this.setFormPristinity();
  }

  isJobTabValid() {
    if (this.projectId) {
      this.addProjectService.isJobTabValid$.next(this.projectForm.valid);
    } else {
      this.addProjectService.isJobTabValid$.next(this.projectForm.form.valid && !this.projectForm.form.pristine);
    }
  }

  isCurrentTabPristine() {
    this.setValueForPristineMap(this.activeIndex, this.projectForm.form.pristine);
  }

  getTabStatus(index: number) {
    if (index !== this.activeIndex) {
      if (this.stepToFormValidity.get(index)) {
        return 'wait';
      } else {
        if (this.stepToFormPristine.get(index)) {
          return 'wait';
        } else {
          return 'error';
        }
      }
    } else {
      return 'wait';
    }
  }

  onSubmit() {
    this.changes = this.changeService.getChanges();
    if (this.projectId) {
      this.updateProject();
    } else {
      this.createProject();
    }
  }

  // updateProjectObjectForBackend() {
  //   // formatting status field
  //   const key = Utils.getEnumKey(ActiveInactiveStatus, this.project.status);
  //   if (key) {
  //     this.project.status = String(this.statusDropdown.find(item => item.label === key).value).toLowerCase();
  //   } else {
  //     // do nothing --> this case should never occur
  //   }
  // }

  createProject() {
    this.isSpinning = true;
    // this.setProjectStatusForBackend();
    this.subscriptions.push(
      this.projectService.createProject(this.project).subscribe(
        (response: any) => {
          if (response) {
            this.isSpinning = false;
            this.messageService.success(AppMessages.PROJECT_ADDED);
            const id = response.data.createProject.id;
            this.navigateToProjectView(id);
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          // this.notificationService.error(errorObj.title, errorObj.message);
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

  updateProject() {
    this.isSpinning = true;
    // this.setProjectStatusForBackend();
    this.subscriptions.push(
      this.projectService.updateProject(this.project, this.changes).subscribe(
        (response: any) => {
          if (response) {
            this.isSpinning = false;
            this.messageService.success(AppMessages.PROJECT_UPDATED);
            const id = response.data.updateProject.id;
            this.navigateToProjectView(id);
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          // this.notificationService.error(errorObj.title, errorObj.message);
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

  navigateToProjectView(id: string) {
    this.router.navigate(
      [AppUrlConstants.SLASH + AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  onNextClick() {
    this.activeIndex += 1;
    this.onIndexChange(this.activeIndex);
  }

  onPrevClick() {
    this.activeIndex -= 1;
    this.onIndexChange(this.activeIndex);
  }

  onCancel(): void {
    if (!this.isFormPristine) {
      this.showConfirmDialog = true;
    } else {
      this.navigateToProjectsList();
    }
  }

  navigateToProjectsList() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.PROJECTS]);
  }

  onOkClick() {
    this.showConfirmDialog = false;
    this.isFormPristine = true;
    this.onCancel();
  }

  onCancelClick() {
    this.showConfirmDialog = false;
  }

  getChangedType() {
    return ChangeModule.PROJECT;
  }

  detectChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
    this.isProjectFetched$.unsubscribe();
  }

}
