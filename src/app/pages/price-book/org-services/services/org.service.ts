import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from 'src/app/modals/service/service';
import { Observable } from 'rxjs';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import gql from 'graphql-tag';
import { Apollo, QueryRef } from 'apollo-angular';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Change } from 'src/app/modals/change/change';

const QUERY_CATEGORIES = gql`
  query(
    $orgId: String!
    $offset: Int
    $take: Int
    $sort: [SortInput!]
    $query: String
    $filter: [FilterInput!]
  ) {
    listCategories(
      orgId: $orgId
      offset: $offset
      take: $take
      sort: $sort
      query: $query
      filter: $filter
    ) {
      total
      data {
        id
        name
      }
    }
  }
`;

const QUERY_SERVICES = gql`
  query(
    $orgId: String!
    $offset: Int
    $take: Int
    $sort: [SortInput!]
    $query: String
    $filter: [FilterInput!]
  ) {
    listServices(
      orgId: $orgId
      offset: $offset
      take: $take
      sort: $sort
      query: $query
      filter: $filter
    ) {
      total
      data {
        id
        name
        code
        itemDescription
        price
        videoLink
        categories {
          id
          name
        }
        status
      }
    }
  }
`;

const QUERY_GET_SERVICE = gql`
  query($id: String!) {
    getService(id: $id) {
      id
      name
      code
      status
      price
      itemDescription
      addOnPrice
      memberPrice
      imageUrl
      videoLink
      bonus
      categories {
        id
        name
      }
      organizationId
    }
  }
`;

const MUTATION_CHANGE_SERVICE_STATUS = gql`
  mutation ChangeServiceStatus(
    $changeServiceStatusDto: StatusUpdateServiceDto!
  ) {
    changeServiceStatus(changeServiceStatusDto: $changeServiceStatusDto)
  }
`;

const MUTATION_CREATE_SERVICE = gql`
  mutation CreateService($createServiceDto: CreateServiceDto!) {
    createService(createServiceDto: $createServiceDto) {
      id
    }
  }
`;

const MUTATION_UPDATE_SERVICE = gql`
  mutation UpdateService($updateServiceDto: UpdateServiceDto!) {
    updateService(updateServiceDto: $updateServiceDto) {
      id
    }
  }
`;

