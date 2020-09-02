import { Injectable } from '@angular/core';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Apollo } from 'apollo-angular';
import { CompanyQueries } from 'src/app/pages/company/queries/company-queries';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getCompanies(sortData?: SortData[], globalFilterData?: GlobalFilterData, paginationData?: PaginationData, filterData?: FilterData[]) {
    return this.apolloService.watchQuery({
      query: CompanyQueries.QUERY_LIST_ORGANIZATIONS,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'name', width: '250px', showSort: true, permanent: true, },
      { name: 'Contact', type: DataTypes.PHONE, columnMap: 'contact', width: '200px', permanent: true, },
      { name: 'Street', type: DataTypes.CUSTOM, columnMap: 'addresses[0].street', width: '300px', permanent: true, },
      { name: 'City', type: DataTypes.CUSTOM, columnMap: 'addresses[0].city', width: '100px', permanent: true, },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_COMPANY) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_COMPANY) ? false : true,
        width: '50px'
      },
    );
    return columns;
  }

}
