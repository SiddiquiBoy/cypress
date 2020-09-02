import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportHomeComponent } from './report-home/report-home.component';
import { ReportAllComponent } from './report-all/report-all.component';
import { ReportScheduledComponent } from './report-scheduled/report-scheduled.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';


const routes: Routes = [
  // {
  //   path: '', component: ReportComponent, children: [
  //     {
  //       path: '', redirectTo: 'home', pathMatch: 'full'
  //     },
  //     {
  //       path: 'home', component: ReportHomeComponent, data: { pageTitle: MenuConstants.HOME }
  //     },
  //     {
  //       path: 'all', component: ReportAllComponent, data: { pageTitle: MenuConstants.ALL }
  //     },
  //     {
  //       path: 'scheduled', component: ReportScheduledComponent, data: { pageTitle: MenuConstants.SCHEDULED }
  //     }
  //   ]
  // },
  {
    path: '', component: ReportComponent, data: { pageTitle: MenuConstants.REPORTS }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
