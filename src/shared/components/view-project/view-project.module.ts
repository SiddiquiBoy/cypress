import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppDialogModule } from '../app-dialog/app-dialog.module';
import { FormsModule } from '@angular/forms';
import { ViewProjectComponent } from './view-project.component';
import { ProjectSummaryComponent } from './project-summary/project-summary.component';
import { GeneralTableModule } from '../general-table/general-table/general-table.module';
// import { ProjectJobComponent } from './project-job/project-job.component';
import { AddJobModule } from '../add-job/add-job.module';
import { ProjectDetailComponent } from '../add-project/project-detail/project-detail.component';
import { AddProjectModule } from '../add-project/add-project.module';
import { ProjectDetailJobComponent } from './project-detail-job/project-detail-job.component';

@NgModule({
  declarations: [ViewProjectComponent, ProjectDetailJobComponent  , ProjectSummaryComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedDirectiveModule,
    AppDialogModule,
    GeneralTableModule,
    FormsModule,
    AddJobModule,
    AddProjectModule
  ],
  exports: [ViewProjectComponent]
})
export class ViewProjectModule { }
