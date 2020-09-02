import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddJobComponent } from './add-job.component';
import { PageHeaderModule } from '../page-header/page-header.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FileUploadModule } from '../file-upload/file-upload.module';



@NgModule({
  declarations: [
    AddJobComponent
  ],
  imports: [
    CommonModule,
    PageHeaderModule,
    SpinnerModule,
    FormsModule,
    NgZorroAntdModule,
    SharedDirectiveModule,
    FileUploadModule
  ],
  exports: [
    AddJobComponent
  ]
})
export class AddJobModule { }
