import { BaseObject } from '../base-object/base-object';
import { PaymentStatus } from '../enums/payment/payment.enum';

export class Invoice extends BaseObject {
    invoiceNumber: number;
    jobNumber: number;
    customerName: string;
    technicians: string;
    invoiceDate: Date;
    completedOn: Date;
    total: number;
    balance: number;
    status: PaymentStatus
}
