import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { JobNote } from 'src/app/modals/job-note/job-note';

const GET = gql`
  query($id: String!) {
    getJob(id: $id) {
      id,
      summary,
      startDate,
      startTime,
      rescheduleDate,
      rescheduleTime,
      wasJobInProgress,
      leadSource,
      remark,
      businessUnit {
        id,
        name
        officialName
      },
      jobType {
        id,
        name
      },
      technicians {
        id,
        fullName,
        imageUrl,
        officePhone,
        email
      },
      tags {
        id,
        name,
        color
      },
      project {
        id,
        name,
        customer {
          id,
          fullName,
          homePhone,
          email
        }
      },
      billingAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      serviceAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      jobNotes {
        id,
        note,
        pinnedAt,
        updatedAt
      },
      status,
      completedDate,
      services {
        id,
        name
      }
    }
  }
`;

const ASSIGN_TECHNICIANS = gql`
  mutation AssignTechnicians($assignTechniciansDto: AssignTechniciansDto!) {
    assignTechnicians(assignTechniciansDto: $assignTechniciansDto) {
      id,
      summary,
      startDate,
      startTime,
      rescheduleDate,
      rescheduleTime,
      wasJobInProgress,
      leadSource,
      remark,
      businessUnit {
        id,
        name
        officialName
      },
      jobType {
        id,
        name
      },
      technicians {
        id,
        fullName,
        imageUrl,
        officePhone,
        email
      },
      tags {
        id,
        name,
        color
      },
      project {
        id,
        name,
        customer {
          id,
          fullName,
          homePhone,
          email
        }
      },
      billingAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      serviceAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      jobNotes {
        id,
        note,
        pinnedAt,
        updatedAt
      },
      status,
      completedDate,
      services {
        id,
        name
      }
    }
  }
`;

const CHANGE_STATUS = gql`
  mutation ChangeJobStatus($jobStatusDto: JobStatusDto!) {
    changeJobStatus(jobStatusDto: $jobStatusDto) {
      id,
      summary,
      startDate,
      startTime,
      rescheduleDate,
      rescheduleTime,
      wasJobInProgress,
      leadSource,
      remark,
      businessUnit {
        id,
        name
        officialName
      },
      jobType {
        id,
        name
      },
      technicians {
        id,
        fullName,
        imageUrl,
        officePhone,
        email
      },
      tags {
        id,
        name,
        color
      },
      project {
        id,
        name,
        customer {
          id,
          fullName,
          homePhone,
          email
        }
      },
      billingAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      serviceAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      jobNotes {
        id,
        note,
        pinnedAt,
        updatedAt
      },
      status,
      completedDate,
      services {
        id,
        name
      }
    }
  }
`;

const GET_TECHNICIANS = gql`
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
`;

const ADD_NOTE = gql`
  mutation CreateJobNote($createJobNote: CreateJobNoteDto!) {
    createJobNote(createJobNote: $createJobNote) {
      id,
      summary,
      startDate,
      startTime,
      rescheduleDate,
      rescheduleTime,
      wasJobInProgress,
      leadSource,
      remark,
      businessUnit {
        id,
        name
        officialName
      },
      jobType {
        id,
        name
      },
      technicians {
        id,
        fullName,
        imageUrl,
        officePhone,
        email
      },
      tags {
        id,
        name,
        color
      },
      project {
        id,
        name,
        customer {
          id,
          fullName,
          homePhone,
          email
        }
      },
      billingAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      serviceAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      jobNotes {
        id,
        note,
        pinnedAt,
        updatedAt
      },
      status,
      completedDate,
      services {
        id,
        name
      }
    }
  }
`;

