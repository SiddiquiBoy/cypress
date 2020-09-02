import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import gql from 'graphql-tag';
import { BehaviorSubject } from 'rxjs';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { SortData } from 'src/app/modals/sorting/sort-data';

@Injectable({
  providedIn: 'root'
})
export class AddCustomerService {

  constructor(
    private apolloService: Apollo
  ) { }

  isCustomerImageUploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAddressTabValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isProjectTabValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isJobTabValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
        listBusinessUnits(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          data {
            id
            name
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

  getProjects(orgId: string, paginationData?: PaginationData) {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $offset: Int, $take: Int) {
        listProjects(orgId: $orgId, offset: $offset, take: $take) {
          data {
            id
            name
            code
            jobs {
              id
              jobType
            }
            customer {
              id
              fullName
            }
            status
          }
        }
      }
      `,
      variables: {
        orgId,
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getJobs(orgId: string, paginationData?: PaginationData) {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $offset: Int, $take: Int) {
        listJobs(orgId: $orgId, offset: $offset, take: $take) {
          data {
            id
            jobType
            priority
            startDate
            startTime
            status
          }
        }
      }
      `,
      variables: {
        orgId,
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null
      },
      fetchPolicy: 'network-only'
    });
  }

}


