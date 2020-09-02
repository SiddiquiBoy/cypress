import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Utils } from 'src/shared/utilities/utils';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { ViewPaymentService } from './services/view-payment.service';
import { Payment } from 'src/app/modals/payment/payment';


@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewPaymentComponent implements OnInit, OnDestroy {

  isSpinning: boolean;
  subscriptions: Subscription[] = [];
  payment: Payment = new Payment();
  paymentId: string;

  constructor(
    private viewPaymentService: ViewPaymentService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.getRouteParams()
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.viewid) {
            this.paymentId = params.viewid;
            this.getPayment();
          } else {
            this.paymentId = undefined;
          }
        })
    );
  }

  getPayment() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewPaymentService.getPayment(this.paymentId).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.payment = response['data']['getPayment'];
            this.payment = Utils.cloneDeep(this.payment);
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  refreshData(isRefreshData: boolean) {
    if (isRefreshData) {
      this.getPayment();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
