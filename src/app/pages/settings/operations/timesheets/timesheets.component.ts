import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimesheetCode } from 'src/app/modals/timesheet-code/timesheet-code';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Router } from '@angular/router';
import { TimesheetCodeService } from './services/timesheet-code.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { User } from 'src/app/modals/user/user';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimesheetsComponent implements OnInit {

  subscriptions: Subscription[] = [];
  timesheetCodes: TimesheetCode[] = [];

  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  actionButtonDropdownMenu: MenuItem[] = [];
  tableActionButtons: TableActionButton[] = [];
  selectedRowIds: string[] = [];

  totalRecords: number;
  paginationData: PaginationData;
  // sortData: SortData;
  sortData: SortData[] = [];
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];

  searchPlaceholder: string;
  description: string;
  editButtonPermission: string;

  isSpinning = false;
  firstLoad: boolean = true;
  orgId: string;

  constructor(
    private timesheetCodeService: TimesheetCodeService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchPlaceholder = 'Search by code';
    this.description = "Time sheet codes are used to track work hours and calculate pay, including overtime, sick leave, meal hours and personal work."
    this.setOrgId();
    this.setColumns();
    this.setEditButtonPermission();
    this.setActionButtonDropdownMenu();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.getTimesheetCodes();
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

  setColumns() {
    this.columns = this.timesheetCodeService.getColumnItems();
  }
  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_TIMESHEET_CODE_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.UPDATE_TIMESHEET_CODE_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false));
    }
    this.setMenuItemsDisable();
  }

  setInitialQueryVariables() {
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialGlobalFilterData();
    this.setInitialFilterData();
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

  setEditButtonPermission() {
    this.editButtonPermission = Permission.EDIT_TIMESHEET_CODE;
  }

  setTableConfig() {
    this.tableConfig.showCheckboxes = true;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  getTimesheetCodes() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.timesheetCodeService.listTimesheetCodes(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData).valueChanges.subscribe(
        (data) => {
          if (data && data.data && data.data.listTimesheetCodes && data.data.listTimesheetCodes.data) {
            if (this.firstLoad) {
              this.firstLoad = false;
            }
            this.totalRecords = data.data.listTimesheetCodes.total;
            this.timesheetCodes = data.data.listTimesheetCodes.data;
            this.setActionButtonDropdownMenu();
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
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
          this.timesheetCodeService.changeStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              if (response) {
                this.isSpinning = false;
                this.getTimesheetCodes();
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
    this.getTimesheetCodes();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getTimesheetCodes();
  }

  onRowEditClick(row: any) {
    this.router.navigate([`/settings/operations/timesheet-codes/${row.id}/edit`]);
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getTimesheetCodes();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getTimesheetCodes();
  }

  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(
      id => this.timesheetCodes.findIndex(timesheetCode => timesheetCode.id === id && GeneralStatus[timesheetCode.status] === GeneralStatus.active) !== -1
    );
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(
      id => this.timesheetCodes.findIndex(timesheetCode => timesheetCode.id === id && GeneralStatus[timesheetCode.status] === GeneralStatus.inactive) !== -1
    );
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
    if (this.authenticationService.checkPermission(Permission.UPDATE_TIMESHEET_CODE_STATUS)) {
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
    if (this.authenticationService.checkPermission(Permission.ADD_TIMESHEET_CODE)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addTimesheetCode();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

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

  addTimesheetCode() {
    this.router.navigate(
      [AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH + AppUrlConstants.TIMESHEET_CODES + AppUrlConstants.SLASH + AppUrlConstants.ADD]
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
