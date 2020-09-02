import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import gql from 'graphql-tag';
import { Customer } from 'src/app/modals/customer/customer';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Project } from 'src/app/modals/project/project';
import { Change } from 'src/app/modals/change/change';
import { Address } from 'src/app/modals/address/address';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }


  // getCustomers(orgId: string, paginationData?: PaginationData, sortData?: SortData, globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
  //   return this.apolloService.watchQuery({
  //     query: gql`
  //     query listCustomers($orgId: String!, $sort: String, $sortBy: String, $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
  //       listCustomers(orgId: $orgId, sort:$sort, sortBy: $sortBy offset:$offset, take:$take, query: $query, filter: $filter) {
  //         total
  //         data {
  //           id
  //           fullName
  //           imageUrl
  //           status
  //           email
  //           jobNotification
  //           roles
  //           homePhone
  //           officePhone
  //           addresses {
  //             street
  //             city
  //             state
  //             country
  //           }
  //         }
  //       }
  //     }
  //     `,
  //     variables: {
  //       offset: (paginationData.page - 1) * paginationData.size,
  //       take: paginationData.size,
  //       sort: sortData.sortOrder,
  //       sortBy: sortData.sortColumn,
  //       orgId,
  //       query: globalFilterData.q,
  //       filter: filterData
  //     },
  //     fetchPolicy: 'network-only'
  //   });
  // }

  getCustomers(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listCustomers($orgId: String!, $sort: [SortInput!], $offset: Int, $take:Int, $query: String, $filter: [FilterInput!]) {
        listCustomers(orgId: $orgId, sort:$sort, offset:$offset, take:$take, query: $query, filter: $filter) {
          total
          data {
            id
            fullName
            imageUrl
            status
            email
            jobNotification
            roles
            homePhone
            officePhone
            addresses {
              street
              city
              state
              country
            }
          }
        }
      }
      `,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // sort: sortData.sortOrder,
        // sortBy: sortData.sortColumn,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getCustomer(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query getCustomer($id: String!) {
        getCustomer(id: $id) {
          id
          firstName
          lastName
          homePhone
          officePhone
          email
          status
          businessUnit {
            id
            name
          }
          fullName
          imageUrl
          jobNotification
          projects {
            id
            name
            code
            status
          }
          addresses {
            id
            street
            city
            state
            country
            postalCode
            latitude
            longitude
            type
            landmark
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

  createCustomer(customer: Customer) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation createCustomer($createCustomerDto: CreateCustomerDto!) {
        createCustomer(createCustomerDto: $createCustomerDto) {
          id
        }
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        createCustomerDto: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          homePhone: customer.homePhone ? customer.homePhone : null,
          officePhone: customer.officePhone,
          email: customer.email,
          organization: customer.organization,
          status: customer.status,
          businessUnitId: customer.businessUnit.id,
          imageUrl: customer.imageUrl,
          jobNotification: customer.jobNotification,
          createProjectDto: customer.projects.map(({ name, status }) => ({ name, status })),
          createAddressDto: customer.addresses
        }
      }
    });
  }

  // updateCustomer(customer: Customer) {
  //   return this.apolloService.mutate({
  //     mutation: gql`
  //     mutation updateCustomer($updateCustomerDto: UpdateCustomerDto!) {
  //       updateCustomer(updateCustomerDto: $updateCustomerDto)
  //     }
  //       `,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       updateCustomerDto: {
  //         id: customer.id,
  //         email: customer.email,
  //         homePhone: customer.homePhone,
  //         officePhone: customer.officePhone,
  //         firstName: customer.firstName,
  //         lastName: customer.lastName,
  //         imageUrl: customer.imageUrl,
  //         status: customer.status,
  //         businessUnitId: customer.businessUnit.id,
  //         jobNotification: customer.jobNotification,
  //         // projectDto: customer.projects.map(({ id, name, code, status }) => ({ id, name, code, status, customer })),
  //         projectDto: this.createProjectDtoFromProjects(customer.projects, customer.id),
  //         addressDto: customer.addresses.map(
  //           ({ id, street, state, city, country, postalCode, latitude, longitude, type, landmark }) => ({ id, street, state, city, country, postalCode, latitude, longitude, type, landmark })
  //         )
  //       }
  //     }
  //   });
  // }

  updateCustomer(customer: Customer, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation updateCustomer($updateCustomerDto: UpdateCustomerDto!) {
        updateCustomer(updateCustomerDto: $updateCustomerDto) {
          id
        }
      }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        updateCustomerDto: this.createUpdateCustomerDtoFromCustomerAndChanges(customer, changes)
      }
    });
  }

  createUpdateCustomerDtoFromCustomerAndChanges(customer: Customer, changes: Change[]) {
    const updateCustomerDto: any = {};
    const customerRelatedChanges = changes.filter(change => (!change.fieldName.includes('addresses/') && !change.fieldName.includes('projects/')));
    const addressRelatedChanges = changes.filter(change => change.fieldName.includes('addresses/'));
    const projectRelatedChanges = changes.filter(change => change.fieldName.includes('projects/'));
    customerRelatedChanges.forEach((change) => {
      updateCustomerDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'businessUnit.id': {
          updateCustomerDto['businessUnitId'] = change.newValue;
          delete updateCustomerDto[change.fieldName];
          break;
        }
        case 'officePhone': {
          updateCustomerDto['officePhone'] = Utils.phoneRemoveSpecialChars(change.newValue);
          break;
        }
        case 'homePhone': {
          updateCustomerDto['homePhone'] = change.newValue ? Utils.phoneRemoveSpecialChars(change.newValue) : null;
          break;
        }
      }
    });
    updateCustomerDto.addressDto = this.createCustomerAddressDtoFromCustomerAddressesAndChanges(customer.addresses, addressRelatedChanges);
    updateCustomerDto.projectDto = this.createCustomerProjectDtoFromCustomerProjectsAndChanges(customer.projects, projectRelatedChanges);
    updateCustomerDto.id = customer.id;
    return updateCustomerDto;
  }

  createCustomerAddressDtoFromCustomerAddressesAndChanges(addresses: Address[], changes: Change[]) {
    const indexToChanges: Map<number, Change[]> = this.createIndexToChangesMapFromChanges(changes);
    const createCustomerAddressDto: any = [];
    addresses.forEach((address, index) => {
      const customerAddressDto: any = {};
      if (indexToChanges.has(index)) {
        const value = indexToChanges.get(index);
        value.forEach((val) => {
          const splittedFields = val.fieldName.split('.');
          if (splittedFields && splittedFields.length > 0) {
            const field = splittedFields[splittedFields.length - 1];
            if (field !== null && field !== undefined) {
              this.createCustomerAddressDtoObject(customerAddressDto, field, val);
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
      customerAddressDto.id = address.id;
      createCustomerAddressDto.push(customerAddressDto);
    });
    return createCustomerAddressDto;
  }

  createCustomerAddressDtoObject(customerAddressDto: any, field: string, val: Change) {
    customerAddressDto[field] = val.newValue;
  }

  createCustomerProjectDtoFromCustomerProjectsAndChanges(projects: Project[], changes: Change[]) {
    const indexToChanges: Map<number, Change[]> = this.createIndexToChangesMapFromChanges(changes);
    const createCustomerProjectDto: any = [];
    projects.forEach((project, index) => {
      const customerProjectDto: any = {};
      if (indexToChanges.has(index)) {
        const value = indexToChanges.get(index);
        value.forEach((val) => {
          const splittedFields = val.fieldName.split('.');
          if (splittedFields && splittedFields.length > 0) {
            const field = splittedFields[splittedFields.length - 1];
            if (field !== null && field !== undefined) {
              this.createCustomerProjectDtoObject(customerProjectDto, field, val);
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
      customerProjectDto.id = project.id;
      createCustomerProjectDto.push(customerProjectDto);
    });
    return createCustomerProjectDto;
  }

  createCustomerProjectDtoObject(customerProjectDto: any, field: string, val: Change) {
    customerProjectDto[field] = val.newValue;
  }

  createIndexToChangesMapFromChanges(changes: Change[]) {
    return Utils.createIndexToChangesMapFromChanges(changes);
  }

  createProjectDtoFromProjects(projects: Project[], customerId: string) {
    const projectDto: any = [];
    projects.forEach((project) => {
      let projDto: any = {};
      projDto = {
        id: project.id,
        name: project.name,
        code: project.code,
        status: project.status,
        customerId
      };
      projectDto.push(projDto);
    });
    return projectDto;
  }

  changeCustomerStatus(userIds: string[], action: string) {
    const changeCustomerStatusDto = { userIds, action };
    return this.apolloService.mutate({
      mutation: gql`
        mutation changeCustomerStatus($changeCustomerStatusDto: UserActivateDeactivateDto!) {
          changeCustomerStatus(changeCustomerStatusDto: $changeCustomerStatusDto)
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        changeCustomerStatusDto
      }
    });
  }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'fullName', showSort: true, permanent: true, width: '200px', },
      { name: 'Location Name', type: DataTypes.CUSTOM, columnMap: 'addresses', default: true, width: '150px', },
      { name: 'Phone', type: DataTypes.CUSTOM, columnMap: 'officePhone', permanent: true, width: '100px', },
      { name: 'Email', type: DataTypes.TEXT, columnMap: 'email', permanent: true, width: '150px', },
      // { name: 'Job Notification', type: DataTypes.CUSTOM, columnMap: 'jobNotification', permanent: true },
      // {
      //   name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdown(ActiveInactiveStatus, false, false, true), showFilter: true,
      //   filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true
      // },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, width: '100px', permanent: true,
      },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
        permanent: (this.authenticationService.checkPermission(Permission.EDIT_CUSTOMER) || this.authenticationService.checkPermission(Permission.VIEW_CUSTOMER_DETAIL)) ? true : false,
        hidden: (this.authenticationService.checkPermission(Permission.EDIT_CUSTOMER) || this.authenticationService.checkPermission(Permission.VIEW_CUSTOMER_DETAIL)) ? false : true,
        width: '50px'
      },
    );
    return columns;
  }

}

