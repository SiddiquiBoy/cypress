import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Demo } from 'src/app/modals/demo/demo';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { DemoService } from './services/demo.service';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DemoComponent implements OnInit, OnDestroy {

  isSpinning = false;
  firstLoad = true;
  subscriptions: Subscription[] = [];
  demos: Demo[] = [];
  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  totalRecords: number;
  paginationData: PaginationData = {};
  sortData: SortData[] = [];
  globalFilterData: GlobalFilterData = { q: '' };
  searchPlaceholder: string;
  tableActionButtons: TableActionButton[] = [];

  constructor(
    private demoService: DemoService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.setSearchPlaceholder();
    this.setColumns();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.setTableActionButtons();
    this.getDemos();
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by company name, contact person and phone number';
  }

  setColumns() {
    this.columns = this.demoService.getColumnItems();
  }

  setInitialQueryVariables() {
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialGlobalFilterData();
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

  setPaginationData(data: PaginationData) {
    this.paginationData = data;
  }

  setSortData(data: SortData) {
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

  setTableConfig() {
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
  }

  getDemos() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.demoService.getDemos(this.paginationData, this.sortData, this.globalFilterData)
        .valueChanges
        .subscribe(
          (response: any) => {
            this.isSpinning = false;
            if (response && response.data && response.data.listDemos) {
              this.checkFirstLoad();
              this.demos = response.data.listDemos.data;
              this.totalRecords = response.data.listDemos.total;
            }
          },
          (error: any) => {
            this.checkFirstLoad();
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

  checkFirstLoad() {
    if (this.firstLoad) {
      this.firstLoad = false;
    }
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.paginationData = paginatedData;
    this.getDemos();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getDemos();
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getDemos();
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
