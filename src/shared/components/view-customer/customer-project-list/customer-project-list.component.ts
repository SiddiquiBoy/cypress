import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Project } from 'src/app/modals/project/project';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { ViewCustomerService } from '../services/view-customer.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { Customer } from 'src/app/modals/customer/customer';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Subscription } from 'rxjs';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-customer-project-list',
  templateUrl: './customer-project-list.component.html',
  styleUrls: ['./customer-project-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerProjectListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() customer: Customer;
  // @Output() emitOnCustomerUpdate = new EventEmitter<boolean>();
  @Output() emitOnProjectUpdate = new EventEmitter<boolean>();
  @Output() emitOnProjectCreate = new EventEmitter<boolean>();

  subscriptions: Subscription[] = [];
  projects: Project[] = [];
  projectsCopy: Project[] = [];
  project: Project = new Project();

  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();

  totalRecords: number;
  paginationData: PaginationData;
  sortData: SortData[];
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];
  tableActionButtons: TableActionButton[] = [];

  viewButtonPermission: string;
  editButtonPermission: string;

  searchPlaceholder: string;
  isSpinning = false;
  showAddprojectDialog = false;
  showEditprojectDialog = false;

  changes: Change[] = [];
  changedType: string;

  constructor(
    private viewCustomerService: ViewCustomerService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setProjects();
    this.searchPlaceholder = 'Search by project name';
    this.changeService.setInitialProject(Utils.cloneDeep(this.project));
    this.setPermissions();
    this.setTotalRecords();
    this.setColumns();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.setTableActionButtons();
    this.changedType = this.getChangedType();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'customer': {
            this.setProjects();
          }
        }
      }
    }
  }

  setProjects() {
    this.projects = this.customer.projects;
    this.cloneProjects();
  }

  cloneProjects() {
    this.projectsCopy = Utils.cloneDeep(this.projects);
  }

  setPermissions() {
    this.viewButtonPermission = Permission.VIEW_CUSTOMER_DETAIL;
    this.editButtonPermission = Permission.EDIT_CUSTOMER;
  }

  setTotalRecords() {
    this.totalRecords = this.projects.length;
  }

  setColumns() {
    this.columns = this.viewCustomerService.getProjectsColumnItems();
  }

  setGlobalFilterData(value: string) {
    this.globalFilterData = {
      q: value
    };
  }

  setTableConfig() {
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = true;
    this.tableConfig.pageSizeOptions = [5, 10, 15, 20];
  }

  setInitialQueryVariables() {
    this.setInitialPaginationData();
    this.setInitialGlobalFilterData();
  }

  setInitialPaginationData() {
    this.paginationData = {
      page: PaginationConstant.DEFAULT_PAGE_NO,
      size: this.paginationData && this.paginationData.size ? this.paginationData.size : PaginationConstant.DEFAULT_PAGE_SIZE_SMALL
    };
  }

  setInitialGlobalFilterData() {
    this.globalFilterData = {
      q: ''
    };
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.searchProject();
  }

  searchProject() {
    this.isSpinning = true;
    this.projects = [...this.projectsCopy];
    if (this.globalFilterData.q) {
      this.projects = this.projects.filter(project => project.name.toLowerCase().includes(this.globalFilterData.q.toLowerCase()));
    }
    this.isSpinning = false;
  }

  openAddProjectDialog() {
    this.project = new Project();
    this.changeService.setInitialProject(Utils.cloneDeep(this.project));
    this.showAddprojectDialog = true;
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.ADD_PROJECT)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.openAddProjectDialog();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

  onCancelClick() {
    this.showAddprojectDialog = false;
    this.showEditprojectDialog = false;
  }

  addProject() {
    this.changes = this.changeService.getChanges();
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewCustomerService.createProject(this.project)
        .subscribe(
          (response: any) => {
            if (response && response.data && response.data.createProject) {
              this.isSpinning = false;
              this.showAddprojectDialog = false;
              // this.emitOnCustomerUpdate.emit(true);
              this.emitOnProjectCreate.emit(true);
            } else {
              this.isSpinning = false;
            }
          }, (error: any) => {
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

  updateProject() {
    this.changes = this.changeService.getChanges();
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewCustomerService.updateProject(this.project, this.changes)
        .subscribe(
          (response: any) => {
            if (response && response.data && response.data.updateProject) {
              this.isSpinning = false;
              this.showEditprojectDialog = false;
              // this.emitOnCustomerUpdate.emit(true);
              this.emitOnProjectUpdate.emit(true);
            } else {
              this.isSpinning = false;
            }
          }, (error: any) => {
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

  onRowEditClick(row: Project) {
    this.project = Utils.cloneDeep(row);
    this.changeService.setInitialProject(Utils.cloneDeep(this.project));
    this.showEditprojectDialog = true;
  }

  onRowViewClick(row: Project) {
    this.router.navigate(
      [AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  getChangedType() {
    return ChangeModule.PROJECT;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
