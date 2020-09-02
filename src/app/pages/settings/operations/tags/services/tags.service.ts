import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from 'src/app/modals/tag/tag';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable, FetchResult } from 'apollo-link';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { of } from 'rxjs';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Importance } from 'src/app/modals/enums/importance/importance.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Change } from 'src/app/modals/change/change';

const TAGSDATA = 'assets/jsons/tags.json';
@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(
    private http: HttpClient,
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  // getTags() {
  //   return this.http.get<Tag[]>(TAGSDATA);
  // }

  /**
   * @description to get the tags
   * @author Pulkit Bansal
   * @date 2020-06-09
   * @param {string} orgId
   * @param {PaginationData} [paginationData]
   * @param {SortData} [sortData]
   * @param {GlobalFilterData} [globalFilterData]
   * @returns {QueryRef<any>}
   * @memberof TagsService
   */
  getTags(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listTags($orgId: String!, $sort: [SortInput!], $offset: Int!, $take:Int!, $query: String, $filter: [FilterInput!]) {
        listTags(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          total
          data {
            id
            name
            code
            color
            importance
            status
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

  changeTagsStatus(tagIds: string[], action: string) {
    const changeTagStatusDto = { tagIds, action };
    return this.apolloService.mutate({
      mutation: gql`
        mutation changeTagStatus($changeTagStatusDto: TagStatusDto!) {
          changeTagStatus(changeTagStatusDto: $changeTagStatusDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        changeTagStatusDto
      }
    });
  }

  getTag(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query getTag($id: String!) {
        getTag(id: $id) {
          id
          name
          color
          code
          importance
          status
        }
      }
      `,
      variables: {
        id
      },
      fetchPolicy: 'no-cache'
    });
  }

  createTag(tag: Tag) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation createTag($createTagDto: TagInputDto!) {
        createTag(createTagDto: $createTagDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        createTagDto: {
          name: tag.name,
          color: tag.color,
          importance: tag.importance
        }
      }
    });
  }

  // updateTag(tag: Tag) {
  //   return this.apolloService.mutate({
  //     mutation: gql`
  //     mutation updateTag($updateTagDto: TagUpdateDto!) {
  //       updateTag(updateTagDto: $updateTagDto)
  //     }
  //       `,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       updateTagDto: {
  //         id: tag.id,
  //         name: tag.name,
  //         color: tag.color,
  //         code: tag.code,
  //         importance: tag.importance,
  //         status: tag.status
  //       }
  //     }
  //   });
  // }

  updateTag(tag: Tag, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation updateTag($updateTagDto: TagUpdateDto!) {
        updateTag(updateTagDto: $updateTagDto)
      }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        // updateTagDto: {
        //   id: tag.id,
        //   name: tag.name,
        //   color: tag.color,
        //   code: tag.code,
        //   importance: tag.importance,
        //   status: tag.status
        // }
        updateTagDto: this.createUpdateTagDtoFromTagAndChanges(tag, changes)
      }
    });
  }

  createUpdateTagDtoFromTagAndChanges(tag: Tag, changes: Change[]) {
    const updateTagDto: any = {};
    changes.forEach((change) => {
      updateTagDto[change.fieldName] = change.newValue;
    });
    updateTagDto.id = tag.id;
    return updateTagDto;
  }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Color', type: DataTypes.COLOR, columnMap: 'color', permanent: true },
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'name', showSort: true, permanent: true },
      { name: 'Code', type: DataTypes.CUSTOM, columnMap: 'code', default: true },
      // {
      //   name: 'Importance', type: DataTypes.CUSTOM, columnMap: 'importance', default: true,
      //   listOfFilters: Utils.showDropdownPropAsTitleCase(Utils.createDropdown(Importance, false, false, true), 'text'), showFilter: true,
      //   filter: { field: 'importance', value: '', op: FilterOp.in }
      // },
      {
        name: 'Importance', type: DataTypes.CUSTOM, columnMap: 'importance', default: true,
        listOfFilters: Utils.createDropdownForNewEnum(Importance, false, false, false, true), showFilter: true,
        filter: { field: 'importance', value: '', op: FilterOp.in }
      },
      // {
      //   name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdown(ActiveInactiveStatus, false, false, true), showFilter: true,
      //   filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true
      //   // Utils.getEnumKey(FilterOp, 'in')
      // },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true
        // Utils.getEnumKey(FilterOp, 'in')
      },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_TAG) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_TAG) ? false : true,
        width: '50px'
      },
    );

    return columns;
  }
}
