import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';


const routes: Routes = [
  {
    path: '', component: DemoComponent, data: { pageTitle: MenuConstants.DEMOS }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
