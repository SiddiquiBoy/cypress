import gql from 'graphql-tag';

export class AddCompanyQueries {

  static readonly GET_ORGANIZATION = gql`
  query($id: String!){
    getOrganization(id: $id) {
      id
      name
      addresses {
        id
        country
        city
        state
        street
        postalCode
      }
      contact
      email
      status
      imageUrl
      employees {
        id
        firstName
        lastName
        email
        roles
        officePhone
        status
        homePhone
      }
    }
  }
`;

static readonly GET_ORGANIZATION_WITH_EMPLOYEES_BY_ROLES = gql`
query($id: String!, $roles: [String!]){
  getOrganizationWithEmployeesByRoles(id: $id, roles: $roles) {
    id
    name
    addresses {
      id
      country
      city
      state
      street
      postalCode
    }
    contact
    email
    status
    imageUrl
    employees {
      id
      firstName
      lastName
      email
      roles
      officePhone
      status
      homePhone
    }
  }
}
`;

  static readonly LIST_ADMINS = gql`
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
      }
    }
  }
  `;

}
