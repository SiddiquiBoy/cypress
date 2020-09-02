import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { SidebarNavigationMenuModule } from 'src/shared/components/sidebar-navigation-menu/sidebar-navigation-menu.module';
import { SpinnerModule } from 'src/shared/components/spinner/spinner.module';
import { ViewEstimateModule } from 'src/shared/components/view-estimate/view-estimate.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { EstimatesComponent } from './estimates/estimates.component';
import { FollowUpRoutingModule } from './follow-up-routing.module';
import { FollowUpComponent } from './follow-up.component';



@NgModule({
  declarations: [FollowUpComponent, EstimatesComponent],
  imports: [
    CommonModule,
    FollowUpRoutingModule,
    NgZorroAntdModule,
    SidebarNavigationMenuModule,
    GeneralTableModule,
    AppSearchbarModule,
    PageHeaderModule,
    SpinnerModule,
    SharedDirectiveModule,
    ViewEstimateModule,
  ]
})
export class FollowUpModule { }
