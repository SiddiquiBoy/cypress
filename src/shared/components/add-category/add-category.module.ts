import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryComponent } from './add-category.component';
import { PageHeaderModule } from '../page-header/page-header.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';

@NgModule({
  declarations: [
    AddCategoryComponent
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
    AddCategoryComponent
  ],
  entryComponents: [
    AddCategoryComponent
  ]
})
export class AddCategoryModule { }
