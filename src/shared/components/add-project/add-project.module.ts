import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjectComponent } from './add-project.component';
import { PageHeaderModule } from '../page-header/page-header.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectJobsComponent } from './project-jobs/project-jobs.component';
import { AppDialogModule } from '../app-dialog/app-dialog.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';



@NgModule({
  declarations: [
    AddProjectComponent,
    ProjectDetailComponent,
    ProjectJobsComponent
  ],
  imports: [
    CommonModule,
    PageHeaderModule,
    FormsModule,
    NgZorroAntdModule,
    AppDialogModule,
    SharedDirectiveModule
  ],
  exports: [ProjectDetailComponent]
})
export class AddProjectModule { }
