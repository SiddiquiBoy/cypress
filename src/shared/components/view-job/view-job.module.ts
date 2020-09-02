import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewJobComponent } from './view-job.component';
import { JobSummaryComponent } from './job-summary/job-summary.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { AppDialogModule } from '../app-dialog/app-dialog.module';
import { FormsModule } from '@angular/forms';
import { SelectTechniciansModule } from '../select-technicians/select-technicians.module';
import { AddJobModule } from '../add-job/add-job.module';
import { JobEventsComponent } from './job-events/job-events.component';
import { AppEventsModule } from '../app-events/app-events.module';



@NgModule({
  declarations: [
    ViewJobComponent,
    JobSummaryComponent,
    JobEventsComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedDirectiveModule,
    AppDialogModule,
    FormsModule,
    SelectTechniciansModule,
    AddJobModule,
    AppEventsModule
  ],
  exports: [
    ViewJobComponent,
    JobSummaryComponent,
    JobEventsComponent
  ]
})
export class ViewJobModule { }
