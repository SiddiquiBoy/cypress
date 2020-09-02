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
import { Project } from 'src/app/modals/project/project';
import { Job } from 'src/app/modals/job/job';
import { DateUtil } from 'src/shared/utilities/date-util';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Change } from 'src/app/modals/change/change';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getProjects(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listProjects($orgId: String!, $sort: [SortInput!], $offset: Int!, $take:Int!, $query: String, $filter: [FilterInput!]) {
        listProjects(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          total
          data {
            id
            name
            code
            status
            jobs {
              id
              jobType {
                id
                name
              }
            }
            customer {
              id
              fullName
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
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getProject(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query getProject($id: String!) {
        getProject(id: $id) {
          id
          name
          code
          status
          jobs {
            id
            summary
            startDate
            startTime
            leadSource
            status
            jobType {
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
            businessUnit {
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
            technicians {
              id
              firstName
              lastName
              fullName
              homePhone
              officePhone
              email
              roles
              status
            }
            tags {
              id
              name
              code
              color
              importance
              status
            }
            billingAddresses {
              id
              street
              state
              city
              country
            }
            serviceAddresses {
              id
              street
              state
              city
              country
            }
            services {
              id
              name
            }
            project {
              id
              name
              code
            }
          }
          customer {
            id
            fullName
            imageUrl
            status
            email
            jobNotification
            roles
            homePhone
            officePhone
          }
        }
      }
      `,
      variables: {
        id
      },
      fetchPolicy: 'no-cache'
    });
  }

  createProject(project: Project) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation createProject($createProjectDto: CreateProjectDto!) {
        createProject(createProjectDto: $createProjectDto) {
          id
        }
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        createProjectDto: {
          name: project.name,
          createJobDto: this.createJobDtoFromJobs(project.jobs),
          customer_id: project.customer.id,
        }
      }
    });
  }

  createJobDtoFromJobs(jobs: Job[]) {
    const createJobDto: any = [];
    jobs.forEach((job) => {
      let jobDto: any = {};
      jobDto = {
        summary: job.summary,
        startDate: job.startDate,
        startTime: DateUtil.getFormattedTimeFromDate(job.startTime, true, false, false),
        leadSource: job.leadSource,
        businessUnitId: job.businessUnit && job.businessUnit.id ? job.businessUnit.id : null,
        technicianIds: job.technicians.map(tech => tech.id),
        serviceIds: job.services.map(service => service.id),
        // addressIds: job.addresses.map(add => add.id),
        billingAddressIds: job.billingAddresses.map(add => add.id),
        serviceAddressIds: job.serviceAddresses.map(add => add.id),
        tagIds: job.tags.map(tag => tag.id),
        jobTypeId: job.jobType && job.jobType.id ? job.jobType.id : null
      };
      createJobDto.push(jobDto);
    });
    return createJobDto;
  }

  updateJobDtoFromJobs(jobs: Job[]) {
    const createJobDto: any = [];
    jobs.forEach((job) => {
      let jobDto: any = {};
      jobDto = {
        id: job.id,
        summary: job.summary,
        startDate: job.startDate,
        startTime: DateUtil.getFormattedTimeFromDate(job.startTime, true, false, false),
        leadSource: job.leadSource,
        businessUnitId: job.businessUnit && job.businessUnit.id ? job.businessUnit.id : null,
        technicianIds: job.technicians.map(tech => tech.id),
        // addressIds: job.addresses.map(add => add.id),
        billingAddressIds: job.billingAddresses.map(add => add.id),
        serviceAddressIds: job.serviceAddresses.map(add => add.id),
        serviceIds: job.services.map(service => service.id),
        tagIds: job.tags.map(tag => tag.id),
        jobTypeId: job.jobType && job.jobType.id ? job.jobType.id : null
      };
      createJobDto.push(jobDto);
    });
    return createJobDto;
  }

  // updateProject(project: Project) {
  //   return this.apolloService.mutate({
  //     mutation: gql`
  //     mutation updateProject($updateProjectDto: UpdateProjectDto!) {
  //       updateProject(updateProjectDto: $updateProjectDto) {
  //         id
  //       }
  //     }
  //       `,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       updateProjectDto: {
  //         id: project.id,
  //         name: project.name,
  //         code: project.code,
  //         updateProjectJobDto: this.updateJobDtoFromJobs(project.jobs),
  //         customer_id: project.customer.id,
  //         status: project.status
  //       }
  //     }
  //   });
  // }

  updateProject(project: Project, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation updateProject($updateProjectDto: UpdateProjectDto!) {
        updateProject(updateProjectDto: $updateProjectDto) {
          id
        }
      }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        updateProjectDto: this.createUpdateProjectDtoFromProjectAndChanges(project, changes)
      }
    });
  }

  createUpdateProjectDtoFromProjectAndChanges(project: Project, changes: Change[]) {
    const updateProjectDto: any = {};
    const projectRelatedChanges = changes.filter(change => !change.fieldName.includes('jobs/'));
    const jobRelatedChanges = changes.filter(change => change.fieldName.includes('jobs/'));
    projectRelatedChanges.forEach((change) => {
      updateProjectDto[change.fieldName] = change.newValue;
    });
    updateProjectDto.updateProjectJobDto = this.createProjectJobDtoFromProjectJobsAndChanges(project.jobs, jobRelatedChanges);
    updateProjectDto.id = project.id;
    return updateProjectDto;
  }

  createProjectJobDtoFromProjectJobsAndChanges(jobs: Job[], changes: Change[]) {
    const indexToChanges: Map<number, Change[]> = this.createIndexToChangesMapFromChanges(changes);
    const createProjectJobDto: any = [];
    jobs.forEach((job, index) => {
      const projectJobDto: any = {};
      if (indexToChanges.has(index)) {
        const value = indexToChanges.get(index);
        value.forEach((val) => {
          const splittedFields = val.fieldName.split('.');
          if (splittedFields && splittedFields.length > 0) {
            const field = splittedFields[splittedFields.length - 1];
            if (field !== null && field !== undefined) {
              this.createProjectJobDtoObject(projectJobDto, field, val);
            } else {
              // do nothing
            }
          } else {
            // do nothing
          }
        });
      } else {
        // do nothing
      }
      projectJobDto.id = job.id;
      createProjectJobDto.push(projectJobDto);
    });
    return createProjectJobDto;
  }

  createProjectJobDtoObject(projectJobDto: any, field: string, val: Change) {
    projectJobDto[field] = val.newValue;
    switch (field) {
      case 'businessUnit': {
        projectJobDto['businessUnitId'] = val.newValue.id;
        delete projectJobDto[field];
        break;
      }
      case 'jobType': {
        projectJobDto['jobTypeId'] = val.newValue.id;
        delete projectJobDto[field];
        break;
      }
      case 'startTime': {
        projectJobDto['startTime'] = DateUtil.getFormattedTime(val.newValue, true, false, false);
        break;
      }
      case 'tags': {
        projectJobDto['tagIds'] = val.newValue.map(item => item.id);
        delete projectJobDto[field];
        break;
      }
      case 'technicians': {
        projectJobDto['technicianIds'] = val.newValue.map(item => item.id);
        delete projectJobDto[field];
        break;
      }
      case 'billingAddresses': {
        projectJobDto['billingAddressIds'] = val.newValue.map(item => item.id);
        delete projectJobDto[field];
        break;
      }
      case 'serviceAddresses': {
        projectJobDto['serviceAddressIds'] = val.newValue.map(item => item.id);
        delete projectJobDto[field];
        break;
      }
      case 'services': {
        projectJobDto['serviceIds'] = val.newValue.map(item => item.id);
        delete projectJobDto[field];
        break;
      }
    }
  }

  createIndexToChangesMapFromChanges(changes: Change[]) {
    return Utils.createIndexToChangesMapFromChanges(changes);
  }

  changeProjectStatus(projectIds: string[], action: string) {
    const changeProjectStatusDto = { projectIds, action };
    return this.apolloService.mutate({
      mutation: gql`
        mutation changeProjectStatus($changeProjectStatusDto: ProjectActivateDeactivateDto!) {
          changeProjectStatus(changeProjectStatusDto: $changeProjectStatusDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        changeProjectStatusDto
      }
    });
  }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'name', showSort: true, permanent: true },
      { name: 'Code', type: DataTypes.CUSTOM, columnMap: 'code', showSort: true, permanent: true },
      { name: 'Jobs', type: DataTypes.CUSTOM, columnMap: 'jobs', permanent: true },
      { name: 'Customer', type: DataTypes.CUSTOM, columnMap: 'customer', permanent: true },
      // {
      //   name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdown(ActiveInactiveStatus, false, false, true), showFilter: true,
      //   filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true
      // },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true
      },
      // {
      //   name: '', type: DataTypes.CUSTOM, columnMap: 'action',
      //   permanent: (this.authenticationService.checkPermission(Permission.EDIT_PROJECT) || (this.authenticationService.checkPermission(Permission.VIEW_PROJECT_DETAIL))) ? true : false,
      //   hidden: (this.authenticationService.checkPermission(Permission.EDIT_PROJECT) || (this.authenticationService.checkPermission(Permission.VIEW_PROJECT_DETAIL))) ? false : true,
      //   width: '75px'
      // },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_PROJECT) || (this.authenticationService.checkPermission(Permission.VIEW_PROJECT_DETAIL)) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_PROJECT) || (this.authenticationService.checkPermission(Permission.VIEW_PROJECT_DETAIL)) ? true : false,
        width: '50px'
      },
    );
    return columns;
  }

}
