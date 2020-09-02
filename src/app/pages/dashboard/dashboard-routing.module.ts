import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';


const routes: Routes = [
  {
    path: '', component: DashboardComponent, data: { pageTitle: MenuConstants.DASHBOARD }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
