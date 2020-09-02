import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from 'src/app/modals/user/user';
import { Change } from 'src/app/modals/change/change';
import { Utils } from 'src/shared/utilities/utils';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    private apolloService: Apollo,
  ) { }

  getUser(): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
        {
          me {
            id
            username
            firstName
            lastName
            officePhone
            roles
            homePhone
            email
            status
            imageUrl
          }
        }
      `,
      fetchPolicy: 'no-cache'
    });
  }

  updateUser(user: User, changes: Change[]) {
    return this.apolloService.mutate<any>({
      mutation: gql`
        mutation UpdateUser($updateUserDto: UserUpdateDto!) {
          updateUser(updateUserDto: $updateUserDto) {
            id
          }
        }
      `,
      variables: {
        updateUserDto: this.createUpdateUserDtoFromUserAndChanges(user, changes),
      }
    });
  }

  createUpdateUserDtoFromUserAndChanges(user: User, changes: Change[]) {
    const updateUserDto: any = {};
    changes.forEach((change) => {
      updateUserDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'officePhone': {
          updateUserDto['officePhone'] = Utils.phoneRemoveSpecialChars(change.newValue);
          break;
        }
        case 'homePhone': {
          updateUserDto['homePhone'] = Utils.phoneRemoveSpecialChars(change.newValue);
          break;
        }
        case 'email': {
          updateUserDto['email'] = change.newValue.toLowerCase();
          break;
        }
      }
    });
    updateUserDto.id = user.id;
    return updateUserDto;
  }

}
