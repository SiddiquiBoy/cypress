import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from 'src/app/modals/tag/tag';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { Change } from 'src/app/modals/change/change';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BusinessunitAddService {
  sortData: SortData = {};
  isDetailTabValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private apolloService: Apollo,
  ) { }

  getTags(orgId: string, sortData: SortData[], paginationData: PaginationData, globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: gql`
      query listTags($orgId: String!, $offset: Int, $take: Int, $sort: [SortInput!]) {
        listTags(orgId: $orgId, offset: $offset, take: $take, sort: $sort) {
          total
          data {
            id
            name
            code
            color
          }
        }
      }
      `,
      variables: {
        orgId,
        offset: (paginationData.page - 1) * paginationData.size,
        take: paginationData.size,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only'
    });
  }

  getBusinessUnit(id: string) {
    return this.apolloService.watchQuery({
      query: gql`
        query($id: String!){
          getBusinessUnit(id: $id){
            id
            name
            officialName
            email
            phone
            minPostDate
            street
            country
            status
            state
            city
            zipCode
            tags{
              name
              color
              id
              code
              importance
              status
            }
          }
        }
      `,
      variables: {
        id: id,
      },
      fetchPolicy: 'no-cache',
    });
  }

  createBusinessUnit(data: BusinessUnit) {
    return this.apolloService.mutate<any>({
      mutation: gql`
      mutation CreateBusinessUnit($createBusinessUnitDto: BusinessUnitCreateDto!) {
      createBusinessUnit(createBusinessUnitDto: $createBusinessUnitDto)
    }
    `,
      variables: {
        createBusinessUnitDto: {
          name: data.name,
          officialName: data.officialName,
          email: data.email,
          tags: data.tags.map(_ => _.id),
          minPostDate: data.minPostDate,
          street: data.street,
          country: data.country,
          state: data.state,
          city: data.city,
          phone: data.phone,
          zipCode: data.zipCode
        }
      }
    })
  }

  // updateBusinessUnit(data: BusinessUnit, id: string){
  //   return this.apolloService.mutate<any>({
  //     mutation: gql`
  //     mutation UpdateBusinessUnit($updateBusinessUnitDto: BusinessUnitUpdateDto!) {
  //       updateBusinessUnit(updateBusinessUnitDto: $updateBusinessUnitDto)
  //     }
  //     `,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       updateBusinessUnitDto: {
  //         id: id,
  //         name: data.name,
  //         officialName: data.officialName,
  //         email: data.email,
  //         tags: data.tags.map(tag => tag.id),
  //         minPostDate: data.minPostDate,
  //         street: data.street,
  //         country: data.country,
  //         state: data.state,
  //         city: data.city,
  //         phone: data.phone,
  //         status: data.status,
  //         zipCode: data.zipCode
  //       }
  //     }
  //   });
  // }

  updateBusinessUnit(data: BusinessUnit, id: string, changes: Change[]) {
    return this.apolloService.mutate<any>({
      mutation: gql`
      mutation UpdateBusinessUnit($updateBusinessUnitDto: BusinessUnitUpdateDto!) {
        updateBusinessUnit(updateBusinessUnitDto: $updateBusinessUnitDto)
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        updateBusinessUnitDto: this.createUpdateBusinessUnitDtoFromBusinessUnitAndChanges(data, changes)
      }
    });
  }

  createUpdateBusinessUnitDtoFromBusinessUnitAndChanges(businessUnit: BusinessUnit, changes: Change[]) {
    const updateBusinessUnitDto: any = {};
    changes.forEach((change) => {
      updateBusinessUnitDto[change.fieldName] = change.newValue;
      if (change.fieldName === 'tags') {
        updateBusinessUnitDto[change.fieldName] = change.newValue.map(item => item.id);
      } else {
        // do nothing
      }
    });
    updateBusinessUnitDto.id = businessUnit.id;
    return updateBusinessUnitDto;
  }

  checkIfEmailPhoneAndNameExist(organizationId: string, name?: string, email?: string, phone?: string) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation checkIfBusinessUnitTaken($organizationId: String!, $name: String, $email: String, $phone: String) {
        checkIfBusinessUnitTaken(organizationId: $organizationId, name: $name, email: $email, phone: $phone)
      }
    `,
      fetchPolicy: 'no-cache',
      variables: {
        organizationId,
        name,
        phone,
        email
      }
    });
  }

}
