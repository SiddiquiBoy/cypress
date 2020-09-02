import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AddCustomerComponent } from 'src/shared/components/add-customer/add-customer.component';
import { CanActivateAddCustomerGuard } from 'src/shared/components/add-customer/services/guard-services/can-activate-add-customer.guard';
import { CanActivateEditCustomerGuard } from 'src/shared/components/add-customer/services/guard-services/can-activate-edit-customer.guard';
import { CanDeactivateAddCustomerGuard } from 'src/shared/components/add-customer/services/guard-services/can-deactivate-add-customer.guard';
import { CanActivateViewCustomerGuard } from 'src/shared/components/view-customer/services/can-activate-view-customer.guard';
import { ViewCustomerComponent } from 'src/shared/components/view-customer/view-customer.component';


const routes: Routes = [
  {
    path: '', component: CustomerComponent, data: { pageTitle: MenuConstants.CUSTOMERS }
  },
  {
    path: AppUrlConstants.ADD, component: AddCustomerComponent, canActivate: [CanActivateAddCustomerGuard],
    canDeactivate: [CanDeactivateAddCustomerGuard], data: { pageTitle: MenuConstants.ADD_CUSTOMER }
  },
  {
    path: ':id' + AppUrlConstants.SLASH + AppUrlConstants.EDIT, component: AddCustomerComponent, canActivate: [CanActivateEditCustomerGuard],
    data: { pageTitle: MenuConstants.EDIT_CUSTOMER }
  },
  {
    path: ':viewid' + AppUrlConstants.SLASH + AppUrlConstants.VIEW, component: ViewCustomerComponent, canActivate: [CanActivateViewCustomerGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
