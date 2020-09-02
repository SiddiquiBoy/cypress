import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { ChangePasswordMutations } from '../../mutations/change-password-mutations';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(
    private apolloService: Apollo,
  ) { }

  changePassword(oldPassword: string, newPassword: string) {
    return this.apolloService.mutate({
      mutation: ChangePasswordMutations.CHANGE_PASSWORD,
      fetchPolicy: 'no-cache',
      variables: {
        changePasswordDto: {
          oldPassword,
          newPassword
        }
      }
    });
  }

}
