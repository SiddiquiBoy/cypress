import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerComponent } from './add-customer.component';
import { PageHeaderModule } from '../page-header/page-header.module';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerProjectsComponent } from './customer-projects/customer-projects.component';
import { CustomerJobsComponent } from './customer-jobs/customer-jobs.component';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { CustomerAddressesComponent } from './customer-addresses/customer-addresses.component';
import { AppDialogModule } from '../app-dialog/app-dialog.module';



@NgModule({
  declarations: [
    AddCustomerComponent,
    CustomerDetailComponent,
    CustomerProjectsComponent,
    CustomerJobsComponent,
    CustomerAddressesComponent,
  ],
  imports: [
    CommonModule,
    PageHeaderModule,
    FormsModule,
    NgZorroAntdModule,
    FileUploadModule,
    SharedDirectiveModule,
    AppDialogModule
  ],
  exports: [
    AddCustomerComponent,
    CustomerDetailComponent,
    CustomerProjectsComponent,
    CustomerJobsComponent,
    CustomerAddressesComponent,
  ],
  entryComponents: [
    AddCustomerComponent,
    CustomerDetailComponent,
    CustomerProjectsComponent,
    CustomerJobsComponent,
    CustomerAddressesComponent,
  ]
})
export class AddCustomerModule { }
