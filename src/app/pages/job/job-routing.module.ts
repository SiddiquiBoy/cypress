import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobComponent } from './job.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AddJobComponent } from 'src/shared/components/add-job/add-job.component';
import { CanActivateAddJobGuard } from 'src/shared/components/add-job/services/guard-services/can-activate-add-job.guard';
import { CanActivateEditJobGuard } from 'src/shared/components/add-job/services/guard-services/can-activate-edit-job.guard';
import { ViewJobComponent } from 'src/shared/components/view-job/view-job.component';
import { CanActivateViewJobGuard } from 'src/shared/components/view-job/services/can-activate-view-job.guard';


const routes: Routes = [
  {
    path: '', component: JobComponent, data: { pageTitle: MenuConstants.JOBS }
  },
  {
    path: AppUrlConstants.ADD, component: AddJobComponent, canActivate: [CanActivateAddJobGuard], data: { pageTitle: MenuConstants.ADD_JOB }
  },
  {
    path: ':id' + AppUrlConstants.SLASH + AppUrlConstants.EDIT, component: AddJobComponent, canActivate: [CanActivateEditJobGuard],
    data: { pageTitle: MenuConstants.EDIT_JOB }
  },
  {
    path: ':id' + AppUrlConstants.SLASH + AppUrlConstants.VIEW, component: ViewJobComponent, canActivate: [CanActivateViewJobGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
