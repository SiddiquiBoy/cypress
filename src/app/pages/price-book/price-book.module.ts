import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceBookRoutingModule } from './price-book-routing.module';
import { PriceBookComponent } from './price-book.component';
import { OrgServicesComponent } from './org-services/org-services.component';
import { CategoriesComponent } from './categories/categories.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SidebarNavigationMenuModule } from 'src/shared/components/sidebar-navigation-menu/sidebar-navigation-menu.module';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { SpinnerModule } from 'src/shared/components/spinner/spinner.module';
import { AddCategoryModule } from 'src/shared/components/add-category/add-category.module';
import { ServiceAddModule } from 'src/shared/components/service-add/service-add.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';


@NgModule({
  declarations: [PriceBookComponent, OrgServicesComponent, CategoriesComponent],
  imports: [
    CommonModule,
    PriceBookRoutingModule,
    NgZorroAntdModule,
    SidebarNavigationMenuModule,
    GeneralTableModule,
    AppSearchbarModule,
    PageHeaderModule,
    SpinnerModule,
    AddCategoryModule,
    ServiceAddModule,
    SharedDirectiveModule
  ]
})
export class PriceBookModule { }
