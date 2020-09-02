import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { JobType } from 'src/app/modals/job-type/job-type';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { JobtypeService } from 'src/app/pages/settings/operations/jobtype/services/jobtype.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Priority } from 'src/app/modals/enums/priority/priority.enum';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { User } from 'src/app/modals/user/user';
import { Tag } from 'src/app/modals/tag/tag';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Change } from 'src/app/modals/change/change';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { NZInputValidationType } from 'src/app/modals/enums/nzinput-validation-type.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-jobtype-add',
  templateUrl: './jobtype-add.component.html',
  styleUrls: ['./jobtype-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobtypeAddComponent implements OnInit, OnDestroy {

  jobTypeId: string;
  orgId: string;
  jobType: JobType = new JobType();
  jobTypeCopy: JobType = new JobType();
  tags: Tag[] = [];
  isSpinning = false;
  subscriptions: Subscription[] = [];
  priorityDropdown: AppDropdown[] = [];
  statusDropdown: AppDropdown[] = [];
  changes: Change[] = [];
  changedType: string;
  maximumSelections: number;

  jobtypeNameValidationStatus: NZInputValidationType;
  jobtypeName$ = new Subject<string>();

  // placeholders
  jobTypeNamePlaceholder: string;
  jobTypeTagsPlaceholder: string;
  jobTypePriorityPlaceholder: string;
  jobTypeStatusPlaceholder: string;
  jobTypeSummaryPlaceholder: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private jobTypeService: JobtypeService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setDropdowns();
    this.setOrgId();
    this.changedType = this.getChangedType();
    this.setMaximumSelections();

    // Subscription for unique name validation
    this.subscriptions.push(
      this.jobtypeName$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((jobtypeName: string) => {
          jobtypeName = (jobtypeName) ? jobtypeName.trim() : jobtypeName;
          if (jobtypeName) {
            if (this.jobTypeId && jobtypeName === this.jobTypeCopy.name) {
              this.jobtypeNameValidationStatus = NZInputValidationType.success;
            } else {
              this.jobtypeNameValidationStatus = NZInputValidationType.validating;
              this.checkJobTypeNameValidity(jobtypeName);
            }
          } else {
            this.jobtypeNameValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );
  }

  setPlaceholders() {
    this.jobTypeNamePlaceholder = PlaceholderConstant.JOB_TYPE_NAME;
    this.jobTypeTagsPlaceholder = PlaceholderConstant.TAGS;
    this.jobTypePriorityPlaceholder = PlaceholderConstant.PRIORITY;
    this.jobTypeStatusPlaceholder = PlaceholderConstant.STATUS;
    this.jobTypeSummaryPlaceholder = PlaceholderConstant.JOB_TYPE_SUMMARY;
  }


  checkJobTypeNameValidity(value: string) {
    this.subscriptions.push(
      this.jobTypeService.checkIfJobTypeNameExist(this.orgId, value).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfJobTypeNameAlreadyTaken) {
            this.jobtypeNameValidationStatus = NZInputValidationType.error;
          } else {
            this.jobtypeNameValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.jobtypeNameValidationStatus = NZInputValidationType.error;
        }

      )
    );
  }

  onJobtypeNameInput(): void {
    this.jobtypeName$.next(this.jobType.name);
  }

  setOrgId() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      // const user: User = Utils.getItemFromLocalStorage('user');
      if (user && user.organization) {
        this.orgId = user.organization.id;
        this.getRouteParams();
        // this.getTags();
      } else {
        this.orgId = undefined;
      }
    });
  }

  getTags() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.jobTypeService.getTags(this.orgId, this.getListPaginationObject(), this.getTagsSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedJobTypeTagIds()).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.tags = response['data']['listTags']['data'];
            this.isSpinning = false;
            this.setSelectedJobTypeTags();
            // this.getRouteParams();
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

  getSelectedJobTypeTagIds() {
    let ids: string[] = [];
    if (this.jobType && this.jobType.tags && this.jobType.tags.length > 0) {
      ids = this.jobType.tags.map(tag => tag.id);
    }
    return ids;
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
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

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  setDropdowns() {
    this.setPriorityDropdown();
    this.setStatusDropdown();
  }

  setPriorityDropdown() {
    this.priorityDropdown = [];
    // this.priorityDropdown = Utils.createDropdown(Priority, false, true);
    this.priorityDropdown = Utils.createDropdownForNewEnum(Priority, false, false, false, false);
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    // this.statusDropdown = Utils.createDropdown(ActiveInactiveStatus, false, true);
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.jobTypeId = params.id;
            this.getJobType();
          } else {
            this.jobTypeId = undefined;
            // Utils.getEnumKey(GeneralStatus, GeneralStatus.active)
            this.jobType.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
            this.changeService.setInitialJobType(Utils.cloneDeep(this.jobType));
            this.getTags();
            // this.jobType.priority = null;
            // this.jobType.tags = null;
            // this.setJobTypeStatusForDropdown();
          }
        })
    );
  }

  getJobType() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.jobTypeService.getJobType(this.jobTypeId).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.jobType = response['data']['getJobType'];
            this.changeService.setInitialJobType(Utils.cloneDeep(this.jobType));
            this.jobTypeCopy = JSON.parse(JSON.stringify(response['data']['getJobType']));
            this.getTags();
            // this.setSelectedJobTypeTags();
            // this.setJobTypePriorityForDropdown();
            // this.setJobTypeStatusForDropdown();
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

  setJobTypePriorityForDropdown() {
    const key = Utils.getEnumKey(Priority, this.jobType.priority);
    if (key) {
      this.jobType.priority = this.priorityDropdown.find(item => item.label === key).value;
    } else {
      // do nothing --> this case should never occur
    }
    if (this.jobType.id) {
      this.setSelectedJobTypeTags();
    }
  }

  setSelectedJobTypeTags() {
    this.jobType.tags = this.tags.filter(tag => this.jobType.tags.findIndex(jTag => jTag.id === tag.id) !== -1);
  }

  setJobTypeStatusForDropdown() {
    const key = Utils.getEnumKey(ActiveInactiveStatus, this.jobType.status);
    if (key) {
      this.jobType.status = this.statusDropdown.find(item => item.label === key).value;
    } else {
      // do nothing --> this case should never occur
    }
  }

  setJobTypePriorityForBackend() {
    const label = Utils.getDropdownLabel(this.priorityDropdown, this.jobType.priority);
    if (label) {
      this.jobType.priority = Priority[label];
    } else {
      // do nothing --> this case should never occur
    }
  }

  setJobTypeStatusForBackend() {
    const label = Utils.getDropdownLabel(this.statusDropdown, this.jobType.status);
    if (label) {
      this.jobType.status = ActiveInactiveStatus[label];
    } else {
      // do nothing --> this case should never occur
    }
  }

  onSubmit() {
    this.changes = this.changeService.getChanges();
    if (this.jobTypeId) {
      this.updateJobType();
    } else {
      this.createJobType();
    }
  }

  createJobType() {
    this.isSpinning = true;
    // this.setJobTypePriorityForBackend();
    // this.setJobTypeStatusForBackend();
    this.subscriptions.push(
      this.jobTypeService.createJobType(this.jobType).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.JOB_TYPE_ADDED);
            this.isSpinning = false;
            this.navigateToJobTypesList();
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

  updateJobType() {
    this.isSpinning = true;
    // this.setJobTypePriorityForBackend();
    // this.setJobTypeStatusForBackend();
    this.subscriptions.push(
      this.jobTypeService.updateJobType(this.jobType, this.changes).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.JOB_TYPE_UPDATED);
            this.isSpinning = false;
            this.navigateToJobTypesList();
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

  onCancel(): void {
    this.navigateToJobTypesList();
  }

  navigateToJobTypesList() {
    this.router.navigate(
      [AppUrlConstants.SLASH + AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH + AppUrlConstants.JOB_TYPE]
    );
  }

  getChangedType() {
    return ChangeModule.JOB_TYPE;
  }

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.MAX_SELECTION;
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
