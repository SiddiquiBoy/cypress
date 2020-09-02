import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { SpinnerModule } from 'src/shared/components/spinner/spinner.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PhoneFormatPipe } from 'src/shared/pipes/phone-format.pipe';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { AddCompanyModule } from 'src/shared/components/add-company/add-company.module';


@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    GeneralTableModule,
    AppSearchbarModule,
    PageHeaderModule,
    SpinnerModule,
    NgZorroAntdModule,
    SharedDirectiveModule,
    AddCompanyModule
  ]
})
export class CompanyModule { }
