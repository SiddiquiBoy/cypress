import { BaseObject } from '../base-object/base-object';

export class PaymentDetail extends BaseObject {
  entityType: string;
  days: string;
  count: string;
  amount: number;
  billingStartDate: Date;
  billingEndDate: Date;
}
