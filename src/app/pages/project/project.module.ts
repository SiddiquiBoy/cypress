import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FileUploadModule } from 'src/shared/components/file-upload/file-upload.module';
import { AddProjectModule } from 'src/shared/components/add-project/add-project.module';
import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { ViewProjectModule } from 'src/shared/components/view-project/view-project.module';

@NgModule({
  declarations: [
    ProjectComponent,
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NgZorroAntdModule,
    GeneralTableModule,
    PageHeaderModule,
    AppSearchbarModule,
    ReactiveFormsModule,
    FormsModule,
    SharedDirectiveModule,
    FileUploadModule,
    AddProjectModule,
    ViewProjectModule
  ],
  providers: []
})
export class ProjectModule { }
