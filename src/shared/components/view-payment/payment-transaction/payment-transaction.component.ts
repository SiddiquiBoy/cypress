import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges, OnChanges } from "@angular/core";
import { Router } from '@angular/router';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { ViewPaymentService } from '../services/view-payment.service';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { Payment } from 'src/app/modals/payment/payment';
import { PaymentTransaction } from 'src/app/modals/payment-transaction/payment-transaction';

@Component({
  selector: 'app-payment-transaction',
  templateUrl: 'payment-transaction.component.html',
  styleUrls: ['./payment-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PaymentTransactionComponent implements OnInit, OnChanges {

  columns: ColumnItem[] = [];
  isSpinning: boolean;
  @Input() payment: Payment = new Payment();
  paymentTransactionCopy: PaymentTransaction[] = [];
  paymentTransaction: PaymentTransaction[] = []
  tableConfig: TableConfig = new TableConfig();
  paginationData: PaginationData;
  defaultDateFormat: string;
  editButtonPermission: string;
  viewButtonPermission: string;
  allNonEditableStatus: string[] = [];
  tableActionButtons: TableActionButton[] = [];
  sortData: SortData[] = [];
  showEditDialog: boolean = false;
  showAddDialog: boolean = false;
  seletedJobId: string = undefined;
  @Output() emitRefreshData = new EventEmitter<any>();
  globalFilterData: GlobalFilterData;
  searchPlaceholder: string;

  constructor(
    private viewPaymentService: ViewPaymentService,
  ) { }
  ngOnInit() {
    this.setPaymentTransactions()
    this.setColumns();
    this.setTableConfig();
    this.setInitialPaginationData();
  }

  setColumns() {
    this.columns = this.viewPaymentService.getTransactionColumnItems();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        this.setPaymentTransactions();
      }
    }
  }

  setPaymentTransactions() {
    this.paymentTransaction = this.payment.paymentTransactions;
    this.clonePaymentTransaction();
  }

  clonePaymentTransaction() {
    this.paymentTransactionCopy = Utils.cloneDeep(this.paymentTransaction);
  }


  setInitialPaginationData() {
    this.paginationData = {
      page: 1,
      size: this.paginationData && this.paginationData.size ? this.paginationData.size : PaginationConstant.DEFAULT_PAGE_SIZE_SMALL
    };
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
  }

  setPaginationData(data: PaginationData) {
    this.paginationData = data;
  }


  setTableConfig() {
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = true;
    this.tableConfig.pageSizeOptions = [5, 10, 15, 20];
  }

}
