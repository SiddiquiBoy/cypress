import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimesheetCode } from 'src/app/modals/timesheet-code/timesheet-code';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { TimesheetCodeType } from 'src/app/modals/enums/timesheet-code-type/timesheet-code-type.enum';
import { User } from 'src/app/modals/user/user';
import { TimesheetCodeService } from 'src/app/pages/settings/operations/timesheets/services/timesheet-code.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-add-timesheet-code',
  templateUrl: './add-timesheet-code.component.html',
  styleUrls: ['./add-timesheet-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddTimesheetCodeComponent implements OnInit, OnDestroy {
  orgId: string;
  timesheetCodeId: string;
  description: string;

  subscriptions: Subscription[] = [];
  timesheetCode: TimesheetCode = new TimesheetCode();
  statusDropdown: AppDropdown[] = [];
  typeDropdown: AppDropdown[] = [];
  businessUnits: any[] = [];

  isSpinning: boolean = false;
  changes: Change[] = [];
  changedType: string;

  // placeholders
  timesheetCodeTypePlaceholder: string;
  timesheetCodeCodePlaceholder: string;
  timesheetCodeStatusPlaceholder: string;
  timesheetCodeBusinessUnitPlaceholder: string;
  timesheetCodeDescriptionPlaceholder: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private timesheetCodeService: TimesheetCodeService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.description = 'Add a new timesheet code';
    this.setDropdowns();
    this.setOrgId();
    this.getRouteParams();
    this.changedType = this.getChangedType();
  }

  setPlaceholders() {
    this.timesheetCodeTypePlaceholder = PlaceholderConstant.TYPE;
    this.timesheetCodeCodePlaceholder = PlaceholderConstant.TIMESHEET_CODE_CODE;
    this.timesheetCodeStatusPlaceholder = PlaceholderConstant.STATUS;
    this.timesheetCodeBusinessUnitPlaceholder = PlaceholderConstant.BUSINESS_UNIT;
    this.timesheetCodeDescriptionPlaceholder = PlaceholderConstant.TIMESHEET_CODE_DESCRIPTION;
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        // const user: User = Utils.getItemFromLocalStorage('user');
        if (user && user.organization) {
          this.orgId = user.organization.id;
          // this.getBusinessUnits();
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  setDropdowns() {
    this.setTypeDropdown();
    this.setStatusDropdown();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(
      GeneralStatus,
      false,
      false,
      false,
      false
    );
  }

  setTypeDropdown() {
    this.typeDropdown = [];
    this.typeDropdown = Utils.createDropdownForNewEnum(
      TimesheetCodeType,
      false,
      true,
      false,
      false
    );
  }

  setServiceStatusForDropdown() {
    const key = Utils.getEnumKey(
      ActiveInactiveStatus,
      this.timesheetCode.status
    );
    if (key) {
      this.timesheetCode.status = this.statusDropdown.find(
        (item) => item.label === key
      ).value;
    } else {
      // do nothing --> this case should never occur
    }
  }

  setBusinessUnitForDropdown() {
    if (this.businessUnits && this.businessUnits.length > 0 && this.timesheetCode && this.timesheetCode.businessUnit && this.timesheetCode.businessUnit.id !== null && this.timesheetCode.businessUnit.id !== undefined) {
      this.timesheetCode.businessUnit = this.businessUnits.find(bu => this.timesheetCode.businessUnit.id === bu.id);
    }
  }

  setTimesheetCodeStatusForBackend() {
    const label = Utils.getDropdownLabel(
      this.statusDropdown,
      this.timesheetCode.status
    );
    if (label) {
      this.timesheetCode.status = ActiveInactiveStatus[label];
    } else {
      // do nothing --> this case should never occur
    }
  }

  onSubmit() {
    this.changes = this.changeService.getChanges();
    if (this.timesheetCodeId) {
      this.update();
    } else {
      this.create();
    }
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.timesheetCodeId = params.id;
            this.description = 'Edit the timesheet code';
            this.getTimesheetCode();
          } else {
            this.timesheetCodeId = undefined;
            this.getBusinessUnits();
            this.timesheetCode.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
            this.changeService.setInitialTimesheetCode(Utils.cloneDeep(this.timesheetCode));
            // this.setServiceStatusForDropdown();
          }
        })
    );
  }

  getBusinessUnits() {
    this.isSpinning = true;
    // const sortData: SortData[] = [{ sortColumn: 'name', sortOrder: 'asc' }];

    this.subscriptions.push(
      this.timesheetCodeService.listBusinessUnits(this.orgId, this.getListPaginationObject(), this.getBusinessUnitSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedTimeSheetCodeBusinessUnitIds()).valueChanges.subscribe(
        (response: any) => {
          if (response && response.data && response.data.listBusinessUnits
            && response.data.listBusinessUnits.data && response.data.listBusinessUnits.data.length) {
            this.businessUnits = response.data.listBusinessUnits.data;
            this.isSpinning = false;
            this.setBusinessUnitForDropdown();
            // this.getRouteParams();
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

  getSelectedTimeSheetCodeBusinessUnitIds() {
    let ids: string[] = [];
    if (this.timesheetCode && this.timesheetCode.businessUnit && this.timesheetCode.businessUnit.id !== null && this.timesheetCode.businessUnit.id !== undefined) {
      ids = [this.timesheetCode.businessUnit.id];
    }
    return ids;
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getBusinessUnitSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc',
    };
    sortData.push(sort);
    return sortData;
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  create() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.timesheetCodeService
        .createTimesheetCode(this.timesheetCode)
        .subscribe(
          (response: any) => {
            if (response) {
              this.messageService.success(AppMessages.TIMESHEET_CODE_ADDED);
              this.isSpinning = false;
              this.navigateToTimeSheetCodesList();
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

  getTimesheetCode() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.timesheetCodeService
        .getTimesheetCode(this.timesheetCodeId)
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.getTimesheetCode) {
              this.timesheetCode = response.data.getTimesheetCode;
              this.getBusinessUnits();
              this.changeService.setInitialTimesheetCode(
                Utils.cloneDeep(this.timesheetCode)
              );
              // this.setServiceStatusForDropdown();
              this.setBusinessUnitForDropdown();
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

  update() {
    this.isSpinning = true;
    // this.setTimesheetCodeStatusForBackend();
    this.subscriptions.push(
      this.timesheetCodeService
        .updateTimesheetCode(this.timesheetCode, this.changes)
        .subscribe(
          (response) => {
            this.isSpinning = false;
            if (response) {
              this.messageService.success(
                AppMessages.TIMESHEET_CODE_UPDATED
              );
              this.isSpinning = false;
              this.navigateToTimeSheetCodesList();
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

  onCancel(): void {
    this.navigateToTimeSheetCodesList();
  }

  navigateToTimeSheetCodesList() {
    this.router.navigate([
      AppUrlConstants.SLASH +
      AppUrlConstants.SETTINGS +
      AppUrlConstants.SLASH +
      AppUrlConstants.OPERATIONS +
      AppUrlConstants.SLASH +
      AppUrlConstants.TIMESHEET_CODES,
    ]);
  }

  getChangedType() {
    return ChangeModule.TIMESHEET_CODE;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
