import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header.component';
import { NzIconModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    NzIconModule
  ],
  exports: [
    PageHeaderComponent
  ],
  entryComponents: [
    PageHeaderComponent
  ]
})
export class PageHeaderModule { }
