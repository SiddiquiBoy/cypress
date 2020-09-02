import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { AddCompanyQueries } from '../queries/add-company-queries';
import { Company } from 'src/app/modals/company/company';
import { AddCompanyMutations } from '../mutations/add-company-mutations';
import { Address } from 'src/app/modals/address/address';
import { Change } from 'src/app/modals/change/change';
import { Utils } from 'src/shared/utilities/utils';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { BehaviorSubject } from 'rxjs';
import { Employee } from 'src/app/modals/people/employee';

@Injectable({
  providedIn: 'root'
})
export class AddCompanyService {

  constructor(
    private apolloService: Apollo,
  ) { }

  isCompanyImageUploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAdminTabValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getCompany(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: AddCompanyQueries.GET_ORGANIZATION,
      variables: {
        id
      },
      fetchPolicy: 'no-cache'
    });
  }

  getCompanyWithEmployeesByRoles(id: string, roles: string[] = []): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: AddCompanyQueries.GET_ORGANIZATION_WITH_EMPLOYEES_BY_ROLES,
      variables: {
        id,
        roles
      },
      fetchPolicy: 'no-cache'
    });
  }

  getAdmins(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: AddCompanyQueries.LIST_ADMINS,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        roles: [Role.ORGADMIN]
      },
      fetchPolicy: 'network-only'
    });
  }

  createCompany(company: Company) {
    return this.apolloService.mutate({
      mutation: AddCompanyMutations.CREATE_ORGANIZATION,
      variables: {
        createOrganizationDto: {
          name: company.name,
          // status: company.status,
          contact: Utils.phoneRemoveSpecialChars(company.contact),
          email: company.email,
          imageUrl: company.imageUrl,
          createAddressDto: company.addresses,
          createEmployeeDto: this.createCompanyEmployeeDtoObjectForCreation(company.employees)
        }
      },
      fetchPolicy: 'no-cache'
    });
  }

  createCompanyEmployeeDtoObjectForCreation(employees: Employee[]) {
    employees.forEach((emp) => {
      if (emp && emp.homePhone && emp.homePhone !== '') {
        emp.homePhone = Utils.phoneRemoveSpecialChars(emp.homePhone);
      } else {
        emp.homePhone = null;
      }
      emp.officePhone = Utils.phoneRemoveSpecialChars(emp.officePhone);
    });
    return employees;
  }

  updateCompany(company: Company, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: AddCompanyMutations.UPDATE_ORGANIZATION,
      variables: {
        updateOrganizationDto: this.createUpdateCompanyDtoFromCompanyAndChanges(company, changes)
      },
      fetchPolicy: 'no-cache'
    });
  }

  createUpdateCompanyDtoFromCompanyAndChanges(company: Company, changes: Change[]) {
    const updateCompanyDto: any = {};
    const companyRelatedChanges = changes.filter(change => !change.fieldName.includes('addresses/') && !change.fieldName.includes('employees/'));
    const addressRelatedChanges = changes.filter(change => change.fieldName.includes('addresses/'));
    const employeeRelatedChanges = changes.filter(change => change.fieldName.includes('employees/'));
    companyRelatedChanges.forEach((change) => {
      this.createUpdateCompanyDtoObject(updateCompanyDto, change);
    });
    updateCompanyDto.updateAddressDto = this.createCompanyAddressDtoFromCompanyAddressesAndChanges(company.addresses, addressRelatedChanges);
    updateCompanyDto.updateEmployeeDto = this.createCompanyAdminDtoFromCompanyEmployeesAndChanges(company.employees, employeeRelatedChanges);
    updateCompanyDto.id = company.id;
    return updateCompanyDto;
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

  createCompanyAdminDtoFromCompanyEmployeesAndChanges(employees: Employee[], changes: Change[]) {
    const indexToChanges: Map<number, Change[]> = this.createIndexToChangesMapFromChanges(changes);
    const createCompanyEmployeesDto: any = [];
    employees.forEach((employee, index) => {
      const companyEmployeeDto: any = {};
      if (indexToChanges.has(index)) {
        const value = indexToChanges.get(index);
        value.forEach((val) => {
          const splittedFields = val.fieldName.split('.');
          if (splittedFields && splittedFields.length > 0) {
            const field = splittedFields[splittedFields.length - 1];
            if (field !== null && field !== undefined) {
              this.createCompanyEmployeeDtoObject(companyEmployeeDto, field, val);
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
      companyEmployeeDto.id = employee.id;
      createCompanyEmployeesDto.push(companyEmployeeDto);
    });
    return createCompanyEmployeesDto;
  }

  createIndexToChangesMapFromChanges(changes: Change[]) {
    return Utils.createIndexToChangesMapFromChanges(changes);
  }

  createCompanyAddressDtoObject(companyAddressDto: any, field: string, val: Change) {
    companyAddressDto[field] = val.newValue;
  }

  createCompanyEmployeeDtoObject(companyEmployeeDto: any, field: string, val: Change) {
    switch (field) {
      case 'homePhone':
      case 'officePhone': {
        companyEmployeeDto[field] = Utils.phoneRemoveSpecialChars(val.newValue);
        break;
      }
      default: {
        companyEmployeeDto[field] = val.newValue;
      }
    }
  }

  checkIfCompanyContactAlreadyExists(contact: string) {
    return this.apolloService.mutate({
      mutation: AddCompanyMutations.IF_COMPANY_CONTACT_ALREADY_EXISTS,
      fetchPolicy: 'no-cache',
      variables: {
        organizationId: undefined,
        contact,
        email: undefined
      },
    });
  }

}
