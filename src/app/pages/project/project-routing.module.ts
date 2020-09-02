import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { ProjectComponent } from './project.component';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AddProjectComponent } from 'src/shared/components/add-project/add-project.component';
import { CanActivateAddProjectGuard } from 'src/shared/components/add-project/services/guard-services/can-activate-add-project.guard';
import { CanActivateEditProjectGuard } from 'src/shared/components/add-project/services/guard-services/can-activate-edit-project.guard';
import { ViewProjectComponent } from 'src/shared/components/view-project/view-project.component';
import { CanActivateViewProjectGuard } from 'src/shared/components/view-project/services/can-activate-project.guard';


const routes: Routes = [
  {
    path: '', component: ProjectComponent, data: { pageTitle: MenuConstants.PROJECTS }
  },
  {
    path: AppUrlConstants.ADD, component: AddProjectComponent, canActivate: [CanActivateAddProjectGuard], data: { pageTitle: MenuConstants.ADD_PROJECT }
  },
  {
    path: ':id' + AppUrlConstants.SLASH + AppUrlConstants.EDIT, component: AddProjectComponent, canActivate: [CanActivateEditProjectGuard],
    data: { pageTitle: MenuConstants.EDIT_PROJECT }
  },
  {
    path: ':viewid' + AppUrlConstants.SLASH + AppUrlConstants.VIEW, component: ViewProjectComponent, canActivate: [CanActivateViewProjectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
