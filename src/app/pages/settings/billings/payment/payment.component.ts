import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { PaymentService } from './services/payment-service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Payment } from 'src/app/modals/payment/payment';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements OnInit {
  subscriptions: Subscription[] = [];
  tableConfig: TableConfig = new TableConfig();
  isSpinning = false;
  paginationData: PaginationData;
  viewButtonPermission: string;
  tableActionButtons: TableActionButton[] = [];
  dateFilter: FilterData;
  payments: [] = [];
  columns: ColumnItem[] = [];
  selectedCols: ColumnItem[] = [];
  sortData: SortData[] = [];
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];
  totalRecords: number;
  searchPlaceholder: string;
  dateFilterPlaceholder: string;
  firstLoad = true;
  selectedRangeDate: Date;


  constructor(
    private paymentService: PaymentService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router

  ) { }

  ngOnInit() {
    this.setColumns();
    this.setTableConfig();
    this.setSearchPlaceholder();
    this.setInitialQueryVariables();
    this.setViewButtonPermission();
    this.getPayments();
  }

  setInitialQueryVariables() {
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialFilterData();
    this.setInitialDateFilter();
  }

  setInitialFilterData() {
    this.filterData = [];
  }

  setInitialDateFilter() {
    this.dateFilter = {};
  }

  setTableConfig() {
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getPayments();
  }


  getPayments() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.paymentService.listOfPayments(this.paginationData, this.sortData, this.filterData).valueChanges.subscribe(
        (response) => {
          if (response) {
            if (this.firstLoad) {
              this.firstLoad = false;
            }
            this.totalRecords = response['data']['listPayments']['total']
            this.payments = response['data']['listPayments']['data']
            console.log(this.payments);
            // this.setActionButtonDropdownMenu();
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

  onRowViewClick(row: Payment) {
    this.router.navigate(
      [AppUrlConstants.SETTINGS + AppUrlConstants.SLASH +  AppUrlConstants.BILLINGS + AppUrlConstants.SLASH +  AppUrlConstants.PAYMENT + AppUrlConstants.SLASH +row.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  setViewButtonPermission() {
    this.viewButtonPermission = Permission.VIEW_PAYMENT;
  }
  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by month, year, and status';
  }

  setSortData(data: SortData) {
    this.sortData = [];
    if (!data.sortOrder) {
      this.setInitialSortData();
    } else {
      this.sortData.push(data);
    }
  }

  setInitialPaginationData() {
    this.paginationData = {
      page: 1,
      size: this.paginationData && this.paginationData.size ? this.paginationData.size : 10
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

  setPaginationData(data: PaginationData) {
    this.paginationData = data;
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getPayments();
  }


  setColumns() {
    this.columns = this.paymentService.getColumnItems();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getPayments();
  }

  setFilterData(data: FilterData[]) {
    this.filterData = data;
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getPayments();
  }

  onFilterRangeDate(date: Date) {
    console.log(date)
    this.setStartDateFilter(date);
    this.setInitialPaginationData();
    this.getPayments();
  }

  setStartDateFilter(date: Date) {
    if (date) {
      this.selectedRangeDate = date;
    } else {
      this.selectedRangeDate = null;
    }
    if (this.selectedRangeDate) {
      this.dateFilter = {
        field: 'billingStartDate',
        value: this.selectedRangeDate,
        op: FilterOp.between,
        type: 'date'
      };
      this.addDateFilterToFilterData();
    } else {
      this.removeDateFilterFromFilterData();
    }
  }

  addDateFilterToFilterData() {
    this.removeDateFilterFromFilterData();
    this.filterData = [];
    this.filterData.push(this.dateFilter);
  }

  removeDateFilterFromFilterData() {
    this.filterData = this.filterData.filter(item => item.field !== 'rangeDate');
  }

  setGlobalFilterData(value: string) {
    this.globalFilterData = {
      q: value
    };
  }
}
