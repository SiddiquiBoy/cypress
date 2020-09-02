import gql from 'graphql-tag';

export class DemoQueries {

  static readonly LIST_DEMOS = gql`
  query($offset: Int, $take: Int, $sort: [SortInput!], $query: String) {
    listDemos(offset: $offset, take: $take, sort: $sort, query: $query) {
      total
      data {
        id
        organizationName
        contactPersonName
        contactPersonEmail
        contactPersonContact
      }
    }
  }
  `;

}
