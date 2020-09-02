import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewCustomerComponent } from './view-customer.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { GeneralTableModule } from '../general-table/general-table/general-table.module';
import { CustomerSummaryComponent } from './customer-summary/customer-summary.component';
import { CustomerAddressListComponent } from './customer-address-list/customer-address-list.component';
import { CustomerProjectListComponent } from './customer-project-list/customer-project-list.component';
import { CustomerJobListComponent } from './customer-job-list/customer-job-list.component';
import { AppDialogModule } from '../app-dialog/app-dialog.module';
import { AddJobModule } from '../add-job/add-job.module';
import { FormsModule } from '@angular/forms';
import { AddProjectModule } from '../add-project/add-project.module';
import { AddCustomerModule } from '../add-customer/add-customer.module';
import { AddAddressModule } from '../add-address/add-address.module';



@NgModule({
  declarations: [ViewCustomerComponent, CustomerSummaryComponent, CustomerAddressListComponent, CustomerProjectListComponent, CustomerJobListComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedDirectiveModule,
    GeneralTableModule,
    AppDialogModule,
    AddJobModule,
    FormsModule,
    AddProjectModule,
    AddCustomerModule,
    AddAddressModule,
  ]
})
export class ViewCustomerModule { }
