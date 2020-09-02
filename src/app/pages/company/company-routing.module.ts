import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AddCompanyComponent } from 'src/shared/components/add-company/add-company.component';
import { CanActivateAddCompanyGuard } from 'src/shared/components/add-company/services/guard-services/can-activate-add-company.guard';
import { CanActivateEditCompanyGuard } from 'src/shared/components/add-company/services/guard-services/can-activate-edit-company.guard';


const routes: Routes = [
  {
    path: '', component: CompanyComponent, data: { pageTitle: MenuConstants.COMPANIES }
  },
  {
    path: AppUrlConstants.ADD, component: AddCompanyComponent, canActivate: [CanActivateAddCompanyGuard], data: { pageTitle: MenuConstants.ADD_COMPANY }
  },
  {
    path: ':id' + AppUrlConstants.SLASH + AppUrlConstants.EDIT, component: AddCompanyComponent, canActivate: [CanActivateEditCompanyGuard], data: { pageTitle: MenuConstants.EDIT_COMPANY }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
