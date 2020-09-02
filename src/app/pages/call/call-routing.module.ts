import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallComponent } from './call.component';
import { CallsComponent } from './calls/calls.component';
import { BookingsComponent } from './bookings/bookings.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';


const routes: Routes = [
  {
    path: '', component: CallComponent, children: [
      {
        path: '', component: CallsComponent, data: { pageTitle: MenuConstants.CALLS }
      },
      {
        path: 'bookings', component: BookingsComponent, data: { pageTitle: MenuConstants.BOOKINGS }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallRoutingModule { }
