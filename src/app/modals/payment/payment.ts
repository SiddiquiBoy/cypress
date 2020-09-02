import { BaseObject } from '../base-object/base-object';
import { PaymentStatus } from '../enums/payment/payment.enum';
import { PaymentDetail } from '../payment-detail/payment-detail';
import { PaymentTransaction } from '../payment-transaction/payment-transaction';

export class Payment extends BaseObject {
  amount: number;
  month: string;
  year: number;  
  status: PaymentStatus;
  orgAdminCharge: number;
  technicianCharge: number;
  paymentDetails: PaymentDetail[] = [];
  paymentTransactions: PaymentTransaction[] = []

}

