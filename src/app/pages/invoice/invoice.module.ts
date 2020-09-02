import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';


@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    PageHeaderModule,
    NgZorroAntdModule,
    GeneralTableModule,
    AppSearchbarModule,
    SharedDirectiveModule
  ]
})
export class InvoiceModule { }
