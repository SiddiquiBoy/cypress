import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Company } from 'src/app/modals/company/company';
import { Change } from 'src/app/modals/change/change';
import { Utils } from 'src/shared/utilities/utils';
import { Address } from 'src/app/modals/address/address';

@Injectable({
  providedIn: 'root'
})
export class CompanyProfileService {

  constructor(
    private apolloService: Apollo
  ) { }

  updateCompanyProfile(company: Company, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation UpdateOrganization($updateOrganizationDto: OrganizationUpdateDto!) {
        updateOrganization(updateOrganizationDto: $updateOrganizationDto) {
          id
        }
      }
      `,
      variables: {
        updateOrganizationDto: this.createUpdateOrganizationDtoFromOrganizationAndChanges(company, changes),
      },
      fetchPolicy: 'no-cache'
    });
  }

  createUpdateOrganizationDtoFromOrganizationAndChanges(organization: Company, changes: Change[]) {
    const updateOrganizationDto: any = {};
    const companyRelatedChanges = changes.filter(change => !change.fieldName.includes('addresses/'));
    const addressRelatedChanges = changes.filter(change => change.fieldName.includes('addresses/'));
    companyRelatedChanges.forEach((change) => {
      this.createUpdateCompanyDtoObject(updateOrganizationDto, change);
    });
    updateOrganizationDto.updateAddressDto = this.createCompanyAddressDtoFromCompanyAddressesAndChanges(organization.addresses, addressRelatedChanges);
    updateOrganizationDto.id = organization.id;
    return updateOrganizationDto;
  }

  createUpdateCompanyDtoObject(updateCompanyDto: any, change: Change) {
    switch (change.fieldName) {
      case 'contact': {
        updateCompanyDto[change.fieldName] = Utils.phoneRemoveSpecialChars(change.newValue);
        break;
      }
      default: {
        updateCompanyDto[change.fieldName] = change.newValue;
      }
    }
  }

  createCompanyAddressDtoFromCompanyAddressesAndChanges(addresses: Address[], changes: Change[]) {
    const indexToChanges: Map<number, Change[]> = this.createIndexToChangesMapFromChanges(changes);
    const createCompanyAddressDto: any = [];
    addresses.forEach((address, index) => {
      const companyAddressDto: any = {};
      if (indexToChanges.has(index)) {
        const value = indexToChanges.get(index);
        value.forEach((val) => {
          const splittedFields = val.fieldName.split('.');
          if (splittedFields && splittedFields.length > 0) {
            const field = splittedFields[splittedFields.length - 1];
            if (field !== null && field !== undefined) {
              this.createCompanyAddressDtoObject(companyAddressDto, field, val);
            } else {
              // do nothing
            }
          } else {
            // do nothing
          }
        });
      } else {
        // do nothing
      }
      companyAddressDto.id = address.id;
      createCompanyAddressDto.push(companyAddressDto);
    });
    return createCompanyAddressDto;
  }

  createIndexToChangesMapFromChanges(changes: Change[]) {
    return Utils.createIndexToChangesMapFromChanges(changes);
  }

  createCompanyAddressDtoObject(companyAddressDto: any, field: string, val: Change) {
    companyAddressDto[field] = val.newValue;
  }
}
