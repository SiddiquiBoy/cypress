import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { BusinessunitComponent } from './businessunit/businessunit.component';
import { TagsComponent } from './tags/tags.component';
import { JobtypeComponent } from './jobtype/jobtype.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { OperationsComponent } from './operations.component';
import { BusinessunitAddModule } from 'src/shared/components/businessunit-add/businessunit-add.module';
import { JobtypeAddModule } from 'src/shared/components/jobtype-add/jobtype-add.module';
import { TagsAddModule } from 'src/shared/components/tags-add/tags-add.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { AddTimesheetCodeModule } from 'src/shared/components/add-timesheet-code/add-timesheet-code.module';


@NgModule({
  declarations: [BusinessunitComponent, TagsComponent, JobtypeComponent, OperationsComponent, TimesheetsComponent],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    NgZorroAntdModule,
    GeneralTableModule,
    PageHeaderModule,
    AppSearchbarModule,
    BusinessunitAddModule,
    JobtypeAddModule,
    TagsAddModule,
    SharedDirectiveModule,
    AddTimesheetCodeModule
  ]
})
export class OperationsModule { }
