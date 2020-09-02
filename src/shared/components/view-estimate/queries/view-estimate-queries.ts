import gql from 'graphql-tag';

export class ViewEstimateQueries {
    static readonly QUERY_GET_ESTIMATE = gql`
        query($id: String!) {
            getEstimate (id: $id) {
                id,
                followUpOn,
                code,
                name,
                subTotal,
                tax,
                total,
                services {
                    id,
                    name,
                    code
                }
                businessUnit {
                    id,
                    name,
                    officialName
                },
                jobType {
                    id,
                    name
                },
                status,
                technicians {
                    id,
                    fullName
                },
                jobs {
                    id,
                    code,
                    startDate,
                    startTime,
                    jobType {
                        id,
                        name
                    },
                    businessUnit {
                        id,
                        name
                    },
                    tags {
                        id,
                        name
                    },
                    summary,
                    project {
                        id,
                        name,
                        customer {
                            id,
                            fullName
                        }
                    },
                    status
                }
            }
        }
    `;
}
