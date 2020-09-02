import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Tag } from 'src/app/modals/tag/tag';
import { Subscription } from 'rxjs';
import { TagsService } from './services/tags.service';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { User } from 'src/app/modals/user/user';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { TitleCasePipe } from '@angular/common';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  tags: Tag[] = [];
  columns: ColumnItem[] = [];
  selectedCols: ColumnItem[] = [];
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
    private tagsService: TagsService,
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
    this.getTags();
    this.setTableConfig();
    // this.setTableActionButtons();
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by name and code';
  }

  setDescription() {
    // tslint:disable-next-line: max-line-length
    this.description = 'Use tags to highlight critical information to your staff. Flag high priority jobs on the dispatch board, highlight customers with a membership, and warn technicians of locations with animals.'
  }

  setEditButtonPermission() {
    this.editButtonPermission = Permission.EDIT_TAG;
  }

  /**
   * @description Action dropdown menu.
   * @author Rajeev Kumar
   * @date 2020-06-05
   * @memberof TagsComponent
   */
  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_TAG_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.UPDATE_TAG_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false));
    }
    this.setMenuItemsDisable();
  }

  /**
   * @description setting the cols of the table
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @memberof TagsComponent
   */
  setColumns() {
    this.columns = this.tagsService.getColumnItems();
  }

  /**
   * @description setting the initial query variables for first api call
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @memberof TagsComponent
   */
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

  /**
   * @description To get the list of tags
   * @author Rajeev Kumar
   * @date 2020-06-05
   * @memberof TagsComponent
   */
  getTags() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.tagsService.getTags(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData).valueChanges.subscribe(
        (response) => {
          if (response) {
            if (this.firstLoad) {
              // this.setColumns();
              this.firstLoad = false;
            }
            this.totalRecords = response['data']['listTags']['total']
            this.tags = response['data']['listTags']['data'];
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

  /**
   * @description setting the config of table
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @memberof TagsComponent
   */
  setTableConfig() {
    this.tableConfig.showCheckboxes = true;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  /**
   * @description setting the action buttons for table
   * @author Pulkit Bansal
   * @date 2020-06-16
   * @memberof TagsComponent
   */
  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_TAG_STATUS)) {
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
    if (this.authenticationService.checkPermission(Permission.ADD_TAG)) {
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

  /**
   * @description Get value of Active/Deactive from dropdown
   * @author Rajeev Kumar
   * @date 2020-06-05
   * @param {MenuItem} item
   * @memberof TagsComponent
   */
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
          this.tagsService.changeTagsStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              if (response) {
                this.isSpinning = false;
                this.getTags();
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

  /**
   * @description when rows selection change
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @param {string[]} rows
   * @memberof TagsComponent
   */
  onRowsSelectionChange(rowIds: string[]): void {
    this.selectedRowIds = rowIds;
    this.setMenuItemsDisable();
  }

  /**
   * @description setting which menu items to enable and which items to disable
   * @author Pulkit Bansal
   * @date 2020-06-16
   * @memberof TagsComponent
   */
  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(id => this.tags.findIndex(tag => tag.id === id && GeneralStatus[tag.status] === GeneralStatus.active) !== -1);
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(id => this.tags.findIndex(tag => tag.id === id && GeneralStatus[tag.status] === GeneralStatus.inactive) !== -1);
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

  /**
   * @description setting the disabled prop of menu item
   * @author Pulkit Bansal
   * @date 2020-06-16
   * @param {boolean} itemTypeRowsSelected
   * @param {boolean} otherTypeRowsSelected
   * @returns {boolean}
   * @memberof TagsComponent
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

  /**
   * @description when events related to page change
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @param {PaginationData} paginatedData
   * @memberof TagsComponent
   */
  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getTags();
  }

  /**
   * @description when sorting is changed
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @param {*} data
   * @memberof TagsComponent
   */
  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getTags();
  }

  onRowEditClick(row: Tag) {
    this.router.navigate(
      [AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH +
        AppUrlConstants.TAGS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]
    );
  }

  /**
   * @description when input is provided in the search box
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @param {string} value
   * @memberof TagsComponent
   */
  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getTags();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getTags();
  }

  addTag() {
    this.router.navigate([AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH + AppUrlConstants.TAGS + AppUrlConstants.SLASH + AppUrlConstants.ADD]);
  }

  onSelectedColsChange(event) {
    this.selectedCols = event;
    this.selectedCols.forEach((col) => {
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

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
