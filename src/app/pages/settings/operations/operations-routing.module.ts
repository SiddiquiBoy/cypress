import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsComponent } from './operations.component';
import { BusinessunitComponent } from './businessunit/businessunit.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { JobtypeComponent } from './jobtype/jobtype.component';
import { TagsComponent } from './tags/tags.component';
import { BusinessunitAddComponent } from 'src/shared/components/businessunit-add/businessunit-add.component';
import { JobtypeAddComponent } from 'src/shared/components/jobtype-add/jobtype-add.component';
import { TagsAddComponent } from 'src/shared/components/tags-add/tags-add.component';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { AddTimesheetCodeComponent } from 'src/shared/components/add-timesheet-code/add-timesheet-code.component';
import { CanActivateJobTypeEditGuard } from 'src/shared/components/jobtype-add/services/guard-services/can-activate-job-type-edit.guard';
import { CanActivateTagsGuard } from './tags/services/guard-services/can-activate-tags.guard';
import { CanActivateAddTagGuard } from 'src/shared/components/tags-add/services/guard-services/can-activate-add-tag.guard';
import { CanActivateEditTagGuard } from 'src/shared/components/tags-add/services/guard-services/can-activate-edit-tag.guard';
import { OperationCanActivateGuard } from './services/guard-services/operation-can-activate.guard';
import { CanActivateJobTypeGuard } from './jobtype/services/guard-services/can-activate-job-type.guard';
import { CanActivateAddJobTypeGuard } from 'src/shared/components/jobtype-add/services/guard-services/can-activate-add-job-type.guard';
import { CanActivateAddTimesheetCodeGuard } from 'src/shared/components/add-timesheet-code/services/can-activate-add-timesheet-code.guard';
import { CanActivateTimesheetCodeGuard } from './timesheets/services/can-activate-timesheet-code.guard';
import { CanActivateEditTimesheetCodeGuard } from 'src/shared/components/add-timesheet-code/services/can-activate-edit-timesheet-code.guard';
import { CanActivateBusinessUnitGuard } from './businessunit/services/gaurd-services/can-activate-business-unit.gaurd';
import { CanActivateAddBusinessUnitGuard } from 'src/shared/components/businessunit-add/services/guard-services/can-activate-add-business-unit.guard';


const routes: Routes = [
  {
    path: '', component: OperationsComponent, canActivate: [OperationCanActivateGuard], children: [
      {
        path: '', redirectTo: 'business-unit', pathMatch: 'full'
      },
      {
        path: 'business-unit', component: BusinessunitComponent, canActivate: [CanActivateBusinessUnitGuard],
        data: { pageTitle: MenuConstants.BUSINESS_UNITS, pageDescription: MenuConstants.BUSINESSUNIT_DESC }
      },
      {
        path: 'business-unit/add', component: BusinessunitAddComponent, canActivate: [CanActivateAddBusinessUnitGuard], data: { pageTitle: MenuConstants.ADD_BUSINESS_UNITS }
      },
      {
        path: 'business-unit/:id/edit', component: BusinessunitAddComponent, canActivate: [CanActivateAddBusinessUnitGuard], data: { pageTitle: MenuConstants.EDIT_BUSINESS_UNITS }
      },
      {
        path: 'jobType', component: JobtypeComponent, canActivate: [CanActivateJobTypeGuard], data: { pageTitle: MenuConstants.JOB_TYPE, pageDescription: MenuConstants.JOBTYPE_DESC }
        // path: 'jobType', component: JobtypeComponent, data: { pageTitle: MenuConstants.JOB_TYPE, pageDescription: MenuConstants.JOBTYPE_DESC }
      },
      {
        path: 'jobType/add', component: JobtypeAddComponent, canActivate: [CanActivateAddJobTypeGuard], data: { pageTitle: MenuConstants.ADD_JOB_TYPE }
      },
      {
        path: 'jobType/:id/edit', component: JobtypeAddComponent, canActivate: [CanActivateJobTypeEditGuard], data: { pageTitle: MenuConstants.EDIT_JOB_TYPE }
      },
      {
        path: 'tags', component: TagsComponent, canActivate: [CanActivateTagsGuard], data: { pageTitle: MenuConstants.TAGS, pageDescription: MenuConstants.TAGS_DESC }
        // path: 'tags', component: TagsComponent, data: { pageTitle: MenuConstants.TAGS, pageDescription: MenuConstants.TAGS_DESC}
      },
      {
        path: 'tags/add', component: TagsAddComponent, canActivate: [CanActivateAddTagGuard], data: { pageTitle: MenuConstants.ADD_TAGS }
      },
      {
        path: 'tags/:id/edit', component: TagsAddComponent, canActivate: [CanActivateEditTagGuard], data: { pageTitle: MenuConstants.EDIT_TAG }
      },
      {
        path: 'timesheet-codes', component: TimesheetsComponent, canActivate: [CanActivateTimesheetCodeGuard], data: {
          pageTitle: MenuConstants.TIMESHEET_CODES, pageDescription: MenuConstants.TIMESHEET_DESC }
      },
      {
        // path: 'timesheet-codes/add', component: AddTimesheetCodeComponent, data: { pageTitle: MenuConstants.ADD_TIMESHEET_CODE }
        path: 'timesheet-codes/add', component: AddTimesheetCodeComponent, canActivate: [CanActivateAddTimesheetCodeGuard], data: { pageTitle: MenuConstants.ADD_TIMESHEET_CODE }
      },
      {
        path: 'timesheet-codes/:id/edit', component: AddTimesheetCodeComponent, canActivate: [CanActivateEditTimesheetCodeGuard], data: { pageTitle: MenuConstants.EDIT_TIMESHEET_CODE }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