const IF_CODE_EXISTS = gql`
  mutation CheckIfServiceAlreadyTaken(
    $organizationId: String!
    $name: String!
  ) {
    checkIfServiceAlreadyTaken(organizationId: $organizationId, name: $name)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class OrgService {
  constructor(
    private http: HttpClient,
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>('assets/jsons/services.json');
  }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      {
        name: 'Code',
        type: DataTypes.TEXT,
        columnMap: 'code',
        permanent: true,
        showSort: true,
        width: '250px',
      },
      {
        name: 'Name',
        type: DataTypes.TEXT,
        columnMap: 'name',
        permanent: true,
        showSort: true,
        width: '250px',
      },
      {
        name: 'Description',
        type: DataTypes.TEXT,
        columnMap: 'itemDescription',
        permanent: true,
        width: '350px',
      },
      {
        name: 'Categories',
        type: DataTypes.CUSTOM,
        columnMap: 'categories',
        permanent: true,
        width: '350px',
      },
      {
        name: 'Price',
        type: DataTypes.CUSTOM,
        columnMap: 'price',
        permanent: true,
        showSort: true,
        width: '150px',
      },
      {
        name: 'Video Link',
        type: DataTypes.LINK,
        columnMap: 'videoLink',
        permanent: true,
        width: '150px',
      },
      // { name: 'Business Unit', type: DataTypes.TEXT, columnMap: 'name', permanent: true, }, // TBD
      // {
      //   name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status',
      //   listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true),
      //   showFilter: true, filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '150px'
      // },
      {
        name: 'Status',
        type: DataTypes.ACTIVEINACTIVE,
        columnMap: 'status',
        listOfFilters: Utils.createDropdownForNewEnum(
          GeneralStatus,
          false,
          false,
          true,
          true
        ),
        showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in },
        permanent: true,
        width: '150px',
      },
      {
        name: 'Action',
        type: DataTypes.CUSTOM,
        columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(
          Permission.EDIT_PRICEBOOK_SERVICES
        )
          ? true
          : false,
        hidden: this.authenticationService.checkPermission(
          Permission.EDIT_PRICEBOOK_SERVICES
        )
          ? false
          : true,
        width: '50px',
      }
    );

    return columns;
  }

  listServices(
    orgId: string,
    paginationData?: PaginationData,
    sortData?: SortData[],
    globalFilterData?: GlobalFilterData,
    filterData?: FilterData[]
  ): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: QUERY_SERVICES,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData.page - 1) * paginationData.size,
        take: paginationData.size,
        sort:
          sortData && sortData.length > 0
            ? sortData.map((item) => ({
              sort: item.sortOrder,
              sortBy: item.sortColumn,
            }))
            : null,
        // sort: (sortData.sortOrder ? sortData.sortOrder : 'desc'),
        // sortBy: (sortData.sortOrder ? sortData.sortColumn : 'createdAt'),
        query: globalFilterData.q,
        filter: filterData,
        orgId,
      },
    });
  }

  getService(id: string): QueryRef<any> {
    return this.apolloService.watchQuery<any>({
      query: QUERY_GET_SERVICE,
      fetchPolicy: 'no-cache',
      variables: {
        id,
      },
    });
  }

  listCategories(orgId: string, sortData?: SortData[], paginationData?: PaginationData, globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: QUERY_CATEGORIES,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null,
        orgId
      }
    });
  }

  createService(data: Service) {
    return this.apolloService.mutate({
      mutation: MUTATION_CREATE_SERVICE,
      fetchPolicy: 'no-cache',
      variables: {
        createServiceDto: {
          name: data.name,
          price: data.price,
          itemDescription: data.itemDescription,
          addOnPrice: data.addOnPrice,
          memberPrice: data.memberPrice,
          generalLedgerAccount: data.generalLedgerAccount,
          imageUrl: data.imageUrl,
          videoLink: data.videoLink,
          bonus: data.bonus,
          categoryIds: data.categories.map((category) => category.id),
        },
      },
    });
  }

  updateService(service: Service, changes: Change[]) {
    // const { id, code, name, price, itemDescription, addOnPrice, memberPrice,
    // generalLedgerAccount, imageUrl, videoLink, bonus, status } = data;
    return this.apolloService.mutate({
      mutation: MUTATION_UPDATE_SERVICE,
      fetchPolicy: 'no-cache',
      variables: {
        updateServiceDto: this.createUpdateServiceDtoFromServiceAndChanges(
          service,
          changes
        ),
      },
    });
  }

  createUpdateServiceDtoFromServiceAndChanges(
    service: Service,
    changes: Change[]
  ) {
    const updateServiceDto: any = {};
    changes.forEach((change) => {
      updateServiceDto[change.fieldName] = change.newValue;
      switch (change.fieldName) {
        case 'categories': {
          updateServiceDto['categoryIds'] = change.newValue.map(
            (item) => item.id
          );
          delete updateServiceDto[change.fieldName];
          break;
        }
        case 'price': {
          updateServiceDto['price'] = Utils.convertToNumber(change.newValue);
          break;
        }
        case 'addOnPrice': {
          updateServiceDto['addOnPrice'] = Utils.convertToNumber(
            change.newValue
          );
          break;
        }
        case 'memberPrice': {
          updateServiceDto['memberPrice'] = Utils.convertToNumber(
            change.newValue
          );
          break;
        }
        case 'bonus': {
          updateServiceDto['bonus'] = Utils.convertToNumber(change.newValue);
          break;
        }
      }
    });
    updateServiceDto.id = service.id;
    return updateServiceDto;
  }

  changeStatus(serviceIds: string[], action: string) {
    return this.apolloService.mutate({
      mutation: MUTATION_CHANGE_SERVICE_STATUS,
      fetchPolicy: 'no-cache',
      variables: {
        changeServiceStatusDto: {
          serviceIds,
          action
        }
      }
    });
  }

  checkIfCodeExists(organizationId: string, name?: string) {
    return this.apolloService.mutate({
      mutation: IF_CODE_EXISTS,
      fetchPolicy: 'no-cache',
      variables: {
        organizationId,
        name,
      },
    });
  }
}
