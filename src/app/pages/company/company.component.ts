import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/modals/company/company';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { CompanyService } from './services/company.service';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { TableActionButtonNzType } from 'src/app/modals/general-table/table-action-button-nz-type.enum';
import { TableActionButtonType } from 'src/app/modals/general-table/table-action-button-type.enum';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { User } from 'src/app/modals/user/user';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyComponent implements OnInit, OnDestroy {

  isSpinning = false;
  firstLoad = true;
  subscriptions: Subscription[] = [];
  companies: Company[] = [];
  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  totalRecords: number;
  paginationData: PaginationData = {};
  sortData: SortData[] = [];
  globalFilterData: GlobalFilterData = { q: '' };
  filterData: FilterData[];
  searchPlaceholder: string;
  tableActionButtons: TableActionButton[] = [];
  editButtonPermission: string;
  // orgId: string;

  constructor(
    private companyService: CompanyService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.setOrgId();
    this.setSearchPlaceholder();
    this.setColumns();
    this.setEditButtonPermission();
    this.setInitialQueryVariables();
    this.setTableConfig();
    this.setTableActionButtons();
    this.getCompanies();
  }

  setSearchPlaceholder() {
    this.searchPlaceholder = 'Search by name';
  }

  setColumns() {
    this.columns = this.companyService.getColumnItems();
  }

  setEditButtonPermission() {
    this.editButtonPermission = Permission.EDIT_COMPANY;
  }

  setInitialQueryVariables() {
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialGlobalFilterData();
    this.setInitialFilterData();
  }

  setInitialSortData() {
    this.sortData = [];
    const sortData: SortData = {
      sortColumn: 'createdAt',
      sortOrder: 'desc'
    };
    this.sortData.push(sortData);
  }

  setInitialPaginationData() {
    this.paginationData = {
      page: PaginationConstant.DEFAULT_PAGE_NO,
      size: this.paginationData && this.paginationData.size ? this.paginationData.size : PaginationConstant.DEFAULT_PAGE_SIZE
    };
  }

  setInitialGlobalFilterData() {
    this.globalFilterData = {
      q: ''
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
  }

  /**
   * @description Fetch list of organizations
   * @author Aman Purohit
   * @date 2020-06-09
   * @memberof CompanyComponent
   */
  getCompanies() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.companyService.getCompanies(this.sortData, this.globalFilterData, this.paginationData, this.filterData)
        .valueChanges
        .subscribe(
          (response: any) => {
            this.isSpinning = false;
            if (response && response.data && response.data.listOrganizations) {
              this.checkFirstLoad();
              this.companies = response.data.listOrganizations.data;
              this.totalRecords = response.data.listOrganizations.total;
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

  /**
   * @description Send column data after fetching list of companies
   * on first time load only
   * @author Aman Purohit
   * @date 2020-06-09
   * @memberof CompanyComponent
   */
  checkFirstLoad() {
    if (this.firstLoad) {
      this.firstLoad = false;
    }
  }

  /**
   * @description Sets the table configuration for companies list
   * page
   * @author Aman Purohit
   * @date 2020-06-09
   * @memberof CompanyComponent
   */
  setTableConfig() {
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
  }

  setTableActionButtons() {
    this.tableActionButtons = [];
    if (this.authenticationService.checkPermission(Permission.ADD_COMPANY)) {
      const addButton: TableActionButton = {
        label: MenuConstants.ADD,
        nzType: TableActionButtonNzType.NZ_PRIMARY,
        type: TableActionButtonType.SINGLE,
        nzGhost: false,
        onClick: () => {
          this.addOrganization();
        }
      };
      this.tableActionButtons.push(addButton);
    }
  }

  setOrgId() {
    // this.subscriptions.push(
    //   this.authenticationService.currentUser.subscribe((user: User) => {
    //     if (user && user.organization) {
    //       this.orgId = user.organization.id;
    //     } else {
    //       this.orgId = undefined;
    //     }
    //   })
    // );
  }

  addOrganization() {
    this.router.navigate(
      [AppUrlConstants.COMPANIES + AppUrlConstants.SLASH + AppUrlConstants.ADD]
    );
  }

  onRowEditClick(row: Company) {
    this.router.navigate(
      [AppUrlConstants.COMPANIES + AppUrlConstants.SLASH + row.id + AppUrlConstants.SLASH + AppUrlConstants.EDIT]
    );
  }

  /**
   * @description Event handler for pagination
   * @author Aman Purohit
   * @date 2020-06-09
   * @param {PaginationData} paginatedData
   * @memberof CompanyComponent
   */
  onPaginationChange(paginatedData: PaginationData): void {
    this.paginationData = paginatedData;
    this.getCompanies();
  }

  /**
   * @description Event handler for sorting
   * @author Aman Purohit
   * @date 2020-06-09
   * @param {*} data
   * @memberof CompanyComponent
   */
  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getCompanies();
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getCompanies();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getCompanies();
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
