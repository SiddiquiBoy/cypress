import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { BillingsComponent } from './billings/billings.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { OperationsComponent } from './operations/operations.component';
import { PeopleComponent } from './people/people.component';
import { RolesComponent } from './roles/roles.component';
import { TagsComponent } from './tags/tags.component';
// import { TimesheetsComponent } from './timesheets/timesheets.component';
import { ZonesComponent } from './zones/zones.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { CanActivateCompanyProfileGuard } from './company-profile/services/can-activate-company-profile.guard';
// import { ProjectComponent } from './project/project.component';
// import { ProjectCanActivateGuard } from './project/services/guard-services/project-can-activate/project-can-activate.guard';
// import { CustomerComponent } from './customer/customer.component';
// import { CustomerCanActivateGuard } from './customer/services/guard-services/customer-can-activate/customer-can-activate.guard';
// import { AddCustomerComponent } from 'src/shared/components/add-customer/add-customer.component';
// import { AddProjectComponent } from 'src/shared/components/add-project/add-project.component';
// import { AddTimesheetCodeComponent } from 'src/shared/components/add-timesheet-code/add-timesheet-code.component';


const routes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      {
        path: '', redirectTo: 'billings', pathMatch: 'full'
      },
      {
        path: 'billings',
        // component: BillingsComponent,
        loadChildren: () => import('./billings/billings.module').then(m => m.BillingsModule),
        data: { pageTitle: MenuConstants.BILLINGS }
      },
      {
        path: 'profile', component: CompanyProfileComponent, canActivate: [CanActivateCompanyProfileGuard],
        data: { pageTitle: MenuConstants.COMPANY_PROFILE, pageDescription: MenuConstants.COMPANIES_DESC }
      },
      {
        path: 'operations',
        // component: OperationsComponent,
        loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule),
        data: { pageTitle: MenuConstants.OPERATIONS }
      },
      {
        path: 'people',
        // component: PeopleComponent,
        loadChildren: () => import('./people/people.module').then(m => m.PeopleModule),
        data: { pageTitle: MenuConstants.PEOPLE }
      },
      {
        path: 'roles', component: RolesComponent, data: { pageTitle: MenuConstants.ROLES }
      },
      // {
      //   path: 'tags', component: TagsComponent, data: { pageTitle: MenuConstants.TAGS }
      // },
      // {
      //   path: 'timesheet-codes', component: TimesheetsComponent, data: { pageTitle: MenuConstants.TIMESHEET_CODES }
      // },
      // {
      //   path: 'timesheet-codes/add', component: AddTimesheetCodeComponent, data: { pageTitle: MenuConstants.ADD_TIMESHEET_CODE }
      // },
      // {
      //   path: 'timesheet-codes/:id/edit', component: AddTimesheetCodeComponent, data: { pageTitle: MenuConstants.EDIT_TIMESHEET_CODE }
      // },
      {
        path: 'zones', component: ZonesComponent, data: { pageTitle: MenuConstants.ZONES }
      },
      // {
      //   path: AppUrlConstants.CUSTOMERS, component: CustomerComponent, data: { pageTitle: MenuConstants.CUSTOMERS },
      //   canActivate: [CustomerCanActivateGuard]
      // },
      // {
      //   path: AppUrlConstants.PROJECTS, component: ProjectComponent, data: { pageTitle: MenuConstants.PROJECTS },
      //   canActivate: [ProjectCanActivateGuard]
      // },
      // {
      //   path: AppUrlConstants.CUSTOMERS + AppUrlConstants.SLASH + AppUrlConstants.ADD, component: AddCustomerComponent, data: { pageTitle: MenuConstants.ADD_CUSTOMER }
      // },
      // {
      //   path: AppUrlConstants.CUSTOMERS + AppUrlConstants.SLASH + ':id' + AppUrlConstants.SLASH + AppUrlConstants.EDIT, component: AddCustomerComponent,
      //   data: { pageTitle: MenuConstants.EDIT_CUSTOMER }
      // },
      // {
      //   path: AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + AppUrlConstants.ADD, component: AddProjectComponent, data: { pageTitle: MenuConstants.ADD_PROJECT }
      // },
      // {
      //   path: AppUrlConstants.PROJECTS + AppUrlConstants.SLASH + ':id' + AppUrlConstants.SLASH + AppUrlConstants.EDIT, component: AddProjectComponent,
      //   data: { pageTitle: MenuConstants.EDIT_PROJECT }
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
