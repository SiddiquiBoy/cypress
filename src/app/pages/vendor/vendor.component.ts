import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Vendor } from 'src/app/modals/vendor/vendor';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { VendorService } from './services/vendor-service';
import { User } from 'src/app/modals/user/user';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Apollo } from 'apollo-angular';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})

export class VendorComponent implements OnInit, OnDestroy {
  isSpinning = false;
  subscriptions: Subscription[] = [];
  vendors: Vendor[] = [];
  columns: ColumnItem[] = [];
  selectedCols: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
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
  editButtonPermission: boolean = true;

  constructor(
    private vendorService: VendorService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private router: Router,
    private apolloService: Apollo,

  ) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s =>
      s.unsubscribe()
    )
  }

  ngOnInit() {
    this.setInitialQueryVariables();
    this.setColumns();
    this.getVendors();
    this.setTableConfig();
    this.setSearchPlaceholder();
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Seach by name and tags';
  }

  setInitialQueryVariables() {
    this.setOrgId();
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialGlobalFilterData();
    this.setInitialFilterData();
  }

  setColumns() {
    this.columns = this.vendorService.getColumnItems();
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

  getVendors() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.vendorService.listOfVendors(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData).valueChanges.subscribe(
        (response) => {
          if (response) {
            if (this.firstLoad) {
              this.firstLoad = false;
            }
            this.totalRecords = response['data']['listVendors']['total']
            this.vendors = response['data']['listVendors']['data']
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

  setTableConfig() {
    this.tableConfig.showCheckboxes = true;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  onRowsSelectionChange(rowIds: string[]): void {
    this.selectedRowIds = rowIds;
    this.setMenuItemsDisable();
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getVendors();
  }

  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (this.authenticationService.checkPermission(Permission.MENU_VENDORS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false));
    }
    if (this.authenticationService.checkPermission(Permission.MENU_VENDORS)) {
      this.actionButtonDropdownMenu.push(Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false));
    }
    this.setMenuItemsDisable();
  }

  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(id => this.vendors.findIndex(vendor => vendor.id === id && GeneralStatus[vendor.status] === GeneralStatus.active) !== -1);
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(id => this.vendors.findIndex(vendor => vendor.id === id && GeneralStatus[vendor.status] === GeneralStatus.inactive) !== -1);
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
          this.vendorService.changeVendorStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              this.apolloService.getClient().resetStore().then(val => {
                this.getVendors();
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

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.UPDATE_VENDOR_STATUS)) {
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
    if (this.authenticationService.checkPermission(Permission.ADD_VENDOR)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addVendor();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

  addVendor() {
    this.router.navigateByUrl('/vendors/add');
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getVendors();
  }

  onRowEditClick(row: Vendor) {
    this.router.navigate(
      [AppUrlConstants.VENDORS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]
    );
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getVendors();
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getVendors();
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


}
