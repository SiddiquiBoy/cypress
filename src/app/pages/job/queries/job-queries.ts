import gql from 'graphql-tag';

export class JobQueries {


  // jobTechnicians {
  //   id
  //   user {
  //     id
  //     fullName
  //   }
  // }
  static readonly LIST_JOBS = gql`
query listJobs($orgId: String!, $query: String, $sort: [SortInput!], $offset: Int!, $take:Int!, $filter: [FilterInput!]) {
  listJobs(orgId: $orgId, query: $query, sort:$sort, offset:$offset, take:$take, filter: $filter) {
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
        firstName
        lastName
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
`;

}
