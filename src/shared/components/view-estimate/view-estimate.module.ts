import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEstimateComponent } from './view-estimate.component';
import { EstimateSummaryComponent } from './estimate-summary/estimate-summary.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { EstimateJobListComponent } from './estimate-job-list/estimate-job-list.component';
import { GeneralTableModule } from '../general-table/general-table/general-table.module';



@NgModule({
  declarations: [ViewEstimateComponent, EstimateSummaryComponent, EstimateJobListComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedDirectiveModule,
    GeneralTableModule,
  ]
})
export class ViewEstimateModule { }
