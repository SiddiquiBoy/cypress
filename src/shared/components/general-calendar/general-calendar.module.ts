import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralCalendarComponent } from './general-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppDialogModule } from '../app-dialog/app-dialog.module';


@NgModule({
  declarations: [GeneralCalendarComponent],
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgZorroAntdModule,
    AppDialogModule,
  ],
  exports: [GeneralCalendarComponent],
  entryComponents: [GeneralCalendarComponent]
})
export class GeneralCalendarModule { }
