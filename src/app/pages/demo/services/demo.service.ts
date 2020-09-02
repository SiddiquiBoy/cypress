import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { DemoQueries } from '../queries/demo-queries';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor(
    private apolloService: Apollo,
  ) { }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Company Name', type: DataTypes.CUSTOM, columnMap: 'organizationName', width: '250px', showSort: true, permanent: true, },
      { name: 'Contact Person', type: DataTypes.CUSTOM, columnMap: 'contactPersonName', width: '200px', permanent: true, },
      { name: 'Phone Number', type: DataTypes.PHONE, columnMap: 'contactPersonContact', width: '200px', permanent: true, },
      { name: 'Email', type: DataTypes.CUSTOM, columnMap: 'contactPersonEmail', width: '100px', permanent: true, },
    );
    return columns;
  }

  getDemos(paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: DemoQueries.LIST_DEMOS,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
      },
      fetchPolicy: 'network-only'
    });
  }

}
