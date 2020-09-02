import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppDialogModule } from '../app-dialog/app-dialog.module';
import { ViewPaymentComponent } from './view-payment.component';
import { GeneralTableModule } from '../general-table/general-table/general-table.module';
// import { ProjectJobComponent } from './project-job/project-job.component';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { PaymentTransactionComponent } from './payment-transaction/payment-transaction.component';

@NgModule({
  declarations: [ViewPaymentComponent, PaymentSummaryComponent, PaymentDetailComponent, PaymentTransactionComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedDirectiveModule,
    AppDialogModule,
    GeneralTableModule,    
  ],
  exports: [ViewPaymentComponent, PaymentSummaryComponent, PaymentDetailComponent, PaymentTransactionComponent]
})
export class ViewPaymentModule { }
