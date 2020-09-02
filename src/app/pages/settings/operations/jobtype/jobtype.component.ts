import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { JobType } from 'src/app/modals/job-type/job-type';
import { JobtypeService } from './services/jobtype.service';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Router } from '@angular/router';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { User } from 'src/app/modals/user/user';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-jobtype',
  templateUrl: './jobtype.component.html',
  styleUrls: ['./jobtype.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobtypeComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  jobTypes: JobType[] = [];
  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  isSpinning = false;
  actionButtonDropdownMenu: MenuItem[] = [];
  paginationData: PaginationData;
  // sortData: SortData;
  sortData: SortData[] = [];
  orgId: string;
  totalRecords: number;
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];
  searchPlaceholder: string;
  selectedRowIds: string[] = [];
  firstLoad: boolean = true;
  tableActionButtons: TableActionButton[] = [];
  description: string;
  editButtonPermission: string;

  constructor(
    private jobTypeService: JobtypeService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setSearchPlaceholder();
    this.setDescription();
    this.setEditButtonPermission();
    this.setColumns();
    this.setActionButtonDropdownMenu();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.getJobTypes();
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by name';
  }

  setDescription() {
    this.description = 'Assign job types to jobs to track and report on different types of work your business does. Common job types include inspection, installation, emergency repair, and No A/C.';
  }

  setEditButtonPermission() {
    this.editButtonPermission = Permission.EDIT_JOB_TYPE;
  }

  setColumns() {
    this.columns = this.jobTypeService.getColumnItems();
  }

  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_TYPE_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_TYPE_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false));
    }
    this.setMenuItemsDisable();
  }

  setInitialQueryVariables() {
    this.setOrgId();
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialGlobalFilterData();
    this.setInitialFilterData();
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        // const user: User = Utils.getItemFromLocalStorage('user');
        if (user && user.organization) {
          this.orgId = user.organization.id;
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  setInitialPaginationData() {
    this.paginationData = {
      page: PaginationConstant.DEFAULT_PAGE_NO,
      size: this.paginationData && this.paginationData.size ? this.paginationData.size : PaginationConstant.DEFAULT_PAGE_SIZE
    };
  }

  setInitialSortData() {
    // this.sortData = {
    //   sortColumn: 'createdAt',
    //   sortOrder: 'desc'
    // };
    this.sortData = [];
    const sortData: SortData = {
      sortColumn: 'createdAt',
      sortOrder: 'desc'
    };
    this.sortData.push(sortData);
  }

  setInitialGlobalFilterData() {
    this.globalFilterData = {
      q: ''
    };
  }

  setInitialFilterData() {
    this.filterData = [];
  }

  setPaginationData(data: PaginationData) {
    this.paginationData = data;
  }

  setSortData(data: SortData) {
    // if (!data.sortOrder) {
    //   this.setInitialSortData();
    // } else {
    //   this.sortData = data;
    // }
    this.sortData = [];
    if (!data.sortOrder) {
      this.setInitialSortData();
    } else {
      this.sortData.push(data);
    }
  }

  setGlobalFilterData(value: string) {
    this.globalFilterData = {
      q: value
    };
  }

  setFilterData(data: FilterData[]) {
    this.filterData = data;
  }

  setTableConfig() {
    this.tableConfig.showCheckboxes = true;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  getJobTypes() {
    // this.subscriptions.push(
    //   this.jobTypeService.getJobTypes()
    //     .subscribe((data: JobType[]) => {
    //       this.jobTypes = data;
    //     },
    //       (error) => {
    //         console.log(`Error while fetching job types`)
    //       })
    // );
    this.isSpinning = true;
    this.subscriptions.push(
      this.jobTypeService.getJobTypes(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData).valueChanges.subscribe(
        (response) => {
          if (response) {
            if (this.firstLoad) {
              // this.setColumns();
              this.firstLoad = false;
            }
            this.totalRecords = response['data']['listJobTypes']['total']
            this.jobTypes = response['data']['listJobTypes']['data'];
            this.setActionButtonDropdownMenu();
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          // this.notificationService.error(errorObj.title, errorObj.message);
          if (this.firstLoad) {
            this.firstLoad = false;
          }
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

  onMenuItemClick(item: MenuItem) {
    if (this.selectedRowIds.length > 0) {
      if (item.disabled) {
        // do nothing
      } else {
        this.isSpinning = true;
        let action: string;
        if (item.label === MenuConstants.ACTIVATE) {
          action = ActiveInactiveStatus.ACTIVE;
        } else if (item.label === MenuConstants.DEACTIVATE) {
          action = ActiveInactiveStatus.INACTIVE;
        }
        this.subscriptions.push(
          this.jobTypeService.changeJobTypesStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              if (response) {
                this.isSpinning = false;
                this.getJobTypes();
                this.messageService.success(AppMessages.STATUS_UPDATED);
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
    } else {
      this.messageService.info(AppMessages.STATUS_SELECT_ROW);
    }
  }

  onRowsSelectionChange(rowIds: string[]): void {
    this.selectedRowIds = rowIds;
    this.setMenuItemsDisable();
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getJobTypes();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getJobTypes();
  }

  onRowEditClick(row: JobType) {
    this.router.navigate(
      [AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH +
        AppUrlConstants.JOB_TYPE + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]
    );
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getJobTypes();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getJobTypes();
  }

  /**
   * @description setting which menu items to enable and which items to disable
   * @author Pulkit Bansal
   * @date 2020-06-16
   * @memberof JobtypeComponent
   */
  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(id => this.jobTypes.findIndex(jobType => jobType.id === id && GeneralStatus[jobType.status] === GeneralStatus.active) !== -1);
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(id => this.jobTypes.findIndex(jobType => jobType.id === id && GeneralStatus[jobType.status] === GeneralStatus.inactive) !== -1);
    const activeRowSelected = (selectedActiveTypeRowIds && selectedActiveTypeRowIds.length > 0) ? true : false;
    const inactiveRowSelected = (selectedInactiveTypeRowIds && selectedInactiveTypeRowIds.length > 0) ? true : false;
    this.actionButtonDropdownMenu.forEach(item => {
      if (item.label === MenuConstants.ACTIVATE) {
        item.disabled = this.shouldDisableItem(activeRowSelected, inactiveRowSelected);
      }
      if (item.label === MenuConstants.DEACTIVATE) {
        item.disabled = this.shouldDisableItem(inactiveRowSelected, activeRowSelected);
      }
    });
    this.setTableActionButtons();
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_JOB_TYPE_STATUS)) {
      const actionButton: TableActionButton = {
        label: MenuConstants.ACTIONS,
        type: TableActionButtonType.MULTIPLE,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        nzGhost: true,
        icon: IconConstants.DOWN,
        menu: this.actionButtonDropdownMenu,
        onChildClick: (item: MenuItem) => {
          this.onMenuItemClick(item);
        }
      };
      this.tableActionButtons.push(actionButton);
    }
    if (this.authenticationService.checkPermission(Permission.ADD_JOB_TYPE)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addJobType();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

  /**
   * @description setting the disabled prop of menu item
   * @author Pulkit Bansal
   * @date 2020-06-16
   * @param {boolean} itemTypeRowsSelected
   * @param {boolean} otherTypeRowsSelected
   * @returns {boolean}
   * @memberof JobtypeComponent
   */
  shouldDisableItem(itemTypeRowsSelected: boolean, otherTypeRowsSelected: boolean): boolean {
    if (itemTypeRowsSelected) {
      if (otherTypeRowsSelected) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  addJobType() {
    this.router.navigate(
      [AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH + AppUrlConstants.JOB_TYPE + AppUrlConstants.SLASH + AppUrlConstants.ADD]
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}
