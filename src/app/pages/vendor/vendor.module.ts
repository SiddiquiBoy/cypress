import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { VendorComponent } from './vendor.component';
import { VendorRoutingModule } from './vendor-routing.module';
import { AddVendorModule } from 'src/shared/components/add-vendor/add-vendor.module';


@NgModule({
  declarations: [
    VendorComponent,
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    GeneralTableModule,
    PageHeaderModule,
    SharedDirectiveModule,
    VendorRoutingModule,
    AddVendorModule
  ]
})
export class VendorModule { }
