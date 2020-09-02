import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingsRoutingModule } from './billings-routing.module';
import { CardComponent } from './card/card.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TransactionComponent } from './transaction/transaction.component';
import { BillingsComponent } from './billings.component';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { AddCardComponent } from './add-card/add-card/add-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';

import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';


@NgModule({
  declarations: [CardComponent, InvoiceComponent, TransactionComponent, BillingsComponent, AddCardComponent],
  imports: [
    CommonModule,
    BillingsRoutingModule,
    PageHeaderModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_51HCeVoIvwMeUSeJcejddPMBiVkLluOYbArsAlb41CICQRYSzm8PLKy9Bwgv5cJiNuMml0al3b3nfn0Kan6zZTuzk00QorOT88p'),
    FormsModule,
    SharedDirectiveModule,
    NgZorroAntdModule,
    GeneralTableModule
  ]
})
export class BillingsModule { }
