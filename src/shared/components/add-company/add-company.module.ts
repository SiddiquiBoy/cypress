import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCompanyComponent } from './add-company.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PageHeaderModule } from '../page-header/page-header.module';
import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { AppDialogModule } from '../app-dialog/app-dialog.module';



@NgModule({
  declarations: [
    AddCompanyComponent,
    CompanyAdminComponent,
    CompanyDetailComponent
  ],
  imports: [
    CommonModule,
    PageHeaderModule,
    FormsModule,
    SharedDirectiveModule,
    NgZorroAntdModule,
    FileUploadModule,
    AppDialogModule
  ],
  exports: [
    AddCompanyComponent
  ]
})
export class AddCompanyModule { }
