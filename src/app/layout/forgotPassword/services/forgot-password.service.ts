import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(
    private apolloService: Apollo
  ) { }

  forgotPassword(email: string) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation ForgotPassword($forgotPasswordDto: ForgotPasswordPayload!) {
        forgotPassword(forgotPasswordDto: $forgotPasswordDto)
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        forgotPasswordDto: {
          email
        }
      }
    });
  }
}
