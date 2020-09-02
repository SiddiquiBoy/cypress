import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from "@angular/core";
import { Subscription } from 'rxjs';
import { Utils } from 'src/shared/utilities/utils';
import { Customer } from 'src/app/modals/customer/customer';
import { Change } from 'src/app/modals/change/change';
import { Payment } from 'src/app/modals/payment/payment';

@Component({
  selector: 'app-payment-summary',
  templateUrl: 'payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PaymentSummaryComponent implements OnInit {

  @Input() payment = new Payment();
  paymentCopy = new Payment();


  @Output() emitRefreshData = new EventEmitter<any>();
  isSpinning: boolean;
  editButtonPermission: string;
  showDetailsDialog: boolean = false;
  subscriptions: Subscription[] = [];
  customers: Customer[] = [];
  orgId: string;
  changes: Change[] = [];
  changedType: string;
  defaultDateFormat: string;

  constructor(
  ) { }

  ngOnInit() {
  }


  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  onOkClick() {

  }

  onCancelClick() {
    this.emitRefreshData.emit(true);
    this.showDetailsDialog = false;
  }

}
