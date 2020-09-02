import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AddVendorComponent } from 'src/shared/components/add-vendor/add-vendor.component';

const routes: Routes = [
  {
    path: '',
    component: VendorComponent,  data: { pageTitle: MenuConstants.VENDORS }
  },
  {
    path: AppUrlConstants.ADD, component: AddVendorComponent,  data: { pageTitle: MenuConstants.ADD_VENDORS }
  },
  {
    path: ':id' + AppUrlConstants.SLASH + AppUrlConstants.EDIT, component: AddVendorComponent,
    data: { pageTitle: MenuConstants.EDIT_VENDORS }
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
