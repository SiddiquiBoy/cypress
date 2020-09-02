import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import gql from 'graphql-tag';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { Address } from 'src/app/modals/address/address';

@Injectable({
  providedIn: 'root'
})
export class AddProjectService {

  constructor(
    private apolloService: Apollo
  ) { }

  isJobTabValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedCustomerAddresses$: BehaviorSubject<Address[]> = new BehaviorSubject<Address[]>([]);

  getCustomers(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listCustomers($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
        listCustomers(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          total
          data {
            id
            fullName
            imageUrl
            status
            email
            jobNotification
            roles
            homePhone
            officePhone
            addresses {
              id
              street
              city
              state
              country
            }
          }
        }
      }
      `,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // sort: sortData.sortOrder,
        // sortBy: sortData.sortColumn,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getJobTypes(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
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
        // sort: sortData.sortOrder,
        // sortBy: sortData.sortColumn,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only'
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
        // sort: sortData.sortOrder,
        // sortBy: sortData.sortColumn,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]){
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
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // sort: sortData.sortOrder,
        // sortBy: sortData.sortColumn,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only',
    });
  }

  getTechnicians(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: gql`
        query ($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!], $roles: [String!]) {
          listUsers(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter, roles: $roles) {
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
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // sort: sortData.sortOrder,
        // sortBy: sortData.sortColumn,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        roles: [Role.TECHNICIAN],
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null,
        orgId
      }
    });
  }

  getServices(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: gql`
        query ($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
          listServices(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
            total
            data {
              id
              name
              code
              itemDescription
              price
              videoLink
              categories {
                id
                name
              }
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // sort: sortData.sortOrder,
        // sortBy: sortData.sortColumn,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      }
    });
  }

}
