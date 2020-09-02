import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { GeneralCalendarModule } from 'src/shared/components/general-calendar/general-calendar.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';


@NgModule({
  declarations: [ScheduleComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    GeneralCalendarModule,
    SharedDirectiveModule,
    PageHeaderModule,
    AppSearchbarModule,
  ]
})
export class ScheduleModule { }
