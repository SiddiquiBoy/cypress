import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceAddComponent } from './service-add.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { PageHeaderModule } from '../page-header/page-header.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FileUploadModule } from '../file-upload/file-upload.module';

@NgModule({
  declarations: [ServiceAddComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    PageHeaderModule,
    SharedDirectiveModule,
    FileUploadModule,
  ],
})
export class ServiceAddModule {}
