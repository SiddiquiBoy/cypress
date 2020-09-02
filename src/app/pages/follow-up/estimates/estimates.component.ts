import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Estimate } from 'src/app/modals/estimate/estimate';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { EstimatesService } from './services/estimates.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/modals/user/user';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EstimatesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  estimates: Estimate[] = [];

  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  actionButtonDropdownMenu: MenuItem[] = [];
  tableActionButtons: TableActionButton[] = [];
  selectedRowIds: string[] = [];

  totalRecords: number;
  paginationData: PaginationData;

  sortData: SortData[] = [];
  globalFilterData: GlobalFilterData;
  filterData: FilterData[];

  searchPlaceholder: string;
  description: string;
  // editButtonPermission: string;
  viewButtonPermission: string;

  isSpinning = false;
  firstLoad: boolean = true;

  orgId: string;

  constructor(
    private estimateService: EstimatesService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchPlaceholder = 'Search code and name';
    this.setOrgId();
    this.setColumns();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.getEstimates();
    this.setPermissions();
  }

  setOrgId() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      if (user && user.organization) {
        this.orgId = user.organization.id;
      } else {
        this.orgId = undefined;
      }
    });
  }

  setColumns() {
    this.columns = this.estimateService.getColumnItems();
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
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  getEstimates() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.estimateService.listEstimates(this.orgId, this.paginationData, this.sortData, this.globalFilterData, this.filterData)
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listEstimates) {
              if (this.firstLoad) {
                this.firstLoad = false;
              }
              this.totalRecords = response["data"]["listEstimates"]["total"];
              this.estimates = response["data"]["listEstimates"]["data"];
              this.isSpinning = false;
            }
          },
          (error) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (this.firstLoad) {
              this.firstLoad = false;
            }
            this.messageService.error(errorObj.message);
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  setPermissions() {
    this.viewButtonPermission = Permission.VIEW_ESTIMATE;
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getEstimates();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getEstimates();
  }

  onRowEditClick(row: any) {
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getEstimates();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getEstimates();
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
  }

  onRowViewClick(row: Estimate) {
    this.router.navigate(
      [AppUrlConstants.FOLLOW_UP + AppUrlConstants.SLASH + AppUrlConstants.ESTIMATES + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW]
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
