import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Job } from 'src/app/modals/job/job';
import { Subscription } from 'rxjs';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { Router } from '@angular/router';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ViewEstimateService } from '../services/view-estimate.service';
import { DateUtil } from 'src/shared/utilities/date-util';

@Component({
  selector: 'app-estimate-job-list',
  templateUrl: './estimate-job-list.component.html',
  styleUrls: ['./estimate-job-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EstimateJobListComponent implements OnInit, OnDestroy {

  @Input() jobs: Job[] = [];
  jobsCopy: Job[] = [];

  subscriptions: Subscription[] = [];

  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();

  totalRecords: number;
  paginationData: PaginationData;
  sortData: SortData[];
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];

  viewButtonPermission: string;

  searchPlaceholder: string;
  isSpinning = false;
  defaultDateFormat: string;

  constructor(
    private viewEstimateService: ViewEstimateService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.searchPlaceholder = 'Search by code';
    this.setPermissions();
    this.setTotalRecords();
    this.setColumns();
    this.getDefaultDateFormat();
    this.setInitialQueryVariables();
    this.setTableConfig();
  }

  setPermissions() {
    this.viewButtonPermission = Permission.VIEW_JOB_DETAIL;
  }

  setTotalRecords() {
    this.totalRecords = this.jobs.length;
  }

  setColumns() {
    this.columns = this.viewEstimateService.getJobColumnItems();
  }

  setGlobalFilterData(value: string) {
    this.globalFilterData = {
      q: value
    };
  }

  getDefaultDateFormat() {
    this.defaultDateFormat = DateUtil.defaultDateFormat;
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
    this.setInitialGlobalFilterData();
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
    this.searchJobs();
  }

  searchJobs() {
    this.isSpinning = true;
    this.jobs = [...this.jobsCopy];
    if (this.globalFilterData.q) {
      this.jobs = this.jobs.filter(job => job.code.toLowerCase().includes(this.globalFilterData.q.toLowerCase()));
    }
    this.isSpinning = false;
  }

  getFormattedTime(time: string): string {
    return DateUtil.getFormattedTimeFromTimeString(time);
  }

  onRowViewClick(row: Job) {
    this.router.navigate(
      [AppUrlConstants.JOBS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
