import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { Service } from 'src/app/modals/service/service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { OrgService } from './services/org.service';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { User } from 'src/app/modals/user/user';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-org-services',
  templateUrl: './org-services.component.html',
  styleUrls: ['./org-services.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrgServicesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  services: Service[] = [];

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
    private orgService: OrgService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchPlaceholder = 'Search by name, service code and category';
    this.description =
      'Manage your service items. Services include repairs, installations, memberships, and other revenue generating items you sell.';
    this.setOrgId();
    this.setColumns();
    this.setEditButtonPermission();
    this.setActionButtonDropdownMenu();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.getOrgServices();
  }

  setOrgId() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      // const user: User = Utils.getItemFromLocalStorage('user');
      if (user && user.organization) {
        this.orgId = user.organization.id;
        // this.getCategories();
      } else {
        this.orgId = undefined;
      }
    });
  }

  setColumns() {
    this.columns = this.orgService.getColumnItems();
  }

  setActionButtonDropdownMenu() {
    this.actionButtonDropdownMenu = [];
    if (
      this.authenticationService.checkPermission(
        Permission.UPDATE_PRICEBOOK_SERVICES_STATUS
      )
    ) {
      this.actionButtonDropdownMenu.push(
        Utils.createMenuItem(MenuConstants.ACTIVATE, null, null, false)
      );
    }
    if (
      this.authenticationService.checkPermission(
        Permission.UPDATE_PRICEBOOK_SERVICES_STATUS
      )
    ) {
      this.actionButtonDropdownMenu.push(
        Utils.createMenuItem(MenuConstants.DEACTIVATE, null, null, false)
      );
    }
    this.setMenuItemsDisable();
  }

  setEditButtonPermission() {
    this.editButtonPermission = Permission.EDIT_TIMESHEET_CODE;
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
      size:
        this.paginationData && this.paginationData.size
          ? this.paginationData.size
          : PaginationConstant.DEFAULT_PAGE_SIZE,
    };
  }

  setInitialSortData() {
    this.sortData = [];
    const sortData: SortData = {
      sortColumn: 'createdAt',
      sortOrder: 'desc',
    };
    this.sortData.push(sortData);
  }

  setInitialGlobalFilterData() {
    this.globalFilterData = {
      q: '',
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
      this.sortData.push(data);
    }
  }

  setGlobalFilterData(value: string) {
    this.globalFilterData = {
      q: value,
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

  getOrgServices() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.orgService
        .listServices(
          this.orgId,
          this.paginationData,
          this.sortData,
          this.globalFilterData,
          this.filterData
        )
        .valueChanges.subscribe(
          (data) => {
            if (
              data &&
              data.data &&
              data.data.listServices &&
              data.data.listServices.data
            ) {
              if (this.firstLoad) {
                this.firstLoad = false;
              }
              this.totalRecords = data.data.listServices.total;
              this.services = data.data.listServices.data;
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
          this.orgService.changeStatus(this.selectedRowIds, action).subscribe(
            (response) => {
              if (response) {
                this.isSpinning = false;
                this.getOrgServices();
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
    this.getOrgServices();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getOrgServices();
  }

  onRowEditClick(row: any) {
    this.router.navigate([`priceBook/services/${row.id}/edit`]);
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getOrgServices();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getOrgServices();
  }

  setMenuItemsDisable() {
    const selectedActiveTypeRowIds = this.selectedRowIds.filter(
      (id) =>
        this.services.findIndex(
          (service) =>
            service.id === id &&
            GeneralStatus[service.status] === GeneralStatus.active
        ) !== -1
    );
    const selectedInactiveTypeRowIds = this.selectedRowIds.filter(
      (id) =>
        this.services.findIndex(
          (service) =>
            service.id === id &&
            GeneralStatus[service.status] === GeneralStatus.inactive
        ) !== -1
    );
    const activeRowSelected =
      selectedActiveTypeRowIds && selectedActiveTypeRowIds.length > 0
        ? true
        : false;
    const inactiveRowSelected =
      selectedInactiveTypeRowIds && selectedInactiveTypeRowIds.length > 0
        ? true
        : false;
    this.actionButtonDropdownMenu.forEach((item) => {
      if (item.label === MenuConstants.ACTIVATE) {
        item.disabled = this.shouldDisableItem(
          activeRowSelected,
          inactiveRowSelected
        );
      }
      if (item.label === MenuConstants.DEACTIVATE) {
        item.disabled = this.shouldDisableItem(
          inactiveRowSelected,
          activeRowSelected
        );
      }
    });
    this.setTableActionButtons();
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (
      this.authenticationService.checkPermission(
        Permission.UPDATE_PRICEBOOK_SERVICES_STATUS
      )
    ) {
      const actionButton: TableActionButton = {
        label: MenuConstants.ACTIONS,
        type: TableActionButtonType.MULTIPLE,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        nzGhost: true,
        icon: IconConstants.DOWN,
        menu: this.actionButtonDropdownMenu,
        onChildClick: (item: MenuItem) => {
          this.onMenuItemClick(item);
        },
      };
      this.tableActionButtons.push(actionButton);
    }
    if (
      this.authenticationService.checkPermission(
        Permission.ADD_PRICEBOOK_SERVICES
      )
    ) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addService();
        },
      };
      this.tableActionButtons.push(addButton);
    }
    // this.tableActionButtons.push(actionButton, addButton);
  }

  shouldDisableItem(
    itemTypeRowsSelected: boolean,
    otherTypeRowsSelected: boolean
  ): boolean {
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

  addService() {
    this.router.navigate([
      AppUrlConstants.PRICEBOOK +
      AppUrlConstants.SLASH +
      AppUrlConstants.SERVICES +
      AppUrlConstants.SLASH +
      AppUrlConstants.ADD,
    ]);
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
