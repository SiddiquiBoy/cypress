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
import { DateUtil } from 'src/shared/utilities/date-util';
import { Job } from 'src/app/modals/job/job';
import { Change } from 'src/app/modals/change/change';
import { AddJobQueries } from '../queries/add-job-queries';
import { AddJobMutations } from '../mutations/add-job-mutations';

@Injectable({
  providedIn: 'root'
})
export class AddJobService {

  constructor(
    private apolloService: Apollo
  ) { }

  getCustomers(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: AddJobQueries.LIST_CUSTOMERS,
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

  getJobTypes(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: AddJobQueries.LIST_JOB_TYPES,
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

  getTags(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: AddJobQueries.LIST_TAGS,
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

  getBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: AddJobQueries.LIST_BUSINESS_UNITS,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
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
      query: AddJobQueries.LIST_USERS,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        roles: [Role.TECHNICIAN],
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null,
        orgId,
      }
    });
  }

  getProjects(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: AddJobQueries.LIST_PROJECTS,
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

  getJob(id: string) {
    return this.apolloService.watchQuery({
      query: AddJobQueries.GET_JOB,
      fetchPolicy: 'no-cache',
      variables: {
        id
      }
    });
  }

  createJob(job: Job) {
    return this.apolloService.mutate<any>({
      mutation: AddJobMutations.CREATE_JOB,
      variables: {
        createJobDto: {
          summary: job.summary,
          // businessUnitId: job.businessUnitId,
          businessUnitId: (job.businessUnit && job.businessUnit.id) ? job.businessUnit.id : null,
          jobTypeId: (job.jobType && job.jobType.id) ? job.jobType.id : null,
          leadSource: job.leadSource,
          startTime: DateUtil.getFormattedTimeFromDate(job.startTime, true, false, false),
          startDate: job.startDate,
          status: job.status,
          tagIds: job.tags.map(tag => tag.id),
          technicianIds: job.technicians.map(tech => tech.id),
          billingAddressIds: job.billingAddresses.map(add => add.id),
          serviceAddressIds: job.serviceAddresses.map(add => add.id),
          projectId: (job.project && job.project.id) ? job.project.id : null,
          serviceIds: job.services.map(service => service.id),
        }
      }
    });

  }

  // updateJob(job: Job) {
  //   return this.apolloService.mutate<any>({
  //     mutation: gql`
  //     mutation updateJob($updateJobDto: UpdateJobDto!){
  //       updateJob(updateJobDto: $updateJobDto)
  //    }`,
  //     variables: {
  //       updateJobDto: {
  //         id: job.id,
  //         summary: job.summary,
  //         // businessUnitId: job.businessUnitId,
  //         businessUnitId: (job.businessUnit && job.businessUnit.id) ? job.businessUnit.id : null,
  //         jobTypeId: (job.jobType && job.jobType.id) ? job.jobType.id : null,
  //         leadSource: job.leadSource,
  //         startTime: DateUtil.getFormattedTimeFromDate(job.startTime, true, false, false),
  //         startDate: job.startDate,
  //         status: job.status,
  //         tagIds: job.tags.map(tag => tag.id),
  //         technicianIds: job.technicians.map(tech => tech.id),
  //         billingAddressIds: job.billingAddresses.map(add => add.id),
  //         serviceAddressIds: job.serviceAddresses.map(add => add.id),
  //         projectId: (job.project && job.project.id) ? job.project.id : null
  //       }
  //     }
  //   });
  // }

  updateJob(job: Job, changes: Change[]) {
    return this.apolloService.mutate<any>({
      mutation: AddJobMutations.UPDATE_JOB,
      variables: {
        updateJobDto: this.createUpdateJobDtoFromJobAndChanges(job, changes)
      }
    });
  }

  createUpdateJobDtoFromJobAndChanges(job: Job, changes: Change[]) {
    const updateJobDto: any = {};
    changes.forEach((change) => {
      updateJobDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'businessUnit': {
          updateJobDto['businessUnitId'] = change.newValue.id;
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'jobType': {
          updateJobDto['jobTypeId'] = change.newValue.id;
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'startTime': {
          updateJobDto['startTime'] = DateUtil.getFormattedTime(change.newValue, true, false, false);
          break;
        }
        case 'tags': {
          updateJobDto['tagIds'] = change.newValue.map(item => item.id);
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'technicians': {
          updateJobDto['technicianIds'] = change.newValue.map(item => item.id);
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'billingAddresses': {
          updateJobDto['billingAddressIds'] = change.newValue.map(item => item.id);
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'serviceAddresses': {
          updateJobDto['serviceAddressIds'] = change.newValue.map(item => item.id);
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'services': {
          updateJobDto['serviceIds'] = change.newValue.map(item => item.id);
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'project': {
          updateJobDto['projectId'] = change.newValue.id;
          delete updateJobDto[change.fieldName];
          break;
        }
        case 'services': {
          updateJobDto['serviceIds'] = change.newValue.map(item => item.id);
          delete updateJobDto[change.fieldName];
          break;
        }
      }
    });
    updateJobDto.id = job.id;
    return updateJobDto;
  }

  getServices(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: AddJobQueries.LIST_SERVICES,
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
