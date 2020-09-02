import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallRoutingModule } from './call-routing.module';
import { CallComponent } from './call.component';
import { CallsComponent } from './calls/calls.component';
import { BookingsComponent } from './bookings/bookings.component';


@NgModule({
  declarations: [CallComponent, CallsComponent, BookingsComponent],
  imports: [
    CommonModule,
    CallRoutingModule
  ]
})
export class CallModule { }
