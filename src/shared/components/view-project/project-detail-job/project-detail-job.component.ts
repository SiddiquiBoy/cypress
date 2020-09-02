import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges, OnChanges } from "@angular/core";
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Router } from '@angular/router';
import { Project } from 'src/app/modals/project/project';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { ViewProjectService } from '../services/view-project.service';
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
import { Job } from 'src/app/modals/job/job';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';

@Component({
  selector: 'app-project-detail-job',
  templateUrl: 'project-detail-job.component.html',
  styleUrls: ['./project-detail-job.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectDetailJobComponent implements OnInit, OnChanges {

  columns: ColumnItem[] = [];
  isSpinning: boolean;
  @Input() project: Project = new Project();
  jobsCopy: Job[] = [];
  jobs: Job[] = []
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
    private router: Router,
    private viewProjectService: ViewProjectService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit() {
    this.setJobs()
    this.setColumns();
    this.setTableConfig();
    this.setInitialPaginationData();
    this.setInitialGlobalFilterData();
    this.setAllNonEditableStatus();
    this.setTableActionButtons();
    this.setSearchPlaceholder();
    this.setPermission();
  }

  setColumns() {
    this.columns = this.viewProjectService.getColumnItems();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        this.setJobs();
      }
    }
  }

  setJobs() {
    this.jobs = this.project.jobs;
    this.cloneJobs();
  }

  cloneJobs() {
    this.jobsCopy = Utils.cloneDeep(this.jobs);
  }

  /**
   * @description Submit form value for ADD/UPDATE job
   * @author Rajeev Kumar
   * @date 2020-07-22
   * @param {boolean} response
   * @memberof ProjectDetailJobComponent
   */
  checkJobFormSubmitResponse(response: boolean) {
    if (response) {
      this.showEditDialog = false;
      this.showAddDialog = false;
      this.emitRefreshData.emit(true);
      this.setJobs();
    } else {
      // do nothing
    }
  }

  /**
   * @description On cancle poup disable
   * @author Rajeev Kumar
   * @date 2020-07-22
   * @param {boolean} jobUpdateCancelStatus
   * @memberof ProjectDetailJobComponent
   */
  handleCancel(jobUpdateCancelStatus: boolean) {
    if (jobUpdateCancelStatus) {
      this.showEditDialog = false;
      this.showAddDialog = false;
    }
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.searchJobs();
  }

  setGlobalFilterData(value: string) {
    this.globalFilterData = {
      q: value
    };
  }

  onDateFilter(value: Date) {
    if (value) {
      this.jobsCopy = this.jobs.filter(job => DateUtil.setToBeginning(new Date(job.startDate)).valueOf() === DateUtil.setToBeginning(new Date(value)).valueOf())
    } else {
      this.jobsCopy = this.jobs;
    }
  }

  searchJobs() {
    if (this.globalFilterData.q) {
      this.jobsCopy = this.jobs.filter(job => job.jobType.name.toLowerCase().includes(this.globalFilterData.q.toLowerCase()));
    } else {
      this.jobsCopy = this.jobs;
    }
  }

  setInitialGlobalFilterData() {
    this.globalFilterData = {
      q: ''
    };
  }

  setInitialPaginationData() {
    this.paginationData = {
      page: PaginationConstant.DEFAULT_PAGE_NO,
      size: this.paginationData && this.paginationData.size ? this.paginationData.size : PaginationConstant.DEFAULT_PAGE_SIZE_SMALL
    };
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
  }

  setPaginationData(data: PaginationData) {
    this.paginationData = data;
  }

  setAllNonEditableStatus() {
    this.allNonEditableStatus = [Utils.getEnumKey(JobStatus, JobStatus.dispatched), Utils.getEnumKey(JobStatus, JobStatus.inProgress),
    Utils.getEnumKey(JobStatus, JobStatus.cancelled), Utils.getEnumKey(JobStatus, JobStatus.complete)];
  }

  setTableConfig() {
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = true;
    this.tableConfig.pageSizeOptions = [5, 10, 15, 20];
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.ADD_PROJECT)) {
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

  getFormattedTime(time: string): string {
    return DateUtil.getFormattedTimeFromTimeString(time);
  }

  getDefaultDateFormat() {
    this.defaultDateFormat = DateUtil.defaultDateFormat;
  }

  /**
   * @description Show edit popup when click on edit button
   * @author Rajeev Kumar
   * @date 2020-07-22
   * @param {*} row
   * @memberof ProjectDetailJobComponent
   */
  onRowEditClick(row: any) {
    this.seletedJobId = row.id;
    this.showEditDialog = true;
    this.showAddDialog = false;
  }

  addJob() {
    this.showEditDialog = false;
    this.showAddDialog = true;
  }

  onOkClick() {
    console.log('OK BUTTON');
  }

  onRowViewClick(row: Project) {
    this.router.navigate(
      [AppUrlConstants.JOBS + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  onCancelClick() {
    this.showEditDialog = false;
    this.showAddDialog = false;
  }

  setPermission() {
    this.editButtonPermission = Permission.EDIT_JOB;
    this.viewButtonPermission = Permission.VIEW_JOB_DETAIL;
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by jobtype';
  }

}
