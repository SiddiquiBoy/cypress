import { Apollo, QueryRef } from 'apollo-angular';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Utils } from 'src/shared/utilities/utils';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { Project } from 'src/app/modals/project/project';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Change } from 'src/app/modals/change/change';

@Injectable({
  providedIn: 'root'
})
export class ViewProjectService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

getProject(id: string): QueryRef<any> {
  return this.apolloService.watchQuery({
    query: gql`
    query getProject($id: String!) {
      getProject(id: $id) {
        id
        name
        code
        createdAt
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

// updateProject(project: Project) {
//   return this.apolloService.mutate({
//     mutation: gql`
//     mutation updateProject($updateProjectDto: UpdateProjectDto!) {
//       updateProject(updateProjectDto: $updateProjectDto)
//     }
//       `,
//     fetchPolicy: 'no-cache',
//     variables: {
//       updateProjectDto: {
//         id: project.id,
//         name: project.name,
//         code: project.code,
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
  projectRelatedChanges.forEach((change) => {
    updateProjectDto[change.fieldName] = change.newValue;
  });
  updateProjectDto.id = project.id;
  return updateProjectDto;
}

getCustomers(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
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
      orgId,
      query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
      filter: filterData ? filterData : null
    },
    fetchPolicy: 'network-only'
  });
}

getColumnItems(): ColumnItem[] {
  const columns: ColumnItem[] = [];
  columns.push(
    { name: 'Job Type', type: DataTypes.CUSTOM, columnMap: 'jobType.name', permanent: true, width: '120px' },
    { name: 'Start Date', type: DataTypes.CUSTOM, columnMap: 'startDate',  permanent: true, showSort: true, width: '120px' },
    { name: 'Start Time', type: DataTypes.CUSTOM, columnMap: 'startTime',  permanent: true, width: '120px' },
    { name: 'Tags', type: DataTypes.CUSTOM, columnMap: 'tags.name',  permanent: true, width: '200px' },
    { name: 'Summary', type: DataTypes.CUSTOM, columnMap: 'summary',  permanent: true, showSort: true, width: '200px' },
    { name: 'Technician', type: DataTypes.CUSTOM, columnMap: 'project.technicians', permanent: true,  width: '200px' },
    {
      name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(JobStatus, false, false, true, true), showFilter: true,
      filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '150px'
    },
    {
      name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
      permanent: (this.authenticationService.checkPermission(Permission.EDIT_JOB) || this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL)) ? true : false,
      hidden: (this.authenticationService.checkPermission(Permission.EDIT_JOB) || this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL)) ? false : true,
      width: '75px'
    }
  );
  return columns;
}

}
