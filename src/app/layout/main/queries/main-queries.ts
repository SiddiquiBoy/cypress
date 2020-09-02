import gql from 'graphql-tag';

export class MainQueries {

  static readonly SEARCH_APP = gql`
  query($orgId: String!, $search: String) {
    searchApp(orgId: $orgId, search: $search) {
      customers {
        id
        firstName
        lastName
        fullName
      }
      employees {
        id
        firstName
        lastName
        fullName
      }
      technicians {
        id
        firstName
        lastName
        fullName
      }
      projects {
        id
        name
      }
      jobs {
        id
        jobTypeName
      }
    }
  }
  `;
}
