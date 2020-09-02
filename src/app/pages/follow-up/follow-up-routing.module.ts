import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FollowUpComponent } from './follow-up.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { EstimatesComponent } from './estimates/estimates.component';
import { CanActivateEstimatesGuard } from './estimates/services/can-activate-estimates.guard';
import { ViewEstimateComponent } from 'src/shared/components/view-estimate/view-estimate.component';
import { CanActivateViewEstimateGuard } from 'src/shared/components/view-estimate/services/can-activate-view-estimate.guard';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';


const routes: Routes = [
  {
    path: '', component: FollowUpComponent,
    children: [
      {
        path: '', redirectTo: AppUrlConstants.ESTIMATES, pathMatch: 'full'
      },
      {
        path: AppUrlConstants.ESTIMATES, component: EstimatesComponent, canActivate: [CanActivateEstimatesGuard], data: { pageTitle: MenuConstants.ESTIMATES},
      },
      {
        path: AppUrlConstants.ESTIMATES + AppUrlConstants.SLASH + ':id' + AppUrlConstants.SLASH + AppUrlConstants.VIEW, component: ViewEstimateComponent, canActivate: [CanActivateViewEstimateGuard],
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowUpRoutingModule { }
