import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DateUtil } from 'src/shared/utilities/date-util';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { User } from 'src/app/modals/user/user';
import { ScheduleService } from './services/schedule.service';
import { Utils } from 'src/shared/utilities/utils';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Tag } from 'src/app/modals/tag/tag';
import { JobType } from 'src/app/modals/job-type/job-type';
import { Technician } from 'src/app/modals/people/technician';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit, OnDestroy {

  orgId: string;

  subscriptions: Subscription[] = [];
  businessUnits: BusinessUnit[] = [];
  tags: Tag[] = [];
  jobTypes: JobType[] = [];
  technicians: Technician[] = [];

  selectedDate: Date = new Date();
  maximumSelections: number;

  isSpinning = false;
  dateFormat: string;

  constructor(
    private authenticationService: AuthenticationService,
    private scheduleService: ScheduleService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.setOrgId();
    this.getDefaultDateFormat();
    this.setMaximumSelections();
  }

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.SCHEDULE_COL_MAX_SELECTION;
  }

  setOrgId() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      if (user && user.organization) {
        this.orgId = user.organization.id;
        this.getBusinessUnits();
        this.getTechnicians();
        this.getTags();
        this.getJobTypes();
      } else {
        this.orgId = undefined;
      }
    });
  }

  getBusinessUnits() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.scheduleService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listBusinessUnits &&
              response.data.listBusinessUnits.data && response.data.listBusinessUnits.data.length) {
              this.isSpinning = false;
              this.businessUnits = response['data']['listBusinessUnits']['data'];
            } else {
              this.isSpinning = false;
              this.messageService.info(AppMessages.CREATE_BUSINESS_UNIT);
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
      this.scheduleService.getTechnicians(this.orgId, this.getListPaginationObject(), this.getTechnicianSortObject(), null,
        this.getListFilterDataForActiveStatus()).valueChanges.subscribe(
          (response) => {
            this.isSpinning = false;
            this.technicians = response.data.listUsers.data;
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

  getTags() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.scheduleService.getTags(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listTags) {
              this.tags = response['data']['listTags']['data'];
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

  getJobTypes() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.scheduleService.getJobTypes(this.orgId, this.getListPaginationObject(), this.getSortObjectByName(), null, this.getListFilterDataForActiveStatus())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listJobTypes) {
              this.jobTypes = response['data']['listJobTypes']['data'];
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

  getSortObjectByName() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  getDefaultDateFormat() {
    this.dateFormat = DateUtil.inputDefaultDateFormat;
  }

  onValueChange() {
  }

  onPanelChange() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
