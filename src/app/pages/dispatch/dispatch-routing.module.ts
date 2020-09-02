import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispatchComponent } from './dispatch.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';


const routes: Routes = [
  {
    path: '', component: DispatchComponent, data: { pageTitle: MenuConstants.DISPATCH }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }
