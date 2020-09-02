import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';

import { Apollo, QueryRef } from 'apollo-angular';
import { Observable, FetchResult } from 'apollo-link';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';

const BUSINESSUNITDATA = 'assets/jsons/businessunit.json';

@Injectable({
  providedIn: 'root'
})

export class BusinessunitService {

  constructor(
    private http: HttpClient,
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  // getBusinessUnit() {
  //   return this.http.get<BusinessUnit[]>(BUSINESSUNITDATA)
  // }

  getColumnItems(): ColumnItem[] {

    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Internal Name', type: DataTypes.CUSTOM, columnMap: 'name', showSort: true, permanent: true, },
      { name: 'Official Name', type: DataTypes.CUSTOM, columnMap: 'officialName', showSort: true, permanent: true, },
      // { name: 'Date', type: DataTypes.CUSTOM, columnMap: 'minPostDate' },
      { name: 'Email', type: DataTypes.CUSTOM, columnMap: 'email', permanent: true, },
      { name: 'Address', type: DataTypes.CUSTOM, columnMap: 'street', permanent: true, },
      // { name: 'Country', type: DataTypes.TEXT , columnMap: 'country'},
      { name: 'State', type: DataTypes.TEXT, columnMap: 'state', permanent: true, },
      // { name: 'City', type: DataTypes.CUSTOM , columnMap: 'city'},
      // { name: 'Zip Code', type: DataTypes.TEXT , columnMap: 'zipCode'},
      // {
      //   name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdown(ActiveInactiveStatus, false, false, true), showFilter: true,
      //   filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true,
      // },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, width: '100px', permanent: true,
      },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_BUSINESS_UNITS) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_BUSINESS_UNITS) ? false : true,
        width: '50px'
      },
    );
    // debugger
    return columns;
  }

  /**
   * @description Chagne status
   * @author Rajeev Kumar
   * @date 2020-06-11
   * @param {string[]} businessUnitIds
   * @param {string} action
   * @returns
   * @memberof BusinessunitService
   */
  changeBUStatus(businessUnitIds: string[], action: string) {
    const changeBusinessUnitStatusDto = { businessUnitIds, action };
    return this.apolloService.mutate({
      mutation: gql`
        mutation changeBusinessUnitStatus($changeBusinessUnitStatusDto: BusinessUnitStatusUpdateDto!) {
          changeBusinessUnitStatus(changeBusinessUnitStatusDto: $changeBusinessUnitStatusDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        changeBusinessUnitStatusDto
      }
    });
  }

  getBusinessUnit(paginationData: PaginationData, token, q, sortData: SortData[], filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int!, $take:Int!, $query: String, $filter: [FilterInput!]){
        listBusinessUnits(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter){
          data {
            id
            name
            officialName
            email
            phone
            minPostDate
            street
            country
            status
            state
            city
            zipCode
            tags{
              id
            }
           }
          total
        }
      }
      `,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        orgId: token.organization.id,
        query: q || '',
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only',
    });
  }

}
