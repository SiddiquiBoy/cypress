import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessunitAddComponent } from './businessunit-add.component';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PageHeaderModule } from '../page-header/page-header.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { BuDetailComponent } from './bu-detail/bu-detail.component';
import { BuAddressComponent } from './bu-address/bu-address.component';
import { AppDialogModule } from '../app-dialog/app-dialog.module';



@NgModule({
  declarations: [
    BusinessunitAddComponent,
    BuDetailComponent,
    BuAddressComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    PageHeaderModule,
    FormsModule,
    SharedDirectiveModule,
    AppDialogModule

  ],
  exports: [BusinessunitAddComponent],
  // entryComponents: [BusinessunitAddComponent]
})
export class BusinessunitAddModule { }
