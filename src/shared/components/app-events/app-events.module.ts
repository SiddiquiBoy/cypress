import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEventsComponent } from './app-events.component';
import { NzSpinModule } from 'ng-zorro-antd';
import { GeneralTableModule } from '../general-table/general-table/general-table.module';



@NgModule({
  declarations: [
    AppEventsComponent
  ],
  imports: [
    CommonModule,
    NzSpinModule,
    GeneralTableModule
  ],
  entryComponents: [
    AppEventsComponent
  ],
  exports: [
    AppEventsComponent
  ]
})
export class AppEventsModule { }
