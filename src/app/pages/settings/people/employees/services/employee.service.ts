import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  /**
   * @author Aman Purohit
   * @description Sets the columns and their associated properties to
   * render the table.
   *
   * @returns {ColumnItem[]}
   * @memberof EmployeeService
   */
  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'fullName', width: '250px', showSort: true, permanent: true, },
      { name: 'Office Phone', type: DataTypes.PHONE, columnMap: 'officePhone', width: '200px', permanent: true, },
      { name: 'Email', type: DataTypes.TEXT, columnMap: 'email', width: '200px', permanent: true, },
      {
        name: 'Business Unit', type: DataTypes.NESTED, columnMap: 'businessUnit', columnMap2: 'name', width: '200px'
        , showSort: false, permanent: true,
      },
      { name: 'Role', type: DataTypes.RANDOM, columnMap: 'roles', width: '200px', permanent: true},
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true),
        showFilter: true, width: '50px', filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true,
      },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_EMPLOYEE) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_EMPLOYEE) ? false : true,
        width: '50px'
      },
    );

    return columns;
  }

  toggleEmployeeStatus(employeeIds: string[], _action: string): any {
    return this.apolloService.mutate({
      mutation: gql`
      mutation ChangeUserStatus($changeUserStatusDto: UserActivateDeactivateDto!) {
        changeUserStatus(changeUserStatusDto: $changeUserStatusDto)
      }
      `,
      variables: {
        changeUserStatusDto: {
          userIds: employeeIds,
          action: _action
        }
      },
      fetchPolicy: 'no-cache'
    });
  }

  getEmployees(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], roles?: Role[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
        query ($orgId: String!, $offset: Int, $take: Int, $sort: [SortInput!], $query: String, $filter: [FilterInput!], $roles: [String!]) {
          listUsers(orgId: $orgId, offset: $offset, take: $take, sort: $sort, query: $query, filter: $filter, roles: $roles) {
            total
            data {
              id
              firstName
              lastName
              fullName
              homePhone
              officePhone
              email
              roles
              status
              organization {
                id
                name
              }
              businessUnit {
                id
                name
              }
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData.page - 1) * paginationData.size,
        take: paginationData.size,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // sort: (sortData.sortOrder ? sortData.sortOrder : 'desc'),
        // sortBy: (sortData.sortOrder ? sortData.sortColumn : 'createdAt'),
        query: globalFilterData.q,
        filter: filterData,
        roles,
        orgId,
      }
    });
  }

}
