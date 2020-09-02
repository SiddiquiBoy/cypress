import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleRoutingModule } from './people-routing.module';
import { EmployeesComponent } from './employees/employees.component';
import { TechniciansComponent } from './technicians/technicians.component';
import { PeopleComponent } from './people.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { SpinnerModule } from 'src/shared/components/spinner/spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEmployeeModule } from 'src/shared/components/forms/addEmployee/addEmployee.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';


@NgModule({
  imports: [
    CommonModule,
    PeopleRoutingModule,
    NgZorroAntdModule,
    GeneralTableModule,
    PageHeaderModule,
    AppSearchbarModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AddEmployeeModule,
    SharedDirectiveModule
  ],
  declarations: [
    EmployeesComponent,
    TechniciansComponent,
    PeopleComponent,
  ]
})
export class PeopleModule { }
