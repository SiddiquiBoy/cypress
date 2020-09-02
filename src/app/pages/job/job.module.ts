import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';
import { AddJobModule } from 'src/shared/components/add-job/add-job.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { ViewJobModule } from 'src/shared/components/view-job/view-job.module';


@NgModule({
  declarations: [
    JobComponent,
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    AddJobModule,
    NgZorroAntdModule,
    GeneralTableModule,
    PageHeaderModule,
    SharedDirectiveModule,
    ViewJobModule,
  ]
})
export class JobModule { }
