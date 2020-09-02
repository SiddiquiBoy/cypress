import { BaseObject } from '../base-object/base-object';

export class PaymentTransaction extends BaseObject {
  last4: string;
  expMonth: string;
  expYear: string;
  amount: number;
  transactionId: string;
}