const UPDATE_NOTE = gql`
  mutation UpdateJobNote($updateJobNote: UpdateJobNoteDto!) {
    updateJobNote(updateJobNote: $updateJobNote) {
      id,
      summary,
      startDate,
      startTime,
      rescheduleDate,
      rescheduleTime,
      wasJobInProgress,
      leadSource,
      remark,
      businessUnit {
        id,
        name
        officialName
      },
      jobType {
        id,
        name
      },
      technicians {
        id,
        fullName,
        imageUrl,
        officePhone,
        email
      },
      tags {
        id,
        name,
        color
      },
      project {
        id,
        name,
        customer {
          id,
          fullName,
          homePhone,
          email
        }
      },
      billingAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      serviceAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      jobNotes {
        id,
        note,
        pinnedAt,
        updatedAt
      },
      status,
      completedDate,
      services {
        id,
        name
      }
    }
  }
`;

const TOGGLE_PIN_JOB_NOTE = gql`
  mutation PinJobNote($id: String!) {
    pinJobNote(id: $id) {
      id,
      summary,
      startDate,
      startTime,
      rescheduleDate,
      rescheduleTime,
      wasJobInProgress,
      leadSource,
      remark,
      businessUnit {
        id,
        name
        officialName
      },
      jobType {
        id,
        name
      },
      technicians {
        id,
        fullName,
        imageUrl,
        officePhone,
        email
      },
      tags {
        id,
        name,
        color
      },
      project {
        id,
        name,
        customer {
          id,
          fullName,
          homePhone,
          email
        }
      },
      billingAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      serviceAddresses {
        id,
        street,
        city,
        country,
        postalCode,
        state
      },
      jobNotes {
        id,
        note,
        pinnedAt,
        updatedAt
      },
      status,
      completedDate,
      services {
        id,
        name
      }
    }
  }
`;

const SEND_SURVEY_LINK = gql`
  mutation SendSurvey($jobId: String!, $link: String!) {
    sendSurvey(jobId: $jobId, link: $link)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ViewJobService {

  constructor(
    private apolloService: Apollo
  ) { }

  getJob(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: GET,
      fetchPolicy: 'no-cache',
      variables: {
        id
      }
    });
  }

  getTechnicians(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: GET_TECHNICIANS,
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

  editTechnicians(id: string, technicianIds: string[]) {
    return this.apolloService.mutate({
      mutation: ASSIGN_TECHNICIANS,
      fetchPolicy: 'no-cache',
      variables: {
        assignTechniciansDto: {
          id,
          technicianIds
        }
      }
    });
  }

  updateJobStatus(id: string, status: JobStatus, startDate?: Date, startTime?: string, completedDate?: Date, rescheduleDate?: Date, rescheduleTime?: string, remark?: string) {
    return this.apolloService.mutate({
      mutation: CHANGE_STATUS,
      fetchPolicy: 'no-cache',
      variables: {
        jobStatusDto: {
          id,
          status,
          startDate,
          startTime,
          rescheduleDate,
          rescheduleTime,
          completedDate,
          remark
        }
      }
    });
  }

  createJobNote(jobId: string, note: JobNote) {
    return this.apolloService.mutate({
      mutation: ADD_NOTE,
      fetchPolicy: 'no-cache',
      variables: {
        createJobNote: {
          jobId,
          note: note.note,
          pinnedAt: note.pinnedAt
        }
      }
    });
  }

  updateJobNote(jobId: string, note: JobNote) {
    return this.apolloService.mutate({
      mutation: UPDATE_NOTE,
      fetchPolicy: 'no-cache',
      variables: {
        updateJobNote: {
          id: note.id,
          jobId,
          note: note.note,
          pinnedAt: note.pinnedAt
        }
      }
    });
  }

  togglePinJobNote(id: string) {
    return this.apolloService.mutate({
      mutation: TOGGLE_PIN_JOB_NOTE,
      fetchPolicy: 'no-cache',
      variables: {
        id
      }
    });
  }

  sendSurveyLink(jobId: string, link: string) {
    return this.apolloService.mutate({
      mutation: SEND_SURVEY_LINK,
      fetchPolicy: 'no-cache',
      variables: {
        jobId,
        link
      }
    });
  }
}
