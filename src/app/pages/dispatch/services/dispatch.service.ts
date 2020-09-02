import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Utils } from 'src/shared/utilities/utils';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { BehaviorSubject } from 'rxjs';
import { DispatchBoardEvent } from 'src/app/modals/dispatch-board-event/dispatch-board-event';
import { DateUtil } from 'src/shared/utilities/date-util';
import { Change } from 'src/app/modals/change/change';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService,
  ) { }

  isSpinning$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedstartDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  getJobsColumnItems(): ColumnItem[] {
    const columnItem: ColumnItem[] = [];
    columnItem.push(
      { name: 'Job Type', type: DataTypes.CUSTOM, columnMap: 'jobType.name', showSort: true, permanent: true, width: '120px' },
      { name: 'Start Date', type: DataTypes.CUSTOM, columnMap: 'startDate', showSort: true, permanent: true, width: '120px' },
      { name: 'Start Time', type: DataTypes.CUSTOM, columnMap: 'startTime', showSort: true, permanent: true, width: '120px' },
      { name: 'Tags', type: DataTypes.CUSTOM, columnMap: 'tags.name', showSort: true, permanent: true, width: '200px' },
      // { name: 'Summary', type: DataTypes.CUSTOM, columnMap: 'summary', showSort: true, permanent: true, width: '200px' },
      { name: 'Project', type: DataTypes.CUSTOM, columnMap: 'project.name', permanent: true, showSort: true, width: '120px' },
      // { name: 'Customer', type: DataTypes.CUSTOM, columnMap: 'customer.fullName', permanent: true, showSort: true, width: '120px' },
      {
        name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(JobStatus, false, false, false, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '120px'
      },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
        permanent: (this.authenticationService.checkPermission(Permission.EDIT_JOB) || this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL)) ? true : false,
        hidden: (this.authenticationService.checkPermission(Permission.EDIT_JOB) || this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL)) ? false : true,
        width: '75px'
      },
    );
    return columnItem;
  }

  getBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int, $take: Int, $query: String, $filter: [FilterInput!]) {
        listBusinessUnits(orgId: $orgId, sort: $sort, offset: $offset, take: $take, query: $query, filter: $filter) {
          data {
            id
            name
          }
        }
      }
      `,
      variables: {
        orgId,
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getTechnicians(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
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
              imageUrl
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        roles: [Role.TECHNICIAN],
        orgId
      }
    });
  }

  listJob(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listJobs($orgId: String!, $query: String, $sort: [SortInput!], $offset: Int, $take:Int, $filter: [FilterInput!]) {
        listJobs(orgId: $orgId, query: $query, sort:$sort, offset:$offset, take:$take, filter: $filter) {
          total
          data {
            id
            code
            jobType {
              id
              name
            }
            businessUnit {
              id
              name
            }
            startDate
            startTime
            leadSource
            summary
            technicians {
              id
              fullName
            }
            tags {
              id
              name
            }
            status
            billingAddresses {
              id
              street
            }
            serviceAddresses {
              id
              street
              state
              city
              country
              postalCode
            }
            project {
              id
              name
              customer {
                id
                fullName
              }
            }
          }
        }
      }
      `,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        filter: filterData ? filterData : null,
      },
      fetchPolicy: 'network-only'
    });
  }

  listTimesheetCodes(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
        query($orgId: String!, $offset: Int, $take: Int, $sort: [SortInput!], $query: String, $filter: [FilterInput!]) {
          listTimesheetCodes(orgId: $orgId, offset: $offset, take: $take, sort: $sort, query: $query, filter: $filter) {
            total
            data {
              id
              code
              description
              type
              businessUnit {
                id
                name
              }
              status
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        filter: filterData ? filterData : null,
      }
    });
  }

  createDispatchBoardEvent(dispatchBoardEvent: DispatchBoardEvent) {
    return this.apolloService.mutate<any>({
      mutation: gql`
      mutation CreateDispatchBoardEvent($createDispatchBoardEvent: CreateDispatchBoardEventDto!) {
        createDispatchBoardEvent(createDispatchBoardEvent: $createDispatchBoardEvent) {
          id
          name
          startDate
          startTime
          endDate
          endTime
          technician {
              id
              fullName
          }
          timesheetCode {
              id
              code
              description
          }
          job {
              id
              code
              summary
              status
          }
        }
      }
      `,
      variables: {
        createDispatchBoardEvent: {
          name: dispatchBoardEvent.name,
          timesheetCodeId: dispatchBoardEvent.timesheetCode.id,
          technicianId: dispatchBoardEvent.technician.id,
          jobId: dispatchBoardEvent.job ? dispatchBoardEvent.job.id : null,
          startDate: dispatchBoardEvent.startDate,
          endDate: dispatchBoardEvent.endDate,
          startTime: DateUtil.getFormattedTimeFromDate(dispatchBoardEvent.startTime, true, false, false),
          endTime: DateUtil.getFormattedTimeFromDate(dispatchBoardEvent.endTime, true, false, false),
        }
      }
    });
  }

  updateDispatchBoardEvent(dispatchBoardEvent: DispatchBoardEvent, changes: Change[]) {
    return this.apolloService.mutate<any>({
      mutation: gql`
        mutation UpdateDispatchBoardEvent($updateDispatchBoardEvent: UpdateDispatchBoardEventDto!) {
          updateDispatchBoardEvent(updateDispatchBoardEvent: $updateDispatchBoardEvent) {
              id
              name
              startDate
              startTime
              endDate
              endTime
              technician {
                  id
                  fullName
              }
              timesheetCode {
                  id
                  code
                  description
              }
              job {
                  id
                  code
                  summary
                  status
              }
          }
        }
      `,
      variables: {
        updateDispatchBoardEvent: this.createUpdateDispatchBoardEventDtoFromChanges(dispatchBoardEvent, changes)
      }
    });
  }

  createUpdateDispatchBoardEventDtoFromChanges(dispatchBoardEvent: DispatchBoardEvent, changes: Change[]) {
    const updateDispatchBoardDto: any = {};
    changes.forEach((change) => {
      updateDispatchBoardDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'timesheetCode': {
          updateDispatchBoardDto['timesheetCodeId'] = change.newValue.id;
          delete updateDispatchBoardDto[change.fieldName];
          break;
        }
        case 'startTime': {
          updateDispatchBoardDto['startTime'] = DateUtil.getFormattedTime(change.newValue, true, false, false);
          break;
        }
        case 'endTime': {
          updateDispatchBoardDto['endTime'] = DateUtil.getFormattedTime(change.newValue, true, false, false);
          break;
        }
      }
    });
    updateDispatchBoardDto.id = dispatchBoardEvent.id;
    return updateDispatchBoardDto;
  }

  listDispatchBoardEvents(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
        query($orgId: String!, $offset: Int, $take: Int, $sort: [SortInput!], $query: String, $filter: [FilterInput!]) {
          listDispatchBoardEvents(orgId: $orgId, offset: $offset, take: $take, sort: $sort, query: $query, filter: $filter) {
            total
            data {
              id
              name
              startDate
              startTime
              endDate
              endTime
              technician {
                  id
                  fullName
              }
              timesheetCode {
                  id
                  code
                  description
              }
              job {
                  id
                  code
                  summary
                  status
              }
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        filter: filterData ? filterData : null,
      }
    });
  }
}
