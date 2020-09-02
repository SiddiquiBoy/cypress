import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Invoice } from 'src/app/modals/invoice/invoice';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Subscription } from 'rxjs';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { InvoiceService } from './services/invoice-service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceComponent implements OnInit {
  subscriptions: Subscription[] = [];
  tableConfig: TableConfig = new TableConfig();
  isSpinning = false;
  paginationData: PaginationData;
  viewButtonPermission: string;
  tableActionButtons: TableActionButton[] = [];
  dateFilter: FilterData;
  invoices: [] = [];
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

  constructor(private invoiceService: InvoiceService) { }

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
    // need to implement
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
    this.columns = this.invoiceService.getColumnItems();
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
