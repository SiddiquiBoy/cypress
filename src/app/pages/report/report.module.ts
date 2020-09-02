import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { ReportHomeComponent } from './report-home/report-home.component';
import { ReportAllComponent } from './report-all/report-all.component';
import { ReportScheduledComponent } from './report-scheduled/report-scheduled.component';


@NgModule({
  declarations: [ReportComponent, ReportHomeComponent, ReportAllComponent, ReportScheduledComponent],
  imports: [
    CommonModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
