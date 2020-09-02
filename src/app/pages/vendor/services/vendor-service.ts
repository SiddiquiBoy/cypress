import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import gql from 'graphql-tag';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { DateUtil } from 'src/shared/utilities/date-util';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Change } from 'src/app/modals/change/change';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'vendorName', showSort: true, permanent: true },
      { name: 'Phone', type: DataTypes.PHONE, columnMap: 'phone', permanent: true },
      { name: 'Fax', type: DataTypes.PHONE, columnMap: 'fax', permanent: true },
      { name: 'Tags', type: DataTypes.PHONE, columnMap: 'tags', showSort: true, permanent: true },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, width: '100px', permanent: true,
      },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_VENDOR) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_VENDOR) ? true : false,
        width: '50px'
      }
    );
    return columns;
  }

  changeVendorStatus(vendorIds: string[], status: string) {
    const vendorStatusDto = { vendorIds, status };
    return this.apolloService.mutate({
      mutation: gql`
        mutation changeVendorStatus($vendorStatusDto: VendorStatusDto!) {
          changeVendorStatus(vendorStatusDto: $vendorStatusDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        vendorStatusDto
      }
    });
  }

  listOfVendors(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listVendors($orgId: String!, $sort: [SortInput!], $offset: Int!, $take:Int!, $query: String, $filter: [FilterInput!]) {
        listVendors(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          total
          data {
            id
            vendorName
            firstName
            lastName
            fullName
            email
            fax
            phone
            memo
            street
            city
            country
            postalCode
            status
            state
            tags{
              id
              name
            }
          }
        }
      }
      `,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }
}
