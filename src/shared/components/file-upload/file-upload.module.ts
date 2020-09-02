import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  exports: [FileUploadComponent],
  entryComponents: [FileUploadComponent]
})
export class FileUploadModule { }
