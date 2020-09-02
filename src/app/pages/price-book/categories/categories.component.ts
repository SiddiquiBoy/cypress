import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Category } from 'src/app/modals/category/category';
import { Subscription } from 'rxjs';
import { CategoryService } from './services/category.service';
import { NotificationService } from 'src/shared/services/notification-service/notification.service';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { Utils } from 'src/shared/utilities/utils';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { User } from 'src/app/modals/user/user';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent implements OnInit, OnDestroy {

  isSpinning = false;
  subscriptions: Subscription[] = [];
  categories: Category[] = [];
  columns: ColumnItem[] = [];
  actionButtonDropdownMenu: MenuItem[] = [];
  tableActionButtons: TableActionButton[] = [];
  selectedRowIds: string[] = [];
  customPaginationData: PaginationData = {};
  sortData: SortData[] = [];
  searchQuery: GlobalFilterData = { q: '' };
  filterData: FilterData[] = [];
  tableConfig: TableConfig;
  totalRecords: any;
  firstLoad: boolean = true;
  dummyImage = "assets/images/tenant-logo.png";
  discription: string;
  editButtonPermission: string;
  searchPlaceholder: string;
  orgId: string;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private apolloService: Apollo,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.setInitialCustomPaginationData();
    this.tableConfig = this.setTableConfig();
    this.columns = this.categoryService.getColumnItems();
    this.setOrgId();
    this.setInitialSortData();
    this.getCategories();
    this.setActionButtonDropdownMenu();
    this.setTableActionButtons();
    this.setEditButtonPermission();
    this.setPlaceholder();
  }

  setInitialCustomPaginationData() {
    this.customPaginationData.page = PaginationConstant.DEFAULT_PAGE_NO;
    this.customPaginationData.size = PaginationConstant.DEFAULT_PAGE_SIZE;
  }

  setPlaceholder() {
    this.searchPlaceholder = 'Search by name, code, services and business unit';
  }

  setEditButtonPermission() {
    this.editButtonPermission = Permission.EDIT_CATEGORY;
  }

  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_CATEGORY_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.UPDATE_CATEGORY_STATUS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false));
    }
    this.setMenuItemsDisable();
  }

  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(id => this.categories.findIndex(cat => cat.id === id && GeneralStatus[cat.status] === GeneralStatus.active) !== -1);
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(id => this.categories.findIndex(cat => cat.id === id && GeneralStatus[cat.status] === GeneralStatus.inactive) !== -1);
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

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_CATEGORY_STATUS)) {
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

    if (this.authenticationService.checkPermission(Permission.ADD_CATEGORY)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addCategory();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

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
          this.categoryService.changeCategoryStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              this.apolloService.getClient().resetStore().then(val => {
                this.getCategories();
                this.setMenuItemsDisable();
                this.isSpinning = false;
                this.messageService.success(AppMessages.STATUS_UPDATED);
              });
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

  getCategories(q?: string) {
    this.isSpinning = true;
    this.subscriptions.push(
      this.categoryService.getCategories(this.orgId, this.customPaginationData, q, this.sortData, this.filterData)
        .valueChanges
        .subscribe((response: any) => {
          if (response) {
            if (this.firstLoad) {
              // this.columns = this.categoryService.getColumnItems();
              this.firstLoad = false;
            }

            this.isSpinning = false;
            this.categories = response['data']['listCategories']['data'];
            this.totalRecords = response['data']['listCategories']['total'];
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

  setSortData(data: SortData) {
    this.sortData = [];
    if (!data.sortOrder) {
      this.setInitialSortData();
    } else {
      this.sortData.push(data);
    }
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

  setInitialSortData() {
    this.sortData = [];
    const sortData: SortData = {
      sortColumn: 'createdAt',
      sortOrder: 'desc'
    };
    this.sortData.push(sortData);
  }

  addCategory() {
    this.router.navigate([AppUrlConstants.PRICEBOOK + AppUrlConstants.SLASH + AppUrlConstants.CATEGORIES + AppUrlConstants.SLASH + AppUrlConstants.ADD]);
  }

  changePagination(paginatedData: PaginationData): void {
    this.customPaginationData = paginatedData;
    this.getCategories();
  }

  showSelectedRows(rows: any[]): void {
    this.selectedRowIds = rows;
    this.setMenuItemsDisable();
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

  onFilter(event) {
    this.filterData = event;
    this.getCategories();
  }

  // edit(data: any) {
  //   this.router.navigate(['/settings/operations/businessunit/' + data.id + '/edit']);
  // }
  editCategory(categoryId: Category) {
    this.router.navigate([AppUrlConstants.PRICEBOOK + AppUrlConstants.SLASH + AppUrlConstants.CATEGORIES + AppUrlConstants.SLASH + categoryId.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]);
  }

  search(q: string) {
    this.setInitialCustomPaginationData();
    this.searchQuery.q = q;
    if (q) {
      this.getCategories(this.searchQuery.q);
    } else {
      this.getCategories();
    }
  }

  handleSorting(data: any) {
    this.setSortData(data.sortObj);
    this.customPaginationData = data.paginationObj;
    if (this.searchQuery && this.searchQuery.q) {
      this.getCategories(this.searchQuery.q);
    } else {
      this.getCategories();
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


  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
