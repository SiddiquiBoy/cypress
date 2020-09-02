import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo, QueryRef } from 'apollo-angular';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Utils } from 'src/shared/utilities/utils';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TimesheetCode } from 'src/app/modals/timesheet-code/timesheet-code';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { TimesheetCodeType } from 'src/app/modals/enums/timesheet-code-type/timesheet-code-type.enum';
import { Change } from 'src/app/modals/change/change';

const LIST = gql`
  query($orgId: String!, $offset: Int, $take: Int, $sort: [SortInput!], $query: String, $filter: [FilterInput!]) {
    listTimesheetCodes(orgId: $orgId, offset: $offset, take: $take, sort: $sort, query: $query, filter: $filter) {
      total
      data {
        id
        code
        description
        type
        businessUnit {
          id
          name
        }
        status
      }
    }
  }
`;
const CREATE = gql`
  mutation CreateTimesheetCode($createTimesheetCodeDto: CreateTimesheetCodeDto!) {
    createTimesheetCode(createTimesheetCodeDto: $createTimesheetCodeDto) {
      id
    }
  }
`;
const UPDATE = gql`
  mutation UpdateTimesheetCode($updateTimesheetCodeDto: UpdateTimesheetCodeDto!) {
    updateTimesheetCode(updateTimesheetCodeDto: $updateTimesheetCodeDto) {
      id
    }
  }
`;
const GET = gql`
  query($id: String!) {
    getTimesheetCode(id: $id) {
      id
      code
      description
      type
      businessUnit {
        id
        name
      }
      status
    }
  }
`;
const CHANGE_STATUS = gql`
  mutation ChangeTimesheetCodeStatus($changeTimesheetCodeStatusDto: StatusUpdateTimesheetCodeDto!) {
    changeTimesheetCodeStatus(changeTimesheetCodeStatusDto: $changeTimesheetCodeStatusDto)
  }
`;

const LIST_BUSINESS_UNITS = gql`
  query($orgId: String!, $sort: [SortInput!], $offset: Int, $take: Int, $query: String, $filter: [FilterInput!]) {
    listBusinessUnits(orgId: $orgId, sort: $sort, offset: $offset, take: $take, query: $query, filter: $filter) {
      data {
        id
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class TimesheetCodeService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

  getColumnItems(): ColumnItem[] {

    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Timesheet Code', type: DataTypes.TEXT, columnMap: 'code', permanent: true, showSort: true, width: '150px' },
      {
        name: 'Type', type: DataTypes.CUSTOM, columnMap: 'type', permanent: true, width: '150px',
        listOfFilters: Utils.createDropdownForNewEnum(TimesheetCodeType, false, false, false, true), showFilter: true,
        filter: { field: 'type', value: '', op: FilterOp.in }
      },
      { name: 'Business Unit', type: DataTypes.NESTED, columnMap: 'businessUnit', columnMap2: 'name', permanent: true, width: '250px' },
      { name: 'Description', type: DataTypes.CUSTOM, columnMap: 'description', permanent: true, width: '350px' },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status',
        listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true),
        showFilter: true, filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '150px'
      },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_TIMESHEET_CODE) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_TIMESHEET_CODE) ? false : true,
        width: '50px'
      },
    );

    return columns;
  }

  listTimesheetCodes(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: LIST,
      fetchPolicy: 'network-only',
      variables: {
        offset: (paginationData.page - 1) * paginationData.size,
        take: paginationData.size,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        // sort: (sortData.sortOrder ? sortData.sortOrder : 'desc'),
        // sortBy: (sortData.sortOrder ? sortData.sortColumn : 'createdAt'),
        query: globalFilterData.q,
        filter: filterData,
        orgId
      }
    });
  }

  createTimesheetCode(data: TimesheetCode) {
    return this.apolloService.mutate({
      mutation: CREATE,
      fetchPolicy: 'no-cache',
      variables: {
        createTimesheetCodeDto: {
          type: data.type,
          description: data.description,
          businessUnitId: data.businessUnit.id
        }
      }
    });
  }

  getTimesheetCode(id: string): QueryRef<any> {
    return this.apolloService.watchQuery<any>({
      query: GET,
      fetchPolicy: 'no-cache',
      variables: {
        id
      }
    });
  }

  // updateTimesheetCode(data: TimesheetCode) {
  //   return this.apolloService.mutate({
  //     mutation: UPDATE,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       updateTimesheetCodeDto: {
  //         id: data.id,
  //         code: data.code,
  //         description: data.description,
  //         status: data.status,
  //         businessUnitId: data.businessUnit.id,
  //         type: data.type
  //       }
  //     }
  //   });
  // }

  updateTimesheetCode(data: TimesheetCode, changes: Change[]) {
    return this.apolloService.mutate({
      mutation: UPDATE,
      fetchPolicy: 'no-cache',
      variables: {
        updateTimesheetCodeDto: this.createUpdateTimesheetCodeDtoFromTimesheetCodeAndChanges(data, changes)
      }
    });
  }

  createUpdateTimesheetCodeDtoFromTimesheetCodeAndChanges(timesheetCode: TimesheetCode, changes: Change[]) {
    const updateTimesheetCodeDto: any = {};
    changes.forEach((change) => {
      updateTimesheetCodeDto[change.fieldName] = change.newValue;
      if (change.fieldName === 'businessUnit') {
        updateTimesheetCodeDto['businessUnitId'] = change.newValue.id;
        delete updateTimesheetCodeDto[change.fieldName];
      } else {
        // do nothing
      }
    });
    updateTimesheetCodeDto.id = timesheetCode.id;
    return updateTimesheetCodeDto;
  }

  changeStatus(timesheetCodeIds: string[], action: string) {
    return this.apolloService.mutate({
      mutation: CHANGE_STATUS,
      fetchPolicy: 'no-cache',
      variables: {
        changeTimesheetCodeStatusDto: {
          timesheetCodeIds,
          action
        }
      }
    });
  }

  listBusinessUnits(orgId: string, paginationData?: PaginationData, sortData?: SortData[], globalFilterData?: GlobalFilterData, filterData?: FilterData[], includeIds?: string[]): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: LIST_BUSINESS_UNITS,
      variables: {
        offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
        take: (paginationData && paginationData.size) ? paginationData.size : null,
        sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
        orgId,
        query: (globalFilterData && globalFilterData.q) ? globalFilterData.q : null,
        filter: filterData ? filterData : null,
        include: (filterData && includeIds && includeIds.length > 0) ? includeIds : null
      },
      fetchPolicy: 'network-only'
    });
  }
}
