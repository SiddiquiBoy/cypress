import { Injectable } from "@angular/core";
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { Change } from 'src/app/modals/change/change';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { Vendor } from 'src/app/modals/vendor/vendor';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AddVendorService {
  constructor(
    private apolloService: Apollo,
  ) { }

  isDetailTabValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  createVendor(vendor: Vendor) {
    return this.apolloService.mutate<any>({
      mutation: gql`
      mutation createVendor($createVendorDto: CreateVendorDto!){
        createVendor(createVendorDto: $createVendorDto) {
          id
        }
     }`,
      variables: {
        createVendorDto: {
          tagIds: vendor.tags.map(tag => tag.id),
          vendorName: vendor.vendorName,
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          fullName: vendor.fullName,
          email: vendor.email,
          fax: vendor.fax,
          phone: vendor.phone,
          memo: vendor.memo,
          street: vendor.street,
          landmark: vendor.landmark,
          city: vendor.city,
          country: vendor.country,
          postalCode: vendor.postalCode,
          state: vendor.state
        }
      }
    });
  }

  updateVendor(vendor: Vendor, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: gql`
      mutation updateVendor($updateVendorDto: UpdateVendorDto!) {
        updateVendor(updateVendorDto: $updateVendorDto) {
          id
        }
      }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        updateVendorDto: this.createUpdateVendorDtoFromVendorAndChanges(vendor, changes)
      }
    });
  }

  createUpdateVendorDtoFromVendorAndChanges(vendor: Vendor, changes: Change[]) {
    const updateVendorDto: any = {};
    changes.forEach((change) => {
      updateVendorDto[change.fieldName] = change.newValue;
      if (change.fieldName === 'tags') {
        updateVendorDto['tagIds'] = change.newValue.map(item => item.id);
        delete updateVendorDto[change.fieldName];
      } else {
        // do nothing
      }
    });
    updateVendorDto.id = vendor.id;
    return updateVendorDto;
  }

  getVendor(id: string) {
    return this.apolloService.watchQuery({
      query: gql`
      query( $id: String!){
        getVendor(id: $id){
          id
          vendorName
          firstName
          lastName
          fullName
          email
          fax
          phone
          memo
          street
          city
          landmark
          country
          postalCode
          status
          state
          tags{
            id
            name
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

}
