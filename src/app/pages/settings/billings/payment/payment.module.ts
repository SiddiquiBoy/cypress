import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { ViewPaymentModule } from 'src/shared/components/view-payment/view-payment.module';

@NgModule({
  declarations: [
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    NgZorroAntdModule,
    GeneralTableModule,
    PageHeaderModule,
    AppSearchbarModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
    ViewPaymentModule
  ],
  providers: []
})
export class PaymentModule { }
