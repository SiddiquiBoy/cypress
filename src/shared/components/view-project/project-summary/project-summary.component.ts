import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from "@angular/core";
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Router } from '@angular/router';
import { Project } from 'src/app/modals/project/project';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Utils } from 'src/shared/utilities/utils';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Customer } from 'src/app/modals/customer/customer';
import { User } from 'src/app/modals/user/user';
import { ViewProjectService } from '../services/view-project.service';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { DateUtil } from 'src/shared/utilities/date-util';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';

@Component({
  selector: 'app-project-summary',
  templateUrl: 'project-summary.component.html',
  styleUrls: ['./project-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectSummaryComponent implements OnInit {

  @Input() project = new Project();
  projectCopy = new Project();

  // _project: Project = new Project();

  // @Input() set project(project: Project) {
  //   this._project = project;
  //   if (project && project.id) {
  //     this.changeService.setInitialProject(Utils.cloneDeep(this.project));
  //   }
  // }

  // get project() {
  //   return this._project;
  // }

  @Output() emitRefreshData = new EventEmitter<any>();
  isSpinning: boolean;
  editButtonPermission: string;
  showDetailsDialog: boolean = false;
  subscriptions: Subscription[] = [];
  customers: Customer[] = [];
  orgId: string;
  changes: Change[] = [];
  changedType: string;
  defaultDateFormat: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private viewProjectService: ViewProjectService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setOrgId();
    this.getDefaultDateFormat();
    this.editButtonPermission = Permission.EDIT_JOB;
    this.changedType = this.getChangedType();
  }

  editDetails() {
    this.changeService.setInitialProject(Utils.cloneDeep(this.project));
    this.projectCopy = Utils.cloneDeep(this.project);
    this.showDetailsDialog = true;
  }

  updateProject() {
    this.changes = this.changeService.getChanges();
    this.subscriptions.push(
      this.viewProjectService.updateProject(this.projectCopy, this.changes).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.PROJECT_DETAIL_UPDATED);
            // this.changeService.setInitialProject(Utils.cloneDeep(this.project));
            this.emitRefreshData.emit(true);
            this.showDetailsDialog = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
          this.emitRefreshData.emit(true);
          this.showDetailsDialog = false;
        }
      )
    );
  }

  getDefaultDateFormat() {
    this.defaultDateFormat = DateUtil.defaultDateFormat;
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        if (user && user.organization) {
          this.orgId = user.organization.id;
          this.getCustomers();
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  getCustomers() {
    this.subscriptions.push(
      this.viewProjectService.getCustomers(this.orgId, this.getListPaginationObject(), this.getCustomerSortObject(), null, this.getListFilterDataForActiveStatus())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listCustomers) {
              this.customers = response['data']['listCustomers']['data'];
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

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
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

  onOkClick() {

  }

  onCancelClick() {
    this.emitRefreshData.emit(true);
    this.showDetailsDialog = false;
  }

  onBack() {
    this.router.navigate(
      [AppUrlConstants.PROJECTS]
    );
  }

  redirectToCustomer(id: string) {
    this.router.navigate(
      [AppUrlConstants.CUSTOMERS + AppUrlConstants.SLASH + id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  getChangedType() {
    return ChangeModule.PROJECT;
  }
}
