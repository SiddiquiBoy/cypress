import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Utils } from 'src/shared/utilities/utils';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { PaymentStatus } from 'src/app/modals/enums/payment/payment.enum';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(
        private apolloService: Apollo,
        private authenticationService: AuthenticationService
    ) { }

    getColumnItems(): ColumnItem[] {
        const columns: ColumnItem[] = [];
        columns.push(
          { name: 'Year', type: DataTypes.TEXT, columnMap: 'year', showSort: true, permanent: true },
          { name: 'Month', type: DataTypes.CUSTOM, columnMap: 'month',showSort: true,  permanent: true },
          { name: 'Amount', type: DataTypes.TEXT, columnMap: 'amount', permanent: true },
          {
            name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(PaymentStatus, false, false, true, true), showFilter: true,
            filter: { field: 'status', value: '', op: FilterOp.in }, width: '100px', permanent: true,
          },
          {
            name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
            permanent: this.authenticationService.checkPermission(Permission.VIEW_PAYMENT) ? true : false,
            hidden: this.authenticationService.checkPermission(Permission.VIEW_PAYMENT) ? false : true,
            width: '75px'
          }
        );
        return columns;
    }

    listOfPayments(paginationData?: PaginationData, sortData?: SortData[], filterData?: FilterData[]): QueryRef<any> {
        return this.apolloService.watchQuery({
          query: gql`
          query listPayments($sort: [SortInput!], $offset: Int!, $take:Int!, $filter: [FilterInput!]) {
            listPayments(sort:$sort, offset:$offset, take:$take, filter: $filter) {
              total
              data {
                id
                month
                year
                amount
                status
              }
            }
          }
          `,
          variables: {
            offset: (paginationData && paginationData.page && paginationData.size) ? (paginationData.page - 1) * paginationData.size : null,
            take: (paginationData && paginationData.size) ? paginationData.size : null,
            sort: (sortData && sortData.length > 0) ? sortData.map(item => ({ sort: item.sortOrder, sortBy: item.sortColumn })) : null,
            filter: filterData ? filterData : null
          },
          fetchPolicy: 'network-only'
        });
      }
    
}
