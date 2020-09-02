import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/modals/address/address';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { ViewCustomerService } from '../services/view-customer.service';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-customer-address-list',
  templateUrl: './customer-address-list.component.html',
  styleUrls: ['./customer-address-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerAddressListComponent implements OnInit, OnDestroy, OnChanges {

  subscriptions: Subscription[] = [];
  @Input() addresses: Address[] = [];
  @Input() customerId: string;

  @Output() emitOnCustomerUpdate = new EventEmitter<boolean>();
  @Output() emitOnCustomerAddressCreate = new EventEmitter<boolean>();
  @Output() emitOnCustomerAddressUpdate = new EventEmitter<boolean>();
  @Output() emitOnCustomerAddressDelete = new EventEmitter<boolean>();

  address: Address = new Address();
  addressesCopy: Address[] = [];

  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();

  totalRecords: number;
  paginationData: PaginationData;
  sortData: SortData[];
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];
  tableActionButtons: TableActionButton[] = [];

  searchPlaceholder: string;
  isSpinning = false;

  editButtonPermission: string;
  deleteButtonPermission: string;

  showAddAddressDialog = false;
  showEditAddressDialog = false;
  showDeleteConfirmationDialog = false;

  constructor(
    private viewCustomerService: ViewCustomerService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.searchPlaceholder = 'Search by street';
    this.cloneAddresses();
    this.setTotalRecords();
    this.setColumns();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.setPermissions();
    this.setTableActionButtons();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'addresses': {
            this.cloneAddresses();
          }
        }
      }
    }
  }

  cloneAddresses() {
    this.addressesCopy = Utils.cloneDeep(this.addresses);
  }

  setPermissions() {
    this.editButtonPermission = Permission.EDIT_CUSTOMER;
    this.deleteButtonPermission = Permission.EDIT_CUSTOMER;
  }

  setTotalRecords() {
    this.totalRecords = this.addresses.length;
  }

  setColumns() {
    this.columns = this.viewCustomerService.getAddressesColumnItems();
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
    // this.setInitialSortData();
    this.setInitialGlobalFilterData();
    // this.setInitialFilterData();
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
    this.searchAddress();
  }

  searchAddress() {
    this.isSpinning = true;
    this.addresses = [...this.addressesCopy];
    if (this.globalFilterData.q) {
      this.addresses = this.addresses.filter(address => address.street.toLowerCase().includes(this.globalFilterData.q.toLowerCase()));
    }
    this.isSpinning = false;
  }

  openAddAddressDialog() {
    this.address = new Address();
    this.showAddAddressDialog = true;
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    // if (this.authenticationService.checkPermission(Permission.ADD_PROJECT)) {
    const addButton: TableActionButton = {
      label: MenuConstants.ADD,
      nzType: TableActionButtonNzType.NZ_PRIMARY,
      type: TableActionButtonType.SINGLE,
      nzGhost: false,
      onClick: () => {
        this.openAddAddressDialog();
      }
    };
    this.tableActionButtons.push(addButton);
    // }
  }

  onPaginationChange(paginationData: PaginationData): void {
  }

  addAddress() {
  }

  updateAddress() {
  }

  /**
   * @description handle delete action
   * @author Aman Purohit
   * @date 2020-07-22
   * @memberof CustomerAddressListComponent
   */
  onOkClick() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewCustomerService.deleteAddress(this.address.id)
        .subscribe(
          (response) => {
            if (response) {
              this.isSpinning = false;
              this.showDeleteConfirmationDialog = false;
              // this.emitOnCustomerUpdate.emit(true);
              this.emitOnCustomerAddressDelete.emit(true);
            } else {
              this.isSpinning = false;
            }
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
  }

  onCancelClick() {
    this.showAddAddressDialog = false;
    this.showEditAddressDialog = false;
    this.showDeleteConfirmationDialog = false;
  }

  onRowEditClick(row: Address) {
    this.address = Utils.cloneDeep(row);
    this.showEditAddressDialog = true;
  }

  onRowDeleteClick(row: Address) {
    this.address = Utils.cloneDeep(row);
    this.showDeleteConfirmationDialog = true;
  }

  handleResponse(status: boolean) {
    if (status) {
      this.emitOnCustomerUpdate.emit(true);
    }
    this.onCancelClick();
  }

  onCustomerAddressCreate(status: boolean) {
    if (status) {
      this.emitOnCustomerAddressCreate.emit(true);
    }
    this.onCancelClick();
  }

  onCustomerAddressUpdate(status: boolean) {
    if (status) {
      this.emitOnCustomerAddressUpdate.emit(true);
    }
    this.onCancelClick();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
