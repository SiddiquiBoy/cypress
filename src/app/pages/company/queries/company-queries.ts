import gql from 'graphql-tag';

export class CompanyQueries {

  // static readonly QUERY_LIST_ORGANIZATIONS = gql`
  // query($sort: [SortInput!], $query: String, $offset: Int, $take: Int){
  //   listOrganizations(sort: $sort, query: $query, offset: $offset, take: $take) {
  //     total
  //     data {
  //       id
  //       name
  //       address
  //       country
  //       city
  //       state
  //       pincode
  //       contact
  //       email
  //     }
  //   }
  // }
  // `;

  static readonly QUERY_LIST_ORGANIZATIONS = gql`
  query($sort: [SortInput!], $query: String, $offset: Int, $take: Int){
    listOrganizations(sort: $sort, query: $query, offset: $offset, take: $take) {
      total
      data {
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
        employees {
          id
          firstName
          lastName
          email
        }
        contact
        email
      }
    }
  }
  `;

}
