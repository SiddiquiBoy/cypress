import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from './notification.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';


const routes: Routes = [
  {
    path: '', component: NotificationComponent, data: { pageTitle: MenuConstants.NOTIFICATION }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
