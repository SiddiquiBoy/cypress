import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Utils } from 'src/shared/utilities/utils';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { EstimateQueries } from '../queries/estimate-queries';
import { EstimateStatus } from 'src/app/modals/enums/estimate-status/estimate-status.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class EstimatesService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService,
  ) { }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Code', type: DataTypes.CUSTOM, columnMap: 'name', permanent: true, width: '200px', showSort: true, },
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'code', permanent: true, width: '200px', showSort: true, },
      { name: 'Job Type', type: DataTypes.CUSTOM, columnMap: 'jobType.name', permanent: true, width: '200px', showSort: true, },
      { name: 'Services', type: DataTypes.CUSTOM, columnMap: 'services', permanent: true, width: '200px' },
      { name: 'Technicians', type: DataTypes.CUSTOM, columnMap: 'technicians', permanent: true, width: '200px' },
      { name: 'Sub Total', type: DataTypes.CUSTOM, columnMap: 'subTotal', permanent: true, width: '200px', showSort: true },
      { name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status',
        listOfFilters: Utils.createDropdownForNewEnum(EstimateStatus, false, false, true, true),
        showFilter: true, filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '150px' },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
        permanent: this.authenticationService.checkPermission(Permission.ADD_ESTIMATE) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.ADD_ESTIMATE) ? false : true,
        width: '75px'
      },
    );
    return columns;
  }

  listEstimates(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: EstimateQueries.QUERY_LIST_ESTIMATES,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData.page - 1) * paginationData.size,
        take: paginationData.size,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: globalFilterData.q,
        filter: filterData,
        orgId,
      }
    });
  }
}
