import { Injectable } from '@angular/core';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Apollo, QueryRef } from 'apollo-angular';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Utils } from 'src/shared/utilities/utils';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import gql from 'graphql-tag';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { JobQueries } from '../queries/job-queries';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Job Type', type: DataTypes.CUSTOM, columnMap: 'jobType.name', showSort: true, permanent: true, width: '120px' },
      // { name: 'Start Date', type: DataTypes.CUSTOM, columnMap: 'startDate', showSort: true, permanent: true, width: '120px' },
      { name: 'Start Date', type: DataTypes.CUSTOM, columnMap: 'startDate', showSort: true, default: true, width: '120px' },
      { name: 'Start Time', type: DataTypes.CUSTOM, columnMap: 'startTime', showSort: true, default: true, width: '120px' },
      { name: 'Tags', type: DataTypes.CUSTOM, columnMap: 'tags.name', showSort: true, default: true, width: '200px' },
      { name: 'Summary', type: DataTypes.CUSTOM, columnMap: 'summary', showSort: true, default: false, width: '200px' },
      { name: 'Project', type: DataTypes.CUSTOM, columnMap: 'project.name', permanent: true, showSort: true, width: '120px' },
      { name: 'Customer', type: DataTypes.CUSTOM, columnMap: 'customer.fullName', permanent: true, showSort: true, width: '120px' },
      {
        name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(JobStatus, false, false, false, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '120px'
      },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
        permanent: (this.authenticationService.checkPermission(Permission.EDIT_JOB) || this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL)) ? true : false,
        hidden: (this.authenticationService.checkPermission(Permission.EDIT_JOB) || this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL)) ? false : true,
        width: '75px'
      },
      // {
      //   name: '', type: DataTypes.CUSTOM, columnMap: 'view',
      //   permanent: this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL) ? true : false,
      //   hidden: this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL) ? false : true,
      //   width: '50px'
      // },
    );
    return columns;
  }

  getJobs(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: JobQueries.LIST_JOBS,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }

}
