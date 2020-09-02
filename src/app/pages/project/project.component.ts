import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/modals/project/project';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { ProjectService } from './services/project.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/modals/user/user';
import { Utils } from 'src/shared/utilities/utils';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  projects: Project[] = [];
  columns: ColumnItem[] = [];
  selectedCols: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  isSpinning = false;
  actionButtonDropdownMenu: MenuItem[] = [];
  paginationData: PaginationData;
  sortData: SortData[] = [];
  orgId: string;
  totalRecords: number;
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];
  searchPlaceholder: string;
  selectedRowIds: string[] = [];
  firstLoad = true;
  tableActionButtons: TableActionButton[] = [];
  editButtonPermission: string;
  viewButtonPermission: string;

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setSearchPlaceholder();
    this.setEditAndViewButtonPermission();
    this.setColumns();
    this.setActionButtonDropdownMenu();
    this.setInitialQueryVariables();
    this.getProjects();
    this.setTableConfig();
    this.setTableActionButtons();
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by name, code and customer';
  }

  setEditAndViewButtonPermission() {
    this.editButtonPermission = Permission.EDIT_CUSTOMER;
    this.viewButtonPermission = Permission.VIEW_PROJECT_DETAIL;
  }

  setColumns() {
    this.columns = this.projectService.getColumnItems();
  }

  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_PROJECTS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_PROJECTS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false));
    }
    this.setMenuItemsDisable();
  }

  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(id => this.projects.findIndex(project => project.id === id && GeneralStatus[project.status] === GeneralStatus.active) !== -1);
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(id => this.projects.findIndex(project => project.id === id && GeneralStatus[project.status] === GeneralStatus.inactive) !== -1);
    const activeRowSelected = (selectedActiveTypeRowIds && selectedActiveTypeRowIds.length > 0) ? true : false;
    const inactiveRowSelected = (selectedInactiveTypeRowIds && selectedInactiveTypeRowIds.length > 0) ? true : false;
    this.actionButtonDropdownMenu.forEach(item => {
      if (item.label === MenuConstants.ACTIVATE) {
        item.disabled = this.shouldDisableItem(activeRowSelected, inactiveRowSelected);
      }
      if (item.label === MenuConstants.DEACTIVATE) {
        item.disabled = this.shouldDisableItem(inactiveRowSelected, activeRowSelected);
      }
      this.setTableActionButtons();
    });
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
        if (user && user.organization) {
          this.orgId = user.organization.id;
        } else {
          this.orgId = undefined;
        }
      })
    );
    // const user: User = Utils.getItemFromLocalStorage('user');
    // if (user && user.organization) {
    //   this.orgId = user.organization.id;
    // } else {
    //   this.orgId = undefined;
    // }
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
    // this.sortData = {
    //   sortColumn: 'createdAt',
    //   sortOrder: 'desc'
    // };
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

  getProjects() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.projectService.getProjects(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData).valueChanges.subscribe(
        (response) => {
          if (response) {
            if (this.firstLoad) {
              // this.setColumns();
              this.firstLoad = false;
            }
            this.totalRecords = response['data']['listProjects']['total']
            this.projects = response['data']['listProjects']['data'];
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

  setTableConfig() {
    this.tableConfig.showCheckboxes = true;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_PROJECT_STATUS)) {
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
    if (this.authenticationService.checkPermission(Permission.ADD_PROJECT)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addProject();
        }
      };
      this.tableActionButtons.push(addButton);
    }
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
          this.projectService.changeProjectStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              if (response) {
                this.isSpinning = false;
                this.getProjects();
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
    this.getProjects();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getProjects();
  }

  onRowEditClick(row: Project) {
    this.router.navigate(
      [AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]
    );
  }

  onRowViewClick(row: Project) {
    this.router.navigate(
      [AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getProjects();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getProjects();
  }

  addProject() {
    this.router.navigate([AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + AppUrlConstants.ADD]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
