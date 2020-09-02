import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTimesheetCodeComponent } from './add-timesheet-code.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PageHeaderModule } from '../page-header/page-header.module';
import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';

@NgModule({
  declarations: [AddTimesheetCodeComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    PageHeaderModule,
    FormsModule,
    SharedDirectiveModule,
  ],
  exports: [AddTimesheetCodeComponent],
})
export class AddTimesheetCodeModule {}
