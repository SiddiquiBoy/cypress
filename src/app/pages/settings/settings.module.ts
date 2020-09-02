import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { BillingsComponent } from './billings/billings.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { PeopleComponent } from './people/people.component';
import { OperationsComponent } from './operations/operations.component';
import { RolesComponent } from './roles/roles.component';
import { TagsComponent } from './tags/tags.component';
// import { TimesheetsComponent } from './timesheets/timesheets.component';
import { ZonesComponent } from './zones/zones.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SidebarNavigationMenuModule } from 'src/shared/components/sidebar-navigation-menu/sidebar-navigation-menu.module';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FORMERR } from 'dns';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FileUploadModule } from 'src/shared/components/file-upload/file-upload.module';
// import { CustomerComponent } from './customer/customer.component';
// import { ProjectComponent } from './project/project.component';
import { AddCustomerModule } from 'src/shared/components/add-customer/add-customer.module';
import { AddProjectModule } from 'src/shared/components/add-project/add-project.module';
import { PhoneFormatPipe } from 'src/shared/pipes/phone-format.pipe';
import { AddTimesheetCodeComponent } from 'src/shared/components/add-timesheet-code/add-timesheet-code.component';


@NgModule({
  declarations: [
    SettingsComponent,
    HomeComponent,
    AccountComponent,
    // BillingsComponent,
    CompanyProfileComponent,
    // PeopleComponent,
    // OperationsComponent,
    RolesComponent,
    TagsComponent,
    // TimesheetsComponent,
    ZonesComponent,
    // CustomerComponent,
    // ProjectComponent,
    // AddTimesheetCodeComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NgZorroAntdModule,
    SidebarNavigationMenuModule,
    GeneralTableModule,
    PageHeaderModule,
    AppSearchbarModule,
    ReactiveFormsModule,
    FormsModule,
    SharedDirectiveModule,
    FileUploadModule,
    AddCustomerModule,
    AddProjectModule
  ],
  providers: [PhoneFormatPipe]
})
export class SettingsModule { }
