import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceBookComponent } from './price-book.component';
import { CategoriesComponent } from './categories/categories.component';
import { OrgServicesComponent } from './org-services/org-services.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AddCategoryComponent } from 'src/shared/components/add-category/add-category.component';
import { ServiceAddComponent } from 'src/shared/components/service-add/service-add.component';
import { CanActivatePricebookServicesGuard } from './org-services/services/can-activate-pricebook-services.guard';
import { CanActivateAddPricebookServicesGuard } from 'src/shared/components/service-add/services/can-activate-add-pricebook-services.guard';
import { CanActivateEditPricebookServicesGuard } from 'src/shared/components/service-add/services/can-activate-edit-pricebook-services.guard';
import { PriceBookCanActivateService } from './services/guard-services/price-book-can-activate-service/price-book-can-activate.service';
import { CanActivateCategoryGuard } from './categories/services/can-activate-category-guard/can-activate-category-guard';
import { CanActivateEditCategoryGuard } from 'src/shared/components/add-category/add-category-service/gaurd/can-activate-edit-category.guard';
import { CanActivateAddCategoryGuard } from 'src/shared/components/add-category/add-category-service/gaurd/can-activate-add-category.guard';


const routes: Routes = [
  {
    path: '', component: PriceBookComponent, canActivate: [PriceBookCanActivateService],
    children: [
      {
        path: '', redirectTo: 'categories', pathMatch: 'full'
      },
      {
        path: 'categories', component: CategoriesComponent, canActivate: [CanActivateCategoryGuard], data: { pageTitle: MenuConstants.CATEGORIES, pageDescription: MenuConstants.CATEGORY_DESC }
      },
      {
        path: 'categories/add', component: AddCategoryComponent, canActivate: [CanActivateAddCategoryGuard], data: { pageTitle: MenuConstants.ADD_CATEGORY }
      },
      {
        path: 'categories/:id/edit', component: AddCategoryComponent,  canActivate: [CanActivateEditCategoryGuard], data: { pageTitle: MenuConstants.EDIT_CATEGORY }
      },
      {
        path: 'services', component: OrgServicesComponent, canActivate: [CanActivatePricebookServicesGuard], data: { pageTitle: MenuConstants.SERVICES, pageDescription: MenuConstants.SERVICES_DESC }
      },
      {
        path: 'services/add', component: ServiceAddComponent, canActivate: [CanActivateAddPricebookServicesGuard], data: { pageTitle: MenuConstants.ADD_SERVICE }
      },
      {
        path: 'services/:id/edit', component: ServiceAddComponent, canActivate: [CanActivateEditPricebookServicesGuard], data: { pageTitle: MenuConstants.EDIT_SERVICE }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceBookRoutingModule { }
