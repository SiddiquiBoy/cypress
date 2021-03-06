import { LocationStrategy } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { Employee } from 'src/app/modals/people/employee';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { EmployeeService } from './services/employee.service';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { User } from 'src/app/modals/user/user';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeesComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  employees: Employee[] = [];

  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  actionButtonDropdownMenu: MenuItem[] = [];
  tableActionButtons: TableActionButton[] = [];
  selectedRowIds: string[] = [];

  totalRecords: number;
  paginationData: PaginationData = {};
  sortData: SortData[] = [];
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];
  filterRoles: Role[] = [Role.ORGADMIN];

  searchPlaceholder: string;
  description: string;
  editButtonPermission: string;

  isSpinning = false;
  firstLoad: boolean = true;
  orgId: string;

  constructor(
    private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private locationStrategy: LocationStrategy,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchPlaceholder = 'Search by name, email and office phone';
    this.setOrgId();
    this.setColumns();
    this.setEditButtonPermission();
    this.setActionButtonDropdownMenu();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.getEmployees();
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
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
    this.columns = this.employeeService.getColumnItems();
  }

  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_EMPLOYEE_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.UPDATE_EMPLOYEE_STATUS)) {
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
      // this.sortData = data;
      if (data.sortColumn === 'fullName') {
        const firstNameSort: SortData = {
          sortColumn: 'firstName',
          sortOrder: data.sortOrder
        };
        const lastNameSort: SortData = {
          sortColumn: 'lastName',
          sortOrder: data.sortOrder
        };
        this.sortData.push(firstNameSort, lastNameSort);
      } else {
        this.sortData.push(data);
      }
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
    this.editButtonPermission = Permission.EDIT_EMPLOYEE;
  }

  setTableConfig(): void {
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showCheckboxes = true;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  getEmployees() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.employeeService.getEmployees(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData, this.filterRoles)
        .valueChanges
        .subscribe(
          (response: any) => {
            if (response && response.data && response.data.listUsers) {
              if (this.firstLoad) {
                // this.columns = this.employeeService.getColumnItems();
                this.firstLoad = false;
              }
              this.totalRecords = response['data']['listUsers']['total']
              this.employees = response['data']['listUsers']['data'];
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
    if (item.disabled) {
      // Do Nothing
    } else {
      if (item.label === MenuConstants.ACTIVATE) {
        this.changeStatus(ActiveInactiveStatus.ACTIVE);
      } else if (item.label === MenuConstants.DEACTIVATE) {
        this.changeStatus(ActiveInactiveStatus.INACTIVE);
      } else {
        // do nothing
      }
    }
  }

  onRowsSelectionChange(rowIds: string[]): void {
    this.selectedRowIds = rowIds;
    this.setMenuItemsDisable();
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getEmployees();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getEmployees();
  }

  getRole(roles: string[]): string[] {
    const updatedRoles = [];
    roles.forEach((role) => {

      switch (role) {
        case Role.ADMIN: {
          // return 'Admin';
          updatedRoles.push('Admin');
          break;
        }
        case Role.CUSTOMER: {
          // return 'Customer';
          updatedRoles.push('Customer');
          break;
        }
        case Role.ORGADMIN: {
          // return 'Org Admin';
          updatedRoles.push('Company Admin');
          break;
        }
        case Role.TECHNICIAN: {
          // return 'Technician';
          updatedRoles.push('Technician');
          break;
        }
        default: {
          // return role;
          updatedRoles.push(role);
        }
      }
    });
    return updatedRoles;
  }

  /**
   * @description Handle Edit Functionality
   * @author Aman Purohit
   * @date 2020-06-08
   * @param {*} data
   * @memberof EmployeesComponent
   */
  onRowEditClick(data: Employee) {
    this.router.navigateByUrl(`/settings/people/employees/${data.id}/edit`);
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getEmployees();
  }

  onFilter(event: FilterData[]) {
    const roles = event.find(item => item.field === 'roles');
    if (roles) {
      this.filterRoles = roles.value;
    } else {
      this.filterRoles = [Role.ORGADMIN]
    }
    const filters = event.filter(item => item.field !== 'roles');
    this.setFilterData(filters);
    this.setInitialPaginationData();
    this.getEmployees();
  }

  /**
   * @description Update verified status of employee/empoyees
   * @author Aman Purohit
   * @date 2020-06-10
   * @param {string} status
   * @memberof EmployeesComponent
   */
  changeStatus(status: string) {
    if (this.selectedRowIds.length) {
      this.isSpinning = true;
      this.subscriptions.push(
        this.employeeService.toggleEmployeeStatus(this.selectedRowIds, status)
          .subscribe(
            (response: any) => {
              this.isSpinning = false;
              if (response) {
                this.getEmployees();
                this.messageService.success(AppMessages.STATUS_UPDATED);
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
    } else {
      this.messageService.info(AppMessages.STATUS_SELECT_ROW);
    }
  }

  /**
   * @description New event listener for sort data from general table
   * @author Aman Purohit
   * @date 2020-06-25
   * @param {SortData} sortData
   * @memberof EmployeesComponent
   */
  onSort(sortData: SortData) {
    // console.log(sortData);
  }

  addEmployee() {
    this.router.navigate(
      [AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.PEOPLE + AppUrlConstants.SLASH + AppUrlConstants.EMPLOYEES + AppUrlConstants.SLASH + AppUrlConstants.ADD]
    );
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

  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(
      id => this.employees.findIndex(employee => employee.id === id && GeneralStatus[employee.status] === GeneralStatus.active) !== -1
    );
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(
      id => this.employees.findIndex(employee => employee.id === id && GeneralStatus[employee.status] === GeneralStatus.inactive) !== -1
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
    if (this.authenticationService.checkPermission(Permission.UPDATE_EMPLOYEE_STATUS)) {
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
    if (this.authenticationService.checkPermission(Permission.ADD_EMPLOYEE)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addEmployee();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
