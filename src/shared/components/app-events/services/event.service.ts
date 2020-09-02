import { Injectable } from '@angular/core';
import { QueryRef, Apollo } from 'apollo-angular';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import gql from 'graphql-tag';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Utils } from 'src/shared/utilities/utils';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'User', type: DataTypes.CUSTOM, columnMap: 'userName', showSort: true, permanent: true },
      { name: 'Role', type: DataTypes.CUSTOM, columnMap: 'roles', showSort: true, permanent: true },
      { name: 'Action', type: DataTypes.CUSTOM, columnMap: 'op', showSort: true, permanent: true },
      { name: 'Date', type: DataTypes.CUSTOM, columnMap: 'updatedAt', showSort: true, permanent: true }
    );
    return columns;
  }

  getLogs(segment: string, owningEntityId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
        query getLogs($segment: String, $owningEntityId: String!, $offset: Int, $take:Int) {
          getLogs(segment: $segment, owningEntityId: $owningEntityId, offset:$offset, take:$take) {
            interactedWith
            interactedWithId
            owningEntityType
            segment
            owningEntityId
            organizationId
            modifiedResourceName
            modifiedResourceId
            diff
            ownerEntityType
            ownerEntityId
            userId
            userName
            op
            metadata
            roles
          }
        }
      `,
      variables: {
        segment,
        owningEntityId,
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        // sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        // filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }
}
