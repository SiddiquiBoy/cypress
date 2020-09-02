import gql from 'graphql-tag';

export class AddJobQueries {

  static readonly LIST_CUSTOMERS = gql`
  query listCustomers($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
    listCustomers(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
      total
      data {
        id
        fullName
        addresses {
          id
          street
          city
          state
          postalCode
          country
        }
      }
    }
  }
  `;

  static readonly LIST_JOB_TYPES = gql`
  query listJobTypes($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
    listJobTypes(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
      total
      data {
        id
        name
      }
    }
  }
  `;

  static readonly LIST_TAGS = gql`
  query listTags($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
    listTags(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
      total
      data {
        id
        name
        code
      }
    }
  }
  `;

  static readonly LIST_BUSINESS_UNITS = gql`
  query($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]){
    listBusinessUnits(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter){
      data {
        id
        name
       }
      total
    }
  }
  `;

  static readonly LIST_USERS = gql`
  query ($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!], $roles: [String!]) {
    listUsers(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter, roles: $roles) {
      total
      data {
        id
        firstName
        lastName
        fullName
      }
    }
  }
`;

  static readonly LIST_PROJECTS = gql`
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
  `;


  // jobTechnicians{
  //   id
  //   user {
  //     fullName
  //     imageUrl
  //     officePhone
  //     email
  //   }
  // }
  static readonly GET_JOB = gql`
  query( $id: String!){
    getJob(id: $id){
      id
      summary
      startDate
      startTime
      rescheduleDate
      rescheduleTime
      wasJobInProgress
      leadSource
      remark
      businessUnit{
        id
        name
        officialName
      }
      jobType{
        id
        name
      }
      technicians {
        id
        firstName
        lastName
        fullName
      }
      tags{
        id
        name
        color
      }
      project{
        id
        name
        customer{
          id
          fullName
          homePhone
          email
        }
      }
      billingAddresses{
          id
          street
          city
          country
          postalCode
          state
      }
      serviceAddresses{
          id
          street
          city
          country
          postalCode
          state
      }
      jobNotes{
        id
        note
        pinnedAt
        updatedAt
      }
      status
      completedDate
      services {
        id
        name
      }
    }
  }
  `;

  static readonly LIST_SERVICES = gql`
  query ($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
    listServices(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
      total
      data {
        id
        name
      }
    }
  }
  `;

}
