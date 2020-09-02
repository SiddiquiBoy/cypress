import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Address } from 'src/app/modals/address/address';
import gql from 'graphql-tag';
import { Change } from 'src/app/modals/change/change';

@Injectable({
  providedIn: 'root'
})
export class AddAddressService {

  constructor(
    private apolloService: Apollo
  ) { }

  createAddress(customerId: string, address: Address) {
    const { street, state, city, country, postalCode, latitude, longitude, landmark } = address;
    return this.apolloService.mutate({
      mutation: gql`
      mutation CreateAddress($createAddress: CreateAddressDto!) {
        createAddress(createAddress: $createAddress) {
          id
        }
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        createAddress: {
          customerId,
          street,
          state,
          city,
          country,
          postalCode,
          latitude,
          longitude,
          landmark
        }
      }
    });
  }

  updateAddress(address: Address, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation UpdateAddress($updateAddress: UpdateAddressDto!) {
        updateAddress(updateAddress: $updateAddress) {
          id
        }
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        updateAddress: this.createUpdateEmployeeDtoFromEmployeeAndChanges(address, changes)
      }
    });
  }

  createUpdateEmployeeDtoFromEmployeeAndChanges(employee: Address, changes: Change[]) {
    const updateAddress: any = {};
    changes.forEach((change) => {
      updateAddress[change.fieldName] = change.newValue;
    });
    updateAddress.id = employee.id;
    return updateAddress;
  }
}
