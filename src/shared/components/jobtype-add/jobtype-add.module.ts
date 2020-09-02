import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobtypeAddComponent } from './jobtype-add.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { PageHeaderModule } from '../page-header/page-header.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';



@NgModule({
  declarations: [JobtypeAddComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    PageHeaderModule,
    FormsModule,
    SharedDirectiveModule
  ],
  exports: [JobtypeAddComponent]
})
export class JobtypeAddModule { }
