import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleComponent } from './people.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { EmployeesComponent } from './employees/employees.component';
import { TechniciansComponent } from './technicians/technicians.component';
import { AddEmployeeComponent } from 'src/shared/components/forms/addEmployee/addEmployee.component';
import { CanActivateEmployeeGuard } from './employees/services/can-activate-employee.guard';
import { CanActivateAddEmployeeGuard } from 'src/shared/components/forms/addEmployee/services/can-activate-add-employee.guard';
import { CanActivateEditEmployeeGuard } from 'src/shared/components/forms/addEmployee/services/can-activate-edit-employee.guard';
import { CanActivateTechnicianGuard } from './technicians/services/can-activate-technician.guard';
import { CanActivateAddTechnicianGuard } from './technicians/services/can-activate-add-technician.guard';
import { CanActivateEditTechnicianGuard } from './technicians/services/can-activate-edit-technician.guard';


const routes: Routes = [
  {
    path: '', component: PeopleComponent, children: [
      {
        path: '', redirectTo: 'employees', pathMatch: 'full'
      },
      {
        path: 'employees', canActivate: [CanActivateEmployeeGuard], component: EmployeesComponent, data: { pageTitle: MenuConstants.EMPLOYEES }
      },
      {
        path: 'employees/add', canActivate: [CanActivateAddEmployeeGuard], component: AddEmployeeComponent, data: { pageTitle: MenuConstants.ADD_EMPLOYEES }
      },
      {
        path: 'employees/:id/edit', canActivate: [CanActivateEditEmployeeGuard], component: AddEmployeeComponent, data: { pageTitle: MenuConstants.EDIT_EMPLOYEES }
      },
      {
        path: 'technicians', canActivate: [CanActivateTechnicianGuard], component: TechniciansComponent, data: { pageTitle: MenuConstants.TECHNICIANS }
      },
      {
        path: 'technician/add', canActivate: [CanActivateAddTechnicianGuard], component: AddEmployeeComponent, data: { pageTitle: MenuConstants.ADD_TECHNICIAN }
      },
      {
        path: 'technician/:id/edit', canActivate: [CanActivateEditTechnicianGuard], component: AddEmployeeComponent, data: { pageTitle: MenuConstants.EDIT_TECHNICIAN }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
