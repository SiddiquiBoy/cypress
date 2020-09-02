import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { BusinessunitService } from './services/businessunit.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { Router } from '@angular/router';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { User } from 'src/app/modals/user/user';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-businessunit',
  templateUrl: './businessunit.component.html',
  styleUrls: ['./businessunit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessunitComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  businessUnits: BusinessUnit[] = [];
  selectedRowIds: string[] = [];
  actionButtonDropdownMenu: MenuItem[] = [];
  tableActionButtons: TableActionButton[] = [];
  columns: ColumnItem[] = [];
  filterData: FilterData[] = [];
  tableConfig: TableConfig;
  isSpinning: boolean;
  totalRecords: number;
  customPaginationData: PaginationData = {};
  sortData: SortData[] = [];
  searchQuery: GlobalFilterData = { q: '' };
  firstLoad: boolean = true;
  description: string;
  editButtonPermission: string;
  constructor(
    private businessUnitService: BusinessunitService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private apolloService: Apollo,
    private router: Router
  ) { }

  ngOnInit() {
    this.setInitialPaginationData();
    this.columns = this.businessUnitService.getColumnItems();
    this.tableConfig = this.setTableConfig();
    this.setInitialSortData();
    this.getBusinessUnit();
    this.setEditButtonPermission();
    this.setActionButtonDropdownMenu();
    this.setTableActionButtons();
  }

  setEditButtonPermission() {
    this.editButtonPermission = Permission.EDIT_BUSINESS_UNITS;
  }

  setInitialSortData() {
    this.sortData = [];
    const sortData: SortData = {
      sortColumn: 'createdAt',
      sortOrder: 'desc'
    };
    this.sortData.push(sortData);
  }

  /**
   * @description Set Active/Inactive in action dropdown
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @memberof BusinessunitComponent
   */
  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_BUSINESS_UNIT_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.UPDATE_BUSINESS_UNIT_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false));
    }
    this.setMenuItemsDisable();
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_BUSINESS_UNIT_STATUS)) {
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
    if (this.authenticationService.checkPermission(Permission.ADD_BUSINESS_UNITS)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addTag();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

  addTag() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH + AppUrlConstants.BUSINESS_UNIT + AppUrlConstants.SLASH + AppUrlConstants.ADD]);
  }

  /**
   * @description Click to filter on action button
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {MenuItem} item
   * @memberof BusinessunitComponent
   */
  onMenuItemClick(item: MenuItem) {
    if (!item.disabled) {
      if (this.selectedRowIds.length > 0) {
        this.isSpinning = true;
        let action: string;
        if (item.label === MenuConstants.ACTIVATE) {
          action = ActiveInactiveStatus.ACTIVE;
        } else if (item.label === MenuConstants.DEACTIVATE) {
          action = ActiveInactiveStatus.INACTIVE;
        }
        this.subscriptions.push(
          this.businessUnitService.changeBUStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              this.apolloService.getClient().resetStore().then(val => {
                this.getBusinessUnit();
                this.isSpinning = false;
                this.messageService.success(AppMessages.STATUS_UPDATED);
              })
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
      } else {
        this.messageService.info(AppMessages.STATUS_SELECT_ROW);
      }
    }
  }

  onSelectedColsChange(event) {
    this.columns = event;
    this.columns.forEach((col) => {
      let foundIndex = -1;
      this.columns.forEach((column, index) => {
        if (col.name === column.name) {
          foundIndex = index;
        }
        column.hidden = false;
      });
      if (foundIndex !== -1) {
        this.columns[foundIndex].hidden = true;
      }
    });
    this.columns = this.columns.filter(col => col.hidden !== true);
  }

  /**
   * @description List of Business Units
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {string} [q]
   * @memberof BusinessunitComponent
   */
  getBusinessUnit(q?: string) {
    this.isSpinning = true;
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((token: User) => {
        // const token = Utils.getItemFromLocalStorage('user');
        this.subscriptions.push(
          this.businessUnitService.getBusinessUnit(this.customPaginationData, token, q, this.sortData, this.filterData)
            .valueChanges.subscribe((response) => {
              if (response) {
                if (this.firstLoad) {
                  // this.columns = this.businessUnitService.getColumnItems();
                  this.firstLoad = false;
                }
                this.businessUnits = response['data']['listBusinessUnits']['data'];
                this.totalRecords = response['data']['listBusinessUnits']['total'];
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
            ));
      })
    );
  }

  /**
   * @description Pagination
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {PaginationData} paginatedData
   * @memberof BusinessunitComponent
   */
  changePagination(paginatedData: PaginationData): void {
    this.customPaginationData = paginatedData;
    this.getBusinessUnit();
  }

  /**
   * @description Checkbox Select/Deselect
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {any[]} rows
   * @memberof BusinessunitComponent
   */
  showSelectedRows(rows: any[]): void {
    this.selectedRowIds = rows;
    this.setMenuItemsDisable();
  }

  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(id => this.businessUnits.findIndex(tag => tag.id === id && GeneralStatus[tag.status] === GeneralStatus.active) !== -1);
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(id => this.businessUnits.findIndex(tag => tag.id === id && GeneralStatus[tag.status] === GeneralStatus.inactive) !== -1);
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

  setTableConfig(): TableConfig {
    const tableConfig = new TableConfig();
    tableConfig.showSerialNumbers = false;
    tableConfig.showCheckboxes = true;
    tableConfig.showPagination = true;
    tableConfig.showEditButton = false;
    tableConfig.frontEnd = false;

    return tableConfig;
  }

  /**
   * @description Sorting using Sort / SortBy
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {*} data
   * @memberof BusinessunitComponent
   */
  handleSorting(data: any) {
    this.setSortData(data.sortObj);
    this.customPaginationData = data.paginationObj;
    if (this.searchQuery && this.searchQuery.q) {
      this.getBusinessUnit(this.searchQuery.q);
    } else {
      this.getBusinessUnit();
    }
  }

  setSortData(data: SortData) {
    this.sortData = [];
    if (!data.sortOrder) {
      this.setInitialSortData();
    } else {
      this.sortData.push(data);
    }
  }

  /**
   * @description Filter using search bar
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {string} q
   * @memberof BusinessunitComponent
   */
  search(q: string) {
    this.setInitialPaginationData();
    this.searchQuery.q = q;
    if (q) {
      this.getBusinessUnit(this.searchQuery.q);
    } else {
      this.getBusinessUnit();
    }
  }

  /**
   * @description Redirect on edit page
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {*} data
   * @memberof BusinessunitComponent
   */
  edit(data: any) {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH + AppUrlConstants.BUSINESS_UNIT  + AppUrlConstants.SLASH + data.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]);
  }

  /**
   * @description Filter Active/Deactie using filter bar
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {*} event
   * @memberof BusinessunitComponent
   */
  onFilter(event) {
    this.filterData = event;
    this.getBusinessUnit();
  }

  setInitialPaginationData() {
    this.customPaginationData = {
      page: PaginationConstant.DEFAULT_PAGE_NO,
      size: this.customPaginationData && this.customPaginationData.size ? this.customPaginationData.size : PaginationConstant.DEFAULT_PAGE_SIZE,
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
