import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { Utils } from 'src/shared/utilities/utils';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Project } from 'src/app/modals/project/project';
import { Change } from 'src/app/modals/change/change';
import { Customer } from 'src/app/modals/customer/customer';

const GET_CUSTOMER = gql`
query getCustomer($id: String!) {
  getCustomer(id: $id) {
    id
    firstName
    lastName
    homePhone
    officePhone
    email
    status
    businessUnit {
      id
      name
    }
    fullName
    imageUrl
    jobNotification
    projects {
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
    }
    addresses {
      id
      street
      city
      state
      country
      postalCode
      latitude
      longitude
      type
      landmark
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class ViewCustomerService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService,
  ) { }

  isSpinning$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getAddressesColumnItems(): ColumnItem[] {
    const columnItem: ColumnItem[] = [];
    columnItem.push(
      { name: 'Street', type: DataTypes.CUSTOM, columnMap: 'street', permanent: true, width: '150px', showSort: true, },
      { name: 'State', type: DataTypes.CUSTOM, columnMap: 'state', permanent: true, width: '150px', showSort: true, },
      { name: 'City', type: DataTypes.CUSTOM, columnMap: 'city', permanent: true, width: '150px', showSort: true, },
      // { name: 'Country', type: DataTypes.CUSTOM, columnMap: 'country', permanent: true, width: '150px' },
      { name: 'Postal Code', type: DataTypes.TEXT, columnMap: 'postalCode', permanent: true, width: '150px' },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_CUSTOMER) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_CUSTOMER) ? true : false,
        width: '50px'
      },
    );
    return columnItem;
  }

  getProjectsColumnItems(): ColumnItem[] {
    const columnItem: ColumnItem[] = [];
    columnItem.push(

      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'name', showSort: true, permanent: true, width: '150px' },
      { name: 'Code', type: DataTypes.CUSTOM, columnMap: 'code', showSort: true, permanent: true, width: '150px' },
      { name: 'Jobs', type: DataTypes.CUSTOM, columnMap: 'jobs', permanent: true, width: '150px' },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '150px'
      },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_PROJECT) || (this.authenticationService.checkPermission(Permission.VIEW_PROJECT_DETAIL)) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_PROJECT) || (this.authenticationService.checkPermission(Permission.VIEW_PROJECT_DETAIL)) ? true : false,
        width: '50px'
      },
    );
    return columnItem;
  }

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

  getCustomer(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: GET_CUSTOMER,
      variables: {
        id
      },
      fetchPolicy: 'no-cache'
    });
  }

  listJobs(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], customerId?: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listJobs($orgId: String!, $query: String, $sort: [SortInput!], $offset: Int, $take:Int, $filter: [FilterInput!], $customerId: String) {
        listJobs(orgId: $orgId, query: $query, sort:$sort, offset:$offset, take:$take, filter: $filter, customerId: $customerId) {
          total
          data {
            id
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
        customerId,
      },
      fetchPolicy: 'network-only'
    });
  }

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
    projectRelatedChanges.forEach((change) => {
      updateProjectDto[change.fieldName] = change.newValue;
    });
    updateProjectDto.id = project.id;
    return updateProjectDto;
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
          code: project.code,
          customer_id: project.customer.id,
        }
      }
    });
  }

  deleteAddress(id: string) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation DeleteAddress($id: String!) {
        deleteAddress(id: $id)
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        id
      }
    });
  }

  getBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]) {
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
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }

  updateCustomer(customer: Customer, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation updateCustomer($updateCustomerDto: UpdateCustomerDto!) {
        updateCustomer(updateCustomerDto: $updateCustomerDto) {
          id
        }
      }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        updateCustomerDto: this.createUpdateCustomerDtoFromCustomerAndChanges(customer, changes)
      }
    });
  }

  createUpdateCustomerDtoFromCustomerAndChanges(customer: Customer, changes: Change[]) {
    const updateCustomerDto: any = {};
    const customerRelatedChanges = changes.filter(change => (!change.fieldName.includes('addresses/') && !change.fieldName.includes('projects/')));
    customerRelatedChanges.forEach((change) => {
      updateCustomerDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'businessUnit.id': {
          updateCustomerDto['businessUnitId'] = change.newValue;
          delete updateCustomerDto[change.fieldName];
          break;
        }
      }
    });
    updateCustomerDto.id = customer.id;
    return updateCustomerDto;
  }
}
