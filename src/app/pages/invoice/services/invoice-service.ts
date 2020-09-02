import { Injectable } from '@angular/core';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { Utils } from 'src/shared/utilities/utils';
import { PaymentStatus } from 'src/app/modals/enums/payment/payment.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor() { }

  getColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Invoice #', type: DataTypes.TEXT, columnMap: 'invoiceNumber', showSort: true, permanent: true },
      { name: 'Job #', type: DataTypes.TEXT, columnMap: 'jobNumber',showSort: true,  permanent: true },
      { name: 'Customer', type: DataTypes.TEXT, columnMap: 'customerName', permanent: true },
      { name: 'Technician', type: DataTypes.TEXT, columnMap: 'technicians', permanent: true },
      { name: 'Location', type: DataTypes.TEXT, columnMap: 'location', permanent: true },
      { name: 'Invoice Date', type: DataTypes.TEXT, columnMap: 'invoiceDate', permanent: true },
      { name: 'Complete On', type: DataTypes.TEXT, columnMap: 'completedOn', permanent: true },
      { name: 'Total', type: DataTypes.TEXT, columnMap: 'total', permanent: true },
      { name: 'Balance', type: DataTypes.TEXT, columnMap: 'balance', permanent: true },
      {
        name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(PaymentStatus, false, false, true, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, width: '100px', permanent: true,
      },
    );
    return columns;
}
}
