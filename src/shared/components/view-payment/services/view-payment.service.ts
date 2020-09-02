import { Apollo, QueryRef } from 'apollo-angular';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Utils } from 'src/shared/utilities/utils';
import { TransactionStatus } from 'src/app/modals/enums/transaction-status/transaction-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ViewPaymentService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService
  ) { }

getPayment(id: string): QueryRef<any> {
  return this.apolloService.watchQuery({
    query: gql`
    query getPayment($id: String!) {
      getPayment(id: $id) {
        id
        status
        amount
        month
        year
        orgAdminCharge
        technicianCharge
        paymentDetails{
          id
          entityType
          count
          days
          amount
          billingStartDate
          billingEndDate
        }
        paymentTransactions{
          id
          amount
          transactionId
          chargeId,
          last4,
          expMonth,
          expYear
          status
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




getColumnItems(): ColumnItem[] {
  const columns: ColumnItem[] = [];
  columns.push(
    { name: 'Role', type: DataTypes.CUSTOM, columnMap: 'entityType', permanent: true, width: '120px' },
    { name: 'Days', type: DataTypes.TEXT, columnMap: 'days',  permanent: true, showSort: true, width: '120px' },
    { name: 'Count', showSort: true, type: DataTypes.TEXT, columnMap: 'count',  permanent: true, width: '120px' },
    { name: 'Bill Cycle', type: DataTypes.CUSTOM, columnMap: 'billCycle',  permanent: true, width: '120px' },
    { name: 'Amount', type: DataTypes.TEXT, columnMap: 'amount',  permanent: true, showSort: true, width: '200px' },
  );
  return columns;
}

getTransactionColumnItems(): ColumnItem[]{
  const columns: ColumnItem[] = [];
  columns.push(
    { name: 'Transaction Id', type: DataTypes.TEXT, columnMap: 'transactionId', permanent: true, width: '120px' },
    { name: 'Amount', type: DataTypes.TEXT, columnMap: 'amount',  permanent: true, showSort: true, width: '200px' },
    { name: 'Last 4', type: DataTypes.TEXT, columnMap: 'last4',  permanent: true, width: '120px' },
    { name: 'Exp Year', type: DataTypes.TEXT, columnMap: 'expYear',  permanent: true, width: '120px' },
    { name: 'Exp Month', type: DataTypes.TEXT, columnMap: 'expMonth',  permanent: true, width: '120px' },
    {
      name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(TransactionStatus, false, false, true, true), showFilter: true,
      filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '150px'
    },
  );
  return columns;
}

}
