import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchRoutingModule } from './dispatch-routing.module';
import { DispatchComponent } from './dispatch.component';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DispatchboardJobListComponent } from './dispatchboard-job-list/dispatchboard-job-list.component';
import { DispatchboardTechnicianTimelineComponent } from './dispatchboard-technician-timeline/dispatchboard-technician-timeline.component';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { AppDialogModule } from 'src/shared/components/app-dialog/app-dialog.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DayViewSchedulerComponent } from './dispatchboard-technician-timeline/day-view-scheduler/day-view-scheduler.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DispatchComponent, DispatchboardJobListComponent, DispatchboardTechnicianTimelineComponent, DayViewSchedulerComponent],
  imports: [
    CommonModule,
    DispatchRoutingModule,
    SharedDirectiveModule,
    PageHeaderModule,
    NgZorroAntdModule,
    GeneralTableModule,
    AppDialogModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ]
})
export class DispatchModule { }
