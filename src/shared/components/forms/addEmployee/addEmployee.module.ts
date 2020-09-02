import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AddEmployeeComponent } from './addEmployee.component';
import { PageHeaderModule } from '../../page-header/page-header.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FileUploadModule } from '../../file-upload/file-upload.module';
import { PhoneFormatPipe } from 'src/shared/pipes/phone-format.pipe';

@NgModule({
  imports: [
    NgZorroAntdModule,
    PageHeaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
    FileUploadModule
  ],
  declarations: [
    AddEmployeeComponent,
  ],
  exports: [
    AddEmployeeComponent
  ],
  entryComponents: [
    AddEmployeeComponent
  ],
  providers: [
    TitleCasePipe,
    PhoneFormatPipe
  ]
})

export class AddEmployeeModule { }
