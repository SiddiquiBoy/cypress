import gql from 'graphql-tag';

export class AddJobMutations {

  static readonly CREATE_JOB = gql`
  mutation createJob($createJobDto: CreateJobDto!){
    createJob(createJobDto: $createJobDto) {
      id
    }
  }`;

  static readonly UPDATE_JOB = gql`
  mutation updateJob($updateJobDto: UpdateJobDto!){
    updateJob(updateJobDto: $updateJobDto) {
      id
    }
  }`;

}
