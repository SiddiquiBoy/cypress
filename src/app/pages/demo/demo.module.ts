import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { DemoComponent } from './demo.component';
import { GeneralTableModule } from 'src/shared/components/general-table/general-table/general-table.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';


@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    NgZorroAntdModule,
    GeneralTableModule,
    SharedDirectiveModule,
    PageHeaderModule,
  ]
})
export class DemoModule { }
