import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/modals/category/category';
import { Observable, of } from 'rxjs';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getCategories(orgId: string, paginationData: PaginationData, q, sortData: SortData[], filterData?: FilterData[]): QueryRef<any>{
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int!, $take:Int!, $query: String, $filter: [FilterInput!]){
        listCategories(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter){
          total
          data{
            id
            name
            code
            status
            services {
              id
              name
              code
              status
            }
            businessUnit {
              id
              name
              officialName
              email
              phone
              status
            }
            imageUrl
          }
        }
      }`,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        orgId,
        query: q || '',
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only',
    });
  }

  changeCategoryStatus(categoryIds: string[], action: string){
    const changeCategoryStatusDto = { categoryIds, action };
    return this.apolloService.mutate({
      mutation: gql`
        mutation changeCategoryStatus($changeCategoryStatusDto: StatusUpdateCategoryDto! ) {
          changeCategoryStatus(changeCategoryStatusDto: $changeCategoryStatusDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        changeCategoryStatusDto
      }
    });
  }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      // { name: 'Image', type: DataTypes.CUSTOM, columnMap: 'imageUrl', permanent: true, },
      { name: 'Name', type: DataTypes.TEXT, columnMap: 'name', permanent: true, showSort: true, width: '150px' },
      { name: 'Code', type: DataTypes.CUSTOM, columnMap: 'code', permanent: true, showSort: true, width: '150px' },
      { name: 'Services', type: DataTypes.CUSTOM, columnMap: 'services', permanent: true, width: '400px'},
      { name: 'Business Unit', type: DataTypes.CUSTOM, columnMap: 'businessUnit', showSort: true, permanent: true, width: '200px' },
      // {
      //   name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdown(ActiveInactiveStatus, false, false, true), showFilter: true,
      //   filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '150px'
      // },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true
        // Utils.getEnumKey(FilterOp, 'in')
      },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_CATEGORY) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_CATEGORY) ? false : true,
        width: '50px'
      },
    );
    return columns;
  }
}
