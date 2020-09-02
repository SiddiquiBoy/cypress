import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges, OnChanges } from "@angular/core";
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Router } from '@angular/router';
import { Project } from 'src/app/modals/project/project';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { ViewPaymentService } from '../services/view-payment.service';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { DateUtil } from 'src/shared/utilities/date-util';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { Payment } from 'src/app/modals/payment/payment';
import { PaymentDetail } from 'src/app/modals/payment-detail/payment-detail';

@Component({
  selector: 'app-payment-detail',
  templateUrl: 'payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PaymentDetailComponent implements OnInit {

  columns: ColumnItem[] = [];
  isSpinning: boolean;
  @Input() payment: Payment = new Payment();
  paymentDetailCopy: PaymentDetail[] = [];
  paymentDetail: PaymentDetail[] = []
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
    this.setPayments()
    this.setColumns();
    this.setTableConfig();
    this.setInitialPaginationData();
  }

  setColumns() {
    this.columns = this.viewPaymentService.getColumnItems();
  }
  
  setPayments() {
    this.paymentDetail = this.payment.paymentDetails;
    this.clonePayments();
  }

  clonePayments() {
    this.paymentDetailCopy = Utils.cloneDeep(this.paymentDetail);
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
