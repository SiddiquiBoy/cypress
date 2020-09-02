import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(
    private apolloService: Apollo
  ) { }

  checkToken(token: string) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation CheckForgotPasswordToken($checkForgotPasswordDto: CheckForgotPasswordPayload!) {
        checkForgotPasswordToken(checkForgotPasswordDto: $checkForgotPasswordDto)
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        checkForgotPasswordDto: {
          token
        }
      }
    });
  }

  resetPassword(token: string, password: string) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation ResetPassword($resetPasswordDto: ResetPasswordPayload!) {
        resetPassword(resetPasswordDto: $resetPasswordDto)
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        resetPasswordDto: {
          token,
          password
        }
      }
    });
  }
}
