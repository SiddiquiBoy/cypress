import { NgModule } from '@angular/core';
import { AddVendorComponent } from './add-vendor.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PageHeaderModule } from '../page-header/page-header.module';
import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';
import { VendorContactComponent } from './vendor-contact/vendor-contact.component';
import { AppDialogModule } from '../app-dialog/app-dialog.module';

@NgModule({
  declarations: [AddVendorComponent, VendorDetailComponent, VendorContactComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    PageHeaderModule,
    FormsModule,
    SharedDirectiveModule,
    AppDialogModule
  ],
  exports: [AddVendorComponent]
})

export class AddVendorModule { }
