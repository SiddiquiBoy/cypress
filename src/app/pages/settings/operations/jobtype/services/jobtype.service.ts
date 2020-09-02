import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobType } from 'src/app/modals/job-type/job-type';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { Priority } from 'src/app/modals/enums/priority/priority.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Change } from 'src/app/modals/change/change';

const JOBTYPEDATA = 'assets/jsons/job-type.json';

@Injectable({
  providedIn: 'root'
})
export class JobtypeService {

  constructor(
    private http: HttpClient,
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getColumnItems(): ColumnItem[] {

    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'name', showSort: true, width: '200px', permanent: true, },
      // { name: 'Priority', type: DataTypes.CUSTOM, columnMap: 'priority', showSort: true },
      {
        name: 'Priority', type: DataTypes.CUSTOM, columnMap: 'priority', listOfFilters: Utils.createDropdownForNewEnum(Priority, false, false, false, true), showFilter: true,
        filter: { field: 'priority', value: '', op: FilterOp.in }, width: '100px', permanent: true,
      },
      { name: 'Tags', type: DataTypes.CUSTOM, columnMap: 'tags', width: '200px', permanent: true, },
      // { name: 'Summary', type: DataTypes.CUSTOM, columnMap: 'summary', width: '250px' },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, width: '100px', permanent: true,
      },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_JOB_TYPE) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_JOB_TYPE) ? false : true,
        width: '50px'
      },
    );
    return columns;
  }

  getJobTypes(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    // return this.http.get<JobType[]>(JOBTYPEDATA);
    return this.apolloService.watchQuery({
      query: gql`
      query listJobTypes($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
        listJobTypes(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          total
          data {
            id
            name
            priority
            tags {
              id
              name
              color
              code
              importance
              status
            }
            summary
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

  checkIfJobTypeNameExist(organizationId: string, name: string){
    return this.apolloService.mutate({
      mutation: gql`
      mutation CheckIfJobTypeNameAlreadyTaken($organizationId: String!, $name: String!) {
        checkIfJobTypeNameAlreadyTaken(organizationId: $organizationId, name: $name)
      }
    `,
      fetchPolicy: 'no-cache',
      variables: {
        organizationId,
        name
      }
    });
  }

  getTags(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listTags($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
        listTags(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          total
          data {
            id
            name
            code
            color
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
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only'
    });
  }

  changeJobTypesStatus(jobTypeIds: string[], action: string) {
    const changeJobTypeStatusDto = { jobTypeIds, action };
    return this.apolloService.mutate({
      mutation: gql`
        mutation changeJobTypeStatus($changeJobTypeStatusDto: JobTypeStatusDto!) {
          changeJobTypeStatus(changeJobTypeStatusDto: $changeJobTypeStatusDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        changeJobTypeStatusDto
      }
    });
  }

  getJobType(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query getJobType($id: String!) {
        getJobType(id: $id) {
          id
          name
          priority
          tags {
            id
            name
            color
            code
            importance
            status
          }
          summary
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

  // createJobType(jobType: JobType) {
  //   return this.apolloService.mutate({
  //     mutation: gql`
  //     mutation createJobType($createJobTypeDto: JobTypeInputDto!) {
  //       createJobType(createJobTypeDto: $createJobTypeDto)
  //       }
  //       `,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       createJobTypeDto: {
  //         name: jobType.name,
  //         priority: jobType.priority,
  //         tags: jobType.tags.map(tag => tag.id),
  //         summary: jobType.summary
  //       }
  //     }
  //   });
  // }

  createJobType(jobType: JobType) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation createJobType($createJobTypeDto: JobTypeInputDto!) {
        createJobType(createJobTypeDto: $createJobTypeDto) {
          id
        }
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        createJobTypeDto: {
          name: jobType.name,
          priority: jobType.priority,
          tags: jobType.tags.map(tag => tag.id),
          summary: jobType.summary
        }
      }
    });
  }

  // updateJobType(jobType: JobType) {
  //   return this.apolloService.mutate({
  //     mutation: gql`
  //     mutation updateJobType($updateJobTypeDto: JobTypeUpdateDto!) {
  //       updateJobType(updateJobTypeDto: $updateJobTypeDto)
  //     }
  //       `,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       updateJobTypeDto: {
  //         id: jobType.id,
  //         name: jobType.name,
  //         priority: jobType.priority,
  //         tags: jobType.tags.map(tag => tag.id),
  //         summary: jobType.summary,
  //         status: jobType.status
  //       }
  //     }
  //   });
  // }

  updateJobType(jobType: JobType, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation updateJobType($updateJobTypeDto: JobTypeUpdateDto!) {
        updateJobType(updateJobTypeDto: $updateJobTypeDto) {
          id
        }
      }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        updateJobTypeDto: this.createUpdateJobTypeDtoFromJobTypeAndChanges(jobType, changes)
      }
    });
  }

  createUpdateJobTypeDtoFromJobTypeAndChanges(jobType: JobType, changes: Change[]) {
    const updateJobTypeDto: any = {};
    changes.forEach((change) => {
      updateJobTypeDto[change.fieldName] = change.newValue;
      if (change.fieldName === 'tags') {
        updateJobTypeDto[change.fieldName] = change.newValue.map(item => item.id);
      } else {
        // do nothing
      }
    });
    updateJobTypeDto.id = jobType.id;
    return updateJobTypeDto;
  }

}
