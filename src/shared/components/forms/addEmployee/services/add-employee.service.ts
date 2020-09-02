import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Employee } from 'src/app/modals/people/employee';
import { Change } from 'src/app/modals/change/change';
import { Utils } from 'src/shared/utilities/utils';

@Injectable({
  providedIn: 'root'
})
export class AddEmployeeService {

  constructor(
    private apolloService: Apollo
  ) { }

  getEmployeeById(id: string): any {
    return this.apolloService.watchQuery<any>({
      query: gql`
        query($id: String!) {
          getUser(id: $id){
            id
            username
            firstName
            lastName
            fullName
            roles
            homePhone
            officePhone
            email
            status
            isAccountVerified
            imageUrl
            organization {
              id
              name
            }
            businessUnit {
              id
              name
            }
          }
        }
      `,
      variables: {
        id
      },
      fetchPolicy: 'no-cache'
    });
  }

  updateEmployee(employee: Employee, changes: Change[]) {
    return this.apolloService.mutate<any>({
      mutation: gql`
        mutation UpdateUser($updateUserDto: UserUpdateDto!) {
          updateUser(updateUserDto: $updateUserDto) {
            id
          }
        }
      `,
      variables: {
        updateUserDto: this.createUpdateEmployeeDtoFromEmployeeAndChanges(employee, changes),
      }
    });
  }

  createUpdateEmployeeDtoFromEmployeeAndChanges(employee: Employee, changes: Change[]) {
    const updateUserDto: any = {};
    changes.forEach((change) => {
      updateUserDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'businessUnit': {
          updateUserDto['businessUnitId'] = change.newValue.id;
          delete updateUserDto[change.fieldName];
          break;
        }
        case 'officePhone': {
          updateUserDto['officePhone'] = Utils.phoneRemoveSpecialChars(change.newValue);
          break;
        }
        case 'homePhone': {
          updateUserDto['homePhone'] = change.newValue ? Utils.phoneRemoveSpecialChars(change.newValue) : null;
          break;
        }
        case 'email': {
          updateUserDto['email'] = change.newValue.toLowerCase();
          break;
        }
      }
    });
    updateUserDto.id = employee.id;
    return updateUserDto;
  }

  getBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int, $take: Int, $query: String, $filter: [FilterInput!]) {
        listBusinessUnits(orgId: $orgId, sort: $sort, offset: $offset, take: $take, query: $query, filter: $filter) {
          data {
            id
            name
          }
        }
      }
      `,
      variables: {
        orgId,
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only'
    });
  }

  createUser(organizationId: string, employee: Employee) {
    return this.apolloService.mutate<any>({
      mutation: gql`
      mutation CreateUser($createUserDto: RegistrationPayload!) {
        createUser(createUserDto: $createUserDto) {
          id
        }
      }
      `,
      variables: {
        createUserDto: {
          organizationId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          officePhone: employee.officePhone,
          homePhone: (employee.homePhone ? employee.homePhone : null),
          email: employee.email,
          businessUnitId: employee.businessUnit.id,
          roles: employee.roles,
          imageUrl: employee.imageUrl
        }
      }
    });
  }
}
