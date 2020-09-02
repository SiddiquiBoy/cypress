import { CustomerComponent } from './customer.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FileUploadModule } from 'src/shared/components/file-upload/file-upload.module';
import { AddCustomerModule } from 'src/shared/components/add-customer/add-customer.module';
import { NgModule } from '@angular/core';
import { CustomerRoutingModule } from './customer-routing.module';
import { ViewCustomerModule } from 'src/shared/components/view-customer/view-customer.module';

@NgModule({
  declarations: [
    CustomerComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NgZorroAntdModule,
    GeneralTableModule,
    PageHeaderModule,
    AppSearchbarModule,
    ReactiveFormsModule,
    FormsModule,
    SharedDirectiveModule,
    FileUploadModule,
    AddCustomerModule,
    ViewCustomerModule,
  ],
  providers: []
})
export class CustomerModule { }
