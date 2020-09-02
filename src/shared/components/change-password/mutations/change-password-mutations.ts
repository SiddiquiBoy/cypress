import gql from 'graphql-tag';

export class ChangePasswordMutations {

  static readonly CHANGE_PASSWORD = gql`
  mutation changePassword($changePasswordDto: ChangePasswordDto!) {
    changePassword(changePasswordDto: $changePasswordDto)
  }
  `;

}
