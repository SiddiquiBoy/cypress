import gql from 'graphql-tag';

export class EstimateQueries {
    static readonly QUERY_LIST_ESTIMATES = gql`
    query($orgId: String!, $offset: Int, $take: Int, $sort: [SortInput!], $query: String, $filter: [FilterInput!]) {
        listEstimates(orgId: $orgId, offset: $offset, take: $take, sort: $sort, query: $query, filter: $filter) {
            total,
            data {
                id
                name
                code
                subTotal
                services {
                    id
                    name
                }
                businessUnit {
                    id
                    name
                }
                jobType {
                    id
                    name
                }
                technicians {
                    id
                    fullName
                }
                jobs {
                    id
                }
                status
            }
        }
    }
    `;
}
