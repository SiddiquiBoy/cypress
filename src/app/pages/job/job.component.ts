import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Job } from 'src/app/modals/job/job';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { JobService } from './services/job.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Router } from '@angular/router';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { User } from 'src/app/modals/user/user';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { DateUtil } from 'src/shared/utilities/date-util';
import { Utils } from 'src/shared/utilities/utils';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  jobs: Job[] = [];
  columns: ColumnItem[] = [];
  selectedCols: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  isSpinning = false;
  paginationData: PaginationData;
  sortData: SortData[] = [];
  orgId: string;
  totalRecords: number;
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];
  searchPlaceholder: string;
  dateFilterPlaceholder: string;
  selectedRowIds: string[] = [];
  firstLoad = true;
  tableActionButtons: TableActionButton[] = [];
  editButtonPermission: string;
  viewButtonPermission: string;
  defaultDateFormat: string;
  allNonEditableStatus: string[] = [];
  selectedStartDate: Date;
  dateFilter: FilterData;
  showColShowHide = false;
  maxShowHideColSelections: number;

  constructor(
    private jobService: JobService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setShowColShowHide(true);
    this.setMaxShowHideColSelections();
    this.getDefaultDateFormat();
    this.setSearchPlaceholder();
    this.setDateFilterPlaceholder();
    this.setEditAndViewButtonPermission();
    this.setAllNonEditableStatus();
    this.setColumns();
    this.setInitialQueryVariables();
    this.getJobs();
    this.setTableConfig();
    this.setTableActionButtons();
  }

  setShowColShowHide(value = false) {
    this.showColShowHide = value;
  }

  setMaxShowHideColSelections() {
    this.maxShowHideColSelections = DisplayConstant.SHOW_HIDE_COL_MAX_SELECTION;
  }

  getDefaultDateFormat() {
    this.defaultDateFormat = DateUtil.defaultDateFormat;
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by job type, project and customer';
  }

  setDateFilterPlaceholder() {
    this.dateFilterPlaceholder = 'Search by start date';
  }

  setEditAndViewButtonPermission() {
    this.editButtonPermission = Permission.EDIT_JOB;
    this.viewButtonPermission = Permission.VIEW_JOB_DETAIL;
  }

  setAllNonEditableStatus() {
    this.allNonEditableStatus = [Utils.getEnumKey(JobStatus, JobStatus.dispatched), Utils.getEnumKey(JobStatus, JobStatus.inProgress),
    Utils.getEnumKey(JobStatus, JobStatus.cancelled), Utils.getEnumKey(JobStatus, JobStatus.complete)];
  }

  setColumns() {
    this.columns = this.jobService.getColumnItems();
  }

  setInitialQueryVariables() {
    this.setOrgId();
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialGlobalFilterData();
    this.setInitialFilterData();
    this.setInitialDateFilter();
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
    // this.sortData = {
    //   sortColumn: 'createdAt',
    //   sortOrder: 'desc'
    // };
  }

  setInitialGlobalFilterData() {
    this.globalFilterData = {
      q: ''
    };
  }

  setInitialFilterData() {
    this.filterData = [];
  }

  setInitialDateFilter() {
    this.dateFilter = {};
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

  setFilterData(data: FilterData[]) {
    this.filterData = data;
    if (this.selectedStartDate) {
      this.addDateFilterToFilterData();
    } else {
      this.removeDateFilterFromFilterData();
    }
  }

  setStartDateFilter(date: Date) {
    if (date) {
      this.selectedStartDate = new Date(date);
    } else {
      this.selectedStartDate = null;
    }
    if (this.selectedStartDate) {
      this.dateFilter = {
        field: 'startDate',
        value: this.selectedStartDate,
        op: FilterOp.equal,
        type: 'date'
      };
      this.addDateFilterToFilterData();
    } else {
      this.removeDateFilterFromFilterData();
    }
  }

  addDateFilterToFilterData() {
    this.removeDateFilterFromFilterData();
    this.filterData.push(this.dateFilter);
  }

  removeDateFilterFromFilterData() {
    this.filterData = this.filterData.filter(item => item.field !== 'startDate');
  }

  getJobs() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.jobService.getJobs(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData).valueChanges.subscribe(
        (response) => {
          if (response) {
            if (this.firstLoad) {
              // this.setColumns();
              this.firstLoad = false;
            }
            this.totalRecords = response['data']['listJobs']['total']
            this.jobs = response['data']['listJobs']['data'];
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

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getJobs();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getJobs();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getJobs();
  }

  onDateFilter(date: Date) {
    this.setStartDateFilter(date);
    this.setInitialPaginationData();
    this.getJobs();
  }

  onRowEditClick(row: Job) {
    this.router.navigate(
      [AppUrlConstants.JOBS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]
    );
  }

  onRowViewClick(row: Job) {
    this.router.navigate(
      [AppUrlConstants.JOBS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getJobs();
  }

  setTableConfig() {
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.ADD_JOB)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addJob();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

  addJob() {
    this.router.navigate([AppUrlConstants.JOBS + AppUrlConstants.SLASH + AppUrlConstants.ADD]);
  }

  getFormattedTime(time: string): string {
    return DateUtil.getFormattedTimeFromTimeString(time);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
