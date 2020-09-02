import { Injectable } from "@angular/core";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Category } from 'src/app/modals/category/category';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { Change } from 'src/app/modals/change/change';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';

@Injectable({
  providedIn: 'root'
})

export class AddCategoryService {
  constructor(
    private apolloService: Apollo,
  ) { }

  getBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int, $take: Int, $query: String, $filter: [FilterInput!]){
        listBusinessUnits(orgId: $orgId, sort: $sort, offset: $offset, take: $take, query: $query, filter: $filter){
          data {
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
              id
            }
           }
          total
        }
      }
      `,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only',
    });
  }

  getServices(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]) {
    return this.apolloService.watchQuery({
      query: gql`
      query($orgId: String!, $sort: [SortInput!], $offset: Int, $take: Int, $query: String, $filter: [FilterInput!]){
        listServices(orgId: $orgId, offset: $offset, take: $take, sort: $sort, query: $query, filter: $filter){
          data {
            id
            name
           }
          total
        }
      }
      `,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null,
        orgId,
      },
      fetchPolicy: 'network-only',
    });
  }

  getCategory(id: string) {
    return this.apolloService.watchQuery({
      query: gql`
      query( $id: String!){
        getCategory(id: $id){
          id
          name
          code
          status
          imageUrl
          services{
            id
            name
            code
            status
          }
          businessUnit {
            id
            name
            officialName
            email
            phone
          }
        }
      }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        id
      }
    });
  }

  createCategory(data: Category) {
    return this.apolloService.mutate<any>({
      mutation: gql`
      mutation createCategory($createCategoryDto: CreateCategoryDto!){
                createCategory(createCategoryDto: $createCategoryDto){
                  id
                }
     }`,
      variables: {
        createCategoryDto: {
          name: (data && data.name) ? data.name : null,
          businessUnitId: (data && data.businessUnit && data.businessUnit.id) ? data.businessUnit.id : null,
          serviceIds: (data && data.services && data.services.length > 0) ? data.services.map(s => s.id) : null,
          // code: data.code,
          imageUrl: (data && data.imageUrl) ? data.imageUrl : null
        }
      }
    });
  }

  updateCategory(category: Category, changes: Change[]) {
    return this.apolloService.mutate<any>({
      mutation: gql`
        mutation updateCategory($updateCategoryDto: UpdateCategoryDto!){
          updateCategory(updateCategoryDto: $updateCategoryDto){
            id
          }
        }
      `,
      variables: {
        updateCategoryDto: this.createUpdateCategoryDtoFromCategoryAndChanges(category, changes)
        // updateCategoryDto: {
        //   name: data.name,
        //   id: data.id,
        //   status: data.status,
        //   businessUnitId: data.businessUnit,
        //   serviceIds: data.services.map(s => s.id),
        //   imageUrl: data.imageUrl
        // }
      },
      // fetchPolicy: 'network-only',
      fetchPolicy: 'no-cache'
    });
  }

  // checkIfCodeAndNameExist(organizationId: string, name?: string, code?: string) {
  //   return this.apolloService.mutate({
  //     mutation: gql`
  //     mutation CheckIfCategoryTaken($organizationId: String!, $name: String, $code: String) {
  //       checkIfCategoryTaken(organizationId: $organizationId, name: $name, code: $code)
  //     }
  //   `,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       organizationId,
  //       name,
  //       code
  //     }
  //   });
  // }

  checkIfCodeAndNameExist(organizationId: string, name: string) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation CheckIfCategoryTaken($organizationId: String!, $name: String!) {
        checkIfCategoryTaken(organizationId: $organizationId, name: $name)
      }
    `,
      // fetchPolicy: 'network-only',
      fetchPolicy: 'no-cache',
      variables: {
        organizationId,
        name
      }
    });
  }

  createUpdateCategoryDtoFromCategoryAndChanges(category: Category, changes: Change[]) {
    const updateCategoryDto: any = {};
    changes.forEach((change) => {
      updateCategoryDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'businessUnit': {
          updateCategoryDto['businessUnitId'] = change.newValue.id;
          delete updateCategoryDto[change.fieldName];
          break;
        }
        case 'services': {
          updateCategoryDto['serviceIds'] = change.newValue.map(item => item.id);
          delete updateCategoryDto[change.fieldName];
          break;
        }
      }
    });
    updateCategoryDto.id = category.id;
    return updateCategoryDto;
  }
}


